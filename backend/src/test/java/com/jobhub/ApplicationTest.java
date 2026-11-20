package com.jobhub;

import static org.junit.jupiter.api.Assertions.*;

import com.jobhub.exception.ValidationException;
import com.jobhub.model.Application;
import com.jobhub.model.ApplicationStatus;
import org.junit.jupiter.api.Test;

class ApplicationTest {

    @Test
    void newApplicationStartsAsApplied() {
        assertEquals(ApplicationStatus.APPLIED, new Application(1, 2).getStatus());
    }

    @Test
    void invalidIdsFailValidation() {
        assertThrows(ValidationException.class, () -> new Application(0, 2).validate());
        assertThrows(ValidationException.class, () -> new Application(1, 0).validate());
    }

    @Test
    void statusParsingIsCaseInsensitive() throws Exception {
        assertEquals(ApplicationStatus.INTERVIEW, ApplicationStatus.fromLabel("interview"));
        assertThrows(ValidationException.class, () -> ApplicationStatus.fromLabel("maybe"));
    }
}
