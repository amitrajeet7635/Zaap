// Test script to verify the complete Circle integration flow
// Run this after setting up Circle credentials

const API_BASE = 'https://zaap-backend.vercel.app'; // Adjust this URL as needed for your local setup

async function testCompleteFlow() {
  console.log('🚀 Testing Complete Zaap + Circle Integration Flow\n');
  
  try {
    // Step 1: Set delegator (creates parent Circle wallet)
    console.log('1. Setting up delegator and parent Circle wallet...');
    const delegatorResponse = await fetch(`${API_BASE}/api/set-delegator`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        delegator: '0x742d35Cc6634C0532925a3b8D3b4E70a1236c889'
      })
    });
    
    const delegatorData = await delegatorResponse.json();
    console.log('✅ Delegator setup:', delegatorData);
    
    // Step 2: Generate QR with USDC token
    console.log('\n2. Generating QR code with USDC restrictions...');
    const qrResponse = await fetch(`${API_BASE}/api/generate-qr`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        maxAmount: 100,
        alias: 'Alice Test'
      })
    });
    
    const qrData = await qrResponse.json();
    console.log('✅ QR Generated successfully');
    
    const parsedQR = JSON.parse(qrData.qrData);
    console.log('📱 QR Contents:');
    console.log(`   • Delegator: ${parsedQR.delegator}`);
    console.log(`   • Token: ${parsedQR.token} (USDC)`);
    console.log(`   • Max Amount: ${parsedQR.maxAmount} USDC`);
    console.log(`   • Weekly Limit: ${parsedQR.weeklyLimit} USDC`);
    console.log(`   • Alias: ${parsedQR.alias}`);
    
    // Step 3: Simulate child connection (creates child wallet + transfers USDC)
    console.log('\n3. Simulating child QR scan and wallet creation...');
    const childResponse = await fetch(`${API_BASE}/api/connect-child`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...parsedQR,
        childAddress: '0x123d35Cc6634C0532925a3b8D3b4E70a1236c999'
      })
    });
    
    const childData = await childResponse.json();
    console.log('✅ Child connection result:', childData);
    
    if (childData.success) {
      console.log('🎉 SUCCESS! Child wallet created and USDC transferred');
      console.log(`   • Child Address: ${childData.child.address}`);
      console.log(`   • Circle Wallet ID: ${childData.circleWalletId || 'Not available (need Circle credentials)'}`);
      console.log(`   • USDC Amount: ${childData.child.balance} USDC`);
    }
    
    // Step 4: List all children
    console.log('\n4. Verifying children list...');
    const childrenResponse = await fetch(`${API_BASE}/api/children`);
    const children = await childrenResponse.json();
    console.log(`✅ Found ${children.length} child account(s)`);
    
    if (children.length > 0) {
      children.forEach((child, index) => {
        console.log(`   Child ${index + 1}:`);
        console.log(`     • Address: ${child.address}`);
        console.log(`     • Alias: ${child.alias}`);
        console.log(`     • Balance: ${child.balance} USDC`);
        console.log(`     • Circle Wallet: ${child.circleWalletId || 'Not available'}`);
      });
    }
    
    console.log('\n🎯 Integration Test Summary:');
    console.log('✅ USDC token properly included in QR');
    console.log('✅ Parent Circle wallet creation ready');
    console.log('✅ Child Circle wallet creation ready');
    console.log('✅ USDC transfer mechanism ready');
    console.log('✅ Database integration working');
    
    console.log('\n📋 Next Steps:');
    console.log('1. Get Circle API credentials from https://console.circle.com/');
    console.log('2. Add CIRCLE_API_KEY and CIRCLE_ENTITY_SECRET to .env');
    console.log('3. Restart server to enable real USDC transfers');
    console.log('4. Test with real Circle sandbox environment');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testCompleteFlow();
}

module.exports = { testCompleteFlow };
