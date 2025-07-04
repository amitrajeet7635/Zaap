// Test script for child account endpoints
const axios = require('axios');

const API_BASE_URL = 'http://localhost:4000'; // Adjust if running on different port

// Test data
const testData = {
  childAddress: '0x1234567890123456789012345678901234567890', // Replace with actual child address
  toAddress: '0x9876543210987654321098765432109876543210', // Replace with actual recipient address
  amount: 5.0,
  memo: 'Test transfer from child account'
};

async function testChildEndpoints() {
  console.log('Testing Child Account Endpoints...\n');

  try {
    // Test 1: Get child balance
    console.log('1. Testing GET /api/child-balance/:address');
    try {
      const balanceResponse = await axios.get(`${API_BASE_URL}/api/child-balance/${testData.childAddress}`);
      console.log('✅ Child balance retrieved successfully:', balanceResponse.data);
    } catch (error) {
      console.log('❌ Child balance test failed:', error.response?.data || error.message);
    }
    console.log('');

    // Test 2: Get child transfer history
    console.log('2. Testing GET /api/child-transfer-history/:address');
    try {
      const historyResponse = await axios.get(`${API_BASE_URL}/api/child-transfer-history/${testData.childAddress}`);
      console.log('✅ Child transfer history retrieved successfully:', historyResponse.data);
    } catch (error) {
      console.log('❌ Child transfer history test failed:', error.response?.data || error.message);
    }
    console.log('');

    // Test 3: Child transfer USDC (Note: This will fail without proper Circle setup)
    console.log('3. Testing POST /api/child-transfer');
    try {
      const transferResponse = await axios.post(`${API_BASE_URL}/api/child-transfer`, {
        childAddress: testData.childAddress,
        toAddress: testData.toAddress,
        amount: testData.amount,
        memo: testData.memo
      });
      console.log('✅ Child transfer successful:', transferResponse.data);
    } catch (error) {
      console.log('❌ Child transfer test failed (expected without Circle setup):', error.response?.data || error.message);
    }
    console.log('');

    // Test 4: Test invalid addresses
    console.log('4. Testing with invalid addresses');
    try {
      await axios.get(`${API_BASE_URL}/api/child-balance/invalid-address`);
    } catch (error) {
      console.log('✅ Invalid address validation working:', error.response?.data?.error);
    }

  } catch (error) {
    console.error('❌ Test setup failed:', error.message);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testChildEndpoints();
}

module.exports = testChildEndpoints;
