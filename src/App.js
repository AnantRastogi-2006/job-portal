import React, { useState, useEffect } from
'react';
import './App.css';
import heroImage from './assets/hero-illustration.svg';
import settingsIcon from './assets/settings-icon-transparent.png';
import {
  Search,
  MapPin,
  SlidersHorizontal,
  Building2,
  DollarSign,
  Clock,
  Code2,
  BadgeCheck,
  Target,
  ArrowRight,
  X,
  Star,
  TrendingUp,
  Zap,
  BriefcaseBusiness,
  Eye,
  EyeOff,
  LogIn,
} from 'lucide-react';
import { auth, db, googleProvider,
githubProvider } from './firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
// Only the account's role is kept in thebrowser (demo only).
// Firebase Authentication itself handlesthe real identity/password.
const ROLE_MAP_KEY = 'jobhub_roles';
const getRoleMap = () => {
  try {
    return JSON.parse(localStorage.getItem(ROLE_MAP_KEY)) || {};
  } catch (err) {
    return {};
  }
};
const setRoleForUid = (uid, role) => {
  const map = getRoleMap();
  map[uid] = role;
  localStorage.setItem(ROLE_MAP_KEY,
JSON.stringify(map));
};
const friendlyAuthError = (code) => {
  switch (code) {
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Please log in.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Incorrect email or password.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a moment and try again.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in popup was closed before completing.';
    default:
      return 'Something went wrong. Please try again.';
  }
};
function App() {
  // Existing states
  const [currentPage, setCurrentPage] =
useState('landing');
  const [currentAuthMode,
setCurrentAuthMode] = useState('login');
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] =
useState(false);
  const [fontSize, setFontSize] =
useState('normal');
  const [showSettings, setShowSettings] =
useState(false);
  // Auth states
  const [selectedRole, setSelectedRole] =
useState('jobseeker');
  const [loginEmail, setLoginEmail] =
useState('');
  const [loginPassword, setLoginPassword] =
useState('');
  const [signupName, setSignupName] =
useState('');
  const [signupEmail, setSignupEmail] =
useState('');
  const [signupPassword, setSignupPassword]
= useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [authError, setAuthError] =
useState('');
  const [authSuccess, setAuthSuccess] =
useState('');
  const [authLoading, setAuthLoading] =
useState(true);
  // Keep user state in sync with Firebase's own session (persists refresh)
  useEffect(() => {
    const unsubscribe =
onAuthStateChanged(auth, (firebaseUser) =>
{
      if (firebaseUser) {
        const role = getRoleMap()
[firebaseUser.uid] || 'jobseeker';
        setUser({
          uid: firebaseUser.uid,
          name: firebaseUser.displayName ||
firebaseUser.email.split('@')[0],
          email: firebaseUser.email,
          role,
        });
      } else {
        setUser(null);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);
  // Jobs page filter states
  const [jobTypeFilters, setJobTypeFilters]
= useState({
    fullTime: true,
    partTime: false,
    internship: false,
    contract: false,
  });
  const [experienceFilters,
setExperienceFilters] = useState({
    any: true,
    entry: false,
    intermediate: false,
    senior: false,
  });
  const [workModeFilters,
setWorkModeFilters] = useState({
    remote: false,
    onsite: false,
    hybrid: false,
  });
  const [skillFilters, setSkillFilters] =
useState(['React', 'JavaScript', 'Node.js',
'Python']);
  const [salaryMax, setSalaryMax] =
useState(150);
  const [jobSearchQuery, setJobSearchQuery]
= useState('');
  const [locationQuery, setLocationQuery] =
useState('');
  const ALL_SKILLS = [
    'React', 'JavaScript', 'Node.js',
'Python',
    'CSS', 'MongoDB', 'Express', 'HTML',
  ];
  const addMoreSkillFilter = () => {
    const next = ALL_SKILLS.find((sk) =>
!skillFilters.includes(sk));
    if (next)
setSkillFilters([...skillFilters, next]);
  };
  const clearAllFilters = () => {
    setJobTypeFilters({ fullTime: false,
partTime: false, internship: false,
contract: false });
    setExperienceFilters({ any: true,
entry: false, intermediate: false, senior:
false });
    setWorkModeFilters({ remote: false,
onsite: false, hybrid: false });
    setSkillFilters([]);
    setSalaryMax(150);
  };
  const removeSkillFilter = (skill) => {
    setSkillFilters(skillFilters.filter((s) => s !== skill));
  };
  const toggleJobTypeFilter = (key) => {
    setJobTypeFilters({ ...jobTypeFilters,
[key]: !jobTypeFilters[key] });
  };
  const toggleExperienceFilter = (key) => {
    setExperienceFilters({
...experienceFilters, [key]:
!experienceFilters[key] });
  };
  const toggleWorkModeFilter = (key) => {
    setWorkModeFilters({
...workModeFilters, [key]:
!workModeFilters[key] });
  };
  const jobCardMeta = [
    { match: 92, badges: ['Featured', 'Easy Apply'], avatarColor: '#102A56' },
    { match: 89, badges: ['Trending',
'Remote'], avatarColor: '#1FA97A' },
    { match: 87, badges: ['Featured',
'Hybrid'], avatarColor: '#6366F1' },
    { match: 83, badges: ['Remote'],
avatarColor: '#F97316' },
  ];
  const getCompanyInitial = (companyName) =>
    companyName ?
companyName.trim().charAt(0).toUpperCase()
: '?';
  const badgeIcon = (badge) => {
    if (badge === 'Featured') return <Star
size={12} />;
    if (badge === 'Trending') return <TrendingUp size={12} />;
    if (badge === 'Easy Apply') return <Zap
size={12} />;
    return <BriefcaseBusiness size={12} />;
  };
  // Job listings (fake data)
  const jobs = [
    {
      id: 1,
      title: 'React Developer',
      company: 'Tech Corp',
      salary: '$80k - $120k',
      location: 'New York',
      skills: ['React', 'JavaScript',
'CSS'],
      description: 'Build amazing web apps with React. Must have 2+ years experience.',
      fullDescription: 'We are looking for an experienced React Developer to join our team. You will work on cutting-edge web applications serving millions of users. Requirements: Strong React skills, JavaScript proficiency, understanding of REST APIs.',
      jobType: 'Full-time',
      experience: '2+ years',
      postedDate: '2 days ago',
    },
    {
      id: 2,
      title: 'Node.js Developer',
      company: 'StartUp Inc',
      salary: '$70k - $110k',
      location: 'Remote',
      skills: ['Node.js', 'Express',
'MongoDB'],
      description: 'Create scalable backend APIs. Remote-friendly position.',
      fullDescription: 'Join our fastgrowing startup building the future of backend infrastructure. You will design and implement scalable APIs, work with microservices, and mentor junior developers.',
      jobType: 'Full-time',
      experience: '1.5+ years',
      postedDate: '5 days ago',
    },
    {
      id: 3,
      title: 'Full Stack Developer',
      company: 'Web Solutions',
      salary: '$90k - $130k',
      location: 'San Francisco',
      skills: ['React', 'Node.js',
'MongoDB'],
      description: 'Full stack development opportunity. Work on complete projects.',
      fullDescription: 'This is a unique opportunity to work on full-stack projects from database design to UI implementation. You will have ownership of features and work in an agile environment.',
      jobType: 'Full-time',
      experience: '3+ years',
      postedDate: '1 week ago',
    },
    {
      id: 4,
      title: 'Frontend Developer',
      company: 'Design Studio',
      salary: '$75k - $115k',
      location: 'Los Angeles',
      skills: ['React', 'CSS',
'JavaScript'],
      description: 'Create beautiful user interfaces. Design-focused role.',
      fullDescription: 'We are looking fora Frontend Developer passionate about creating beautiful, intuitive user interfaces. Work closely with designers and backend developers to bring ideas to life.',
      jobType: 'Full-time',
      experience: '2+ years',
      postedDate: '3 days ago',
    },
  ];
  const [selectedJob, setSelectedJob] =
useState(null);
  const [applications, setApplications] =
useState([]);
  const [postedJobs, setPostedJobs] =
useState([]);
  // Live-sync employer-posted jobs from Firestore (all visitors see these,
  // and they survive refresh / different devices).
  useEffect(() => {
    const jobsQuery = query(collection(db,
'jobs'), orderBy('createdAt', 'desc'));
    const unsubscribe =
onSnapshot(jobsQuery, (snapshot) => {
      const liveJobs =
snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setPostedJobs(liveJobs);
    });
    return () => unsubscribe();
  }, []);
  // Live-sync the signed-in user's own applications from Firestore
  useEffect(() => {
    if (!user) {
      setApplications([]);
      return undefined;
    }
    const appsQuery = query(
      collection(db, 'applications'),
      where('uid', '==', user.uid)
    );
    const unsubscribe =
onSnapshot(appsQuery, (snapshot) => {
      const liveApps =
snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setApplications(liveApps);
    });
    return () => unsubscribe();
  }, [user]);
  const [newJob, setNewJob] = useState({
    title: '',
    salary: '',
    location: '',
    skills: '',
    description: '',
    fullDescription: '',
  });
  const handleJobChange = (e) => {
    setNewJob({ ...newJob, [e.target.name]:
e.target.value });
  };
  // ===== AUTH HANDLERS =====
  const goToAuth = (mode) => {
    setCurrentAuthMode(mode);
    setAuthError('');
    setAuthSuccess('');
    setCurrentPage('auth');
  };
  const switchAuthMode = (mode) => {
    setCurrentAuthMode(mode);
    setAuthError('');
    setAuthSuccess('');
  };
  const handleFormKeyboardNavigation = (e) => {
    if (!['ArrowDown', 'ArrowUp', 'Enter'].includes(e.key)) return;
    if (e.target.tagName !== 'INPUT') return;

    const fields = Array.from(
      e.currentTarget.querySelectorAll('input:not([type="hidden"]):not(:disabled)')
    );
    const currentIndex = fields.indexOf(e.target);
    if (currentIndex < 0) return;

    if (e.key === 'ArrowDown' || (e.key === 'Enter' && currentIndex < fields.length - 1)) {
      e.preventDefault();
      fields[currentIndex + 1]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      fields[Math.max(0, currentIndex - 1)]?.focus();
    }
  };
  const finishLogin = (role) => {
    setAuthError('');
    setAuthSuccess('');
    setLoginEmail('');
    setLoginPassword('');
    setSignupName('');
    setSignupEmail('');
    setSignupPassword('');
    setCurrentPage(role === 'employer' ?
'postJob' : 'jobListing');
  };
  const handleSignup = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    const name = signupName.trim();
    const email =
signupEmail.trim().toLowerCase();
    if (!name || !email || !signupPassword)
{
      setAuthError('Please fill in all fields.');
      return;
    }
    try {
      const cred = await
createUserWithEmailAndPassword(auth, email,
signupPassword);
      await updateProfile(cred.user, {
displayName: name });
      setRoleForUid(cred.user.uid,
selectedRole);
      finishLogin(selectedRole);
    } catch (err) {
     
setAuthError(friendlyAuthError(err.code));
    }
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    const email =
loginEmail.trim().toLowerCase();
    if (!email || !loginPassword) {
      setAuthError('Please enter your email and password.');
      return;
    }
    try {
      const cred = await
signInWithEmailAndPassword(auth, email,
loginPassword);
      const actualRole = getRoleMap()
[cred.user.uid] || 'jobseeker';
      if (actualRole !== selectedRole) {
        await signOut(auth);
        setAuthError(
          `This account is registered as ${
            actualRole === 'employer' ? 'an Employer' : 'a Job Seeker'
          }. Please select the correct role
above.`
        );
        return;
      }
      finishLogin(actualRole);
    } catch (err) {
     
setAuthError(friendlyAuthError(err.code));
    }
  };
  const handleSocialLogin = async (provider) => {
    setAuthError('');
    setAuthSuccess('');
    try {
      const result = await
signInWithPopup(auth, provider);
      const uid = result.user.uid;
      const existingRole = getRoleMap()
[uid];
      const role = existingRole ||
selectedRole;
      if (!existingRole) setRoleForUid(uid,
role);
      finishLogin(role);
    } catch (err) {
     
setAuthError(friendlyAuthError(err.code));
    }
  };
  const handleLogout = async () => {
    await signOut(auth);
    setCurrentPage('landing');
    setSelectedJob(null);
  };
  const handleApplyJob = async (job) => {
    if (!user) {
      setSelectedJob(null);
      goToAuth('login');
      return;
    }
    if (user.role !== 'jobseeker') {
      alert('Only Job Seeker accounts can apply for jobs.');
      return;
    }
    if (applications.some((a) => a.jobId
=== job.id)) {
      alert('You have already applied for this job.');
      return;
    }
    try {
      await addDoc(collection(db,
'applications'), {
        uid: user.uid,
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        applicantName: user.name,
        applicantEmail: user.email,
        appliedDate: new
Date().toLocaleDateString(),
        status: 'Applied',
        createdAt: serverTimestamp(),
      });
      setSelectedJob(null);
      alert(`Successfully applied to
${job.title}!`);
    } catch (err) {
      alert('Could not submit your application. Please try again.');
    }
  };
  const handlePostJob = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'jobs'),
{
        title: newJob.title,
        salary: newJob.salary,
        location: newJob.location,
        skills:
newJob.skills.split(',').map((s) =>
s.trim()),
        description: newJob.description,
        fullDescription:
newJob.fullDescription,
        company: user ? user.name :
'Company',
        jobType: 'Full-time',
        experience: '1+ years',
        postedDate: 'Today',
        postedByUid: user ? user.uid :
null,
        createdAt: serverTimestamp(),
      });
      setNewJob({ title: '', salary: '',
location: '', skills: '', description: '',
fullDescription: '' });
      alert('Job posted successfully!');
    } catch (err) {
      alert('Could not post the job. Please try again.');
    }
  };
  // ===== NAVBAR =====
  const Navbar = () => {
    return (
      <nav className="navbar">
        <div className="navbar-left">
          <h1 className="navbar-logo">JobHub</h1>
        </div>
        <div className="nav-links">
          <button
            type="button"
            className="nav-link"
            onClick={() => setCurrentPage('landing')}
          >
            Home
          </button>
          <button
            type="button"
            className={`nav-link ${currentPage === 'jobListing' ? 'active-page' : ''}`}
            onClick={() => setCurrentPage('jobListing')}
          >
            Jobs
          </button>
          <span className="nav-link">About</span>
          <span className="nav-link">Contact</span>
        </div>
        <div className="navbar-right">
          <button
            className="settings-btn-gradient"
            onClick={() =>
setShowSettings(!showSettings)}
            title="Settings"
          >
            <img src={settingsIcon} alt="" className="settings-icon-img" />
          </button>
          {user ? (
            <div className="nav-user">
              <span className="user-name">Hi, {user.name}</span>
              {user.role === 'jobseeker' ?
(
                <button
                  className="btn-nav-action"
                  onClick={() =>
setCurrentPage('myApplications')}
                >
                  My Applications
                </button>
              ) : (
                <button
                  className="btn-nav-action"
                  onClick={() =>
setCurrentPage('postJob')}
                >
                  Post a Job
                </button>
              )}
              <button className="btn-logout" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <>
              <button className="btn-login"
onClick={() => goToAuth('login')}>
                Login
              </button>
              <button className="btn-signup" onClick={() => goToAuth('signup')}>
                Sign Up
              </button>
            </>
          )}
        </div>
      </nav>
    );
  };
  // Avoid flashing the wrong page while Firebase checks the saved session
  if (authLoading) {
    return (
      <div className="auth-loading-screen">
        <p>Loading...</p>
      </div>
    );
  }
  // ===== LANDING PAGE =====
  if (currentPage === 'landing') {
    return (
      <div className={`landing ${darkMode ?
'dark-mode' : 'light-mode'}
font-${fontSize}`}>
        <Navbar />
        <section className="hero">
          <div className="hero-content">
            <div className="hero-tag">Your
Career, Our Priority</div>
            <h2>
              Find a Job <span>You'll Love.
</span>
            </h2>
            <p>
              Discover opportunities,
connect with top employers, and take the
next step in
              your career.
            </p>
            <div className="hero-search">
              <div className="search-input">
                <Search size={18} />
                <input type="text"
placeholder="Job title, skills or company"
/>
              </div>
              <div className="search-input
location-input">
                <MapPin size={18} />
                <input type="text"
placeholder="Location" />
              </div>
              <button className="search-button" onClick={() =>
setCurrentPage('jobListing')}>
                <Search size={16} /> Search
              </button>
            </div>
            <div className="hero-buttons">
              <button onClick={() =>
setCurrentPage('auth')} className="btn-primary">
                Get Started <ArrowRight
size={16} />
              </button>
              <button onClick={() =>
setCurrentPage('jobListing')}
className="btn-secondary">
                Browse Jobs
              </button>
            </div>
          </div>
          <div className="hero-visual">
            <img src={heroImage}
alt="Person working on laptop"
className="hero-illustration" />
          </div>
        </section>
        <section className="categories">
          <div className="section-heading">
            <div>
              <h3>Popular Job
Categories</h3>
              <p>Explore top categories and
find the right opportunity for you.</p>
            </div>
            <button onClick={() =>
setCurrentPage('jobListing')}
className="view-all">
              View All <ArrowRight size={14} aria-hidden="true" />
            </button>
          </div>
          <div className="category-grid">
            <div className="category-card">
              <div className="category-icon
purple">
                <Code2 size={20} />
              </div>
              <div>
                <h4>IT & Software</h4>
                <p>12,540+ Jobs</p>
              </div>
              <ArrowRight size={16} className="category-arrow" aria-hidden="true" />
            </div>
            <div className="category-card">
              <div className="category-icon
green">
                <TrendingUp size={20} />
              </div>
              <div>
                <h4>Data Science</h4>
                <p>4,230+ Jobs</p>
              </div>
              <ArrowRight size={16} className="category-arrow" aria-hidden="true" />
            </div>
            <div className="category-card">
              <div className="category-icon
pink">
                <Star size={20} />
              </div>
              <div>
                <h4>Design & Creative</h4>
                <p>3,120+ Jobs</p>
              </div>
              <ArrowRight size={16} className="category-arrow" aria-hidden="true" />
            </div>
            <div className="category-card">
              <div className="category-icon
orange">
                <BriefcaseBusiness size=
{20} />
              </div>
              <div>
                <h4>Business</h4>
                <p>5,680+ Jobs</p>
              </div>
              <ArrowRight size={16} className="category-arrow" aria-hidden="true" />
            </div>
          </div>
        </section>
        <section className="features">
          <h3>Why Choose JobHub?</h3>
          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Search size={22} />
              </div>
              <h4>Easy Search</h4>
              <p>Find jobs that match your
skills in seconds</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <BriefcaseBusiness size=
{22} />
              </div>
              <h4>For Employers</h4>
              <p>Post jobs and hire top
talent easily</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Zap size={22} />
              </div>
              <h4>Fast Hiring</h4>
              <p>Connect with candidates
instantly</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Target size={22} />
              </div>
              <h4>Best Match</h4>
              <p>AI-powered recommendations
for you</p>
            </div>
          </div>
        </section>
        <footer className="footer">
          <p>&copy; 2026 JobHub. All rights
reserved.</p>
        </footer>
        {showSettings && (
          <div className="settings-overlay"
onClick={() => setShowSettings(false)}>
            <div className="settings-panel"
onClick={(e) => e.stopPropagation()}>
              <button className="close-settings" aria-label="Close settings" onClick={() =>
setShowSettings(false)}>
                <X size={18} />
              </button>
              <h2>Appearance Settings</h2>
              <div className="settings-group">
                <label>Theme</label>
                <div className="settings-options">
                  <button
                    className={`option-btn
${!darkMode ? 'active' : ''}`}
                    onClick={() =>
setDarkMode(false)}
                  >
                    Light
                  </button>
                  <button
                    className={`option-btn
${darkMode ? 'active' : ''}`}
                    onClick={() =>
setDarkMode(true)}
                  >
                    Dark
                  </button>
                </div>
              </div>
              <div className="settingsgroup">
                <label>Font Size</label>
                <div className="settings-options">
                  <button
                    className={`option-btn
${fontSize === 'small' ? 'active' : ''}`}
                    onClick={() =>
setFontSize('small')}
                  >
                    small
                  </button>
                  <button
                    className={`option-btn
${fontSize === 'normal' ? 'active' : ''}`}
                    onClick={() =>
setFontSize('normal')}
                  >
                    normal
                  </button>
                  <button
                    className={`option-btn
${fontSize === 'large' ? 'active' : ''}`}
                    onClick={() =>
setFontSize('large')}
                  >
                    large
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
  // ===== AUTH PAGE =====
  if (currentPage === 'auth') {
    return (
      <div className="auth-container">
        <button className="back-btn"
onClick={() => setCurrentPage('landing')}>
          Back
        </button>
        <div className="auth-box">
          <h1>Job Portal</h1>
          <p>Sign in to find your dream
job</p>
          <div className="toggle-buttons">
            <button
              className={`${currentAuthMode
=== 'login' ? 'active' : ''}`}
              onClick={() =>
switchAuthMode('login')}
            >
              Login
            </button>
            <button
              className={`${currentAuthMode
=== 'signup' ? 'active' : ''}`}
              onClick={() =>
switchAuthMode('signup')}
            >
              Sign Up
            </button>
          </div>
          <div className="role-selection">
            <label>
              <input
                type="radio"
                name="role"
                value="jobseeker"
                checked={selectedRole ===
'jobseeker'}
                onChange={(e) =>
setSelectedRole(e.target.value)}
              />
              Job Seeker
            </label>
            <label>
              <input
                type="radio"
                name="role"
                value="employer"
                checked={selectedRole ===
'employer'}
                onChange={(e) =>
setSelectedRole(e.target.value)}
              />
              Employer
            </label>
          </div>
          {authError && <div
className="auth-message auth-error">
{authError}</div>}
          {authSuccess && <div
className="auth-message auth-success">
{authSuccess}</div>}
          {currentAuthMode === 'login' && (
            <form onSubmit={handleLogin} onKeyDown={handleFormKeyboardNavigation}>
              <div className="input-group">
                <input
                  type="email"
                  placeholder="Email
address"
                  value={loginEmail}
                  onChange={(e) =>
setLoginEmail(e.target.value)}
                />
              </div>
              <div className="input-group">
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  className="password-input"
                  placeholder="Password"
                  value={loginPassword}
                  onChange={(e) =>
setLoginPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="password-toggle"
                  aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showLoginPassword}
                  onClick={() => setShowLoginPassword((visible) => !visible)}
                >
                  {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <button type="submit">Login
Now</button>
            </form>
          )}
          <div className="social-divider">
            <span>or continue with</span>
          </div>
          <div className="social-buttons">
            <button
              type="button"
              className="social-btn googlebtn"
              onClick={() =>
handleSocialLogin(googleProvider)}
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" />
              Google
            </button>
            <button
              type="button"
              className="social-btn githubbtn"
              onClick={() =>
handleSocialLogin(githubProvider)}
            >
              <img src="https://www.svgrepo.com/show/512317/github-142.svg" alt="GitHub" />
              GitHub
            </button>
          </div>
          {currentAuthMode === 'signup' &&
(
            <form onSubmit={handleSignup} onKeyDown={handleFormKeyboardNavigation}>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Full name"
                  value={signupName}
                  onChange={(e) =>
setSignupName(e.target.value)}
                />
              </div>
              <div className="input-group">
                <input
                  type="email"
                  placeholder="Email
address"
                  value={signupEmail}
                  onChange={(e) =>
setSignupEmail(e.target.value)}
                />
              </div>
              <div className="input-group">
                <input
                  type={showSignupPassword ? 'text' : 'password'}
                  className="password-input"
                  placeholder="Create
password"
                  value={signupPassword}
                  onChange={(e) =>
setSignupPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="password-toggle"
                  aria-label={showSignupPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showSignupPassword}
                  onClick={() => setShowSignupPassword((visible) => !visible)}
                >
                  {showSignupPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <button type="submit">Create
Account</button>
            </form>
          )}
          <div className="authdivider">Already have an account?</div>
          <div className="auth-footer">
            {currentAuthMode === 'login' ?
(
              <>
                Don't have an account?
                <button type="button" className="auth-footer-link" onClick={() => switchAuthMode('signup')}> Sign Up</button>
              </>
            ) : (
              <>
                Already signed up?
                <button type="button" className="auth-footer-link" onClick={() => switchAuthMode('login')}> Login</button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
  // ===== JOB LISTING PAGE =====
  if (currentPage === 'jobListing') {
    const allJobs = [...jobs,
...postedJobs];
    const jobTypeKeyToLabel = {
      fullTime: 'Full-time',
      partTime: 'Part-time',
      internship: 'Internship',
      contract: 'Contract',
    };
    const activeJobTypeLabels =
Object.keys(jobTypeFilters)
      .filter((k) => jobTypeFilters[k])
      .map((k) => jobTypeKeyToLabel[k]);
    const parseExperienceYears = (expStr) => {
      const match = (expStr ||
'').match(/(\d+(\.\d+)?)/);
      return match ? parseFloat(match[1]) :
0;
    };
    const getExperienceBucket = (years) =>
{
      if (years < 1) return 'entry';
      if (years < 3) return 'intermediate';
      return 'senior';
    };
    const activeExperienceBuckets = [];
    if (experienceFilters.entry)
activeExperienceBuckets.push('entry');
    if (experienceFilters.intermediate)
activeExperienceBuckets.push('intermediate'
);
    if (experienceFilters.senior)
activeExperienceBuckets.push('senior');
    const experienceFilterActive =
!experienceFilters.any &&
activeExperienceBuckets.length > 0;
    const getWorkMode = (location) =>
      (location ||
'').toLowerCase().includes('remote') ?
'remote' : 'onsite';
    const activeWorkModes =
Object.keys(workModeFilters).filter((k) =>
workModeFilters[k]);
    const parseSalaryRange = (salaryStr) =>
{
      const nums = ((salaryStr ||
'').match(/\d+/g) || []).map(Number);
      if (nums.length === 0) return null;
      if (nums.length === 1) return { min:
nums[0], max: nums[0] };
      return { min: nums[0], max: nums[1]
};
    };
    const searchText =
jobSearchQuery.trim().toLowerCase();
    const locationText =
locationQuery.trim().toLowerCase();
    const filteredJobs =
allJobs.filter((job) => {
      const haystack = `${job.title}
${job.company} ${job.skills.join(' ')}`.toLowerCase();
      if (searchText && !haystack.includes(searchText)) return false;
      if (locationText && !(job.location ||
'').toLowerCase().includes(locationText))
return false;
      if (activeJobTypeLabels.length > 0 &&
!activeJobTypeLabels.includes(job.jobType))
return false;
      if (experienceFilterActive) {
        const bucket =
getExperienceBucket(parseExperienceYears(job.experience));
        if
(!activeExperienceBuckets.includes(bucket))
return false;
      }
      if (activeWorkModes.length > 0 &&
!activeWorkModes.includes(getWorkMode(job.location))) return false;
      if (skillFilters.length > 0) {
        const jobSkillsLower =
job.skills.map((sk) => sk.toLowerCase());
        const hasMatch =
skillFilters.some((sk) =>
jobSkillsLower.includes(sk.toLowerCase()));
        if (!hasMatch) return false;
      }
      const range =
parseSalaryRange(job.salary);
      if (range && range.min >
Number(salaryMax)) return false;
      return true;
    });
    return (
      <div className="jobhub-jobs-page">
        <Navbar />
        <section className="jobs-hero">
          <div className="jobs-hero-inner">
            <div className="breadcrumb">
              <span>Home</span>
              <span className="crumb-sep">/</span>
              <span className="crumb-active">Jobs</span>
            </div>
            <div className="jobs-hero-top">
              <div className="jobs-hero-text">
                <h1>
                  Find your next <span
className="gradient-text">opportunity.
</span>
                </h1>
                <p>Explore jobs that match
your skills, goals and location.</p>
              </div>
              <div className="jobs-hero-illustration">
                <img src={heroImage}
alt="Job search illustration" />
              </div>
              <div className="job-match-card">
                <div className="job-match-icon">
                  <Target size={22} />
                </div>
                <div>
                  <p className="job-match-label">Your Job Match</p>
                  <p className="job-match-percent">92%</p>
                  <p className="job-match-sub">
                    Better matches. Bigger
opportunities. <ArrowRight size={13} />
                  </p>
                </div>
              </div>
            </div>
            <div className="jobs-search-bar">
              <div className="jobs-search-input">
                <Search size={18}
className="jh-icon" />
                <input
                  type="text"
                  placeholder="Job title,
skills or company"
                  value={jobSearchQuery}
                  onChange={(e) =>
setJobSearchQuery(e.target.value)}
                />
              </div>
              <div className="jobs-search-input jobs-location-input">
                <MapPin size={18}
className="jh-icon" />
                <input
                  type="text"
                  placeholder="Location"
                  value={locationQuery}
                  onChange={(e) =>
setLocationQuery(e.target.value)}
                />
              </div>
              <button className="jobs-search-btn" type="button">Search</button>
            </div>
          </div>
        </section>
        <div className="jobs-main-container">
          <aside className="jobs-filters-card">
            <div className="filters-header">
              <h3>
                <SlidersHorizontal size=
{16} className="jh-icon" /> Filters
              </h3>
              <button className="clear-all-btn" onClick={clearAllFilters}>Clear
all</button>
            </div>
            <div className="filter-group">
              <h4>Job Type</h4>
              <label className="filter-checkbox">
                <input
                  type="checkbox"
                  checked=
{jobTypeFilters.fullTime}
                  onChange={() =>
toggleJobTypeFilter('fullTime')}
                />
                Full Time <span
className="filter-count">142</span>
              </label>
              <label className="filter-checkbox">
                <input
                  type="checkbox"
                  checked=
{jobTypeFilters.partTime}
                  onChange={() =>
toggleJobTypeFilter('partTime')}
                />
                Part Time <span
className="filter-count">28</span>
              </label>
              <label className="filter-checkbox">
                <input
                  type="checkbox"
                  checked=
{jobTypeFilters.internship}
                  onChange={() =>
toggleJobTypeFilter('internship')}
                />
                Internship <span
className="filter-count">34</span>
              </label>
              <label className="filter-checkbox">
                <input
                  type="checkbox"
                  checked=
{jobTypeFilters.contract}
                  onChange={() =>
toggleJobTypeFilter('contract')}
                />
                Contract <span
className="filter-count">12</span>
              </label>
            </div>
            <div className="filter-group">
              <h4>Experience Level</h4>
              <label className="filter-checkbox">
                <input
                  type="checkbox"
                  checked=
{experienceFilters.any}
                  onChange={() =>
toggleExperienceFilter('any')}
                />
                Any <span
className="filter-count">236</span>
              </label>
              <label className="filter-checkbox">
                <input
                  type="checkbox"
                  checked=
{experienceFilters.entry}
                  onChange={() =>
toggleExperienceFilter('entry')}
                />
                Entry Level (0-1 yrs) <span
className="filter-count">78</span>
              </label>
              <label className="filter-checkbox">
                <input
                  type="checkbox"
                  checked=
{experienceFilters.intermediate}
                  onChange={() =>
toggleExperienceFilter('intermediate')}
                />
                Intermediate (1-3 yrs)
<span className="filter-count">96</span>
              </label>
              <label className="filter-checkbox">
                <input
                  type="checkbox"
                  checked=
{experienceFilters.senior}
                  onChange={() =>
toggleExperienceFilter('senior')}
                />
                Senior (3+ yrs) <span
className="filter-count">62</span>
              </label>
            </div>
            <div className="filter-group">
              <h4>Salary Range</h4>
              <input
                type="range"
                min="20"
                max="150"
                value={salaryMax}
                onChange={(e) =>
setSalaryMax(e.target.value)}
                className="salary-slider"
              />
              <p className="salary-range-label">$20k - ${salaryMax}k+</p>
            </div>
            <div className="filter-group">
              <h4>Work Mode</h4>
              <label className="filter-checkbox">
                <input
                  type="checkbox"
                  checked=
{workModeFilters.remote}
                  onChange={() =>
toggleWorkModeFilter('remote')}
                />
                Remote <span
className="filter-count">89</span>
              </label>
              <label className="filter-checkbox">
                <input
                  type="checkbox"
                  checked=
{workModeFilters.onsite}
                  onChange={() =>
toggleWorkModeFilter('onsite')}
                />
                On-site <span
className="filter-count">102</span>
              </label>
              <label className="filter-checkbox">
                <input
                  type="checkbox"
                  checked=
{workModeFilters.hybrid}
                  onChange={() =>
toggleWorkModeFilter('hybrid')}
                />
                Hybrid <span
className="filter-count">45</span>
              </label>
            </div>
            <div className="filter-group">
              <h4>Skills</h4>
              <div className="skill-filter-pills">
                {skillFilters.map((skill)=> (
                  <span key={skill}
className="skill-filter-pill">
                    {skill}
                    <button onClick={() =>
removeSkillFilter(skill)}>
                      <X size={12} />
                    </button>
                  </span>
                ))}
                <button className="skill-filter-more" onClick={addMoreSkillFilter}>+
More</button>
              </div>
            </div>
          </aside>
          <div className="jobs-list-section">
            <div className="jobs-list-header">
              <p>
                Showing
{filteredJobs.length} of {allJobs.length}
jobs
              </p>
              <select className="sort-dropdown">
                <option>Most
Relevant</option>
                <option>Newest</option>
                <option>Highest
Salary</option>
              </select>
            </div>
            <div className="jobs-list">
              {filteredJobs.length === 0 &&
(
                <div className="no-data">
                  <p>No jobs match your
filters.</p>
                  <button onClick=
{clearAllFilters} className="link-btn">
                    Clear filters
<ArrowRight size={14} />
                  </button>
                </div>
              )}
              {filteredJobs.map((job, idx)=> {
                const meta =
jobCardMeta[idx % jobCardMeta.length];
                return (
                  <div key={job.id}
className="jobhub-job-card">
                    <div className="jc-left">
                      <div className="jc-avatar" style={{ background:
meta.avatarColor }}>
                       
{getCompanyInitial(job.company)}
                      </div>
                      <p className="jc-company">
                        {job.company}
<BadgeCheck size={14} className="jc-verified" />
                      </p>
                      <p className="jc-location">
                        <MapPin size={13}
className="jh-icon" /> {job.location}
                      </p>
                      <p className="jc-salary">
                        <DollarSign size=
{13} className="jh-icon" /> {job.salary}
                      </p>
                    </div>
                    <div className="jc-center">
                      <span className="jc-match-badge">
                        <Target size={12}
/> {meta.match}% Match
                      </span>
                      <h3>{job.title}</h3>
                      <p className="jc-description">{job.description}</p>
                      <div className="jc-skills">
                       
{job.skills.slice(0, 4).map((skill, i) => (
                          <span key={i}
className="jc-skill-pill">
                            <Code2 size=
{11} /> {skill}
                          </span>
                        ))}
                        {job.skills.length
> 4 && (
                          <span
className="jc-skill-pill jc-skill-more">
                            +
{job.skills.length - 4}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="jc-right">
                      <div className="jc-badges">
                       
{meta.badges.map((badge) => (
                          <span
                            key={badge}
                            className={`jc-badge jc-badge-${badge
                             
.toLowerCase()
                              .replace(' ','-')}`}
                          >
                           
{badgeIcon(badge)} {badge}
                          </span>
                        ))}
                      </div>
                      <p className="jc-meta-line">
                        <BriefcaseBusiness
size={13} className="jh-icon" />
{job.jobType}
                      </p>
                      <p className="jc-meta-line">
                        <Clock size={13}
className="jh-icon" /> {job.experience}
                      </p>
                      <p className="jc-meta-line">
                        <Clock size={13}
className="jh-icon" /> Posted
{job.postedDate}
                      </p>
                      <button
className="jc-view-details-btn" onClick={() =>
setSelectedJob(job)}>
                        View Details
                        <ArrowRight size=
{16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        {selectedJob && (
          <div className="modal-overlay"
onClick={() => setSelectedJob(null)}>
            <div className="modal-content"
onClick={(e) => e.stopPropagation()}>
              <button className="close-modal" aria-label="Close job details" onClick={() =>
setSelectedJob(null)}>
                <X size={20} />
              </button>
              <h2>{selectedJob.title}</h2>
              <p className="modal-company">
                <Building2 size={14}
className="jh-icon" />
{selectedJob.company}
              </p>
              <div className="modal-info">
                <div className="info-item">
                  <strong>Location:
</strong> {selectedJob.location}
                </div>
                <div className="info-item">
                  <strong>Salary:</strong>
{selectedJob.salary}
                </div>
                <div className="info-item">
                  <strong>Job Type:
</strong> {selectedJob.jobType}
                </div>
                <div className="info-item">
                  <strong>Experience
Required:</strong> {selectedJob.experience}
                </div>
                <div className="info-item">
                  <strong>Posted:</strong>
{selectedJob.postedDate}
                </div>
              </div>
              <h3>About the Job</h3>
              <p className="fulldescription">{selectedJob.fullDescription}
</p>
              <h3>Required Skills</h3>
              <div className="skills">
               
{selectedJob.skills.map((skill, idx) => (
                  <span key={idx}
className="skill-badge">
                    <Code2 size={12} />
{skill}
                  </span>
                ))}
              </div>
              <button className="btn-apply-modal" onClick={() =>
handleApplyJob(selectedJob)}>
                {user ? (
                  <BriefcaseBusiness size={17} aria-hidden="true" />
                ) : (
                  <LogIn size={17} aria-hidden="true" />
                )}
                {user ? 'Apply Now' :
'Login to Apply'}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
  // ===== MY APPLICATIONS PAGE (JobSeeker) =====
  if (currentPage === 'myApplications') {
    if (!user || user.role !== 'jobseeker')
{
      return (
        <div className="applications-page">
          <Navbar />
          <div className="page-container">
            <div className="access-denied">
              <h2>Job Seeker access
only</h2>
              <p>Please log in with a Job
Seeker account to see your applications.
</p>
              <button className="btn-primary" onClick={() => goToAuth('login')}>
                Go to Login
              </button>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="applications-page">
        <Navbar />
        <div className="page-container">
          <h2>My Applications</h2>
          {applications.length === 0 ? (
            <div className="no-data">
              <p>No applications yet.</p>
              <button onClick={() =>
setCurrentPage('jobListing')}
className="link-btn">
                Browse jobs now <ArrowRight
size={14} />
              </button>
            </div>
          ) : (
            <div className="applicationstable">
              <div className="tableheader">
                <div className="col coljob">Job Title</div>
                <div className="col colcompany">Company</div>
                <div className="col coldate">Applied Date</div>
                <div className="col colstatus">Status</div>
              </div>
              {applications.map((app) => (
                <div key={app.id}
className="table-row">
                  <div className="col coljob">{app.jobTitle}</div>
                  <div className="col colcompany">{app.company}</div>
                  <div className="col coldate">{app.appliedDate}</div>
                  <div className="col colstatus">
                    <span className=
{`status-badge
status-${app.status.toLowerCase()}`}>
                      {app.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
  // ===== POST JOB PAGE (Employer) =====
  if (currentPage === 'postJob') {
    if (!user || user.role !== 'employer')
{
      return (
        <div className="post-job-page">
          <Navbar />
          <div className="page-container">
            <div className="access-denied">
              <h2>Employer access only</h2>
              <p>Please log in with an
Employer account to post jobs.</p>
              <button className="btnprimary" onClick={() => goToAuth('login')}>
                Go to Login
              </button>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="post-job-page">
        <Navbar />
        <div className="page-container">
          <div className="post-job-form">
            <h2>Post a New Job</h2>
            <form onSubmit={handlePostJob}>
              <input
                type="text"
                name="title"
                placeholder="Job Title
(e.g., React Developer)"
                value={newJob.title}
                onChange={handleJobChange}
                required
              />
              <input
                type="text"
                name="salary"
                placeholder="Salary (e.g.,
$80k - $120k)"
                value={newJob.salary}
                onChange={handleJobChange}
                required
              />
              <input
                type="text"
                name="location"
                placeholder="Location"
                value={newJob.location}
                onChange={handleJobChange}
                required
              />
              <input
                type="text"
                name="skills"
                placeholder="Required
Skills (comma-separated)"
                value={newJob.skills}
                onChange={handleJobChange}
                required
              />
              <textarea
                name="description"
                placeholder="Short
Description (one line)"
                rows="2"
                value={newJob.description}
                onChange={handleJobChange}
                required
              ></textarea>
              <textarea
                name="fullDescription"
                placeholder="Full Job
Description (detailed)"
                rows="5"
                value=
{newJob.fullDescription}
                onChange={handleJobChange}
                required
              ></textarea>
              <button type="submit"
className="btn-submit">
                Post Job
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
  return null;
}
export default App;
