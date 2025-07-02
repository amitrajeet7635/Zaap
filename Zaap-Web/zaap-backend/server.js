const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

let children = [];

// Endpoint to connect child account via QR scan
app.post('/api/connect-child', async (req, res) => {
  let { childAddress, delegator, token, maxAmount, timestamp } = req.body;
  // If QR payload is sent as a string, parse it
  if (!childAddress && typeof req.body === 'string') {
    try {
      const parsed = JSON.parse(req.body);
      delegator = parsed.delegator;
      token = parsed.token;
      maxAmount = parsed.maxAmount;
      timestamp = parsed.timestamp;
    } catch (e) {
      return res.status(400).json({ error: 'Invalid QR payload' });
    }
  }
  // Validate Ethereum addresses (delegator, token, childAddress if present)
  const isValidEthAddress = (addr) => /^0x[a-fA-F0-9]{40}$/.test(addr);
  if (!delegator || !token || !maxAmount) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }
  if (!isValidEthAddress(delegator)) {
    return res.status(400).json({ error: 'Invalid delegator address' });
  }
  if (!isValidEthAddress(token)) {
    return res.status(400).json({ error: 'Invalid token address' });
  }
  if (childAddress && !isValidEthAddress(childAddress)) {
    return res.status(400).json({ error: 'Invalid child address' });
  }
  // Here you would store the connection, validate, or trigger on-chain logic
  // For now, just return success
  return res.json({ success: true, message: 'Child account connected with restrictions', data: { childAddress, delegator, token, maxAmount, timestamp } });
});

// Get all children
app.get('/api/children', (req, res) => {
  res.json(children);
});

// Add new child
app.post('/api/children', (req, res) => {
  const { address, alias, maxUSDC, balance, weeklyLimit, monthlyLimit } = req.body;
  if (!address) return res.status(400).json({ error: 'Missing address' });
  if (children.find(c => c.address === address)) {
    return res.status(400).json({ error: 'Child already exists' });
  }
  const child = {
    address,
    alias: alias || '',
    maxUSDC: maxUSDC || 0,
    balance: balance || 0,
    weeklyLimit: weeklyLimit || 0,
    monthlyLimit: monthlyLimit || 0,
  };
  children.push(child);
  res.json(child);
});

// Update child (alias, limits)
app.put('/api/children/:address', (req, res) => {
  const { address } = req.params;
  const { alias, weeklyLimit, monthlyLimit } = req.body;
  const child = children.find(c => c.address === address);
  if (!child) return res.status(404).json({ error: 'Child not found' });
  if (alias !== undefined) child.alias = alias;
  if (weeklyLimit !== undefined) child.weeklyLimit = weeklyLimit;
  if (monthlyLimit !== undefined) child.monthlyLimit = monthlyLimit;
  res.json(child);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
