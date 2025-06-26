import { useState, useEffect } from 'react'
import LandingPage from './pages/LandingPage'
import ParentalLogin from './pages/ParentalLogin'
import ParentalDashboard from './pages/ParentalDashboard'

function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'login' | 'dashboard'>('landing')
  
  return (
    <div className="min-h-screen bg-black">
      {currentPage === 'landing' && (
        <LandingPage onNavigateToLogin={() => setCurrentPage('login')} />
      )}
      {currentPage === 'login' && (
        <ParentalLogin 
          onNavigateBack={() => setCurrentPage('landing')}
          onNavigateToDashboard={() => setCurrentPage('dashboard')}
        />
      )}
      {currentPage === 'dashboard' && (
        <ParentalDashboard onNavigateBack={() => setCurrentPage('landing')} />
      )}
    </div>
  )
}

export default App
