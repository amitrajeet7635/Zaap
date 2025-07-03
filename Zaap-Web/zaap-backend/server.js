const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const { databases } = require('./appwriteClient');
const { ID } = require('node-appwrite');

// Simple CORS policy for local development
app.use(cors());
app.use(bodyParser.json());

const DB_ID = process.env.APPWRITE_DB_ID;
const COLLECTION_ID = process.env.APPWRITE_CHILDREN_COLLECTION_ID;
const USDC_ADDRESS = process.env.USDC_ADDRESS || '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238';

// Circle SDK Configuration
const CIRCLE_API_KEY = process.env.CIRCLE_API_KEY;
const CIRCLE_ENTITY_SECRET = process.env.CIRCLE_ENTITY_SECRET;

console.log('Server configuration:', {
  USDC_ADDRESS,
  CIRCLE_API_KEY: CIRCLE_API_KEY ? 'Set' : 'Not set',
  CIRCLE_ENTITY_SECRET: CIRCLE_ENTITY_SECRET ? 'Set' : 'Not set',
});

// Initialize Circle SDK
let circleClient;
try {
  const { initiateDeveloperControlledWalletsClient } = require('@circle-fin/developer-controlled-wallets');
  
  if (CIRCLE_API_KEY && CIRCLE_ENTITY_SECRET) {
    circleClient = initiateDeveloperControlledWalletsClient({
      apiKey: CIRCLE_API_KEY,
      entitySecret: CIRCLE_ENTITY_SECRET,
    });
    console.log('Circle SDK initialized successfully');
  } else {
    console.warn('Circle API credentials not provided - wallet features disabled');
  }
} catch (error) {
  console.warn('Circle SDK initialization failed:', error.message);
}

// Global state
let currentDelegator = null;
let parentWalletData = null; // Store parent wallet info

// Helper: Validate Ethereum address
function isValidEthAddress(addr) {
  return typeof addr === 'string' && /^0x[a-fA-F0-9]{40}$/.test(addr) && addr.length === 42;
}

// Helper: Create parent Circle wallet
async function createParentWallet(delegatorAddress) {
  if (!circleClient) {
    throw new Error('Circle SDK not initialized');
  }

  try {
    console.log('Creating parent wallet for:', delegatorAddress);
    
    // Create wallet set
    const walletSetResponse = await circleClient.createWalletSet({
      name: `Parent_${delegatorAddress.slice(0, 8)}`
    });

    if (!walletSetResponse.data?.walletSet?.id) {
      throw new Error('Failed to create parent wallet set');
    }

    // Create wallet on Polygon Amoy testnet
    const walletsResponse = await circleClient.createWallets({
      blockchains: ['MATIC-AMOY'],
      count: 1,
      walletSetId: walletSetResponse.data.walletSet.id
    });

    if (!walletsResponse.data?.wallets?.[0]) {
      throw new Error('Failed to create parent wallet');
    }

    const wallet = walletsResponse.data.wallets[0];
    console.log('Parent wallet created successfully:', wallet.address);
    
    return {
      walletId: wallet.id,
      address: wallet.address,
      walletSetId: walletSetResponse.data.walletSet.id
    };
  } catch (error) {
    console.error('Error creating parent wallet:', error);
    throw error;
  }
}

// Helper: Create child Circle wallet
async function createChildWallet(alias) {
  if (!circleClient) {
    throw new Error('Circle SDK not initialized');
  }

  try {
    console.log('Creating child wallet for:', alias);
    
    // Create wallet set for child
    const walletSetResponse = await circleClient.createWalletSet({
      name: `Child_${alias || Date.now()}`
    });

    if (!walletSetResponse.data?.walletSet?.id) {
      throw new Error('Failed to create child wallet set');
    }

    // Create wallet on Polygon Amoy testnet
    const walletsResponse = await circleClient.createWallets({
      blockchains: ['MATIC-AMOY'],
      count: 1,
      walletSetId: walletSetResponse.data.walletSet.id
    });

    if (!walletsResponse.data?.wallets?.[0]) {
      throw new Error('Failed to create child wallet');
    }

    const wallet = walletsResponse.data.wallets[0];
    console.log('Child wallet created successfully:', wallet.address);
    
    return {
      walletId: wallet.id,
      address: wallet.address,
      walletSetId: walletSetResponse.data.walletSet.id
    };
  } catch (error) {
    console.error('Error creating child wallet:', error);
    throw error;
  }
}

// Helper: Transfer USDC from parent to child
async function transferUSDCToChild(parentWalletId, childWalletAddress, amount) {
  if (!circleClient) {
    throw new Error('Circle SDK not initialized');
  }

  try {
    console.log(`Initiating USDC transfer: ${amount} USDC from ${parentWalletId} to ${childWalletAddress}`);
    
    // Get available tokens on Polygon Amoy
    const tokensResponse = await circleClient.listTokens({
      blockchain: 'MATIC-AMOY'
    });

    const usdcToken = tokensResponse.data?.tokens?.find(token => 
      token.symbol === 'USDC' || token.name.toLowerCase().includes('usdc')
    );

    if (!usdcToken) {
      throw new Error('USDC token not found on Polygon Amoy');
    }

    console.log('Found USDC token:', usdcToken.id);

    // Create transfer transaction
    const transactionResponse = await circleClient.createTransaction({
      amounts: [amount.toString()],
      destinationAddress: childWalletAddress,
      tokenId: usdcToken.id,
      walletId: parentWalletId,
      fee: {
        type: 'level',
        config: {
          feeLevel: 'MEDIUM'
        }
      }
    });

    console.log('USDC transfer transaction created:', transactionResponse.data?.id);
    return transactionResponse.data;
  } catch (error) {
    console.error('Error transferring USDC:', error);
    throw error;
  }
}

// Home route
app.get('/', (req, res) => {
  res.send('Zaap Backend API is running with Circle Wallet integration');
});

// POST /api/set-delegator - Set delegator and create parent wallet
app.post('/api/set-delegator', async (req, res) => {
  try {
    const { delegator } = req.body;
    
    if (!isValidEthAddress(delegator)) {
      return res.status(400).json({ error: 'Invalid delegator address' });
    }
    
    currentDelegator = delegator;
    console.log('Delegator set to:', delegator);
    
    // Create Circle wallet for parent if SDK is available
    if (circleClient) {
      try {
        parentWalletData = await createParentWallet(delegator);
        console.log('Parent wallet data:', parentWalletData);
      } catch (error) {
        console.error('Failed to create parent wallet:', error);
        // Continue without Circle wallet
      }
    }
    
    return res.json({ 
      success: true, 
      delegator: currentDelegator,
      parentWalletAddress: parentWalletData?.address,
      message: 'Delegator set successfully'
    });
  } catch (err) {
    console.error('Set delegator error:', err);
    return res.status(500).json({ error: 'Failed to set delegator' });
  }
});

// GET /api/delegator
app.get('/api/delegator', (req, res) => {
  if (!currentDelegator) {
    return res.status(404).json({ 
      error: 'No delegator set',
      message: 'Please set delegator address first using POST /api/set-delegator' 
    });
  }
  return res.json({ 
    delegator: currentDelegator,
    parentWalletAddress: parentWalletData?.address,
    success: true 
  });
});

// POST /api/generate-qr - Generate QR with USDC token properly included
app.post('/api/generate-qr', async (req, res) => {
  try {
    const { delegator, maxAmount, alias } = req.body;
    
    const finalDelegator = delegator || currentDelegator;
    
    if (!isValidEthAddress(finalDelegator)) {
      return res.status(400).json({ 
        error: 'Invalid or missing delegator address',
        message: 'Please provide a valid delegator address or set one using /api/set-delegator'
      });
    }
    
    const max = Number(maxAmount);
    if (isNaN(max) || max <= 0) {
      return res.status(400).json({ error: 'Invalid maxAmount' });
    }
    
    const weeklyLimit = Math.floor(max * 0.2);
    
    // Update delegator if provided
    if (delegator && delegator !== currentDelegator) {
      currentDelegator = delegator;
      console.log('Delegator updated to:', delegator);
    }
    
    // Create QR payload with proper USDC token inclusion
    const qrPayload = {
      delegator: finalDelegator,
      token: USDC_ADDRESS, // CRITICAL: This ensures USDC token is included
      maxAmount: max,
      weeklyLimit,
      timestamp: Date.now(),
      alias: alias || '',
      restrictions: {
        allowedToken: USDC_ADDRESS,
        tokenSymbol: 'USDC',
        weeklySpendingLimit: weeklyLimit,
        description: `Max: ${max} USDC, Weekly Limit: ${weeklyLimit} USDC`
      }
    };
    
    console.log('Generated QR payload with USDC token:', qrPayload);
    return res.json({ 
      success: true, 
      qrData: JSON.stringify(qrPayload),
      tokenAddress: USDC_ADDRESS // Also return separately for debugging
    });
  } catch (err) {
    console.error('Generate QR error:', err);
    return res.status(500).json({ error: 'Failed to generate QR' });
  }
});

// POST /api/connect-child - Connect child and transfer real USDC
app.post('/api/connect-child', async (req, res) => {
  try {
    console.log('Connect child request with payload:', JSON.stringify(req.body, null, 2));
    
    let { childAddress, address, walletAddress, delegator, token, maxAmount, timestamp, alias } = req.body;
    
    const finalChildAddress = childAddress || address || walletAddress;
    
    // Validate child address
    if (!isValidEthAddress(finalChildAddress)) {
      console.error('Invalid child address:', finalChildAddress);
      return res.status(400).json({ 
        error: 'Invalid child address', 
        message: 'Child address must be a valid Ethereum address' 
      });
    }
    
    // Validate delegator
    if (!isValidEthAddress(delegator)) {
      console.error('Invalid delegator address:', delegator);
      return res.status(400).json({ 
        error: 'Invalid delegator address',
        message: 'Delegator address must be a valid Ethereum address'
      });
    }
    
    // Validate USDC token
    if (!token || token.toLowerCase() !== USDC_ADDRESS.toLowerCase()) {
      console.error('Invalid token address:', token, 'Expected:', USDC_ADDRESS);
      return res.status(400).json({ 
        error: 'Invalid token', 
        message: 'Only USDC token is allowed for child accounts' 
      });
    }
    
    // Validate amount
    const max = Number(maxAmount);
    if (isNaN(max) || max <= 0) {
      console.error('Invalid maxAmount:', maxAmount);
      return res.status(400).json({ 
        error: 'Invalid maxAmount',
        message: 'Maximum amount must be a positive number'
      });
    }
    
    const weeklyLimit = Math.floor(max * 0.2);
    
    // Circle Wallet Integration: Create child wallet and transfer USDC
    let childWalletData = null;
    let transferResult = null;
    
    if (circleClient && parentWalletData) {
      try {
        console.log('Creating Circle wallet for child...');
        childWalletData = await createChildWallet(alias);
        
        console.log('Transferring USDC to child wallet...');
        transferResult = await transferUSDCToChild(
          parentWalletData.walletId,
          childWalletData.address,
          max
        );
        
        console.log('USDC transfer successful:', transferResult?.id);
      } catch (circleError) {
        console.error('Circle wallet/transfer error:', circleError);
        // Continue with database operations even if Circle fails
      }
    } else {
      console.warn('Circle SDK or parent wallet not available - skipping real transfer');
    }
    
    // Check if child already exists in database
    try {
      const existingChildren = await databases.listDocuments(DB_ID, COLLECTION_ID);
      const existingChild = existingChildren.documents.find(child => 
        child.address.toLowerCase() === finalChildAddress.toLowerCase()
      );
      
      if (existingChild) {
        console.log('Child already exists, updating...');
        const updatedChild = await databases.updateDocument(DB_ID, COLLECTION_ID, existingChild.$id, {
          delegator,
          token: USDC_ADDRESS,
          maxAmount: max,
          weeklyLimit,
          alias: alias || existingChild.alias || '',
          status: 'active',
          connectedAt: timestamp || Date.now(),
          balance: max,
          totalUSDC: max,
          updatedAt: Date.now(),
          circleWalletId: childWalletData?.walletId,
          circleWalletAddress: childWalletData?.address,
          lastTransferTxId: transferResult?.id,
        });
        
        console.log('Child updated successfully');
        return res.json({ 
          success: true, 
          child: updatedChild, 
          updated: true,
          circleWallet: childWalletData,
          transferTransaction: transferResult,
          message: 'Child account updated and USDC transferred successfully'
        });
      }
    } catch (error) {
      console.log('No existing child found, creating new one...');
    }
    
    // Create new child in database
    const childDoc = await databases.createDocument(DB_ID, COLLECTION_ID, ID.unique(), {
      address: finalChildAddress,
      delegator,
      token: USDC_ADDRESS,
      maxAmount: max,
      weeklyLimit,
      alias: alias || '',
      status: 'active',
      connectedAt: timestamp || Date.now(),
      balance: max,
      spent: 0,
      totalUSDC: max,
      createdAt: Date.now(),
      circleWalletId: childWalletData?.walletId,
      circleWalletAddress: childWalletData?.address,
      lastTransferTxId: transferResult?.id,
    });
    
    console.log('Child connected successfully with Circle wallet integration');
    return res.json({ 
      success: true, 
      child: childDoc, 
      created: true,
      circleWallet: childWalletData,
      transferTransaction: transferResult,
      message: 'Child account connected and real USDC transferred successfully'
    });
  } catch (err) {
    console.error('Connect child error:', err);
    return res.status(500).json({ 
      error: 'Failed to connect child', 
      details: err.message,
      message: 'Internal server error while connecting child account'
    });
  }
});

// GET /api/children - List all children
app.get('/api/children', async (req, res) => {
  try {
    console.log('Fetching children from database...');
    
    if (!databases) {
      console.error('Database connection not available');
      return res.status(200).json([]);
    }
    
    const result = await databases.listDocuments(DB_ID, COLLECTION_ID);
    console.log('Children fetched successfully:', result.documents.length, 'documents');
    
    // Transform documents to ensure consistent format
    const children = result.documents.map(doc => ({
      id: doc.$id,
      address: doc.address,
      alias: doc.alias || '',
      balance: doc.balance || 0,
      weeklyLimit: doc.weeklyLimit || 0,
      spent: doc.spent || 0,
      status: doc.status || 'active',
      totalUSDC: doc.totalUSDC || doc.maxAmount || 0,
      maxAmount: doc.maxAmount || 0,
      delegator: doc.delegator,
      token: doc.token,
      connectedAt: doc.connectedAt,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      circleWalletId: doc.circleWalletId,
      circleWalletAddress: doc.circleWalletAddress,
      lastTransferTxId: doc.lastTransferTxId
    }));
    
    return res.status(200).json(children);
  } catch (err) {
    console.error('List children error:', err);
    return res.status(200).json([]);
  }
});

// PUT /api/children/:address - Update child account
app.put('/api/children/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const updates = req.body;
    
    if (!isValidEthAddress(address)) {
      return res.status(400).json({ error: 'Invalid address format' });
    }
    
    const result = await databases.listDocuments(DB_ID, COLLECTION_ID);
    const child = result.documents.find(child => 
      child.address.toLowerCase() === address.toLowerCase()
    );
    
    if (!child) {
      return res.status(404).json({ error: 'Child not found' });
    }
    
    const updatedChild = await databases.updateDocument(
      DB_ID, 
      COLLECTION_ID, 
      child.$id, 
      { ...updates, updatedAt: Date.now() }
    );
    
    return res.json({ success: true, child: updatedChild });
  } catch (err) {
    console.error('Update child error:', err);
    return res.status(500).json({ error: 'Failed to update child' });
  }
});

// POST /api/children/:address/add-funds - Add funds to child (Circle wallet integration)
app.post('/api/children/:address/add-funds', async (req, res) => {
  try {
    const { address } = req.params;
    const { amount } = req.body;
    
    if (!isValidEthAddress(address)) {
      return res.status(400).json({ error: 'Invalid address format' });
    }
    
    const addAmount = Number(amount);
    if (isNaN(addAmount) || addAmount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }
    
    // Find child in database
    const result = await databases.listDocuments(DB_ID, COLLECTION_ID);
    const child = result.documents.find(child => 
      child.address.toLowerCase() === address.toLowerCase()
    );
    
    if (!child) {
      return res.status(404).json({ error: 'Child not found' });
    }
    
    // Transfer additional funds via Circle if available
    let transferResult = null;
    if (circleClient && parentWalletData && child.circleWalletAddress) {
      try {
        transferResult = await transferUSDCToChild(
          parentWalletData.walletId,
          child.circleWalletAddress,
          addAmount
        );
        console.log('Additional funds transferred:', transferResult?.id);
      } catch (error) {
        console.error('Circle transfer failed:', error);
      }
    }
    
    // Update child's balance in database
    const newBalance = (child.balance || 0) + addAmount;
    const newMaxAmount = (child.maxAmount || 0) + addAmount;
    
    const updatedChild = await databases.updateDocument(
      DB_ID, 
      COLLECTION_ID, 
      child.$id, 
      {
        balance: newBalance,
        maxAmount: newMaxAmount,
        totalUSDC: newMaxAmount,
        updatedAt: Date.now(),
        lastTransferTxId: transferResult?.id || child.lastTransferTxId
      }
    );
    
    return res.json({ 
      success: true, 
      child: {
        ...updatedChild,
        balance: newBalance,
        maxAmount: newMaxAmount,
        totalUSDC: newMaxAmount
      },
      transferTransaction: transferResult,
      message: `Added ${addAmount} USDC to ${child.alias || 'child'}'s account`
    });
  } catch (err) {
    console.error('Add funds error:', err);
    return res.status(500).json({ error: 'Failed to add funds' });
  }
});

// Start server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Zaap Backend with Circle Wallet integration running on port ${PORT}`);
  console.log('Available endpoints:');
  console.log('  POST /api/set-delegator - Set parent delegator and create Circle wallet');
  console.log('  POST /api/generate-qr - Generate QR with USDC restrictions');
  console.log('  POST /api/connect-child - Connect child and transfer real USDC');
  console.log('  GET /api/children - List all children');
  console.log('  PUT /api/children/:address - Update child details');
  console.log('  POST /api/children/:address/add-funds - Add more USDC to child');
});

module.exports = app;
