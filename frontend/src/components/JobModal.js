import React from 'react';
import { Building2, Code2, X } from 'lucide-react';

export default function JobModal({ job, user, onClose, onApply }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal" onClick={onClose}>
          <X size={20} />
        </button>

        <h2>{job.title}</h2>
        <p className="modal-company">
          <Building2 size={14} className="jh-icon" /> {job.company}
        </p>

        <div className="modal-info">
          <div className="info-item"><strong>Location:</strong> {job.location}</div>
          <div className="info-item"><strong>Salary:</strong> {job.salary}</div>
          <div className="info-item"><strong>Job Type:</strong> {job.jobType}</div>
          <div className="info-item"><strong>Experience Required:</strong> {job.experience}</div>
          <div className="info-item"><strong>Posted:</strong> {job.postedDate}</div>
        </div>

        <h3>About the Job</h3>
        <p className="full-description">{job.fullDescription}</p>

        <h3>Required Skills</h3>
        <div className="skills">
          {(job.skills || []).map((skill) => (
            <span key={skill} className="skill-badge">
              <Code2 size={12} /> {skill}
            </span>
          ))}
        </div>

        <button className="btn-apply-modal" onClick={() => onApply(job)}>
          {user ? 'Apply Now' : 'Login to Apply'}
        </button>
      </div>
    </div>
  );
}
