import { useCallback, useEffect, useState } from 'react';
import { fetchJobs } from '../services/jobService';

// Loads every job from the backend (single source of truth - no hard-coded jobs).
export default function useJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    try {
      setError('');
      setJobs(await fetchJobs());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { jobs, loading, error, reload };
}
