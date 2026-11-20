package com.jobhub.model;

/** A job seeker can apply to jobs but cannot post them. */
public class JobSeeker extends User {
    private static final long serialVersionUID = 1L;

    public JobSeeker(Long id, String name, String email, String passwordHash) {
        super(id, name, email, passwordHash);
    }

    @Override public String getRole() { return ROLE_JOB_SEEKER; }
    @Override public boolean canPostJobs() { return false; }
    @Override public boolean canApplyToJobs() { return true; }
    @Override public String getHomePage() { return "jobListing"; }
}
