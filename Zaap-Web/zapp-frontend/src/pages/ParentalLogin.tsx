import { useState } from 'react'
import Header from '../components/Header'
import Card from '../components/Card'
import Button from '../components/Button'

interface ParentalLoginProps {
  onNavigateBack: () => void
  onNavigateToDashboard: () => void
}

export default function ParentalLogin({ onNavigateBack, onNavigateToDashboard }: ParentalLoginProps) {
  const [isConnecting] = useState(false)
  // const { loggedIn, userInfo, login } = 

  // const handleWeb3AuthConnect = async () => {
  //   setIsConnecting(true)
  //   try {
  //     await login()
  //     console.log('Successfully connected to Web3Auth')
  //     // Navigate to dashboard after successful login
  //     setTimeout(() => {
  //       onNavigateToDashboard()
  //     }, 1000)
  //   } catch (error) {
  //     console.error('Failed to connect:', error)
  //   } finally {
  //     setIsConnecting(false)
  //   }
  // }

  return (
    <div className="min-h-screen bg-black font-inter">
      <Header showLogin={false} />
      
      <div className="max-w-lg mx-auto px-6 py-16">
        <Card className="text-center relative bg-gradient-to-br from-gray-900 to-black border-yellow-400/30 animate-scale-in">
          <button 
            onClick={onNavigateBack}
            className="absolute top-6 left-6 text-gray-400 hover:text-yellow-400 text-2xl transition-all duration-300 hover:scale-110"
          >
            ←
          </button>
          
          <div className="mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-glow pulse-yellow">
              <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A2.006 2.006 0 0 0 17.5 7h-3c-.83 0-1.54.5-1.85 1.22l-1.92 5.78H9c-1.1 0-2 .9-2 2v6h2v7h2v-7h2v7h2v-7z"/>
              </svg>
            </div>
            <h2 className="text-3xl font-bold gradient-text mb-3">Parental Dashboard</h2>
            <p className="text-gray-300 text-base leading-relaxed">
              
                "Welcome back, 'Parent'! Access your family's financial dashboard` :
                "Secure access to your family's financial dashboard using Web3Auth"
            </p>
          </div>

           
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-green-400/10 to-green-600/20 border border-green-400/30 rounded-2xl p-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <span className="text-lg font-bold text-green-400">Connected Successfully</span>
                </div>
                <p className="text-gray-300 leading-relaxed text-sm">
                  You are now connected and can access your parental dashboard
                </p>
              </div>
              
              <Button 
                size="lg" 
                className="w-full text-lg py-5 bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700"
                onClick={onNavigateToDashboard}
              >
                <div className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                  </svg>
                  Access Dashboard
                </div>
              </Button>
            </div>
         
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-yellow-400/10 to-yellow-600/20 border border-yellow-400/30 rounded-2xl p-6 hover:border-yellow-400/50 transition-all duration-300">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <span className="text-lg font-bold text-yellow-400">Web3Auth Login</span>
                </div>
                <p className="text-gray-300 leading-relaxed text-sm">
                  Connect securely using social logins or wallet providers for complete control over your family's digital spending
                </p>
              </div>

              <Button 
                size="lg" 
                className="w-full text-lg py-5"
                disabled={isConnecting}
              >
                {isConnecting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-black border-t-transparent mr-3"></div>
                    Connecting to Web3Auth...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    Connect with Web3Auth
                  </div>
                )}
              </Button>
            </div>
          

      
            <div className="text-center text-gray-400 space-y-2 mt-6">
              <p className="text-sm">Supports Google, Discord, GitHub, and more</p>
              <a 
                href="https://web3auth.io" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-yellow-400 hover:text-yellow-300 font-medium transition-colors duration-300 text-sm"
              >
                Learn more about Web3Auth →
              </a>
            </div>
       
        </Card>

        {/* Security Features */}
        <div className="mt-8 space-y-4">
          <Card className="bg-gradient-to-br from-yellow-400/5 to-yellow-600/10 border-yellow-400/20 hover:border-yellow-400/30 transition-all duration-300">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400/20 to-yellow-600/30 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1Z"/>
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-yellow-400 text-base">Bank-Level Security</h4>
                <p className="text-gray-300 text-sm">MPC technology ensures your keys are never exposed</p>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-400/5 to-yellow-600/10 border-yellow-400/20 hover:border-yellow-400/30 transition-all duration-300">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400/20 to-yellow-600/30 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-yellow-400 text-base">Social Login</h4>
                <p className="text-gray-300 text-sm">Use familiar social accounts for easy access</p>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-400/5 to-yellow-600/10 border-yellow-400/20 hover:border-yellow-400/30 transition-all duration-300">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400/20 to-yellow-600/30 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C9.24 2 7 4.24 7 7v1H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2h-1V7c0-2.76-2.24-5-5-5z"/>
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-yellow-400 text-base">Non-Custodial</h4>
                <p className="text-gray-300 text-sm">You maintain full control of your wallet</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
