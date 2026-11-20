package com.jobhub.model;

/** An employer can post jobs but cannot apply to them. */
public class Employer extends User {
    private static final long serialVersionUID = 1L;

    public Employer(Long id, String name, String email, String passwordHash) {
        super(id, name, email, passwordHash);
    }

    @Override public String getRole() { return ROLE_EMPLOYER; }
    @Override public boolean canPostJobs() { return true; }
    @Override public boolean canApplyToJobs() { return false; }
    @Override public String getHomePage() { return "postJob"; }

    /** The company name shown on job cards is the employer's account name. */
    public String getCompanyName() { return getName(); }
}
