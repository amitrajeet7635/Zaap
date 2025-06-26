import { useState } from 'react'
import Header from '../components/Header'
import Card from '../components/Card'
import Button from '../components/Button'

interface Child {
  id: string
  name: string
  avatar: string
  balance: number
  dailyLimit: number
  weeklyLimit: number
  spent: number
  status: 'active' | 'restricted'
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

export default function ParentalDashboard({ onNavigateBack }: ParentalDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'children' | 'transactions' | 'settings'>('overview')
  
  // Mock data - replace with real data from your API
  const [children, setChildren] = useState<Child[]>([
    {
      id: '1',
      name: 'Alex',
      avatar: '👦',
      balance: 125.50,
      dailyLimit: 50,
      weeklyLimit: 200,
      spent: 35.20,
      status: 'active'
    },
    {
      id: '2',
      name: 'Emma',
      avatar: '👧',
      balance: 85.30,
      dailyLimit: 30,
      weeklyLimit: 150,
      spent: 22.50,
      status: 'active'
    }
  ])

  const [transactions] = useState<Transaction[]>([
    {
      id: '1',
      childId: '1',
      childName: 'Alex',
      amount: 12.50,
      merchant: 'Starbucks',
      category: 'Food & Drink',
      timestamp: '2024-01-20T14:30:00Z',
      status: 'completed'
    },
    {
      id: '2',
      childId: '2',
      childName: 'Emma',
      amount: 8.99,
      merchant: 'McDonald\'s',
      category: 'Food & Drink',
      timestamp: '2024-01-20T12:15:00Z',
      status: 'completed'
    },
    {
      id: '3',
      childId: '1',
      childName: 'Alex',
      amount: 25.00,
      merchant: 'GameStop',
      category: 'Entertainment',
      timestamp: '2024-01-19T16:45:00Z',
      status: 'completed'
    }
  ])

  const updateChildLimit = (childId: string, type: 'daily' | 'weekly', amount: number) => {
    setChildren(prev => prev.map(child => 
      child.id === childId 
        ? { ...child, [type === 'daily' ? 'dailyLimit' : 'weeklyLimit']: amount }
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
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-400">Total Family Balance</p>
              <p className="text-2xl font-bold text-yellow-400">${totalBalance.toFixed(2)}</p>
            </div>
            <Button size="sm" className="px-6">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
              Add Funds
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-900/50 p-1 rounded-2xl">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'children', label: 'Children', icon: '👨‍👩‍👧‍👦' },
            { id: 'transactions', label: 'Transactions', icon: '💳' },
            { id: 'settings', label: 'Settings', icon: '⚙️' }
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
                <h3 className="text-2xl font-bold text-green-400">${totalBalance.toFixed(2)}</h3>
                <p className="text-gray-300 text-sm">Total Balance</p>
              </Card>

              <Card className="text-center bg-gradient-to-br from-yellow-400/10 to-yellow-600/20 border-yellow-400/30">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20V6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4V4H7Z"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-yellow-400">${totalSpent.toFixed(2)}</h3>
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
                      <p className="font-bold text-white">${transaction.amount.toFixed(2)}</p>
                      <p className={`text-sm ${getStatusColor(transaction.status)}`}>
                        {transaction.status}
                      </p>
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
            {children.map(child => (
              <Card key={child.id} className="hover:border-yellow-400/50 transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center text-2xl">
                      {child.avatar}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{child.name}</h3>
                      <p className="text-gray-400">Balance: ${child.balance.toFixed(2)}</p>
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
                  {/* Daily Limit */}
                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-300">Daily Limit</h4>
                      <span className="text-yellow-400 font-bold">${child.dailyLimit}</span>
                    </div>
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-400 mb-2">
                        <span>Spent Today</span>
                        <span>${child.spent.toFixed(2)}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min((child.spent / child.dailyLimit) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="range"
                        min="10"
                        max="200"
                        value={child.dailyLimit}
                        onChange={(e) => updateChildLimit(child.id, 'daily', parseInt(e.target.value))}
                        className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      />
                      <input
                        type="number"
                        value={child.dailyLimit}
                        onChange={(e) => updateChildLimit(child.id, 'daily', parseInt(e.target.value))}
                        className="w-16 px-2 py-1 bg-gray-700 text-white rounded text-sm"
                      />
                    </div>
                  </div>

                  {/* Weekly Limit */}
                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-300">Weekly Limit</h4>
                      <span className="text-yellow-400 font-bold">${child.weeklyLimit}</span>
                    </div>
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-400 mb-2">
                        <span>Spent This Week</span>
                        <span>${(child.spent * 3).toFixed(2)}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(((child.spent * 3) / child.weeklyLimit) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="range"
                        min="50"
                        max="500"
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
                </div>
              </Card>
            ))}
            
            <Card className="text-center border-dashed border-2 border-gray-600 hover:border-yellow-400/50 transition-all duration-300 cursor-pointer">
              <div className="py-8">
                <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
                  ➕
                </div>
                <h3 className="text-lg font-medium text-gray-400 mb-2">Add New Child</h3>
                <p className="text-gray-500 text-sm">Create a new account and set spending limits</p>
              </div>
            </Card>
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
                      <p className="font-bold text-white">${transaction.amount.toFixed(2)}</p>
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

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <Card>
              <h3 className="text-xl font-bold text-yellow-400 mb-6">Notification Settings</h3>
              <div className="space-y-4">
                {[
                  { label: 'Transaction Notifications', desc: 'Get notified for all transactions' },
                  { label: 'Limit Alerts', desc: 'Alerts when spending limits are reached' },
                  { label: 'Weekly Reports', desc: 'Weekly spending summary emails' },
                  { label: 'Low Balance Warnings', desc: 'Notify when balance is low' }
                ].map((setting, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl">
                    <div>
                      <p className="font-medium text-white">{setting.label}</p>
                      <p className="text-sm text-gray-400">{setting.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
                    </label>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h3 className="text-xl font-bold text-yellow-400 mb-6">Security Settings</h3>
              <div className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9V17H10Z"/>
                  </svg>
                  Change PIN
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z"/>
                  </svg>
                  Enable Biometrics
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21,9V7H9V9H21M21,11H9V13H21V11M21,15H9V17H21V15M7,7V9H5V7H7M7,11V13H5V11H7M7,15V17H5V15H7Z"/>
                  </svg>
                  Export Transaction Data
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
