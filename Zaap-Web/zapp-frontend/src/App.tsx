import { useState } from 'react'
import LandingPage from './pages/LandingPage'
import ParentalLogin from './pages/ParentalLogin'

function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'login'>('landing')

  return (
    <div className="min-h-screen bg-black">
      {currentPage === 'landing' && (
        <LandingPage onNavigateToLogin={() => setCurrentPage('login')} />
      )}
      {currentPage === 'login' && (
        <ParentalLogin onNavigateBack={() => setCurrentPage('landing')} />
      )}
    </div>
  )
}

export default App
