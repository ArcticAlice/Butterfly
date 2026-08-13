import React, { useState, useEffect } from 'react';
import './App.css';

// Import pages
// import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import SleepPage from './pages/SleepPage';
import DietPage from './pages/DietPage';
import Vitals from './pages/VitalsPage';
import BloodWorkPage from './pages/BloodWorkPage';
import JournalPage from './pages/JournalPage';
import { getService } from './utils/dataFunctions';
import CalendarPage from './pages/CalendarPage';

function App() {
  // ========== LOGIC SECTION ==========
  const [currentPage, setCurrentPage] = useState('auth');
  const [previousPage, setPreviousPage] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  // 2. Add global database state
  const [service, setService] = useState(null);
  const [isDbLoading, setIsDbLoading] = useState(true);

  // 3. Initialize the database once when App mounts
  useEffect(() => {
    let mounted = true;

    async function initDatabase() {
      try {
        const s = await getService();
        if (mounted) {
          setService(s);
        }
      } catch (error) {
        console.error("Failed to initialize database in App:", error);
      } finally {
        if (mounted) {
          setIsDbLoading(false);
        }
      }
    }

    initDatabase();

    return () => {
      mounted = false;
    };
  }, []);

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

  const handleOpenCalendar = () => {
    if (currentPage !== 'calendar') {
      setPreviousPage(currentPage === 'auth' ? 'dashboard' : currentPage);
    }
    setCurrentPage('calendar');
  };

  const handleSelectDate = (selectedDate) => {
    setCurrentDate(selectedDate);
    setCurrentPage(previousPage || 'dashboard');
  };

  const renderPage = () => {
    // if (!isAuthenticated) {
    //   return <AuthPage onAuthenticate={handleAuthenticate} />;
    // }

    // 4. Show a loading state while the DB connects
    if (isDbLoading) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white' }}>
          <h2>Loading Database...</h2>
        </div>
      );
    }

    // 5. Pass the service as a prop to every page
    switch (currentPage) {
      case 'dashboard':
        return (
          <DashboardPage
            onNavigate={navigateTo}
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            service={service}
            onCalendarClick={handleOpenCalendar}
          />
        );
      case 'sleep':
        return (
          <SleepPage
            onBack={navigateBack}
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            service={service}
            onCalendarClick={handleOpenCalendar}
          />
        );
      case 'diet':
        return (
          <DietPage
            onBack={navigateBack}
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            service={service}
            onCalendarClick={handleOpenCalendar}
          />
        );
      case 'vitals':
        return (
          <Vitals
            onBack={navigateBack}
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            service={service}
            onCalendarClick={handleOpenCalendar}
          />
        );
      case 'blood-work':
        return (
          <BloodWorkPage
            onBack={navigateBack}
            onCalendarClick={handleOpenCalendar}
          />
        );
      case 'journal':
        return (
          <JournalPage
            onBack={navigateBack}
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            service={service}
            onCalendarClick={handleOpenCalendar}
          />
        );
      case 'calendar':
        return (
          <CalendarPage
            currentDate={currentDate}
            onSelectDate={handleSelectDate}
            onBack={() => setCurrentPage(previousPage || 'dashboard')}
          />
        );
      default:
        return (
          <DashboardPage
            onNavigate={navigateTo}
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            service={service}
            onCalendarClick={handleOpenCalendar}
          />
        );
    }
  };

  // ========== RETURN STATEMENT ==========
  return (
    renderPage()
  );
}

export default App;