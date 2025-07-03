const express = require('express');
const cors = require('cors');
const { databases } = require('./appwriteClient');
const { ID } = require('node-appwrite');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const DB_ID = process.env.APPWRITE_DB_ID;
const COLLECTION_ID = process.env.APPWRITE_CHILDREN_COLLECTION_ID;
const USDC_ADDRESS = process.env.USDC_ADDRESS;

// Dynamic delegator storage
let currentDelegator = null;

// Helper: Validate Ethereum address
const isValidEthAddress = (addr) => /^0x[a-fA-F0-9]{40}$/.test(addr);

// Health check
app.get('/', (req, res) => res.send('Zaap Backend API is running'));

// Set/Update delegator dynamically
app.post('/api/set-delegator', (req, res) => {
  const { delegator } = req.body;
  if (!isValidEthAddress(delegator)) {
    return res.status(400).json({ error: 'Invalid delegator address' });
  }
  currentDelegator = delegator;
  return res.json({ success: true, delegator, message: 'Delegator updated successfully' });
});

// Get current delegator
app.get('/api/delegator', (req, res) => {
  if (!currentDelegator) {
    return res.status(404).json({ 
      error: 'No delegator set',
      message: 'Please set delegator address first' 
    });
  }
  return res.json({ delegator: currentDelegator, success: true });
});

// Generate QR with dynamic delegator
app.post('/api/generate-qr', (req, res) => {
  try {
    const { maxAmount, alias } = req.body;
    
    if (!currentDelegator) {
      return res.status(400).json({ error: 'Delegator not set. Please connect wallet first.' });
    }
    
    const max = Number(maxAmount);
    if (isNaN(max) || max <= 0) {
      return res.status(400).json({ error: 'Invalid maxAmount' });
    }
    
    const qrPayload = {
      delegator: currentDelegator,
      token: USDC_ADDRESS,
      maxAmount: max,
      weeklyLimit: Math.floor(max * 0.2),
      timestamp: Date.now(),
      alias: alias || ''
    };
    
    return res.json({ success: true, qrData: JSON.stringify(qrPayload) });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to generate QR' });
  }
});

// Connect child
app.post('/api/connect-child', async (req, res) => {
  try {
    const { childAddress, address, walletAddress, delegator, token, maxAmount, alias } = req.body;
    const finalChildAddress = childAddress || address || walletAddress;
    
    if (!isValidEthAddress(finalChildAddress) || !isValidEthAddress(delegator)) {
      return res.status(400).json({ error: 'Invalid addresses' });
    }
    
    if (token?.toLowerCase() !== USDC_ADDRESS?.toLowerCase()) {
      return res.status(400).json({ error: 'Only USDC token allowed' });
    }
    
    const max = Number(maxAmount);
    if (isNaN(max) || max <= 0) {
      return res.status(400).json({ error: 'Invalid maxAmount' });
    }
    
    const childDoc = await databases.createDocument(DB_ID, COLLECTION_ID, ID.unique(), {
      address: finalChildAddress,
      delegator,
      token: USDC_ADDRESS,
      maxAmount: max,
      weeklyLimit: Math.floor(max * 0.2),
      alias: alias || '',
      status: 'active',
      connectedAt: Date.now(),
      balance: max,
      spent: 0,
      createdAt: Date.now()
    });
    
    return res.json({ success: true, child: childDoc });
  } catch (err) {
    console.error('Connect child error:', err);
    return res.status(500).json({ error: 'Failed to connect child' });
  }
});

// List children
app.get('/api/children', async (req, res) => {
  try {
    const result = await databases.listDocuments(DB_ID, COLLECTION_ID);
    const children = result.documents.map(doc => ({
      id: doc.$id,
      address: doc.address,
      alias: doc.alias || '',
      balance: doc.balance || 0,
      weeklyLimit: doc.weeklyLimit || 0,
      spent: doc.spent || 0,
      status: doc.status || 'active',
      maxAmount: doc.maxAmount || 0,
      delegator: doc.delegator,
      connectedAt: doc.connectedAt
    }));
    return res.json(children);
  } catch (err) {
    console.error('List children error:', err);
    return res.json([]); // Return empty array on error
  }
});

// Update child
app.put('/api/children/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const updates = req.body;
    
    if (!isValidEthAddress(address)) {
      return res.status(400).json({ error: 'Invalid address' });
    }
    
    const result = await databases.listDocuments(DB_ID, COLLECTION_ID);
    const child = result.documents.find(c => c.address.toLowerCase() === address.toLowerCase());
    
    if (!child) {
      return res.status(404).json({ error: 'Child not found' });
    }
    
    const updatedChild = await databases.updateDocument(DB_ID, COLLECTION_ID, child.$id, {
      ...updates,
      updatedAt: Date.now()
    });
    
    return res.json({ success: true, child: updatedChild });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update child' });
  }
});

// Add funds to child
app.post('/api/children/:address/add-funds', async (req, res) => {
  try {
    const { address } = req.params;
    const { amount } = req.body;
    
    if (!isValidEthAddress(address)) {
      return res.status(400).json({ error: 'Invalid address' });
    }
    
    const addAmount = Number(amount);
    if (isNaN(addAmount) || addAmount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }
    
    const result = await databases.listDocuments(DB_ID, COLLECTION_ID);
    const child = result.documents.find(c => c.address.toLowerCase() === address.toLowerCase());
    
    if (!child) {
      return res.status(404).json({ error: 'Child not found' });
    }
    
    const newBalance = (child.balance || 0) + addAmount;
    const newMaxAmount = (child.maxAmount || 0) + addAmount;
    
    const updatedChild = await databases.updateDocument(DB_ID, COLLECTION_ID, child.$id, {
      balance: newBalance,
      maxAmount: newMaxAmount,
      updatedAt: Date.now()
    });
    
    return res.json({ 
      success: true, 
      child: { ...updatedChild, balance: newBalance, maxAmount: newMaxAmount }
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to add funds' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
