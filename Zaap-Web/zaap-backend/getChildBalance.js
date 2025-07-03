// Utility to fetch USDC balance for a given address using ethers.js
const { ethers } = require('ethers');

const USDC_ADDRESS = '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238';
const USDC_ABI = [
  'function balanceOf(address) view returns (uint256)'
];

// You can use a public RPC for Sepolia, or set your own
const RPC_URL = process.env.SEPOLIA_RPC_URL || 'https://rpc.sepolia.org';
const provider = new ethers.JsonRpcProvider(RPC_URL);

async function getChildBalance(address) {
  try {
    const usdc = new ethers.Contract(USDC_ADDRESS, USDC_ABI, provider);
    const bal = await usdc.balanceOf(address);
    // USDC has 6 decimals
    return Number(ethers.formatUnits(bal, 6));
  } catch (e) {
    return 0;
  }
}

module.exports = getChildBalance;
