import React from 'react';
import {
  MapPin, DollarSign, Clock, Code2, BadgeCheck, Target, ArrowRight,
  Star, TrendingUp, Zap, BriefcaseBusiness,
} from 'lucide-react';

const CARD_META = [
  { match: 92, badges: ['Featured', 'Easy Apply'], avatarColor: '#102A56' },
  { match: 89, badges: ['Trending', 'Remote'], avatarColor: '#1FA97A' },
  { match: 87, badges: ['Featured', 'Hybrid'], avatarColor: '#6366F1' },
  { match: 83, badges: ['Remote'], avatarColor: '#F97316' },
];

const companyInitial = (name) => (name ? name.trim().charAt(0).toUpperCase() : '?');

const badgeIcon = (badge) => {
  if (badge === 'Featured') return <Star size={12} />;
  if (badge === 'Trending') return <TrendingUp size={12} />;
  if (badge === 'Easy Apply') return <Zap size={12} />;
  return <BriefcaseBusiness size={12} />;
};

export default function JobCard({ job, index, onViewDetails }) {
  const meta = CARD_META[index % CARD_META.length];
  const skills = job.skills || [];

  return (
    <div className="jobhub-job-card">
      <div className="jc-left">
        <div className="jc-avatar" style={{ background: meta.avatarColor }}>
          {companyInitial(job.company)}
        </div>
        <p className="jc-company">
          {job.company} <BadgeCheck size={14} className="jc-verified" />
        </p>
        <p className="jc-location">
          <MapPin size={13} className="jh-icon" /> {job.location}
        </p>
        <p className="jc-salary">
          <DollarSign size={13} className="jh-icon" /> {job.salary}
        </p>
      </div>

      <div className="jc-center">
        <span className="jc-match-badge">
          <Target size={12} /> {meta.match}% Match
        </span>
        <h3>{job.title}</h3>
        <p className="jc-description">{job.description}</p>
        <div className="jc-skills">
          {skills.slice(0, 4).map((skill) => (
            <span key={skill} className="jc-skill-pill">
              <Code2 size={11} /> {skill}
            </span>
          ))}
          {skills.length > 4 && (
            <span className="jc-skill-pill jc-skill-more">+{skills.length - 4}</span>
          )}
        </div>
      </div>

      <div className="jc-right">
        <div className="jc-badges">
          {meta.badges.map((badge) => (
            <span key={badge} className={`jc-badge jc-badge-${badge.toLowerCase().replace(' ', '-')}`}>
              {badgeIcon(badge)} {badge}
            </span>
          ))}
        </div>
        <p className="jc-meta-line">
          <BriefcaseBusiness size={13} className="jh-icon" /> {job.jobType}
        </p>
        <p className="jc-meta-line">
          <Clock size={13} className="jh-icon" /> {job.experience}
        </p>
        <p className="jc-meta-line">
          <Clock size={13} className="jh-icon" /> Posted {job.postedDate}
        </p>
        <button className="view-details-btn" onClick={() => onViewDetails(job)}>
          View Details
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
