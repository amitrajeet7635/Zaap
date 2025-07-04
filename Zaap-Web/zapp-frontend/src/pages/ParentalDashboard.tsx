import { useState, useEffect } from 'react';
import { BrowserProvider } from 'ethers';
import Header from '../components/Header'
import Card from '../components/Card'
import Button from '../components/Button'
import { QRCodeSVG } from 'qrcode.react';
import Modal from '../components/Modal';
import { apiCall, loginUser, getParentWallet } from '../utils/api';

interface Child {
  id?: string;
  address?: string;
  name?: string; // alias
  alias?: string;
  avatar?: string;
  balance: number;
  weeklyLimit: number;
  spent: number;
  status?: 'active' | 'restricted';
  walletAddress?: string;
  totalUSDC?: number;
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

interface ParentWallet {
  walletId: string;
  address: string;
  walletSetId: string;
  delegatorAddress: string;
  balance: number;
  createdAt: number;
}

interface ParentalDashboardProps {
  onNavigateBack: () => void
}

export default function ParentalDashboard({ onNavigateBack }: ParentalDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'children' | 'transactions'>('overview')
  
  // Real data from your API
  const [children, setChildren] = useState<Child[]>([])
  const [transactions] = useState<Transaction[]>([])

  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [parentWallet, setParentWallet] = useState<ParentWallet | null>(null);
  const [usdcBalance, setUsdcBalance] = useState<string>('0');
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrData, setQRData] = useState('');
  const [qrAmount, setQRAmount] = useState('');
  const [qrAlias, setQRAlias] = useState('');
  const [loading, setLoading] = useState(false);
  const [qrTestResult, setQrTestResult] = useState<string | null>(null);

  // Safe wrapper to ensure children is always an array
  const safeChildren = Array.isArray(children) ? children : [];

  // Initialize from stored delegator address
  useEffect(() => {
    const storedAddress = localStorage.getItem('delegatorAddress');
    if (storedAddress) {
      setWalletAddress(storedAddress);
      performLogin(storedAddress);
    } else {
      connectWallet(); // Auto-connect if not stored
    }
  }, []);

  // Perform login and create parent wallet
  const performLogin = async (delegatorAddress: string) => {
    try {
      setLoading(true);
      console.log('Performing login for delegator:', delegatorAddress);
      
      const loginResponse = await loginUser(delegatorAddress);
      
      if (loginResponse.success && loginResponse.parentWallet) {
        setParentWallet(loginResponse.parentWallet);
        setUsdcBalance(loginResponse.parentWallet.balance.toString());
        console.log('Parent wallet created/retrieved:', loginResponse.parentWallet);
      } else {
        console.log('Login successful but no parent wallet created');
      }
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // Connect wallet
  const connectWallet = async () => {
    if (!(window as any).ethereum) return;
    const provider = new BrowserProvider((window as any).ethereum);
    const accounts = await provider.send('eth_requestAccounts', []);
    setWalletAddress(accounts[0]);
    localStorage.setItem('delegatorAddress', accounts[0]);
    
    // Perform login with the new wallet address
    await performLogin(accounts[0]);
  };

  // Fetch parent wallet balance
  const fetchParentWalletBalance = async () => {
    if (!walletAddress) return;
    
    try {
      const parentWalletData = await getParentWallet(walletAddress);
      
      if (parentWalletData.success && parentWalletData.parentWallet) {
        setParentWallet(parentWalletData.parentWallet);
        setUsdcBalance(parentWalletData.parentWallet.balance.toString());
      }
    } catch (error) {
      console.error('Failed to fetch parent wallet balance:', error);
    }
  };

  // Fetch parent wallet balance periodically
  useEffect(() => {
    if (!walletAddress) return;
    
    fetchParentWalletBalance();
    
    // Set up interval to refresh balance every 30 seconds
    const intervalId = setInterval(fetchParentWalletBalance, 30000);
    
    return () => clearInterval(intervalId);
  }, [walletAddress]);

  // Fetch children from backend on load
  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const childrenList = await apiCall('/api/children');
        // Ensure we always have an array, even if response is not ok
        setChildren(Array.isArray(childrenList) ? childrenList : []);
      } catch (error) {
        console.error('Error fetching children:', error);
        setChildren([]); // Set empty array on error
      }
    };
    
    fetchChildren();
  }, []);
    
  // Update child alias/weeklyLimit/status
  const handleUpdateChild = async (address: string, updates: Partial<Child>) => {
    try {
      const updated = await apiCall(`/api/children/${address}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
      if (updated.success) {
        setChildren(prev => prev.map(c => (c.address === address || c.id === address) ? { ...c, ...updated.child } : c));
      }
    } catch (error) {
      console.error('Failed to update child:', error);
    }
  };

  // Generate QR code with delegation restrictions
  const generateQRCode = async () => {
    if (!walletAddress || !qrAmount) {
      alert('Please connect your wallet and enter an amount');
      return;
    }

    // Validate inputs before sending
    const amount = parseFloat(qrAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    console.log('Generating QR with:', { 
      delegator: walletAddress, 
      maxAmount: amount, 
      alias: qrAlias || undefined 
    });

    setLoading(true);
    try {
      const { generateQR } = await import('../utils/api');
      const data = await generateQR(walletAddress, amount, qrAlias || undefined);

      if (data.success && data.qrData) {
        setQRData(data.qrData);
        setShowQRModal(true);
        setQrTestResult(null);
      } else {
        const errorMessage = data.error || data.message || 'Unknown error';
        console.error('QR generation failed:', data);
        alert('Failed to generate QR: ' + errorMessage);
      }
    } catch (error) {
      console.error('QR generation error:', error);
      alert('Failed to generate QR: Network error');
    } finally {
      setLoading(false);
    }
  };

  // Editable alias
  const updateChildAlias = (childId: string, newAlias: string) => {
    setChildren(prev => prev.map(child =>
      (child.id === childId || child.address === childId) ? { ...child, alias: newAlias } : child
    ));
    handleUpdateChild(childId, { alias: newAlias });
  };

  // Toggle child status
  const toggleChildStatus = (childId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'restricted' : 'active';
    setChildren(prev => prev.map(child =>
      (child.id === childId || child.address === childId) ? { ...child, status: newStatus } : child
    ));
    handleUpdateChild(childId, { status: newStatus });
  };

  // Add this function to handle adding funds to a child
  const handleAddFunds = async (child: Child) => {
    const amountStr = prompt('Enter amount to add (USDC):', '');
    if (!amountStr) return;
    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) {
      alert('Invalid amount');
      return;
    }
    const address = child.id || child.address || '';
    try {
      const updated = await apiCall(`/api/children/${address}/add-funds`, {
        method: 'POST',
        body: JSON.stringify({ amount })
      });
      if (updated.success) {
        setChildren(prev => prev.map(c => (c.id === address || c.address === address) ? { ...c, ...updated.child } : c));
      } else {
        alert('Failed to add funds');
      }
    } catch (error) {
      console.error('Failed to add funds:', error);
      alert('Failed to add funds');
    }
  };

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

  const totalBalance = safeChildren.reduce((sum, child) => sum + (child.balance || 0), 0)
  const totalSpent = safeChildren.reduce((sum, child) => sum + (child.spent || 0), 0)

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
                <h3 className="text-2xl font-bold text-blue-400">{safeChildren.length}</h3>
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
            {/* Minimalist QR Code Generation Section - Top Right */}
            <div className="flex w-full justify-end">
              <div className="flex flex-col items-end w-full md:w-auto">
                <h3 className="text-sm font-semibold text-yellow-400 mb-1 text-right">Add Child Account</h3>
                <div className="flex flex-row items-center gap-2 w-full justify-end">
                  <input
                    type="text"
                    value={qrAlias}
                    onChange={e => setQRAlias(e.target.value)}
                    className="px-2 py-1 rounded bg-gray-800 text-white border border-gray-600 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-400/30 transition w-20 text-sm"
                    placeholder="Name"
                  />
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={qrAmount}
                    onChange={e => setQRAmount(e.target.value)}
                    className="px-2 py-1 rounded bg-gray-800 text-white border border-yellow-400 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-400/30 transition w-24 text-sm font-semibold"
                    placeholder="USDC"
                  />
                  <Button 
                    size="sm" 
                    className="text-sm font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 text-black shadow-none px-4 py-1 min-w-0" 
                    onClick={generateQRCode}
                    disabled={loading}
                  >
                    {loading ? '...' : 'Generate QR'}
                  </Button>
                </div>
              </div>
            </div>
            {/* Children List */}
            {safeChildren.length === 0 && (
              <div className="text-gray-400 text-center py-12">No children added yet. Generate a QR to add a child account.</div>
            )}
            {safeChildren.map(child => (
              <div key={child.id || child.address} className="flex items-center justify-between bg-gray-800/60 rounded-2xl p-8 mb-4 shadow-lg">
                <div className="flex items-center space-x-8">
                  <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center text-5xl shadow-md">
                    {/* White male avatar emoji */}
                    <span role="img" aria-label="boy" className="text-black">👦🏻</span>
                  </div>
                  <input
                    type="text"
                    value={child.alias || ''}
                    onChange={e => updateChildAlias(child.id || child.address || '', e.target.value)}
                    placeholder="Set child alias"
                    className="text-2xl font-bold text-white bg-transparent border-b border-yellow-400 focus:outline-none focus:border-yellow-600 px-2 py-1 rounded transition-all duration-200"
                    style={{ minWidth: 120 }}
                  />
                </div>
                <div className="flex flex-col items-end space-y-3">
                  <div className="text-gray-400 text-base">Total USDC: <span className="text-yellow-400 font-bold text-lg">{child.totalUSDC || 0}</span></div>
                  <div className="text-gray-400 text-base">Balance: <span className="text-green-400 font-bold text-lg">{child.balance}</span></div>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-gray-400 text-base">Weekly Limit</span>
                    <input
                      type="number"
                      min="0"
                      value={child.weeklyLimit}
                      onChange={e => handleUpdateChild(child.id || child.address || '', { weeklyLimit: parseInt(e.target.value) })}
                      className="w-20 px-3 py-1 bg-gray-700 text-white rounded text-base border border-yellow-400"
                    />
                    <span className="text-yellow-400 text-base">USDC</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <div className={`px-3 py-1 rounded-full text-base font-medium ${
                      (child.status || 'active') === 'active'
                        ? 'bg-green-400/20 text-green-400'
                        : 'bg-red-400/20 text-red-400'
                    }`}>
                      {(child.status || 'active') === 'active' ? '🟢 Active' : '🔴 Restricted'}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleChildStatus(child.id || child.address || '', child.status || 'active')}
                    >
                      {(child.status || 'active') === 'active' ? 'Restrict' : 'Activate'}
                    </Button>
                    <Button
                      size="sm"
                      className="ml-2 bg-yellow-500 text-black font-bold"
                      onClick={() => handleAddFunds(child)}
                    >
                      Add Funds
                    </Button>
                  </div>
                </div>
              </div>
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
                  {safeChildren.map(child => (
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
                <div className="flex items-center space-x-2">
                  <div>
                    <p className="text-sm text-gray-400">Delegator: {walletAddress.slice(0,6)}...{walletAddress.slice(-4)}</p>
                    {parentWallet && (
                      <div className="flex items-center space-x-2">
                        <p className="text-sm text-blue-400">Circle Wallet: {parentWallet.address.slice(0,6)}...{parentWallet.address.slice(-4)}</p>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(parentWallet.address);
                            alert('Parent wallet address copied!');
                          }}
                          className="text-gray-400 hover:text-white transition-colors"
                          title="Copy parent wallet address"
                        >
                          📋
                        </button>
                      </div>
                    )}
                    <p className="text-sm text-yellow-400">USDC Balance: {usdcBalance}</p>
                  </div>
                  {loading && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* QR Modal Popup */}
      {showQRModal && (
        <Modal onClose={() => { setShowQRModal(false); setQrTestResult(null); }}>
          <div className="flex flex-col items-center p-8 bg-gray-900 rounded-2xl max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-yellow-400 mb-2">Connect Child Account</h2>
            <p className="text-gray-300 text-center mb-6 text-sm leading-relaxed">
              Scan this QR code with the Zaap mobile app to connect a child account with the following restrictions:
            </p>
            
            {/* Restrictions Info */}
            <div className="bg-gray-800 rounded-lg p-4 mb-6 w-full">
              <h3 className="text-yellow-400 font-semibold mb-2">Delegation Restrictions:</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• <strong>Token:</strong> USDC only</li>
                <li>• <strong>Max Amount:</strong> {qrAmount} USDC</li>
                <li>• <strong>Weekly Limit:</strong> {Math.floor(Number(qrAmount) * 0.2)} USDC (20%)</li>
              </ul>
            </div>
            
            {/* QR Code */}
            <div className="bg-white p-4 rounded-lg mb-6">
              <QRCodeSVG value={qrData} size={220} />
            </div>
            
            {/* Instructions */}
            <div className="text-gray-400 text-xs text-center mb-6 leading-relaxed">
              <p className="font-semibold text-yellow-400 mb-2">How to connect:</p>
              <p>1. Open Zaap mobile app</p>
              <p>2. Tap "Scan QR Code"</p>
              <p>3. Point camera at this QR code</p>
              <p>4. Confirm connection on mobile</p>
              <p className="text-yellow-400 mt-2 text-xs">The restrictions will be automatically applied to the child account</p>
            </div>

            {/* Connection Status */}
            {qrTestResult && (
              <div className="w-full mb-4">
                <div className={`text-center text-sm p-3 rounded-lg border-l-4 ${
                  qrTestResult.includes('✅') 
                    ? 'bg-green-900/30 border-green-400 text-green-300' 
                    : 'bg-red-900/30 border-red-400 text-red-300'
                }`}>
                  {qrTestResult}
                </div>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="w-full mb-4">
                <div className="text-center text-sm p-3 rounded-lg bg-yellow-900/30 border-l-4 border-yellow-400 text-yellow-300">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full"></div>
                    <span>Processing connection...</span>
                  </div>
                </div>
              </div>
            )}
            
            <Button 
              size="sm" 
              className="w-full" 
              variant="outline" 
              onClick={() => { 
                setShowQRModal(false); 
                setQrTestResult(null);
                setQRAmount('');
                setQRAlias('');
              }}
            >
              Close
            </Button>
          </div>
        </Modal>
      )}
    </div>
  )
}
