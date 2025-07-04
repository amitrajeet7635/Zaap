const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();

// Simple CORS policy for local development
app.use(cors());
app.use(bodyParser.json());

// Use a writable directory — fallback to /tmp for serverless environments
let DATA_DIR = path.join(__dirname, 'data');
if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
  DATA_DIR = path.join('/tmp', 'data');
}

// Create the directory if it doesn't exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const CHILDREN_FILE = path.join(DATA_DIR, 'children.json');

// Initialize file if not present
if (!fs.existsSync(CHILDREN_FILE)) {
  fs.writeFileSync(CHILDREN_FILE, JSON.stringify([]));
}

function loadChildren() {
  try {
    const data = fs.readFileSync(CHILDREN_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading children data:', error);
    return [];
  }
}

function saveChildren(children) {
  try {
    fs.writeFileSync(CHILDREN_FILE, JSON.stringify(children, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving children data:', error);
    return false;
  }
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
const USDC_ADDRESS = process.env.USDC_ADDRESS || '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238'; // Sepolia USDC

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
let entitySecretRegistered = false;

async function initializeCircleSDK() {
  try {
    const { 
      initiateDeveloperControlledWalletsClient 
    } = require('@circle-fin/developer-controlled-wallets');
    
    if (!CIRCLE_API_KEY || !CIRCLE_ENTITY_SECRET) {
      console.warn('Circle API credentials not provided - wallet features disabled');
      return;
    }

    console.log('Initializing Circle SDK...');
    
    // Initialize the Circle client directly
    circleClient = initiateDeveloperControlledWalletsClient({
      apiKey: CIRCLE_API_KEY,
      entitySecret: CIRCLE_ENTITY_SECRET,
    });
    
    console.log('Circle SDK initialized successfully');
    entitySecretRegistered = true;
    
  } catch (error) {
    console.warn('Circle SDK initialization failed:', error.message);
    circleClient = null;
    entitySecretRegistered = false;
  }
}

// Initialize Circle SDK on startup
initializeCircleSDK().catch(error => {
  console.error('Failed to initialize Circle SDK:', error.message);
});

// Global state - Store parent wallets by delegator address
let parentWallets = {}; // { delegatorAddress: { walletId, address, walletSetId, balance } }

// Helper: Ensure Circle SDK is initialized and ready
async function ensureCircleSDKReady() {
  if (!circleClient) {
    throw new Error('Circle SDK not initialized - check your Circle API credentials');
  }
  
  if (!entitySecretRegistered) {
    throw new Error('Entity secret not registered - please register through Circle Console');
  }
  
  return circleClient;
}

// Helper: Validate Ethereum address
function isValidEthAddress(addr) {
  return typeof addr === 'string' && /^0x[a-fA-F0-9]{40}$/.test(addr) && addr.length === 42;
}

// Helper: Create or get parent Circle wallet for a delegator
async function getOrCreateParentWallet(delegatorAddress) {
  // Check if we already have a parent wallet for this delegator
  if (parentWallets[delegatorAddress]) {
    console.log('Using existing parent wallet for delegator:', delegatorAddress);
    return parentWallets[delegatorAddress];
  }

  const client = await ensureCircleSDKReady();

  try {
    console.log('Creating new parent wallet for delegator:', delegatorAddress);
    
    // Create wallet set for parent
    const walletSetResponse = await client.createWalletSet({
      name: `Parent_${delegatorAddress.slice(0, 10)}_${Date.now()}`
    });

    if (!walletSetResponse.data?.walletSet?.id) {
      throw new Error('Failed to create parent wallet set');
    }

    // Create wallet on Ethereum Sepolia testnet
    const walletsResponse = await client.createWallets({
      blockchains: ['ETH-SEPOLIA'],
      count: 1,
      walletSetId: walletSetResponse.data.walletSet.id
    });

    if (!walletsResponse.data?.wallets?.[0]) {
      throw new Error('Failed to create parent wallet');
    }

    const wallet = walletsResponse.data.wallets[0];
    console.log('Parent wallet created successfully:', wallet.address);
    
    const parentWalletData = {
      walletId: wallet.id,
      address: wallet.address,
      walletSetId: walletSetResponse.data.walletSet.id,
      delegatorAddress: delegatorAddress,
      balance: 0,
      createdAt: Date.now()
    };

    // Store the parent wallet for future use
    parentWallets[delegatorAddress] = parentWalletData;
    
    return parentWalletData;
  } catch (error) {
    console.error('Error creating parent wallet:', error);
    throw error;
  }
}

// Helper: Get parent wallet USDC balance
async function getParentWalletUSDCBalance(parentWalletId) {
  const client = await ensureCircleSDKReady();

  try {
    console.log('Checking USDC balance for parent wallet:', parentWalletId);
    
    // Get wallet token balances
    const balancesResponse = await client.getWalletTokenBalance({
      id: parentWalletId
    });

    if (!balancesResponse.data?.tokenBalances) {
      throw new Error('Failed to fetch wallet token balances');
    }

    // Find USDC balance
    const usdcBalance = balancesResponse.data.tokenBalances.find(balance => 
      balance.token?.symbol === 'USDC' || 
      balance.token?.name?.toLowerCase().includes('usdc')
    );

    if (!usdcBalance) {
      console.warn('No USDC balance found for wallet');
      return 0;
    }

    const balance = parseFloat(usdcBalance.amount || '0');
    console.log(`Parent wallet USDC balance: ${balance} USDC`);
    return balance;
  } catch (error) {
    console.error('Error checking wallet balance:', error);
    return 0;
  }
}

// Helper: Create child Circle wallet
async function createChildWallet(alias) {
  const client = await ensureCircleSDKReady();

  try {
    console.log('Creating child wallet for:', alias);
    
    // Create wallet set for child
    const walletSetResponse = await client.createWalletSet({
      name: `Child_${alias || Date.now()}`
    });

    if (!walletSetResponse.data?.walletSet?.id) {
      throw new Error('Failed to create child wallet set');
    }

    // Create wallet on Ethereum Sepolia testnet
    const walletsResponse = await client.createWallets({
      blockchains: ['ETH-SEPOLIA'],
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
  const client = await ensureCircleSDKReady();

  try {
    console.log(`Initiating USDC transfer: ${amount} USDC from ${parentWalletId} to ${childWalletAddress}`);
    
    // Get available tokens on Ethereum Sepolia
    const tokensResponse = await client.listTokens({
      blockchain: 'ETH-SEPOLIA'
    });

    const usdcToken = tokensResponse.data?.tokens?.find(token => 
      token.symbol === 'USDC' || token.name.toLowerCase().includes('usdc')
    );

    if (!usdcToken) {
      throw new Error('USDC token not found on Ethereum Sepolia');
    }

    console.log('Found USDC token:', usdcToken.id);

    // Create transfer transaction
    const transactionResponse = await client.createTransaction({
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

// Helper: Get child Circle wallet USDC balance
async function getChildWalletUSDCBalance(childWalletId) {
  const client = await ensureCircleSDKReady();

  try {
    console.log('Checking USDC balance for child wallet:', childWalletId);
    
    // Get wallet token balances
    const balancesResponse = await client.getWalletTokenBalance({
      id: childWalletId
    });

    if (!balancesResponse.data?.tokenBalances) {
      throw new Error('Failed to fetch child wallet token balances');
    }

    // Find USDC balance
    const usdcBalance = balancesResponse.data.tokenBalances.find(balance => 
      balance.token?.symbol === 'USDC' || 
      balance.token?.name?.toLowerCase().includes('usdc')
    );

    if (!usdcBalance) {
      console.warn('No USDC balance found for child wallet');
      return 0;
    }

    const balance = parseFloat(usdcBalance.amount || '0');
    console.log(`Child wallet USDC balance: ${balance} USDC`);
    return balance;
  } catch (error) {
    console.error('Error checking child wallet balance:', error);
    return 0;
  }
}

// Helper: Transfer USDC from child wallet to external address
async function transferUSDCFromChild(childWalletId, toAddress, amount) {
  const client = await ensureCircleSDKReady();

  try {
    console.log(`Initiating USDC transfer from child: ${amount} USDC from ${childWalletId} to ${toAddress}`);
    
    // Get available tokens on Ethereum Sepolia
    const tokensResponse = await client.listTokens({
      blockchain: 'ETH-SEPOLIA'
    });

    const usdcToken = tokensResponse.data?.tokens?.find(token => 
      token.symbol === 'USDC' || token.name.toLowerCase().includes('usdc')
    );

    if (!usdcToken) {
      throw new Error('USDC token not found on Ethereum Sepolia');
    }

    console.log('Found USDC token:', usdcToken.id);

    // Create transfer transaction from child wallet
    const transactionResponse = await client.createTransaction({
      amounts: [amount.toString()],
      destinationAddress: toAddress,
      tokenId: usdcToken.id,
      walletId: childWalletId,
      fee: {
        type: 'level',
        config: {
          feeLevel: 'MEDIUM'
        }
      }
    });

    console.log('Child USDC transfer transaction created:', transactionResponse.data?.id);
    return transactionResponse.data;
  } catch (error) {
    console.error('Error transferring USDC from child:', error);
    throw error;
  }
}

// Helper: Check if child can perform transfer (spending limits, etc.)
function canChildTransfer(child, transferAmount) {
  // Check if child has sufficient balance
  if (child.balance < transferAmount) {
    return {
      allowed: false,
      reason: 'Insufficient balance',
      details: `Child has ${child.balance} USDC, but ${transferAmount} USDC requested`
    };
  }

  // Check weekly spending limit
  const weeklySpent = child.spent || 0;
  const weeklyLimit = child.weeklyLimit || 0;
  
  if (weeklySpent + transferAmount > weeklyLimit) {
    return {
      allowed: false,
      reason: 'Weekly spending limit exceeded',
      details: `Weekly limit: ${weeklyLimit} USDC, already spent: ${weeklySpent} USDC, requested: ${transferAmount} USDC`
    };
  }

  // Check if child account is active
  if (child.status !== 'connected' && child.status !== 'active') {
    return {
      allowed: false,
      reason: 'Child account is not active',
      details: `Child account status: ${child.status}`
    };
  }

  return {
    allowed: true,
    reason: 'Transfer allowed',
    details: `Child can transfer ${transferAmount} USDC`
  };
}

// Home route
app.get('/', (req, res) => {
  res.send('Zaap Backend API is running with Circle Wallet integration');
});

app.post('/api/set-delegator', (req, res) => {
  const { delegator } = req.body;
  if (!delegator) {
    return res.status(400).json({ error: 'Missing delegator address' });
  }
  // Save or process delegator here
  return res.status(200).json({ message: 'Delegator set successfully' });
});

// POST /api/login - User login and parent wallet creation
app.post('/api/login', async (req, res) => {
  try {
    const { delegatorAddress } = req.body;
    
    if (!isValidEthAddress(delegatorAddress)) {
      return res.status(400).json({ error: 'Invalid delegator address' });
    }
    
    console.log('User login for delegator:', delegatorAddress);
    
    // Create or get parent wallet for this delegator
    let parentWalletData = null;
    if (circleClient && entitySecretRegistered) {
      try {
        parentWalletData = await getOrCreateParentWallet(delegatorAddress);
        
        // Update balance
        const balance = await getParentWalletUSDCBalance(parentWalletData.walletId);
        parentWalletData.balance = balance;
        parentWallets[delegatorAddress].balance = balance;
        
        console.log('Parent wallet ready:', parentWalletData.address);
      } catch (error) {
        console.error('Failed to create/get parent wallet:', error);
        // Continue with login even if Circle wallet creation fails
      }
    }
    
    return res.json({ 
      success: true, 
      delegator: delegatorAddress,
      parentWallet: parentWalletData,
      message: 'Login successful'
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Login failed' });
  }
});

// GET /api/parent-wallet/:delegator - Get parent wallet info
app.get('/api/parent-wallet/:delegator', async (req, res) => {
  try {
    const { delegator } = req.params;
    
    if (!isValidEthAddress(delegator)) {
      return res.status(400).json({ error: 'Invalid delegator address' });
    }
    
    const parentWalletData = parentWallets[delegator];
    
    if (!parentWalletData) {
      return res.status(404).json({ 
        error: 'Parent wallet not found',
        message: 'Please login first to create parent wallet' 
      });
    }
    
    // Update balance
    let currentBalance = parentWalletData.balance;
    if (circleClient && entitySecretRegistered) {
      try {
        currentBalance = await getParentWalletUSDCBalance(parentWalletData.walletId);
        parentWallets[delegator].balance = currentBalance;
      } catch (error) {
        console.error('Failed to fetch balance:', error);
      }
    }
    
    return res.json({ 
      success: true,
      parentWallet: {
        ...parentWalletData,
        balance: currentBalance
      }
    });
  } catch (err) {
    console.error('Get parent wallet error:', err);
    return res.status(500).json({ error: 'Failed to get parent wallet' });
  }
});

// POST /api/generate-qr - Generate QR with USDC token and balance validation
app.post('/api/generate-qr', async (req, res) => {
  try {
    const { delegator, maxAmount, alias } = req.body;
    
    console.log('Generate QR request received:', { 
      delegator, 
      maxAmount, 
      alias,
      bodyKeys: Object.keys(req.body)
    });
    
    if (!delegator) {
      return res.status(400).json({ 
        error: 'Missing delegator address',
        message: 'Delegator address is required'
      });
    }
    
    if (!isValidEthAddress(delegator)) {
      console.log('Invalid delegator address validation failed:', {
        delegator,
        type: typeof delegator,
        length: delegator ? delegator.length : 'undefined'
      });
      return res.status(400).json({ 
        error: 'Invalid delegator address',
        message: 'Please provide a valid delegator address',
        received: delegator
      });
    }
    
    if (!maxAmount) {
      return res.status(400).json({ 
        error: 'Missing maxAmount',
        message: 'Maximum amount is required'
      });
    }
    
    const max = Number(maxAmount);
    if (isNaN(max) || max <= 0) {
      console.log('Invalid maxAmount validation failed:', {
        maxAmount,
        parsed: max,
        type: typeof maxAmount
      });
      return res.status(400).json({ 
        error: 'Invalid maxAmount',
        message: 'Maximum amount must be a positive number',
        received: maxAmount
      });
    }
    
    // Check if parent wallet exists for this delegator
    const parentWalletData = parentWallets[delegator];
    if (parentWalletData && circleClient && entitySecretRegistered) {
      try {
        const parentBalance = await getParentWalletUSDCBalance(parentWalletData.walletId);
        parentWallets[delegator].balance = parentBalance;
        
        if (parentBalance < max) {
          return res.status(400).json({
            error: 'Insufficient USDC balance',
            message: `Parent wallet has ${parentBalance} USDC, but ${max} USDC requested. Please fund your Circle wallet first.`,
            parentBalance,
            requestedAmount: max,
            shortfall: max - parentBalance
          });
        }
        
        console.log(`Balance check passed: ${parentBalance} USDC >= ${max} USDC requested`);
      } catch (error) {
        console.warn('Balance check failed, proceeding anyway:', error.message);
      }
    } else {
      console.warn('Parent wallet not found or Circle SDK not available - skipping balance check');
    }
    
    const weeklyLimit = Math.floor(max * 0.2);
    
    // Create QR payload with proper USDC token inclusion
    const qrPayload = {
      delegator: delegator,
      token: USDC_ADDRESS,
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
    
    console.log('Generated QR payload with USDC token and balance validation:', qrPayload);
    return res.json({ 
      success: true, 
      qrData: JSON.stringify(qrPayload),
      tokenAddress: USDC_ADDRESS
    });
  } catch (err) {
    console.error('Generate QR error:', err);
    return res.status(500).json({ error: 'Failed to generate QR' });
  }
});

// POST /api/connect-child - Connect child and create Circle wallet
app.post('/api/connect-child', async (req, res) => {
  try {
    console.log('Connect child request with payload:', JSON.stringify(req.body, null, 2));
    
    let { childAddress, address, walletAddress, delegator, token, maxAmount, timestamp, alias } = req.body;
    
    const finalChildAddress = childAddress || address || walletAddress;
    
    // Validate child address
    if (!isValidEthAddress(finalChildAddress)) {
      return res.status(400).json({ 
        error: 'Invalid child address',
        message: 'Please provide a valid child wallet address'
      });
    }
    
    // Validate delegator
    if (!isValidEthAddress(delegator)) {
      return res.status(400).json({ 
        error: 'Invalid delegator address',
        message: 'Please provide a valid delegator address'
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
    
    // Circle Wallet Integration: Create child wallet
    let childWalletData = null;
    
    if (circleClient && entitySecretRegistered) {
      try {
        console.log('Creating Circle wallet for child...');
        childWalletData = await createChildWallet(alias);
        console.log('Child Circle wallet created successfully:', childWalletData.address);
      } catch (circleError) {
        console.error('Circle wallet creation error:', circleError);
        // Continue with local storage operations even if Circle fails
      }
    } else {
      console.warn('Circle SDK not available - skipping wallet creation');
    }
    
    // Load existing children from local storage
    const children = loadChildren();
    
    // Check if child already exists
    const existingChildIndex = children.findIndex(child => 
      child.address.toLowerCase() === finalChildAddress.toLowerCase()
    );
    
    if (existingChildIndex !== -1) {
      console.log('Child already exists, updating...');
      const updatedChild = {
        ...children[existingChildIndex],
        delegator,
        token: USDC_ADDRESS,
        maxAmount: max,
        weeklyLimit,
        alias: alias || children[existingChildIndex].alias || '',
        status: 'connected',
        connectedAt: timestamp || Date.now(),
        balance: max,
        totalUSDC: max,
        updatedAt: Date.now(),
        circleWalletId: childWalletData?.walletId || children[existingChildIndex].circleWalletId || '',
        circleWalletAddress: childWalletData?.address || children[existingChildIndex].circleWalletAddress || '',
        transferStatus: 'pending'
      };
      
      children[existingChildIndex] = updatedChild;
      saveChildren(children);
      
      console.log('Child updated successfully');
      return res.json({ 
        success: true, 
        child: updatedChild, 
        updated: true,
        circleWallet: childWalletData,
        message: 'Child account connected. Use /api/transfer-usdc to complete USDC transfer.'
      });
    }
    
    // Create new child in local storage
    const childDoc = {
      id: generateId(),
      address: finalChildAddress,
      delegator,
      token: USDC_ADDRESS,
      maxAmount: max,
      weeklyLimit,
      alias: alias || '',
      avatar: '',
      status: 'connected',
      connectedAt: timestamp || Date.now(),
      balance: max,
      spent: 0,
      totalUSDC: max,
      createdAt: Date.now(),
      circleWalletId: childWalletData?.walletId || '',
      circleWalletAddress: childWalletData?.address || '',
      transferStatus: 'pending'
    };
    
    children.push(childDoc);
    saveChildren(children);
    
    console.log('Child connected successfully with Circle wallet');
    return res.json({ 
      success: true, 
      child: childDoc, 
      created: true,
      circleWallet: childWalletData,
      message: 'Child account connected. Use /api/transfer-usdc to complete USDC transfer.'
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

// POST /api/transfer-usdc - Transfer USDC from parent to child Circle wallet
app.post('/api/transfer-usdc', async (req, res) => {
  try {
    const { childAddress, amount, delegator } = req.body;
    
    if (!isValidEthAddress(childAddress)) {
      return res.status(400).json({ error: 'Invalid child address' });
    }
    
    if (!isValidEthAddress(delegator)) {
      return res.status(400).json({ error: 'Invalid delegator address' });
    }
    
    // Load children from local storage
    const children = loadChildren();
    const childIndex = children.findIndex(child => 
      child.address.toLowerCase() === childAddress.toLowerCase()
    );
    
    if (childIndex === -1) {
      return res.status(404).json({ 
        error: 'Child not found',
        message: 'Child account not found in local storage'
      });
    }
    
    const child = children[childIndex];
    
    if (!child.circleWalletAddress) {
      return res.status(400).json({ 
        error: 'Child Circle wallet not found',
        message: 'Child does not have a Circle wallet address'
      });
    }
    
    // Use amount from request or child's maxAmount
    const transferAmount = amount ? Number(amount) : child.maxAmount;
    
    if (isNaN(transferAmount) || transferAmount <= 0) {
      return res.status(400).json({ 
        error: 'Invalid transfer amount',
        message: 'Transfer amount must be a positive number'
      });
    }
    
    // Check if Circle SDK is available
    if (!circleClient || !entitySecretRegistered) {
      return res.status(500).json({ 
        error: 'Circle SDK not available',
        message: 'Circle integration is not properly configured'
      });
    }
    
    // Get parent wallet for this delegator
    const parentWalletData = parentWallets[delegator];
    if (!parentWalletData) {
      return res.status(404).json({ 
        error: 'Parent wallet not found',
        message: 'Please login first to create parent wallet'
      });
    }
    
    // Check parent's USDC balance
    let parentBalance = 0;
    try {
      parentBalance = await getParentWalletUSDCBalance(parentWalletData.walletId);
      parentWallets[delegator].balance = parentBalance;
    } catch (balanceError) {
      console.error('Failed to check parent balance:', balanceError);
      return res.status(500).json({ 
        error: 'Failed to check parent balance',
        message: 'Could not verify parent wallet balance'
      });
    }
    
    if (parentBalance < transferAmount) {
      return res.status(400).json({
        error: 'Insufficient parent wallet balance',
        message: `Parent wallet has ${parentBalance} USDC, but ${transferAmount} USDC requested`,
        parentBalance,
        requestedAmount: transferAmount,
        shortfall: transferAmount - parentBalance
      });
    }
    
    // Perform the USDC transfer
    let transferResult = null;
    try {
      transferResult = await transferUSDCToChild(
        parentWalletData.walletId,
        child.circleWalletAddress,
        transferAmount
      );
      
      console.log('USDC transfer completed successfully');
      
      // Update child's transfer status in local storage
      const updatedChild = {
        ...child,
        transferStatus: 'completed',
        lastTransferTxId: transferResult.id,
        lastTransferAmount: transferAmount,
        lastTransferAt: Date.now(),
        lastTransferError: null,
        updatedAt: Date.now()
      };
      
      children[childIndex] = updatedChild;
      saveChildren(children);
      
      return res.json({
        success: true,
        transferTransaction: transferResult,
        child: updatedChild,
        message: `Successfully transferred ${transferAmount} USDC to ${child.alias || 'child'}`
      });
      
    } catch (transferError) {
      console.error('USDC transfer failed:', transferError);
      
      // Update child with transfer error in local storage
      const updatedChild = {
        ...child,
        transferStatus: 'failed',
        lastTransferError: transferError.message,
        lastTransferAt: Date.now(),
        updatedAt: Date.now()
      };
      
      children[childIndex] = updatedChild;
      saveChildren(children);
      
      return res.status(500).json({
        error: 'Transfer failed',
        message: transferError.message,
        details: 'USDC transfer to child wallet failed'
      });
    }
    
  } catch (err) {
    console.error('Transfer USDC error:', err);
    return res.status(500).json({ 
      error: 'Failed to transfer USDC', 
      details: err.message 
    });
  }
});

// GET /api/children - List all children
app.get('/api/children', async (req, res) => {
  try {
    console.log('Fetching children from local storage...');
    
    const children = loadChildren();
    console.log('Children fetched successfully:', children.length, 'documents');
    
    // Transform documents to ensure consistent format
    const formattedChildren = children.map(doc => ({
      id: doc.id,
      address: doc.address,
      alias: doc.alias || '',
      avatar: doc.avatar || '',
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
      circleWalletId: doc.circleWalletId || '',
      circleWalletAddress: doc.circleWalletAddress || '',
      lastTransferTxId: doc.lastTransferTxId,
      transferStatus: doc.transferStatus || 'pending',
      lastTransferAmount: doc.lastTransferAmount,
      lastTransferAt: doc.lastTransferAt,
      lastTransferError: doc.lastTransferError
    }));
    
    return res.status(200).json(formattedChildren);
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
      return res.status(400).json({ error: 'Invalid child address' });
    }
    
    const children = loadChildren();
    const childIndex = children.findIndex(child => 
      child.address.toLowerCase() === address.toLowerCase()
    );
    
    if (childIndex === -1) {
      return res.status(404).json({ error: 'Child not found' });
    }
    
    const updatedChild = {
      ...children[childIndex],
      ...updates,
      updatedAt: Date.now()
    };
    
    children[childIndex] = updatedChild;
    saveChildren(children);
    
    return res.json({ success: true, child: updatedChild });
  } catch (err) {
    console.error('Update child error:', err);
    return res.status(500).json({ error: 'Failed to update child' });
  }
});

// GET /api/child-balance/:address - Get child Circle wallet balance
app.get('/api/child-balance/:address', async (req, res) => {
  try {
    const { address } = req.params;
    
    if (!isValidEthAddress(address)) {
      return res.status(400).json({ error: 'Invalid child address' });
    }

    // Load children from local storage
    const children = loadChildren();
    const child = children.find(child => 
      child.address.toLowerCase() === address.toLowerCase()
    );

    if (!child) {
      return res.status(404).json({ 
        error: 'Child not found',
        message: 'Child account not found'
      });
    }

    // Get balance from Circle wallet if available
    let circleBalance = 0;
    if (child.circleWalletId && circleClient && entitySecretRegistered) {
      try {
        circleBalance = await getChildWalletUSDCBalance(child.circleWalletId);
      } catch (error) {
        console.error('Failed to fetch Circle wallet balance:', error);
      }
    }

    // Also get balance from blockchain directly
    const getChildBalance = require('./getChildBalance');
    let blockchainBalance = 0;
    if (child.circleWalletAddress) {
      try {
        blockchainBalance = await getChildBalance(child.circleWalletAddress);
      } catch (error) {
        console.error('Failed to fetch blockchain balance:', error);
      }
    }

    // Update child balance in local storage
    const updatedChild = {
      ...child,
      balance: Math.max(circleBalance, blockchainBalance),
      circleWalletBalance: circleBalance,
      blockchainBalance: blockchainBalance,
      lastBalanceCheck: Date.now(),
      updatedAt: Date.now()
    };

    const childIndex = children.findIndex(c => c.address.toLowerCase() === address.toLowerCase());
    children[childIndex] = updatedChild;
    saveChildren(children);

    return res.json({
      success: true,
      child: updatedChild,
      balances: {
        current: updatedChild.balance,
        circle: circleBalance,
        blockchain: blockchainBalance
      }
    });

  } catch (err) {
    console.error('Get child balance error:', err);
    return res.status(500).json({ 
      error: 'Failed to get child balance', 
      details: err.message 
    });
  }
});

// POST /api/child-transfer - Transfer USDC from child to external address
app.post('/api/child-transfer', async (req, res) => {
  try {
    const { childAddress, toAddress, amount, memo } = req.body;
    
    console.log('Child transfer request:', { 
      childAddress, 
      toAddress, 
      amount, 
      memo 
    });

    // Validate child address
    if (!isValidEthAddress(childAddress)) {
      return res.status(400).json({ 
        error: 'Invalid child address',
        message: 'Please provide a valid child wallet address'
      });
    }

    // Validate recipient address
    if (!isValidEthAddress(toAddress)) {
      return res.status(400).json({ 
        error: 'Invalid recipient address',
        message: 'Please provide a valid recipient wallet address'
      });
    }

    // Validate amount
    const transferAmount = Number(amount);
    if (isNaN(transferAmount) || transferAmount <= 0) {
      return res.status(400).json({ 
        error: 'Invalid transfer amount',
        message: 'Transfer amount must be a positive number'
      });
    }

    // Check if Circle SDK is available
    if (!circleClient || !entitySecretRegistered) {
      return res.status(500).json({ 
        error: 'Circle SDK not available',
        message: 'Circle integration is not properly configured'
      });
    }

    // Load children from local storage
    const children = loadChildren();
    const childIndex = children.findIndex(child => 
      child.address.toLowerCase() === childAddress.toLowerCase()
    );

    if (childIndex === -1) {
      return res.status(404).json({ 
        error: 'Child not found',
        message: 'Child account not found'
      });
    }

    const child = children[childIndex];

    // Check if child has Circle wallet
    if (!child.circleWalletId) {
      return res.status(400).json({ 
        error: 'Child Circle wallet not found',
        message: 'Child does not have a Circle wallet'
      });
    }

    // Get current child wallet balance
    let currentBalance = 0;
    try {
      currentBalance = await getChildWalletUSDCBalance(child.circleWalletId);
    } catch (balanceError) {
      console.error('Failed to check child balance:', balanceError);
      return res.status(500).json({ 
        error: 'Failed to check child balance',
        message: 'Could not verify child wallet balance'
      });
    }

    // Update child balance in local storage
    child.balance = currentBalance;

    // Check if child can perform this transfer
    const transferCheck = canChildTransfer(child, transferAmount);
    if (!transferCheck.allowed) {
      return res.status(400).json({
        error: transferCheck.reason,
        message: transferCheck.details,
        childBalance: currentBalance,
        requestedAmount: transferAmount
      });
    }

    // Perform the USDC transfer
    let transferResult = null;
    try {
      transferResult = await transferUSDCFromChild(
        child.circleWalletId,
        toAddress,
        transferAmount
      );

      console.log('Child USDC transfer completed successfully');

      // Update child's spending and balance in local storage
      const updatedChild = {
        ...child,
        balance: currentBalance - transferAmount,
        spent: (child.spent || 0) + transferAmount,
        lastTransferTxId: transferResult.id,
        lastTransferAmount: transferAmount,
        lastTransferTo: toAddress,
        lastTransferMemo: memo || '',
        lastTransferAt: Date.now(),
        lastTransferError: null,
        transferHistory: [
          ...(child.transferHistory || []),
          {
            id: transferResult.id,
            amount: transferAmount,
            to: toAddress,
            memo: memo || '',
            timestamp: Date.now(),
            status: 'completed'
          }
        ].slice(-10), // Keep only last 10 transfers
        updatedAt: Date.now()
      };

      children[childIndex] = updatedChild;
      saveChildren(children);

      return res.json({
        success: true,
        transferTransaction: transferResult,
        child: updatedChild,
        message: `Successfully transferred ${transferAmount} USDC to ${toAddress}`
      });

    } catch (transferError) {
      console.error('Child USDC transfer failed:', transferError);

      // Update child with transfer error in local storage
      const updatedChild = {
        ...child,
        lastTransferError: transferError.message,
        lastTransferAt: Date.now(),
        transferHistory: [
          ...(child.transferHistory || []),
          {
            amount: transferAmount,
            to: toAddress,
            memo: memo || '',
            timestamp: Date.now(),
            status: 'failed',
            error: transferError.message
          }
        ].slice(-10),
        updatedAt: Date.now()
      };

      children[childIndex] = updatedChild;
      saveChildren(children);

      return res.status(500).json({
        error: 'Transfer failed',
        message: transferError.message,
        details: 'USDC transfer from child wallet failed'
      });
    }

  } catch (err) {
    console.error('Child transfer error:', err);
    return res.status(500).json({ 
      error: 'Failed to process child transfer', 
      details: err.message 
    });
  }
});

// GET /api/child-transfer-history/:address - Get child transfer history
app.get('/api/child-transfer-history/:address', async (req, res) => {
  try {
    const { address } = req.params;
    
    if (!isValidEthAddress(address)) {
      return res.status(400).json({ error: 'Invalid child address' });
    }

    // Load children from local storage
    const children = loadChildren();
    const child = children.find(child => 
      child.address.toLowerCase() === address.toLowerCase()
    );

    if (!child) {
      return res.status(404).json({ 
        error: 'Child not found',
        message: 'Child account not found'
      });
    }

    const transferHistory = child.transferHistory || [];
    
    return res.json({
      success: true,
      childAddress: child.address,
      alias: child.alias,
      transferHistory: transferHistory.sort((a, b) => b.timestamp - a.timestamp),
      totalTransfers: transferHistory.length,
      totalSpent: child.spent || 0,
      weeklyLimit: child.weeklyLimit || 0,
      remainingWeeklyLimit: Math.max(0, (child.weeklyLimit || 0) - (child.spent || 0))
    });

  } catch (err) {
    console.error('Get child transfer history error:', err);
    return res.status(500).json({ 
      error: 'Failed to get child transfer history', 
      details: err.message 
    });
  }
});

// GET /api/debug - Debug endpoint
app.get('/api/debug', async (req, res) => {
  try {
    console.log('Debug endpoint called');
    
    // Load children from local storage
    const children = loadChildren();
    
    return res.json({
      success: true,
      localStorageConnected: true,
      documentCount: children.length,
      sampleDocument: children[0] || 'No documents found',
      parentWallets: Object.keys(parentWallets).length,
      circleClient: circleClient !== null,
      entitySecretRegistered,
      envVars: {
        USDC_ADDRESS: USDC_ADDRESS,
        CIRCLE_API_KEY: CIRCLE_API_KEY ? 'Set' : 'Not set',
        DATA_DIR: DATA_DIR,
        CHILDREN_FILE: CHILDREN_FILE
      }
    });
  } catch (err) {
    console.error('Debug error:', err);
    return res.status(500).json({ 
      error: 'Debug failed',
      details: err.message,
      localStorageConnected: false
    });
  }
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Zaap Backend with Circle Wallet integration running on port ${PORT}`);
});

module.exports = app;
