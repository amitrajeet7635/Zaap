import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import ParentalLogin from './pages/ParentalLogin';
import ParentalDashboard from './pages/ParentalDashboard';
import LandingPage from './pages/LandingPage';

function RouterWrapper() {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/" element={<LandingPage onNavigateToLogin={() => navigate('/login')} />} />
      <Route
        path="/dashboard"
        element={<ParentalDashboard onNavigateBack={() => navigate('/login')} />}
      />
      <Route
        path="/login"
        element={<ParentalLogin onAuthenticated={() => navigate('/dashboard')} onNavigateBack={() => navigate('/')} />}
      />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <RouterWrapper />
    </BrowserRouter>
  );
}

export default App;
