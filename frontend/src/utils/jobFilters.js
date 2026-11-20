// Pure filtering helpers (easy to unit test).

export const ALL_SKILLS = [
  'React', 'JavaScript', 'Node.js', 'Python',
  'CSS', 'MongoDB', 'Express', 'HTML',
];

export const DEFAULT_FILTERS = {
  searchQuery: '',
  locationQuery: '',
  jobTypeFilters: { fullTime: true, partTime: false, internship: false, contract: false },
  experienceFilters: { any: true, entry: false, intermediate: false, senior: false },
  workModeFilters: { remote: false, onsite: false, hybrid: false },
  skillFilters: ['React', 'JavaScript', 'Node.js', 'Python'],
  salaryMax: 150,
};

export const CLEARED_FILTERS = {
  ...DEFAULT_FILTERS,
  jobTypeFilters: { fullTime: false, partTime: false, internship: false, contract: false },
  skillFilters: [],
};

const JOB_TYPE_LABELS = {
  fullTime: 'Full-time',
  partTime: 'Part-time',
  internship: 'Internship',
  contract: 'Contract',
};

export const parseExperienceYears = (text) => {
  const match = (text || '').match(/(\d+(\.\d+)?)/);
  return match ? parseFloat(match[1]) : 0;
};

export const getExperienceBucket = (years) => {
  if (years < 1) return 'entry';
  if (years < 3) return 'intermediate';
  return 'senior';
};

export const getWorkMode = (location) =>
  (location || '').toLowerCase().includes('remote') ? 'remote' : 'onsite';

export const parseSalaryRange = (text) => {
  const nums = ((text || '').match(/\d+/g) || []).map(Number);
  if (nums.length === 0) return null;
  if (nums.length === 1) return { min: nums[0], max: nums[0] };
  return { min: nums[0], max: nums[1] };
};

export function filterJobs(jobs, filters) {
  const {
    searchQuery, locationQuery, jobTypeFilters, experienceFilters,
    workModeFilters, skillFilters, salaryMax,
  } = filters;

  const activeJobTypes = Object.keys(jobTypeFilters)
    .filter((k) => jobTypeFilters[k])
    .map((k) => JOB_TYPE_LABELS[k]);

  const activeBuckets = ['entry', 'intermediate', 'senior'].filter((k) => experienceFilters[k]);
  const experienceActive = !experienceFilters.any && activeBuckets.length > 0;

  const activeWorkModes = Object.keys(workModeFilters).filter((k) => workModeFilters[k]);
  const searchText = searchQuery.trim().toLowerCase();
  const locationText = locationQuery.trim().toLowerCase();

  return jobs.filter((job) => {
    const skills = job.skills || [];
    const haystack = `${job.title} ${job.company} ${skills.join(' ')}`.toLowerCase();
    if (searchText && !haystack.includes(searchText)) return false;
    if (locationText && !(job.location || '').toLowerCase().includes(locationText)) return false;
    if (activeJobTypes.length > 0 && !activeJobTypes.includes(job.jobType)) return false;

    if (experienceActive) {
      const bucket = getExperienceBucket(parseExperienceYears(job.experience));
      if (!activeBuckets.includes(bucket)) return false;
    }

    if (activeWorkModes.length > 0 && !activeWorkModes.includes(getWorkMode(job.location))) {
      return false;
    }

    if (skillFilters.length > 0) {
      const lower = skills.map((s) => s.toLowerCase());
      if (!skillFilters.some((s) => lower.includes(s.toLowerCase()))) return false;
    }

    const range = parseSalaryRange(job.salary);
    if (range && range.min > Number(salaryMax)) return false;

    return true;
  });
}
