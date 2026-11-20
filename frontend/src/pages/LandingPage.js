import React, { useState } from 'react';
import {
  Search, MapPin, ArrowRight, Code2, TrendingUp, Star, BriefcaseBusiness, Zap, Target,
} from 'lucide-react';
import heroImage from '../assets/hero-illustration.svg';

const CATEGORIES = [
  { title: 'IT & Software', count: '12,540+ Jobs', color: 'purple', Icon: Code2 },
  { title: 'Data Science', count: '4,230+ Jobs', color: 'green', Icon: TrendingUp },
  { title: 'Design & Creative', count: '3,120+ Jobs', color: 'pink', Icon: Star },
  { title: 'Business', count: '5,680+ Jobs', color: 'orange', Icon: BriefcaseBusiness },
];

const FEATURES = [
  { title: 'Easy Search', text: 'Find jobs that match your skills in seconds', Icon: Search },
  { title: 'For Employers', text: 'Post jobs and hire top talent easily', Icon: BriefcaseBusiness },
  { title: 'Fast Hiring', text: 'Connect with candidates instantly', Icon: Zap },
  { title: 'Best Match', text: 'AI-powered recommendations for you', Icon: Target },
];

export default function LandingPage({ navbar, themeClass, onSearch, onBrowse, onGetStarted }) {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');

  return (
    <div className={`landing ${themeClass}`}>
      {navbar}

      <section className="hero">
        <div className="hero-content">
          <div className="hero-tag">Your Career, Our Priority</div>

          <h2>
            Find a Job <span>You'll Love.</span>
          </h2>

          <p>
            Discover opportunities, connect with top employers, and take the next step in
            your career.
          </p>

          <div className="hero-search">
            <div className="search-input">
              <Search size={18} />
              <input
                type="text"
                placeholder="Job title, skills or company"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <div className="search-input location-input">
              <MapPin size={18} />
              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <button className="search-button" onClick={() => onSearch(query, location)}>
              <Search size={16} /> Search
            </button>
          </div>

          <div className="hero-buttons">
            <button onClick={onGetStarted} className="btn-primary">
              Get Started <ArrowRight size={16} />
            </button>
            <button onClick={onBrowse} className="btn-secondary">
              Browse Jobs
            </button>
          </div>
        </div>

        <div className="hero-visual">
          <img src={heroImage} alt="Person working on laptop" className="hero-illustration" />
        </div>
      </section>

      <section className="categories">
        <div className="section-heading">
          <div>
            <h3>Popular Job Categories</h3>
            <p>Explore top categories and find the right opportunity for you.</p>
          </div>
          <button onClick={onBrowse} className="view-all">
            View All <ArrowRight size={14} />
          </button>
        </div>

        <div className="category-grid">
          {CATEGORIES.map(({ title, count, color, Icon }) => (
            <div className="category-card" key={title}>
              <div className={`category-icon ${color}`}>
                <Icon size={20} />
              </div>
              <div>
                <h4>{title}</h4>
                <p>{count}</p>
              </div>
              <ArrowRight size={16} />
            </div>
          ))}
        </div>
      </section>

      <section className="features">
        <h3>Why Choose JobHub?</h3>
        <div className="feature-grid">
          {FEATURES.map(({ title, text, Icon }) => (
            <div className="feature-card" key={title}>
              <div className="feature-icon">
                <Icon size={22} />
              </div>
              <h4>{title}</h4>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="footer">
        <p>&copy; 2026 JobHub. All rights reserved.</p>
      </footer>
    </div>
  );
}
