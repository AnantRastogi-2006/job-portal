package com.jobhub.dao;

import com.jobhub.exception.DataAccessException;
import com.jobhub.model.Application;
import com.jobhub.model.ApplicationStatus;
import java.util.List;

public interface ApplicationRepository extends Repository<Application, Long> {
    List<Application> findByUser(long userId) throws DataAccessException;

    /** Applications received for the jobs posted by this employer. */
    List<Application> findByEmployer(long employerId) throws DataAccessException;

    boolean exists(long jobId, long userId) throws DataAccessException;

    void updateStatus(long applicationId, ApplicationStatus status) throws DataAccessException;
}
