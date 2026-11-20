package com.jobhub.model;

import com.jobhub.exception.ValidationException;
import java.time.LocalDateTime;

public class Application implements Validatable {
    private Long id;
    private long jobId;
    private long userId;
    private String jobTitle;        // filled by the JOIN query
    private String company;         // filled by the JOIN query
    private String applicantName;   // filled by the JOIN query
    private String applicantEmail;  // filled by the JOIN query
    private ApplicationStatus status = ApplicationStatus.APPLIED;
    private LocalDateTime appliedAt = LocalDateTime.now();

    public Application() { }

    public Application(long jobId, long userId) {
        this.jobId = jobId;
        this.userId = userId;
    }

    @Override
    public void validate() throws ValidationException {
        if (jobId <= 0) throw new ValidationException("A valid job id is required.");
        if (userId <= 0) throw new ValidationException("A valid applicant is required.");
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public long getJobId() { return jobId; }
    public void setJobId(long jobId) { this.jobId = jobId; }
    public long getUserId() { return userId; }
    public void setUserId(long userId) { this.userId = userId; }
    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }
    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }
    public String getApplicantName() { return applicantName; }
    public void setApplicantName(String n) { this.applicantName = n; }
    public String getApplicantEmail() { return applicantEmail; }
    public void setApplicantEmail(String e) { this.applicantEmail = e; }
    public ApplicationStatus getStatus() { return status; }
    public void setStatus(ApplicationStatus status) { this.status = status; }
    public LocalDateTime getAppliedAt() { return appliedAt; }
    public void setAppliedAt(LocalDateTime appliedAt) { this.appliedAt = appliedAt; }
}
