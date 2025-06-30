import { useState } from 'react';
import LandingPage from './pages/LandingPage';
import ParentalLogin from './pages/ParentalLogin';
import ParentalDashboard from './pages/ParentalDashboard';

type PageType = 'landing' | 'parentalLogin' | 'parentalDashboard';

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('landing');

  const navigateToParentalLogin = () => {
    setCurrentPage('parentalLogin');
  };

  const navigateToParentalDashboard = () => {
    setCurrentPage('parentalDashboard');
  };

  const navigateToLanding = () => {
    setCurrentPage('landing');
  };

  return (
    <div className="App">
      {currentPage === 'landing' && (
        <LandingPage onNavigateToLogin={navigateToParentalLogin} />
      )}
      
      {currentPage === 'parentalLogin' && (
        <ParentalLogin 
          onNavigateBack={navigateToLanding}
          onLoginSuccess={navigateToParentalDashboard}
        />
      )}
      
      {currentPage === 'parentalDashboard' && (
        <ParentalDashboard onNavigateBack={navigateToLanding} />
      )}
    </div>
  );
}

export default App;
