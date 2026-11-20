import React, { useState } from 'react';
import { Search, MapPin, ArrowRight, Target } from 'lucide-react';
import heroImage from '../assets/hero-illustration.svg';
import FilterSidebar from '../components/FilterSidebar';
import JobCard from '../components/JobCard';
import JobModal from '../components/JobModal';
import { CLEARED_FILTERS, DEFAULT_FILTERS, filterJobs } from '../utils/jobFilters';

export default function JobListingPage({
  navbar, jobs, loading, error, user, initialSearch, onApply,
}) {
  const [filters, setFilters] = useState({
    ...DEFAULT_FILTERS,
    searchQuery: initialSearch.query,
    locationQuery: initialSearch.location,
  });
  const [selectedJob, setSelectedJob] = useState(null);

  const filteredJobs = filterJobs(jobs, filters);
  const clearAll = () =>
    setFilters({ ...CLEARED_FILTERS, searchQuery: filters.searchQuery, locationQuery: filters.locationQuery });

  const handleApply = async (job) => {
    const done = await onApply(job);
    if (done !== false) setSelectedJob(null);
  };

  return (
    <div className="jobhub-jobs-page">
      {navbar}

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
                Find your next <span className="gradient-text">opportunity.</span>
              </h1>
              <p>Explore jobs that match your skills, goals and location.</p>
            </div>

            <div className="jobs-hero-illustration">
              <img src={heroImage} alt="Job search illustration" />
            </div>

            <div className="job-match-card">
              <div className="job-match-icon"><Target size={22} /></div>
              <div>
                <p className="job-match-label">Your Job Match</p>
                <p className="job-match-percent">92%</p>
                <p className="job-match-sub">
                  Better matches. Bigger opportunities. <ArrowRight size={13} />
                </p>
              </div>
            </div>
          </div>

          <div className="jobs-search-bar">
            <div className="jobs-search-input">
              <Search size={18} className="jh-icon" />
              <input
                type="text"
                placeholder="Job title, skills or company"
                value={filters.searchQuery}
                onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
              />
            </div>
            <div className="jobs-search-input jobs-location-input">
              <MapPin size={18} className="jh-icon" />
              <input
                type="text"
                placeholder="Location"
                value={filters.locationQuery}
                onChange={(e) => setFilters({ ...filters, locationQuery: e.target.value })}
              />
            </div>
            <button className="jobs-search-btn" type="button">Search</button>
          </div>
        </div>
      </section>

      <div className="jobs-main-container">
        <FilterSidebar filters={filters} setFilters={setFilters} onClear={clearAll} />

        <div className="jobs-list-section">
          <div className="jobs-list-header">
            <p>Showing {filteredJobs.length} of {jobs.length} jobs</p>
            <select className="sort-dropdown">
              <option>Most Relevant</option>
              <option>Newest</option>
              <option>Highest Salary</option>
            </select>
          </div>

          <div className="jobs-list">
            {loading && <div className="no-data"><p>Loading jobs...</p></div>}
            {error && <div className="no-data"><p>{error}</p></div>}
            {!loading && !error && filteredJobs.length === 0 && (
              <div className="no-data">
                <p>No jobs match your filters.</p>
                <button onClick={clearAll} className="link-btn">
                  Clear filters <ArrowRight size={14} />
                </button>
              </div>
            )}
            {filteredJobs.map((job, idx) => (
              <JobCard key={job.id} job={job} index={idx} onViewDetails={setSelectedJob} />
            ))}
          </div>
        </div>
      </div>

      {selectedJob && (
        <JobModal
          job={selectedJob}
          user={user}
          onClose={() => setSelectedJob(null)}
          onApply={handleApply}
        />
      )}
    </div>
  );
}
