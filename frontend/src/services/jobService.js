import { api } from './api';

export const fetchJobs = () => api.get('/jobs');

export const postJob = (job) => api.post('/jobs', job);
