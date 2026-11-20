package com.jobhub;

import static org.junit.jupiter.api.Assertions.*;

import com.jobhub.exception.ValidationException;
import com.jobhub.model.Employer;
import com.jobhub.model.JobSeeker;
import com.jobhub.model.User;
import org.junit.jupiter.api.Test;

class UserPolymorphismTest {

    @Test
    void factoryReturnsCorrectSubclass() throws Exception {
        User e = User.create("employer", 1L, "Acme", "hr@acme.com", "x");
        User s = User.create("jobseeker", 2L, "Sam", "sam@mail.com", "x");
        assertTrue(e instanceof Employer);
        assertTrue(s instanceof JobSeeker);
    }

    @Test
    void permissionsDifferByRole() throws Exception {
        User e = User.create("employer", 1L, "Acme", "hr@acme.com", "x");
        User s = User.create("jobseeker", 2L, "Sam", "sam@mail.com", "x");
        assertTrue(e.canPostJobs());
        assertFalse(e.canApplyToJobs());
        assertFalse(s.canPostJobs());
        assertTrue(s.canApplyToJobs());
        assertEquals("postJob", e.getHomePage());
        assertEquals("jobListing", s.getHomePage());
    }

    @Test
    void unknownRoleIsRejected() {
        assertThrows(ValidationException.class, () -> User.create("admin", 1L, "A", "a@b.com", "x"));
    }

    @Test
    void emailIsValidatedAndNormalised() throws Exception {
        User bad = User.create("jobseeker", null, "Sam", "not-an-email", "x");
        assertThrows(ValidationException.class, bad::validate);
        User ok = User.create("jobseeker", null, "  Sam ", " SAM@Mail.COM ", "x");
        ok.validate();
        assertEquals("sam@mail.com", ok.getEmail());
        assertEquals("Sam", ok.getName());
    }
}
