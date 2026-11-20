import React, { useState } from 'react';
import { postJob } from '../services/jobService';

const EMPTY_JOB = {
  title: '',
  salary: '',
  location: '',
  skills: '',
  description: '',
  fullDescription: '',
  jobType: 'Full-time',
  experience: '1+ years',
};

export default function PostJobPage({ navbar, user, onPosted, onLogin }) {
  const [job, setJob] = useState(EMPTY_JOB);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [busy, setBusy] = useState(false);

  if (!user || user.role !== 'employer') {
    return (
      <div className="post-job-page">
        {navbar}
        <div className="page-container">
          <div className="access-denied">
            <h2>Employer access only</h2>
            <p>Please log in with an Employer account to post jobs.</p>
            <button className="btn-primary" onClick={onLogin}>Go to Login</button>
          </div>
        </div>
      </div>
    );
  }

  const handleChange = (e) => setJob({ ...job, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMessage({ type: '', text: '' });
    try {
      await postJob(job);
      setJob(EMPTY_JOB);
      setMessage({ type: 'success', text: 'Job posted successfully!' });
      onPosted();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="post-job-page">
      {navbar}
      <div className="page-container">
        <div className="post-job-form">
          <h2>Post a New Job</h2>
          {message.text && (
            <div className={`auth-message ${message.type === 'error' ? 'auth-error' : 'auth-success'}`}>
              {message.text}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <input type="text" name="title" placeholder="Job Title (e.g., React Developer)"
              value={job.title} onChange={handleChange} required />
            <input type="text" name="salary" placeholder="Salary (e.g., $80k - $120k)"
              value={job.salary} onChange={handleChange} required />
            <input type="text" name="location" placeholder="Location"
              value={job.location} onChange={handleChange} required />
            <input type="text" name="skills" placeholder="Required Skills (comma-separated)"
              value={job.skills} onChange={handleChange} required />
            <select name="jobType" value={job.jobType} onChange={handleChange}>
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Internship</option>
              <option>Contract</option>
            </select>
            <input type="text" name="experience" placeholder="Experience (e.g., 2+ years)"
              value={job.experience} onChange={handleChange} />
            <textarea name="description" placeholder="Short Description (one line)" rows="2"
              value={job.description} onChange={handleChange} required></textarea>
            <textarea name="fullDescription" placeholder="Full Job Description (detailed)" rows="5"
              value={job.fullDescription} onChange={handleChange} required></textarea>
            <button type="submit" className="btn-submit" disabled={busy}>
              {busy ? 'Posting...' : 'Post Job'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
