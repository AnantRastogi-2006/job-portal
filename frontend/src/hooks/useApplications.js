import { useCallback, useEffect, useState } from 'react';
import { applyToJob, fetchApplications } from '../services/applicationService';

// Applications of the logged-in job seeker (or received applications for an employer).
export default function useApplications(user) {
  const [applications, setApplications] = useState([]);

  const reload = useCallback(async () => {
    if (!user) {
      setApplications([]);
      return;
    }
    try {
      setApplications(await fetchApplications());
    } catch (err) {
      setApplications([]);
    }
  }, [user]);

  useEffect(() => {
    reload();
  }, [reload]);

  const apply = useCallback(
    async (jobId) => {
      await applyToJob(jobId);
      await reload();
    },
    [reload]
  );

  return { applications, apply, reload };
}
