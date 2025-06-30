import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import ParentalLogin from './pages/ParentalLogin';
import ParentalDashboard from './pages/ParentalDashboard';

function RouterWrapper() {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/" element={<ParentalLogin />} />
      <Route
        path="/dashboard"
        element={<ParentalDashboard onNavigateBack={() => navigate('/')} />}
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
