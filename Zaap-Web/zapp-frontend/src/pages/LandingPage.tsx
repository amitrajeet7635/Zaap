import Header from '../components/Header'
import Card from '../components/Card'
import Button from '../components/Button'

interface LandingPageProps {
  onNavigateToLogin: () => void
}

export default function LandingPage({ onNavigateToLogin }: LandingPageProps) {
  const features = [
    {
      icon: (
        <svg className="w-8 h-8 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10.5V11.5C15.4,11.5 16,12.4 16,13V16C16,17 15.4,17.5 14.8,17.5H9.2C8.6,17.5 8,17 8,16V13C8,12.4 8.6,11.5 9.2,11.5V10.5C9.2,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.5,8.7 10.5,10.5V11.5H13.5V10.5C13.5,8.7 12.8,8.2 12,8.2Z"/>
        </svg>
      ),
      title: 'Secure Payments',
      description: 'Bank-level security with MetaMask Card integration for safe transactions'
    },
    {
      icon: (
        <svg className="w-8 h-8 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      ),
      title: 'Instant Payments',
      description: 'Quick QR code scanning for seamless transactions anywhere, anytime'
    },
    {
      icon: (
        <svg className="w-8 h-8 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17,19H7V5H17M17,1H7C5.89,1 5,1.89 5,3V21C5,22.1 5.89,23 7,23H17C18.1,23 19,22.1 19,21V3C19,1.89 18.1,1 17,1Z"/>
        </svg>
      ),
      title: 'Mobile First',
      description: 'Designed for teenagers with intuitive mobile interface and easy navigation'
    },
    {
      icon: (
        <svg className="w-8 h-8 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M16,4C16.88,4 17.67,4.84 17.67,5.71C17.67,6.57 16.88,7.43 16,7.43C15.12,7.43 14.33,6.57 14.33,5.71C14.33,4.84 15.12,4 16,4M8.5,4C9.38,4 10.17,4.84 10.17,5.71C10.17,6.57 9.38,7.43 8.5,7.43C7.62,7.43 6.83,6.57 6.83,5.71C6.83,4.84 7.62,4 8.5,4M16,10.5V9H14V10.5C14,11.88 12.88,13 11.5,13H9C7.62,13 6.5,11.88 6.5,10.5V9H4.5V10.5C4.5,12.42 5.91,14.08 7.75,14.45V16H9.25V14.5H11.25V16H12.75V14.45C14.59,14.08 16,12.42 16,10.5Z"/>
        </svg>
      ),
      title: 'Parental Control',
      description: 'Complete oversight with spending limits, notifications, and transaction history'
    }
  ]

  return (
    <div className="min-h-screen bg-black font-inter">
      <Header onLoginClick={onNavigateToLogin} />
      
      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16 animate-fade-in">
          {/* Lightning bolt icon */}
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-glow pulse-yellow">
            <svg className="w-10 h-10 text-black" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight animate-slide-up">
            Digital Wallet for
            <span className="block gradient-text animate-float">
              Smart Teens
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed animate-slide-up">
            Powered by MetaMask Card. Give teens financial independence with complete parental oversight. 
            Scan, pay, and track - all in one secure Web3 platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in">
            <Button size="lg" onClick={onNavigateToLogin} className="text-lg px-10 py-4">
              Start Your Journey
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center text-white mb-3">Why Choose Zaap?</h3>
          <p className="text-center text-gray-400 mb-10 text-base">Built for the Web3 generation</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} hover className="text-center group bg-black/60 border-gray-700 hover:border-yellow-400/50 hover:bg-gradient-to-br hover:from-yellow-400/5 hover:to-yellow-600/10">
                <div className="flex justify-center mb-4 group-hover:animate-bounce-slow">{feature.icon}</div>
                <h3 className="text-lg font-bold text-yellow-400 mb-3">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed text-sm">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* How it Works Section */}
        <Card className="mb-16 bg-gradient-to-br from-gray-900 to-black border-yellow-400/20 overflow-hidden">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold gradient-text mb-4">How Zaap Works</h3>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
              Transform your family's financial experience in three simple steps
            </p>
          </div>
          
          <div className="relative">
            {/* Connection Lines */}
            <div className="hidden lg:block absolute top-24 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400 to-transparent animate-pulse"></div>
            </div>
            <div className="hidden lg:block absolute top-24 left-1/2 right-1/12 h-0.5 bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400 to-transparent animate-pulse animation-delay-1000"></div>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-12 lg:gap-8">
              {/* Step 1 */}
              <div className="text-center group relative">
                <div className="relative mb-8">
                  {/* Main Icon Container */}
                  <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl group-hover:shadow-yellow-400/50 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                    {/* Parent & Wallet Icon */}
                    <svg className="w-12 h-12 text-black transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14M22,8V6H24V8H22M22,10V12H24V10H22M20,12V10H18V12H20M18,8V6H20V8H18Z"/>
                    </svg>
                  </div>
                  
                  {/* Step Number */}
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-black border-2 border-yellow-400 rounded-full flex items-center justify-center group-hover:animate-bounce">
                    <span className="text-yellow-400 text-sm font-bold">1</span>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-yellow-400/10 to-yellow-600/20 border border-yellow-400/30 rounded-2xl p-6 group-hover:border-yellow-400/60 transition-all duration-300 group-hover:bg-yellow-400/5">
                  <h4 className="text-xl font-bold text-yellow-400 mb-4 group-hover:text-yellow-300 transition-colors">
                    Parent Setup & Connect
                  </h4>
                  <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors">
                    Connect your MetaMask wallet securely and create personalized accounts for each child with 
                    <span className="text-yellow-400 font-medium"> customizable spending limits</span> and safety controls
                  </p>
                  
                  {/* Feature Tags */}
                  <div className="flex flex-wrap gap-2 mt-4 justify-center">
                    <span className="text-xs bg-yellow-400/20 text-yellow-300 px-2 py-1 rounded-full border border-yellow-400/30">
                      Secure Setup
                    </span>
                    <span className="text-xs bg-yellow-400/20 text-yellow-300 px-2 py-1 rounded-full border border-yellow-400/30">
                      Spending Limits
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="text-center group relative">
                <div className="relative mb-8">
                  {/* Main Icon Container */}
                  <div className="w-24 h-24 bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-3xl flex items-center justify-center mx-auto shadow-2xl group-hover:shadow-yellow-500/50 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                    {/* Funding & Monitoring Icon */}
                    <svg className="w-12 h-12 text-black transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.5,1L2,6V8H21V6M16,10V12H14.5V16H9.5V12H8V10M2,22H21V19H2M16,16.5H13V18.5H16M8,16.5H11V18.5H8V16.5Z"/>
                    </svg>
                  </div>
                  
                  {/* Step Number */}
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-black border-2 border-yellow-500 rounded-full flex items-center justify-center group-hover:animate-bounce">
                    <span className="text-yellow-500 text-sm font-bold">2</span>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-700/20 border border-yellow-500/30 rounded-2xl p-6 group-hover:border-yellow-500/60 transition-all duration-300 group_hover:bg-yellow-500/5">
                  <h4 className="text-xl font-bold text-yellow-400 mb-4 group-hover:text-yellow-300 transition-colors">
                    Fund & Monitor
                  </h4>
                  <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors">
                    Add funds instantly through MetaMask and monitor all transactions with 
                    <span className="text-yellow-400 font-medium"> real-time analytics</span>, spending insights, and instant notifications
                  </p>
                  
                  {/* Feature Tags */}
                  <div className="flex flex-wrap gap-2 mt-4 justify-center">
                    <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full border border-yellow-500/30">
                      Instant Funding
                    </span>
                    <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full border border-yellow-500/30">
                      Live Monitoring
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="text-center group relative">
                <div className="relative mb-8">
                  {/* Main Icon Container */}
                  <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl group-hover:shadow-yellow-400/50 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                    {/* QR Scan & Pay Icon */}
                    <svg className="w-12 h-12 text-black transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4,4H10V10H4V4M20,4V10H14V4H20M14,15H16V13H14V11H16V13H18V11H20V13H18V15H20V18H18V20H16V18H13V20H11V16H14V15M16,15V18H18V15H16M4,20V14H10V20H4M6,6V8H8V6H6M16,6V8H18V6H16M6,16V18H8V16H6M4,11H6V13H4V11M9,11H13V15H11V13H9V11M11,6H13V10H11V6M2,2V6H6V2H2M18,2V6H22V2H18M2,18V22H6V18H2Z"/>
                    </svg>
                  </div>
                  
                  {/* Step Number */}
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-black border-2 border-yellow-400 rounded-full flex items-center justify-center group-hover:animate-bounce">
                    <span className="text-yellow-400 text-sm font-bold">3</span>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-yellow-400/10 to-yellow-600/20 border border-yellow-400/30 rounded-2xl p-6 group-hover:border-yellow-400/60 transition-all duration-300 group_hover:bg-yellow-400/5">
                  <h4 className="text-xl font-bold text-yellow-400 mb-4 group-hover:text-yellow-300 transition-colors">
                    Scan & Pay Anywhere
                  </h4>
                  <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors">
                    Teens simply scan QR codes for lightning-fast payments anywhere, with 
                    <span className="text-yellow-400 font-medium"> automatic notifications</span> sent to parents for complete peace of mind
                  </p>
                  
                  {/* Feature Tags */}
                  <div className="flex flex-wrap gap-2 mt-4 justify-center">
                    <span className="text-xs bg-yellow-400/20 text-yellow-300 px-2 py-1 rounded-full border border-yellow-400/30">
                      QR Payments
                    </span>
                    <span className="text-xs bg-yellow-400/20 text-yellow-300 px-2 py-1 rounded-full border border-yellow-400/30">
                      Auto Notifications
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Simple Footer */}
        <footer className="text-center py-12 border-t border-gray-800 mt-16">
          <div className="mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <h4 className="text-2xl font-bold gradient-text">Zaap</h4>
          </div>
          <p className="text-gray-400 mb-4">Digital Wallet for Smart Teens</p>
          <p className="text-gray-600 text-sm mt-6">© 2024 Zaap. All rights reserved.</p>
        </footer>
      </main>
    </div>
  )
}

