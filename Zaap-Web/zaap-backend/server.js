const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { databases, Query } = require('./appwriteClient');

const DATABASE_ID = '68658da40010c32ded91'; // Replace with your Appwrite Database ID
const COLLECTION_ID_CHILDREN = '68658db3002290609d71'; // Replace with your Appwrite Collection ID

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Zaap Backend API is running');
});

// DEV: Clear all children (for testing)
app.post('/api/children/clear', async (req, res) => {
  try {
    const list = await databases.listDocuments(DATABASE_ID, COLLECTION_ID_CHILDREN);
    const promises = list.documents.map(doc => databases.deleteDocument(DATABASE_ID, COLLECTION_ID_CHILDREN, doc.$id));
    await Promise.all(promises);
    res.json({ success: true });
  } catch (e) {
    console.error('Appwrite error in /api/children/clear:', e);
    res.status(500).json({ error: 'Failed to clear children', details: e.message, appwrite: e });
  }
});

// Endpoint to connect child account via QR scan
app.post('/api/connect-child', async (req, res) => {
  // Accept childAddress, address, walletAddress, or id
  let { childAddress, delegator, token, maxAmount, timestamp, alias, weeklyLimit, balance, address, walletAddress, id } = req.body;
  // Fallbacks for child address
  childAddress = childAddress || address || walletAddress || id;
  if (!childAddress && typeof req.body === 'string') {
    try {
      const parsed = JSON.parse(req.body);
      delegator = parsed.delegator;
      token = parsed.token;
      maxAmount = parsed.maxAmount;
      timestamp = parsed.timestamp;
      alias = parsed.alias;
      weeklyLimit = parsed.weeklyLimit;
      balance = parsed.balance;
      childAddress = parsed.childAddress || parsed.address || parsed.walletAddress || parsed.id;
    } catch (e) {
      return res.status(400).json({ error: 'Invalid QR payload' });
    }
  }
  // Ensure childAddress is a string
  if (typeof childAddress !== 'string') childAddress = String(childAddress || '');
  // Validate Ethereum address
  const isValidEthAddress = (addr) => typeof addr === 'string' && /^0x[a-fA-F0-9]{40}$/.test(addr) && addr.length === 42;
  if (!delegator || !token || !maxAmount) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }
  if (!isValidEthAddress(delegator)) {
    return res.status(400).json({ error: 'Invalid delegator address' });
  }
  if (!isValidEthAddress(token)) {
    return res.status(400).json({ error: 'Invalid token address' });
  }
  if (!childAddress || !isValidEthAddress(childAddress)) {
    return res.status(400).json({ error: 'Invalid or missing child address' });
  }
  const addressFinal = childAddress;
  const initialBalance = Number(maxAmount) || 0;
  try {
    // Check if child exists
    const list = await databases.listDocuments(DATABASE_ID, COLLECTION_ID_CHILDREN, [
      Query.equal('address', addressFinal)
    ]);
    let child = list.documents[0];
    if (!child) {
      // Save all relevant fields
      const doc = await databases.createDocument(DATABASE_ID, COLLECTION_ID_CHILDREN, 'unique()', {
        address: addressFinal,
        alias: alias || '',
        totalUSDC: maxAmount || 0,
        balance: typeof balance !== 'undefined' ? balance : initialBalance,
        weeklyLimit: weeklyLimit || 0,
        status: 'active',
        avatar: '🧑🏻',
        timestamp: timestamp || Date.now(),
        delegator,
        token
      });
      child = doc;
    }
    // Always return the child object
    return res.json({ success: true, message: 'Child account connected with restrictions', child });
  } catch (e) {
    console.error('Appwrite error in /api/connect-child:', e);
    return res.status(500).json({ error: 'Appwrite error', details: e.message, appwrite: e });
  }
});

// Get all children
app.get('/api/children', async (req, res) => {
  try {
    const list = await databases.listDocuments(DATABASE_ID, COLLECTION_ID_CHILDREN);
    res.json(list.documents);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch children', details: e.message });
  }
});

// Add new child
app.post('/api/children', async (req, res) => {
  const address = req.body.address || req.body.walletAddress || req.body.id;
  const { alias, totalUSDC, maxUSDC, maxAmount, balance, weeklyLimit } = req.body;
  const isValidEthAddress = (addr) => typeof addr === 'string' && /^0x[a-fA-F0-9]{40}$/.test(addr) && addr.length === 42;
  if (!address || !isValidEthAddress(address)) return res.status(400).json({ error: 'Missing or invalid address' });
  try {
    // Check if child exists
    const list = await databases.listDocuments(DATABASE_ID, COLLECTION_ID_CHILDREN, [
      Query.equal('address', address)
    ]);
    if (list.documents.length > 0) {
      return res.status(400).json({ error: 'Child already exists' });
    }
    const initialBalance = Number(totalUSDC || maxUSDC || maxAmount) || 0;
    const doc = await databases.createDocument(DATABASE_ID, COLLECTION_ID_CHILDREN, 'unique()', {
      address,
      alias: alias || '',
      totalUSDC: totalUSDC || maxUSDC || maxAmount || 0,
      balance: initialBalance,
      weeklyLimit: weeklyLimit || 0,
      status: 'active',
      avatar: '🧑🏻',
    });
    res.json(doc);
  } catch (e) {
    res.status(500).json({ error: 'Appwrite error', details: e.message });
  }
});

// Update child (alias, weeklyLimit, status)
app.put('/api/children/:address', async (req, res) => {
  const { address } = req.params;
  const { alias, weeklyLimit, status } = req.body;
  try {
    const list = await databases.listDocuments(DATABASE_ID, COLLECTION_ID_CHILDREN, [
      Query.equal('address', address)
    ]);
    const child = list.documents[0];
    if (!child) return res.status(404).json({ error: 'Child not found' });
    const doc = await databases.updateDocument(DATABASE_ID, COLLECTION_ID_CHILDREN, child.$id, {
      ...(alias !== undefined && { alias }),
      ...(weeklyLimit !== undefined && { weeklyLimit }),
      ...(status !== undefined && { status }),
    });
    res.json(doc);
  } catch (e) {
    res.status(500).json({ error: 'Appwrite error', details: e.message });
  }
});

// Add funds to a child (increase totalUSDC and balance)
app.post('/api/children/:address/add-funds', async (req, res) => {
  const { address } = req.params;
  const { amount } = req.body;
  try {
    const list = await databases.listDocuments(DATABASE_ID, COLLECTION_ID_CHILDREN, [
      Query.equal('address', address)
    ]);
    const child = list.documents[0];
    if (!child) return res.status(404).json({ error: 'Child not found' });
    const addAmount = Number(amount);
    if (isNaN(addAmount) || addAmount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }
    const doc = await databases.updateDocument(DATABASE_ID, COLLECTION_ID_CHILDREN, child.$id, {
      totalUSDC: (Number(child.totalUSDC) || 0) + addAmount,
      balance: (Number(child.balance) || 0) + addAmount,
    });
    res.json(doc);
  } catch (e) {
    res.status(500).json({ error: 'Appwrite error', details: e.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
