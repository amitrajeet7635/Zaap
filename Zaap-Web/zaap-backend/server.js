const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

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

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
