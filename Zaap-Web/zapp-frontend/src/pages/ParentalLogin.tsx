import { useState } from 'react';
import { switchOrAddSepoliaChain } from '../utils/switchOrAddEthChain';
import { getMetaMaskSmartAccount } from '../utils/getMetamaskSmartAccounts';

import Header from '../components/Header';
import Card from '../components/Card';
import Button from '../components/Button';

// Type guard for window.ethereum
function getEthereum() {
  if (typeof window !== 'undefined' && (window as any).ethereum) {
    return (window as any).ethereum;
  }
  return null;
}

interface ParentalLoginProps {
  onAuthenticated: () => void;
  onNavigateBack: () => void;
}

export default function ParentalLogin({ onAuthenticated, onNavigateBack }: ParentalLoginProps) {
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async () => {
    const ethereum = getEthereum();
    if (!ethereum) {
      setStatus('Error: MetaMask not found. Please install MetaMask and try again.');
      return;
    }
    try {
      setLoading(true);
      setStatus('Switching to Ethereum Sepolia...');

      // Switch to Ethereum Sepolia
      await switchOrAddSepoliaChain();

      // Check if on correct network
      const chainId = await ethereum.request({ method: 'eth_chainId' });
      if (chainId !== '0xaa36a7') {
        setStatus('Error: Please switch to Ethereum Sepolia network in MetaMask.');
        setLoading(false);
        return;
      }

      // Request EOA account
      setStatus('Connecting to MetaMask...');
      const [rawAddress] = await ethereum.request({ method: 'eth_requestAccounts' }) as string[];
      const address = rawAddress as `0x${string}`;

      // Pass EOA address to get Smart Account
      setStatus('Setting up MetaMask Smart Account...');
      const { smartAccount } = await getMetaMaskSmartAccount(address);

      // Store the delegator address for the session
      localStorage.setItem('delegatorAddress', address);
      localStorage.setItem('smartAccountAddress', smartAccount.address);

      setStatus(`Successfully connected ${address}`);
      console.log('Connected wallet:', { address, smartAccount: smartAccount.address });

      setTimeout(() => {
        onAuthenticated();
      }, 1500);
    } catch (err: any) {
      console.error('Connection Error:', err);
      setStatus('Error: ' + (err && err.message ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = () => {
    if (loading) {
      return (
        <div className="animate-spin w-6 h-6 border-2 border-yellow-400 border-t-transparent rounded-full"></div>
      );
    }
    if (status.includes('successful')) {
      return (
        <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.41,10.09L6,11.5L11,16.5Z" />
        </svg>
      );
    }
    if (status.includes('Error')) {
      return (
        <svg className="w-6 h-6 text-red-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,7A1,1 0 0,0 11,8V12A1,1 0 0,0 12,13A1,1 0 0,0 13,12V8A1,1 0 0,0 12,7M12,17.5A1.5,1.5 0 0,0 13.5,16A1.5,1.5 0 0,0 12,14.5A1.5,1.5 0 0,0 10.5,16A1.5,1.5 0 0,0 12,17.5Z" />
        </svg>
      );
    }
    return null;
  };

  const getStatusColor = () => {
    if (status.includes('successful')) return 'text-green-400';
    if (status.includes('Error')) return 'text-red-400';
    return 'text-yellow-400';
  };

  return (
    <div className="min-h-screen bg-black font-inter">
      <Header showLogin={false} />

      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-glow pulse-yellow">
            <svg className="w-10 h-10 text-black" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10.5V11.5C15.4,11.5 16,12.4 16,13V16C16,17 15.4,17.5 14.8,17.5H9.2C8.6,17.5 8,17 8,16V13C8,12.4 8.6,11.5 9.2,11.5V10.5C9.2,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.5,8.7 10.5,10.5V11.5H13.5V10.5C13.5,8.7 12.8,8.2 12,8.2Z" />
            </svg>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight animate-slide-up">
            Parental
            <span className="block gradient-text animate-float">
              Access Portal
            </span>
          </h1>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed animate-slide-up">
            Connect your MetaMask wallet to access your family's financial dashboard and manage spending controls
          </p>
        </div>

        {/* Main Login Card */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Connection Card */}
          <Card className="text-center bg-gradient-to-br from-gray-900 to-black border-yellow-400/30 hover:border-yellow-400/60 transition-all duration-500">
            <div className="mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21.17,3.25Q21.5,3.25 21.76,3.5Q22,3.74 22,4.08V19.92Q22,20.26 21.76,20.5Q21.5,20.75 21.17,20.75H2.83Q2.5,20.75 2.24,20.5Q2,20.26 2,19.92V4.08Q2,3.74 2.24,3.5Q2.5,3.25 2.83,3.25H21.17M21,5H3V19H21V5M14,17H16V15H14V17M10,17H12V15H10V17M6,17H8V15H6V17Z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-yellow-400 mb-4">Secure Connection</h3>
              <p className="text-gray-300 leading-relaxed mb-6">
                Connect with MetaMask to establish secure delegation for your family's financial management
              </p>

              <Button
                size="lg"
                onClick={handleLogin}
                disabled={loading}
                className="w-full text-lg py-4"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-3">
                    <div className="animate-spin w-5 h-5 border-2 border-black border-t-transparent rounded-full"></div>
                    <span>Connecting...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-3">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M21.17,3.25Q21.5,3.25 21.76,3.5Q22,3.74 22,4.08V19.92Q22,20.26 21.76,20.5Q21.5,20.75 21.17,20.75H2.83Q2.5,20.75 2.24,20.5Q2,20.26 2,19.92V4.08Q2,3.74 2.24,3.5Q2.5,3.25 2.83,3.25H21.17M21,5H3V19H21V5M14,17H16V15H14V17M10,17H12V15H10V17M6,17H8V15H6V17Z" />
                    </svg>
                    <span>Connect & Delegate</span>
                  </div>
                )}
              </Button>
              <button onClick={onNavigateBack} className="mt-4 text-yellow-400 underline">Back to Home</button>
            </div>
          </Card>

          {/* Features Card */}
          <Card className="bg-gradient-to-br from-yellow-400/10 to-yellow-600/20 border-yellow-400/30">
            <h3 className="text-xl font-bold text-yellow-400 mb-6 flex items-center">
              <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14H22A1,1 0 0,1 23,15V18A1,1 0 0,1 22,19H21V20A2,2 0 0,1 19,22H5A2,2 0 0,1 3,20V19H2A1,1 0 0,1 1,18V15A1,1 0 0,1 2,14H3A7,7 0 0,1 10,7H11V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2M7.5,13A2.5,2.5 0 0,0 5,15.5A2.5,2.5 0 0,0 7.5,18A2.5,2.5 0 0,0 10,15.5A2.5,2.5 0 0,0 7.5,13M16.5,13A2.5,2.5 0 0,0 14,15.5A2.5,2.5 0 0,0 16.5,18A2.5,2.5 0 0,0 19,15.5A2.5,2.5 0 0,0 16.5,13Z" />
              </svg>
              What You'll Get Access To
            </h3>
            <div className="space-y-4">
              {[
                {
                  icon: '📊',
                  title: 'Real-time Dashboard',
                  desc: 'Monitor all family transactions instantly'
                },
                {
                  icon: '💳',
                  title: 'Spending Controls',
                  desc: 'Set daily and weekly limits for each child'
                },
                {
                  icon: '🔔',
                  title: 'Smart Notifications',
                  desc: 'Get alerts for transactions and limit breaches'
                },
                {
                  icon: '🛡️',
                  title: 'Security Features',
                  desc: 'Block cards and restrict spending instantly'
                }
              ].map((feature, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-800/30 rounded-xl hover:bg-gray-800/50 transition-all duration-300">
                  <span className="text-2xl">{feature.icon}</span>
                  <div>
                    <h4 className="font-medium text-white">{feature.title}</h4>
                    <p className="text-sm text-gray-400">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Status Card */}
        {status && (
          <Card className={`text-center animate-slide-up bg-gradient-to-br ${status.includes('successful')
            ? 'from-green-400/10 to-green-600/20 border-green-400/30'
            : status.includes('Error')
              ? 'from-red-400/10 to-red-600/20 border-red-400/30'
              : 'from-yellow-400/10 to-yellow-600/20 border-yellow-400/30'
            }`}>
            <div className="flex items-center justify-center space-x-4 mb-4">
              {getStatusIcon()}
              <h3 className="text-lg font-bold text-white">Connection Status</h3>
            </div>
            <p className={`text-lg font-medium ${getStatusColor()}`}>
              {status}
            </p>

            {status.includes('successful') && (
              <div className="mt-6 p-4 bg-green-400/10 rounded-xl border border-green-400/30">
                <div className="flex items-center justify-center space-x-2 text-green-400 mb-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
                  </svg>
                  <span className="font-medium">Success!</span>
                </div>
                <p className="text-green-300 text-sm">
                  You can now access your parental dashboard and manage your family's spending
                </p>
              </div>
            )}

            {status.includes('Error') && (
              <div className="mt-6 p-4 bg-red-400/10 rounded-xl border border-red-400/30">
                <div className="flex items-center justify-center space-x-2 text-red-400 mb-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
                  </svg>
                  <span className="font-medium">Connection Failed</span>
                </div>
                <p className="text-red-300 text-sm">
                  Please make sure MetaMask is installed and try again
                </p>
              </div>
            )}
          </Card>
        )}

        {/* Info Section */}
        <Card className="mt-8 bg-gradient-to-br from-blue-400/10 to-blue-600/20 border-blue-400/30">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-blue-400 mb-4 flex items-center">
                <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M11,17H13V11H11V17Z" />
                </svg>
                How It Works
              </h3>
              <ol className="space-y-3 text-gray-300">
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-yellow-400 text-black rounded-full flex items-center justify-center text-sm font-bold">1</span>
                  <span>Connect your MetaMask wallet securely</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-yellow-400 text-black rounded-full flex items-center justify-center text-sm font-bold">2</span>
                  <span>Create delegation permissions for family management</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-yellow-400 text-black rounded-full flex items-center justify-center text-sm font-bold">3</span>
                  <span>Access your comprehensive parental dashboard</span>
                </li>
              </ol>
            </div>

            <div>
              <h3 className="text-xl font-bold text-blue-400 mb-4 flex items-center">
                <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z" />
                </svg>
                Security & Privacy
              </h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
                  </svg>
                  <span>End-to-end encryption</span>
                </li>
                <li className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
                  </svg>
                  <span>No personal data stored</span>
                </li>
                <li className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
                  </svg>
                  <span>Web3 secure protocols</span>
                </li>
                <li className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
                  </svg>
                  <span>Your keys, your control</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
