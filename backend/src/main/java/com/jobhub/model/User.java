package com.jobhub.model;

import com.jobhub.exception.ValidationException;
import java.io.Serializable;
import java.util.regex.Pattern;

/**
 * Abstract base class for every account (inheritance).
 * Subclasses override the abstract methods (polymorphism).
 */
public abstract class User implements Validatable, Serializable {
    private static final long serialVersionUID = 1L;
    private static final Pattern EMAIL = Pattern.compile("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$");

    public static final String ROLE_JOB_SEEKER = "jobseeker";
    public static final String ROLE_EMPLOYER = "employer";

    private Long id;
    private String name;
    private String email;
    private transient String passwordHash; // never sent to the browser

    protected User(Long id, String name, String email, String passwordHash) {
        this.id = id;
        this.name = name == null ? "" : name.trim();
        this.email = email == null ? "" : email.trim().toLowerCase();
        this.passwordHash = passwordHash;
    }

    /** Factory: picks the right subclass from the role string. */
    public static User create(String role, Long id, String name, String email, String passwordHash)
            throws ValidationException {
        if (ROLE_EMPLOYER.equals(role)) {
            return new Employer(id, name, email, passwordHash);
        }
        if (ROLE_JOB_SEEKER.equals(role)) {
            return new JobSeeker(id, name, email, passwordHash);
        }
        throw new ValidationException("Role must be 'jobseeker' or 'employer'.");
    }

    // ----- polymorphic behaviour -----
    public abstract String getRole();

    public abstract boolean canPostJobs();

    public abstract boolean canApplyToJobs();

    public abstract String getHomePage();

    @Override
    public void validate() throws ValidationException {
        if (name.isEmpty()) {
            throw new ValidationException("Please enter your name.");
        }
        if (!EMAIL.matcher(email).matches()) {
            throw new ValidationException("Please enter a valid email address.");
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getPasswordHash() { return passwordHash; }
}
