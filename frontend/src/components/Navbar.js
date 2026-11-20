import React from 'react';
import settingsIcon from '../assets/settings-icon-transparent.png';
import { useAuth } from '../hooks/useAuth';

export default function Navbar({ currentPage, navigate, goToAuth, onToggleSettings, onLogout }) {
  const { user } = useAuth();

  const link = (page, label) => (
    <a
      href="#"
      className={`nav-link ${currentPage === page ? 'active-page' : ''}`}
      onClick={(e) => {
        e.preventDefault();
        navigate(page);
      }}
    >
      {label}
    </a>
  );

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h1 className="navbar-logo">JobHub</h1>
      </div>

      <div className="nav-links">
        {link('landing', 'Home')}
        {link('jobListing', 'Jobs')}
        <a href="#" className="nav-link" onClick={(e) => e.preventDefault()}>About</a>
        <a href="#" className="nav-link" onClick={(e) => e.preventDefault()}>Contact</a>
      </div>

      <div className="navbar-right">
        <button className="settings-btn-gradient" onClick={onToggleSettings} title="Settings">
          <img src={settingsIcon} alt="Settings" className="settings-icon-img" />
        </button>

        {user ? (
          <div className="nav-user">
            <span className="user-name">Hi, {user.name}</span>
            {user.role === 'jobseeker' ? (
              <button className="btn-nav-action" onClick={() => navigate('myApplications')}>
                My Applications
              </button>
            ) : (
              <button className="btn-nav-action" onClick={() => navigate('postJob')}>
                Post a Job
              </button>
            )}
            <button className="btn-logout" onClick={onLogout}>Logout</button>
          </div>
        ) : (
          <>
            <button className="btn-login" onClick={() => goToAuth('login')}>Login</button>
            <button className="btn-signup" onClick={() => goToAuth('signup')}>Sign Up</button>
          </>
        )}
      </div>
    </nav>
  );
}
