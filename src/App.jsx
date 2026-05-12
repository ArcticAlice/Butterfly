import React, { useState } from 'react';
import './App.css';

// Import pages
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import SleepPage from './pages/SleepPage';
import WorkoutPage from './pages/WorkoutPage';
import DietPage from './pages/DietPage';
import HealthMetricsPage from './pages/HealthMetricsPage';
import BloodWorkPage from './pages/BloodWorkPage';

function App() {
  // ========== LOGIC SECTION ==========
  const [currentPage, setCurrentPage] = useState('auth');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
    if (!isAuthenticated) {
      return <AuthPage onAuthenticate={handleAuthenticate} />;
    }

    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage onNavigate={navigateTo} />;
      case 'sleep':
        return <SleepPage onBack={navigateBack} />;
      case 'workout':
        return <WorkoutPage onBack={navigateBack} />;
      case 'diet':
        return <DietPage onBack={navigateBack} />;
      case 'health-metrics':
        return <HealthMetricsPage onBack={navigateBack} />;
      case 'blood-work':
        return <BloodWorkPage onBack={navigateBack} />;
      default:
        return <DashboardPage onNavigate={navigateTo} />;
    }
  };

  // ========== RETURN STATEMENT ==========
  return (
    //   {renderPage()}
    <SleepPage/>
  );
}

export default App;