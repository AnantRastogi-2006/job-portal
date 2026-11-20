import { api } from './api';

export const fetchApplications = () => api.get('/applications');

export const applyToJob = (jobId) => api.post('/applications', { jobId });

export const updateApplicationStatus = (id, status) =>
  api.put(`/applications/${id}/status`, { status });
