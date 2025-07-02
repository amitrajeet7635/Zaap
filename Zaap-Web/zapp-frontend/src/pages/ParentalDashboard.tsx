import { useState, useEffect } from 'react';
import { BrowserProvider, Contract, formatUnits } from 'ethers';
import Header from '../components/Header'
import Card from '../components/Card'
import Button from '../components/Button'
import { QRCodeSVG } from 'qrcode.react';
import Modal from '../components/Modal';

interface Child {
  id: string
  name: string // alias
  avatar: string
  balance: number
  weeklyLimit: number
  monthlyLimit: number
  spent: number
  status: 'active' | 'restricted'
  walletAddress: string
  maxAmount: number
}

interface Transaction {
  id: string
  childId: string
  childName: string
  amount: number
  merchant: string
  category: string
  timestamp: string
  status: 'completed' | 'pending' | 'failed'
}

interface ParentalDashboardProps {
  onNavigateBack: () => void
}

// Update to Ethereum Sepolia USDC address
const USDC_ADDRESS = '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238'; 

const USDC_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function approve(address spender, uint256 amount)",
];

export default function ParentalDashboard({ onNavigateBack }: ParentalDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'children' | 'transactions'>('overview')
  
  // Mock data - replace with real data from your API
  const [children, setChildren] = useState<Child[]>([])
  const [transactions] = useState<Transaction[]>([])

  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [usdcBalance, setUsdcBalance] = useState<string>('0');
  const [showQR, setShowQR] = useState(false);
  const [qrData, setQRData] = useState('');
  const [qrAmount, setQRAmount] = useState('');
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrTestResult, setQrTestResult] = useState<string | null>(null);

  const updateChildLimit = (childId: string, type: 'weekly' | 'monthly', amount: number) => {
    setChildren(prev => prev.map(child => 
      child.id === childId 
        ? { ...child, [type === 'weekly' ? 'weeklyLimit' : 'monthlyLimit']: amount }
        : child
    ))
  }

  const toggleChildStatus = (childId: string) => {
    setChildren(prev => prev.map(child => 
      child.id === childId 
        ? { ...child, status: child.status === 'active' ? 'restricted' : 'active' }
        : child
    ))
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Food & Drink':
        return '🍔'
      case 'Entertainment':
        return '🎮'
      case 'Shopping':
        return '🛍️'
      case 'Transport':
        return '🚗'
      default:
        return '💳'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400'
      case 'pending':
        return 'text-yellow-400'
      case 'failed':
        return 'text-red-400'
      default:
        return 'text-gray-400'
    }
  }

  const totalBalance = children.reduce((sum, child) => sum + child.balance, 0)
  const totalSpent = children.reduce((sum, child) => sum + child.spent, 0)

  // Connect wallet
  const connectWallet = async () => {
    if (!(window as any).ethereum) return;
    const provider = new BrowserProvider((window as any).ethereum);
    const accounts = await provider.send('eth_requestAccounts', []);
    setWalletAddress(accounts[0]);
  };

  // Fetch USDC balance
  useEffect(() => {
    if (!walletAddress) return;
    const fetchBalance = async () => {
      const provider = new BrowserProvider((window as any).ethereum);
      const usdc = new Contract(USDC_ADDRESS, USDC_ABI, provider);
      const bal = await usdc.balanceOf(walletAddress);
      setUsdcBalance(formatUnits(bal, 6));
    };
    fetchBalance();
  }, [walletAddress]);

  // Fetch children from backend
  useEffect(() => {
    fetch('/api/children')
      .then(res => res.json())
      .then(setChildren)
      .catch(() => setChildren([]));
  }, []);

  // Add new child after QR generation
  const handleAddChild = async (child: Partial<Child>) => {
    const res = await fetch('/api/children', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(child)
    });
    if (res.ok) {
      const newChild = await res.json();
      setChildren(prev => [...prev, newChild]);
    }
  };

  // Update child alias/limits
  const handleUpdateChild = async (address: string, updates: Partial<Child>) => {
    const res = await fetch(`/api/children/${address}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (res.ok) {
      const updated = await res.json();
      setChildren(prev => prev.map(c => c.walletAddress === address ? { ...c, ...updated } : c));
      alert('Changes saved successfully!');
    }
  };

  // Generate QR data
  const handleGenerateQR = () => {
    if (!walletAddress || !qrAmount) return;
    const qrPayload = {
      delegator: walletAddress,
      token: USDC_ADDRESS,
      maxAmount: qrAmount,
      timestamp: Date.now(),
    };
    setQRData(JSON.stringify(qrPayload));
    setShowQR(true);
    setShowQRModal(false); // reset modal state
  };

  // Test connect-child API
  const handleTestConnect = async () => {
    setQrTestResult(null);
    try {
      const res = await fetch('/api/connect-child', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: qrData
      });
      const data = await res.json();
      if (res.ok) {
        setQrTestResult('✅ Connection successful!');
      } else {
        setQrTestResult('❌ Connection failed: ' + (data?.error || 'Unknown error'));
      }
    } catch (e) {
      setQrTestResult('❌ Connection failed: Network error');
    }
  };

  // Add this function to handle alias (name) change
  const updateChildAlias = (childId: string, newAlias: string) => {
    setChildren(prev => prev.map(child =>
      child.id === childId ? { ...child, name: newAlias } : child
    ));
  };

  // On QR modal confirm, add new child
  const handleConfirmAddChild = (alias: string) => {
    // Simulate wallet address from QR (in real: get from backend or scan result)
    const newWallet = '0x' + Math.random().toString(16).slice(2, 42).padEnd(40, '0');
    handleAddChild({
      walletAddress: newWallet,
      name: alias, 
      maxAmount: Number(qrAmount),
      balance: 0,
      weeklyLimit: 0,
      monthlyLimit: 0,
      spent: 0,
      status: 'active',
      avatar: '👤',
      id: newWallet
    });
    setShowQR(false);
    setQRAmount('');
  };

  return (
    <div className="min-h-screen bg-black font-inter">
      <Header showLogin={false} />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button 
              onClick={onNavigateBack}
              className="text-gray-400 hover:text-yellow-400 text-2xl transition-all duration-300 hover:scale-110"
            >
              ←
            </button>
            <div>
              <h1 className="text-3xl font-bold gradient-text">Parental Dashboard</h1>
              <p className="text-gray-400 mt-1">Monitor and manage your family's spending</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-900/50 p-1 rounded-2xl">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'children', label: 'Children', icon: '👨‍👩‍👧‍👦' },
            { id: 'transactions', label: 'Transactions', icon: '💳' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black shadow-lg'
                  : 'text-gray-400 hover:text-yellow-400 hover:bg-gray-800/50'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="text-center bg-gradient-to-br from-green-400/10 to-green-600/20 border-green-400/30">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-green-400">{totalBalance.toFixed(2)} USDC</h3>
                <p className="text-gray-300 text-sm">Total Balance</p>
              </Card>

              <Card className="text-center bg-gradient-to-br from-yellow-400/10 to-yellow-600/20 border-yellow-400/30">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20V6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4V4H7Z"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-yellow-400">{totalSpent.toFixed(2)} USDC</h3>
                <p className="text-gray-300 text-sm">Total Spent</p>
              </Card>

              <Card className="text-center bg-gradient-to-br from-blue-400/10 to-blue-600/20 border-blue-400/30">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-blue-400">{children.length}</h3>
                <p className="text-gray-300 text-sm">Active Children</p>
              </Card>

              <Card className="text-center bg-gradient-to-br from-purple-400/10 to-purple-600/20 border-purple-400/30">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2Z"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-purple-400">{transactions.length}</h3>
                <p className="text-gray-300 text-sm">This Week</p>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <h3 className="text-xl font-bold text-yellow-400 mb-6 flex items-center">
                <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z"/>
                </svg>
                Recent Activity
              </h3>
              <div className="space-y-4">
                {transactions.slice(0, 5).map(transaction => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl hover:bg-gray-800/80 transition-all duration-300">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">{getCategoryIcon(transaction.category)}</div>
                      <div>
                        <p className="font-medium text-white">{transaction.merchant}</p>
                        <p className="text-sm text-gray-400">{transaction.childName} • {transaction.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-white">{transaction.amount.toFixed(2)} USDC</p>
                      <p className={`text-sm ${getStatusColor(transaction.status)}`}>{transaction.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Children Tab */}
        {activeTab === 'children' && (
          <div className="space-y-6">
            {/* QR Code Generation UI */}
            <Card className="mb-6">
              <h3 className="text-lg font-bold text-yellow-400 mb-2">Add New Child Account</h3>
              <div className="flex flex-col md:flex-row md:items-end md:space-x-4 space-y-2 md:space-y-0">
                <div className="flex flex-col">
                  <label className="text-gray-300 text-sm mb-1">Max USDC for Child</label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={qrAmount}
                    onChange={e => setQRAmount(e.target.value)}
                    className="px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 w-40"
                    placeholder="e.g. 100"
                  />
                </div>
                <Button size="sm" className="mt-2 md:mt-0" onClick={handleGenerateQR}>
                  Generate QR
                </Button>
                {showQR && (
                  <div className="flex flex-col items-center ml-4 cursor-pointer" onClick={() => setShowQRModal(true)}>
                    <QRCodeSVG value={qrData} size={120} />
                    <span className="text-xs text-gray-400 mt-1">Click to enlarge</span>
                    <Button size="sm" className="mt-2" onClick={() => setShowQR(false)}>
                      Close
                    </Button>
                  </div>
                )}
              </div>
            </Card>
            {/* Children List */}
            {children.length === 0 && (
              <div className="text-gray-400 text-center py-12">No children added yet. Generate a QR to add a child account.</div>
            )}
            {children.map(child => (
              <Card key={child.id} className="hover:border-yellow-400/50 transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center text-2xl">
                      {child.avatar}
                    </div>
                    <div>
                      {/* Editable alias */}
                      <input
                        type="text"
                        value={child.name}
                        onChange={e => updateChildAlias(child.id, e.target.value)}
                        placeholder="Set child alias"
                        className="text-xl font-bold text-white bg-transparent border-b border-yellow-400 focus:outline-none focus:border-yellow-600 mb-1"
                        style={{ minWidth: 120 }}
                      />
                      <p className="text-gray-400">Balance: {child.balance} USDC</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      child.status === 'active' 
                        ? 'bg-green-400/20 text-green-400' 
                        : 'bg-red-400/20 text-red-400'
                    }`}>
                      {child.status === 'active' ? '🟢 Active' : '🔴 Restricted'}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleChildStatus(child.id)}
                    >
                      {child.status === 'active' ? 'Restrict' : 'Activate'}
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Weekly Limit */}
                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-300">Weekly Limit</h4>
                      <span className="text-yellow-400 font-bold">{child.weeklyLimit} USDC</span>
                    </div>
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-400 mb-2">
                        <span>Spent This Week</span>
                        <span>{child.spent} USDC</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min((child.spent / child.weeklyLimit) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="range"
                        min="10"
                        max="2000"
                        value={child.weeklyLimit}
                        onChange={(e) => updateChildLimit(child.id, 'weekly', parseInt(e.target.value))}
                        className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      />
                      <input
                        type="number"
                        value={child.weeklyLimit}
                        onChange={(e) => updateChildLimit(child.id, 'weekly', parseInt(e.target.value))}
                        className="w-16 px-2 py-1 bg-gray-700 text-white rounded text-sm"
                      />
                    </div>
                  </div>

                  {/* Monthly Limit */}
                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-300">Monthly Limit</h4>
                      <span className="text-yellow-400 font-bold">{child.monthlyLimit} USDC</span>
                    </div>
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-400 mb-2">
                        <span>Spent This Month</span>
                        <span>{child.spent} USDC</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min((child.spent / child.monthlyLimit) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="range"
                        min="50"
                        max="8000"
                        value={child.monthlyLimit}
                        onChange={(e) => updateChildLimit(child.id, 'monthly', parseInt(e.target.value))}
                        className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      />
                      <input
                        type="number"
                        value={child.monthlyLimit}
                        onChange={(e) => updateChildLimit(child.id, 'monthly', parseInt(e.target.value))}
                        className="w-16 px-2 py-1 bg-gray-700 text-white rounded text-sm"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <Button size="sm" onClick={() => {/* TODO: Save/confirm changes for this child */}}>
                    Confirm Changes
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-yellow-400 flex items-center">
                <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6,16.5L3,19.44V11H6M11,14.66L9.43,13.32L8,14.64V7H11M16,13L14,15.07V5H16M21.5,11L19,13.5V9.5H21.5M22,3H2C0.89,3 0,3.89 0,5V19C0,20.11 0.89,21 2,21H22C23.11,21 24,20.11 24,19V5C24,3.89 23.11,3 22,3Z"/>
                </svg>
                All Transactions
              </h3>
              <div className="flex space-x-2">
                <select className="px-3 py-2 bg-gray-800 text-white rounded-lg border border-gray-600">
                  <option>All Children</option>
                  {children.map(child => (
                    <option key={child.id}>{child.name}</option>
                  ))}
                </select>
                <select className="px-3 py-2 bg-gray-800 text-white rounded-lg border border-gray-600">
                  <option>All Categories</option>
                  <option>Food & Drink</option>
                  <option>Entertainment</option>
                  <option>Shopping</option>
                  <option>Transport</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-3">
              {transactions.map(transaction => (
                <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl hover:bg-gray-800/60 transition-all duration-300 group">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl group-hover:scale-110 transition-transform duration-300">
                      {getCategoryIcon(transaction.category)}
                    </div>
                    <div>
                      <p className="font-medium text-white">{transaction.merchant}</p>
                      <p className="text-sm text-gray-400">{transaction.childName} • {new Date(transaction.timestamp).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-bold text-white">{transaction.amount.toFixed(2)} USDC</p>
                      <p className={`text-sm ${getStatusColor(transaction.status)}`}>
                        {transaction.status}
                      </p>
                    </div>
                    <button className="text-gray-400 hover:text-yellow-400 transition-colors duration-300">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* Wallet Connection and USDC Allocation */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 p-4 border-t border-gray-700">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {!walletAddress ? (
              <Button size="sm" className="px-6" onClick={connectWallet}>
                Connect Wallet
              </Button>
            ) : (
              <div className="text-right">
                <p className="text-sm text-gray-400">Wallet: {walletAddress.slice(0,6)}...{walletAddress.slice(-4)}</p>
                <p className="text-sm text-yellow-400">USDC: {usdcBalance}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* QR Modal Popup */}
      {showQRModal && (
        <Modal onClose={() => { setShowQRModal(false); setQrTestResult(null); }}>
          <div className="flex flex-col items-center p-6 bg-gray-900 rounded-2xl max-w-xs mx-auto">
            <h2 className="text-xl font-bold text-yellow-400 mb-4">Child Account QR</h2>
            <QRCodeSVG value={qrData} size={200} />
            <div className="mt-4 w-full flex flex-col items-center">
              <Button size="sm" className="w-full" onClick={handleTestConnect}>
                Test Connect
              </Button>
              {qrTestResult && (
                <div className="mt-2 text-center text-sm text-white">{qrTestResult}</div>
              )}
              <Button size="sm" className="w-full mt-2" variant="outline" onClick={() => { setShowQRModal(false); setQrTestResult(null); }}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
