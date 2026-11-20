import React, { useState } from 'react';
import './App.css';
import { AuthProvider, useAuth } from './hooks/useAuth';
import useJobs from './hooks/useJobs';
import useApplications from './hooks/useApplications';
import Navbar from './components/Navbar';
import SettingsPanel from './components/SettingsPanel';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import JobListingPage from './pages/JobListingPage';
import MyApplicationsPage from './pages/MyApplicationsPage';
import PostJobPage from './pages/PostJobPage';

// App only decides WHICH page to show. All page markup lives in /pages,
// data access in /services, shared state in /hooks.
function AppContent() {
  const { user, authLoading, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState('landing');
  const [authMode, setAuthMode] = useState('login');
  const [initialSearch, setInitialSearch] = useState({ query: '', location: '' });
  const [darkMode, setDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState('normal');
  const [showSettings, setShowSettings] = useState(false);

  const { jobs, loading, error, reload: reloadJobs } = useJobs();
  const { applications, apply } = useApplications(user);

  const goToAuth = (mode) => {
    setAuthMode(mode);
    setCurrentPage('auth');
  };

  const handleLogout = async () => {
    await logout();
    setCurrentPage('landing');
  };

  // Returns false when the apply did not succeed (so the modal stays open).
  const handleApply = async (job) => {
    if (!user) {
      goToAuth('login');
      return true;
    }
    if (user.role !== 'jobseeker') {
      window.alert('Only Job Seeker accounts can apply for jobs.');
      return false;
    }
    if (applications.some((a) => a.jobId === job.id)) {
      window.alert('You have already applied for this job.');
      return false;
    }
    try {
      await apply(job.id);
      window.alert(`Successfully applied to ${job.title}!`);
      return true;
    } catch (err) {
      window.alert(err.message);
      return false;
    }
  };

  if (authLoading) {
    return (
      <div className="auth-loading-screen">
        <p>Loading...</p>
      </div>
    );
  }

  const navbar = (
    <Navbar
      currentPage={currentPage}
      navigate={setCurrentPage}
      goToAuth={goToAuth}
      onToggleSettings={() => setShowSettings(!showSettings)}
      onLogout={handleLogout}
    />
  );

  let page = null;
  switch (currentPage) {
    case 'landing':
      page = (
        <LandingPage
          navbar={navbar}
          themeClass={`${darkMode ? 'dark-mode' : 'light-mode'} font-${fontSize}`}
          onSearch={(query, location) => {
            setInitialSearch({ query, location });
            setCurrentPage('jobListing');
          }}
          onBrowse={() => setCurrentPage('jobListing')}
          onGetStarted={() => goToAuth('signup')}
        />
      );
      break;
    case 'auth':
      page = (
        <AuthPage
          initialMode={authMode}
          onBack={() => setCurrentPage('landing')}
          onSuccess={(u) => setCurrentPage(u.homePage)}
        />
      );
      break;
    case 'jobListing':
      page = (
        <JobListingPage
          navbar={navbar}
          jobs={jobs}
          loading={loading}
          error={error}
          user={user}
          initialSearch={initialSearch}
          onApply={handleApply}
        />
      );
      break;
    case 'myApplications':
      page = (
        <MyApplicationsPage
          navbar={navbar}
          user={user}
          applications={applications}
          onBrowse={() => setCurrentPage('jobListing')}
          onLogin={() => goToAuth('login')}
        />
      );
      break;
    case 'postJob':
      page = (
        <PostJobPage
          navbar={navbar}
          user={user}
          onPosted={reloadJobs}
          onLogin={() => goToAuth('login')}
        />
      );
      break;
    default:
      page = null;
  }

  return (
    <>
      {page}
      {showSettings && (
        <SettingsPanel
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          fontSize={fontSize}
          setFontSize={setFontSize}
          onClose={() => setShowSettings(false)}
        />
      )}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
