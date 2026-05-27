import React, { useState } from 'react';
import './App.css';

// Import pages
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import SleepPage from './pages/SleepPage';
import DietPage from './pages/DietPage';
import Vitals from './pages/VitalsPage';
import BloodWorkPage from './pages/BloodWorkPage';

function App() {
  // ========== LOGIC SECTION ==========
  const [currentPage, setCurrentPage] = useState('auth');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleAuthenticate = () => {
    setIsAuthenticated(true);
    setCurrentPage('dashboard');
  };

  const navigateTo = (pageName) => {
    setCurrentPage(pageName);
  };

  const navigateBack = () => {
    setCurrentPage('dashboard');
  };

  const renderPage = () => {
    // if (!isAuthenticated) {
    //   return <AuthPage onAuthenticate={handleAuthenticate} />;
    // }

    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage onNavigate={navigateTo} currentDate={currentDate} setCurrentDate={setCurrentDate}/>;
      case 'sleep':
        return <SleepPage onBack={navigateBack} currentDate={currentDate} setCurrentDate={setCurrentDate}/>;
      case 'diet':
        return <DietPage onBack={navigateBack} currentDate={currentDate} setCurrentDate={setCurrentDate}/>;
      case 'vitals':
        return <Vitals onBack={navigateBack} currentDate={currentDate} setCurrentDate={setCurrentDate}/>;
      case 'blood-work':
        return <BloodWorkPage onBack={navigateBack}/>;
      default:
        return <DashboardPage onNavigate={navigateTo} currentDate={currentDate} setCurrentDate={setCurrentDate}/>;
    }
  };

  // ========== RETURN STATEMENT ==========
  return (
      renderPage()
      // <Vitals/>
  );
}

export default App;