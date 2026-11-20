import {
  CLEARED_FILTERS,
  DEFAULT_FILTERS,
  filterJobs,
  getExperienceBucket,
  getWorkMode,
  parseExperienceYears,
  parseSalaryRange,
} from './jobFilters';

const jobs = [
  { id: 1, title: 'React Developer', company: 'Tech Corp', location: 'New York', salary: '$80k - $120k',
    skills: ['React', 'CSS'], jobType: 'Full-time', experience: '2+ years' },
  { id: 2, title: 'Node Developer', company: 'StartUp', location: 'Remote', salary: '$70k - $110k',
    skills: ['Node.js'], jobType: 'Full-time', experience: '1.5+ years' },
  { id: 3, title: 'Designer Intern', company: 'Studio', location: 'Paris', salary: '$20k - $30k',
    skills: ['CSS'], jobType: 'Internship', experience: '0 years' },
];

test('parses experience and salary text', () => {
  expect(parseExperienceYears('1.5+ years')).toBe(1.5);
  expect(parseExperienceYears('')).toBe(0);
  expect(parseSalaryRange('$80k - $120k')).toEqual({ min: 80, max: 120 });
  expect(parseSalaryRange('negotiable')).toBeNull();
});

test('buckets experience and work mode', () => {
  expect(getExperienceBucket(0)).toBe('entry');
  expect(getExperienceBucket(2)).toBe('intermediate');
  expect(getExperienceBucket(5)).toBe('senior');
  expect(getWorkMode('Remote (US)')).toBe('remote');
  expect(getWorkMode('Paris')).toBe('onsite');
});

test('default filters show full-time jobs that match a default skill', () => {
  expect(filterJobs(jobs, DEFAULT_FILTERS).map((j) => j.id)).toEqual([1, 2]);
});

test('search text matches title, company or skills', () => {
  const result = filterJobs(jobs, { ...CLEARED_FILTERS, searchQuery: 'startup' });
  expect(result.map((j) => j.id)).toEqual([2]);
});

test('location filter works', () => {
  const result = filterJobs(jobs, { ...CLEARED_FILTERS, locationQuery: 'paris' });
  expect(result.map((j) => j.id)).toEqual([3]);
});

test('work mode filter keeps only remote jobs', () => {
  const result = filterJobs(jobs, {
    ...CLEARED_FILTERS,
    workModeFilters: { remote: true, onsite: false, hybrid: false },
  });
  expect(result.map((j) => j.id)).toEqual([2]);
});

test('salary slider hides jobs whose minimum salary is above the limit', () => {
  const result = filterJobs(jobs, { ...CLEARED_FILTERS, salaryMax: 75 });
  expect(result.map((j) => j.id)).toEqual([2, 3]);
});

test('cleared filters show everything', () => {
  expect(filterJobs(jobs, CLEARED_FILTERS)).toHaveLength(3);
});
