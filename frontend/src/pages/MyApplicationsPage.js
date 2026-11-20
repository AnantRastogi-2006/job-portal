import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function MyApplicationsPage({ navbar, user, applications, onBrowse, onLogin }) {
  if (!user || user.role !== 'jobseeker') {
    return (
      <div className="applications-page">
        {navbar}
        <div className="page-container">
          <div className="access-denied">
            <h2>Job Seeker access only</h2>
            <p>Please log in with a Job Seeker account to see your applications.</p>
            <button className="btn-primary" onClick={onLogin}>Go to Login</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="applications-page">
      {navbar}
      <div className="page-container">
        <h2>My Applications</h2>

        {applications.length === 0 ? (
          <div className="no-data">
            <p>No applications yet.</p>
            <button onClick={onBrowse} className="link-btn">
              Browse jobs now <ArrowRight size={14} />
            </button>
          </div>
        ) : (
          <div className="applications-table">
            <div className="table-header">
              <div className="col col-job">Job Title</div>
              <div className="col col-company">Company</div>
              <div className="col col-date">Applied Date</div>
              <div className="col col-status">Status</div>
            </div>

            {applications.map((app) => (
              <div key={app.id} className="table-row">
                <div className="col col-job">{app.jobTitle}</div>
                <div className="col col-company">{app.company}</div>
                <div className="col col-date">{app.appliedDate}</div>
                <div className="col col-status">
                  <span className={`status-badge status-${app.status.toLowerCase()}`}>
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
