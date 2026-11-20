import React from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { ALL_SKILLS } from '../utils/jobFilters';

function CheckboxGroup({ title, options, values, onToggle }) {
  return (
    <div className="filter-group">
      <h4>{title}</h4>
      {options.map(([key, label, count]) => (
        <label key={key} className="filter-checkbox">
          <input type="checkbox" checked={values[key]} onChange={() => onToggle(key)} />
          {label} <span className="filter-count">{count}</span>
        </label>
      ))}
    </div>
  );
}

export default function FilterSidebar({ filters, setFilters, onClear }) {
  const toggle = (group) => (key) =>
    setFilters({ ...filters, [group]: { ...filters[group], [key]: !filters[group][key] } });

  const addSkill = () => {
    const next = ALL_SKILLS.find((s) => !filters.skillFilters.includes(s));
    if (next) setFilters({ ...filters, skillFilters: [...filters.skillFilters, next] });
  };

  const removeSkill = (skill) =>
    setFilters({ ...filters, skillFilters: filters.skillFilters.filter((s) => s !== skill) });

  return (
    <aside className="jobs-filters-card">
      <div className="filters-header">
        <h3><SlidersHorizontal size={16} className="jh-icon" /> Filters</h3>
        <button className="clear-all-btn" onClick={onClear}>Clear all</button>
      </div>

      <CheckboxGroup
        title="Job Type"
        values={filters.jobTypeFilters}
        onToggle={toggle('jobTypeFilters')}
        options={[
          ['fullTime', 'Full Time', 142],
          ['partTime', 'Part Time', 28],
          ['internship', 'Internship', 34],
          ['contract', 'Contract', 12],
        ]}
      />

      <CheckboxGroup
        title="Experience Level"
        values={filters.experienceFilters}
        onToggle={toggle('experienceFilters')}
        options={[
          ['any', 'Any', 236],
          ['entry', 'Entry Level (0-1 yrs)', 78],
          ['intermediate', 'Intermediate (1-3 yrs)', 96],
          ['senior', 'Senior (3+ yrs)', 62],
        ]}
      />

      <div className="filter-group">
        <h4>Salary Range</h4>
        <input
          type="range"
          min="20"
          max="150"
          value={filters.salaryMax}
          onChange={(e) => setFilters({ ...filters, salaryMax: e.target.value })}
          className="salary-slider"
        />
        <p className="salary-range-label">$20k - ${filters.salaryMax}k+</p>
      </div>

      <CheckboxGroup
        title="Work Mode"
        values={filters.workModeFilters}
        onToggle={toggle('workModeFilters')}
        options={[
          ['remote', 'Remote', 89],
          ['onsite', 'On-site', 102],
          ['hybrid', 'Hybrid', 45],
        ]}
      />

      <div className="filter-group">
        <h4>Skills</h4>
        <div className="skill-filter-pills">
          {filters.skillFilters.map((skill) => (
            <span key={skill} className="skill-filter-pill">
              {skill}
              <button onClick={() => removeSkill(skill)}><X size={12} /></button>
            </span>
          ))}
          <button className="skill-filter-more" onClick={addSkill}>+ More</button>
        </div>
      </div>
    </aside>
  );
}
