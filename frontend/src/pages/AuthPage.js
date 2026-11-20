import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function AuthPage({ initialMode, onBack, onSuccess }) {
  const { login, signup, logout } = useAuth();
  const [mode, setMode] = useState(initialMode);
  const [selectedRole, setSelectedRole] = useState('jobseeker');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const switchMode = (next) => {
    setMode(next);
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setBusy(true);
    try {
      const user = await login({ email: email.trim(), password });
      // The role comes from the server. If the person picked the wrong tab, tell them.
      if (user.role !== selectedRole) {
        await logout();
        setError(
          `This account is registered as ${
            user.role === 'employer' ? 'an Employer' : 'a Job Seeker'
          }. Please select the correct role above.`
        );
        return;
      }
      onSuccess(user);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim() || !email.trim() || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setBusy(true);
    try {
      const user = await signup({ name: name.trim(), email: email.trim(), password, role: selectedRole });
      onSuccess(user);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-container">
      <button className="back-btn" onClick={onBack}>Back</button>

      <div className="auth-box">
        <h1>Job Portal</h1>
        <p>Sign in to find your dream job</p>

        <div className="toggle-buttons">
          <button className={mode === 'login' ? 'active' : ''} onClick={() => switchMode('login')}>
            Login
          </button>
          <button className={mode === 'signup' ? 'active' : ''} onClick={() => switchMode('signup')}>
            Sign Up
          </button>
        </div>

        <div className="role-selection">
          <label>
            <input
              type="radio"
              name="role"
              value="jobseeker"
              checked={selectedRole === 'jobseeker'}
              onChange={(e) => setSelectedRole(e.target.value)}
            />
            Job Seeker
          </label>
          <label>
            <input
              type="radio"
              name="role"
              value="employer"
              checked={selectedRole === 'employer'}
              onChange={(e) => setSelectedRole(e.target.value)}
            />
            Employer
          </label>
        </div>

        {error && <div className="auth-message auth-error">{error}</div>}

        {mode === 'login' ? (
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <input type="email" placeholder="Email address" value={email}
                onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="input-group">
              <input type="password" placeholder="Password" value={password}
                onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button type="submit" disabled={busy}>{busy ? 'Please wait...' : 'Login Now'}</button>
          </form>
        ) : (
          <form onSubmit={handleSignup}>
            <div className="input-group">
              <input type="text" placeholder="Full name" value={name}
                onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="input-group">
              <input type="email" placeholder="Email address" value={email}
                onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="input-group">
              <input type="password" placeholder="Create password (min 6 characters)" value={password}
                onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button type="submit" disabled={busy}>{busy ? 'Please wait...' : 'Create Account'}</button>
          </form>
        )}

        <div className="auth-footer">
          {mode === 'login' ? (
            <>
              Don't have an account?
              <a onClick={() => switchMode('signup')}> Sign Up</a>
            </>
          ) : (
            <>
              Already signed up?
              <a onClick={() => switchMode('login')}> Login</a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
