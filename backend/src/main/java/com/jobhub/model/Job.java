package com.jobhub.model;

import com.jobhub.exception.ValidationException;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class Job implements Validatable {
    private Long id;
    private String title;
    private String company;
    private String salary;
    private String location;
    private List<String> skills = new ArrayList<>();
    private String description;
    private String fullDescription;
    private String jobType = "Full-time";
    private String experience = "1+ years";
    private Long postedBy;
    private LocalDateTime createdAt = LocalDateTime.now();

    public Job() { }

    @Override
    public void validate() throws ValidationException {
        require(title, "Job title");
        require(company, "Company");
        require(salary, "Salary");
        require(location, "Location");
        require(description, "Short description");
        require(fullDescription, "Full description");
        if (skills == null || skills.isEmpty()) {
            throw new ValidationException("Please add at least one skill.");
        }
        if (title.length() > 150) {
            throw new ValidationException("Job title is too long (max 150 characters).");
        }
        if (description.length() > 500) {
            throw new ValidationException("Short description is too long (max 500 characters).");
        }
    }

    private static void require(String value, String label) throws ValidationException {
        if (value == null || value.trim().isEmpty()) {
            throw new ValidationException(label + " is required.");
        }
    }

    /** "Today", "2 days ago", "1 week ago" ... shown on the job card. */
    public String getPostedDateLabel() {
        long days = Duration.between(createdAt, LocalDateTime.now()).toDays();
        if (days <= 0) return "Today";
        if (days == 1) return "1 day ago";
        if (days < 7) return days + " days ago";
        long weeks = days / 7;
        if (weeks < 5) return weeks == 1 ? "1 week ago" : weeks + " weeks ago";
        long months = days / 30;
        return months <= 1 ? "1 month ago" : months + " months ago";
    }

    public static List<String> parseSkills(String csv) {
        List<String> out = new ArrayList<>();
        if (csv == null) return out;
        for (String s : csv.split(",")) {
            String t = s.trim();
            if (!t.isEmpty()) out.add(t);
        }
        return out;
    }

    public String getSkillsCsv() { return String.join(",", skills); }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title == null ? null : title.trim(); }
    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company == null ? null : company.trim(); }
    public String getSalary() { return salary; }
    public void setSalary(String salary) { this.salary = salary == null ? null : salary.trim(); }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location == null ? null : location.trim(); }
    public List<String> getSkills() { return skills; }
    public void setSkills(List<String> skills) { this.skills = skills == null ? new ArrayList<>() : skills; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description == null ? null : description.trim(); }
    public String getFullDescription() { return fullDescription; }
    public void setFullDescription(String d) { this.fullDescription = d == null ? null : d.trim(); }
    public String getJobType() { return jobType; }
    public void setJobType(String jobType) { if (jobType != null && !jobType.trim().isEmpty()) this.jobType = jobType.trim(); }
    public String getExperience() { return experience; }
    public void setExperience(String e) { if (e != null && !e.trim().isEmpty()) this.experience = e.trim(); }
    public Long getPostedBy() { return postedBy; }
    public void setPostedBy(Long postedBy) { this.postedBy = postedBy; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
