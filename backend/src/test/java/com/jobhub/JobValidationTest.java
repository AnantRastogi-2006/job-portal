package com.jobhub;

import static org.junit.jupiter.api.Assertions.*;

import com.jobhub.exception.ValidationException;
import com.jobhub.model.Job;
import java.time.LocalDateTime;
import java.util.Arrays;
import org.junit.jupiter.api.Test;

class JobValidationTest {

    private Job validJob() {
        Job j = new Job();
        j.setTitle("React Developer");
        j.setCompany("Tech Corp");
        j.setSalary("$80k - $120k");
        j.setLocation("Remote");
        j.setSkills(Arrays.asList("React", "CSS"));
        j.setDescription("Short");
        j.setFullDescription("Long description");
        return j;
    }

    @Test
    void validJobPasses() {
        assertDoesNotThrow(() -> validJob().validate());
    }

    @Test
    void missingTitleFails() {
        Job j = validJob();
        j.setTitle("   ");
        assertThrows(ValidationException.class, j::validate);
    }

    @Test
    void noSkillsFails() {
        Job j = validJob();
        j.setSkills(Job.parseSkills(" , ,"));
        assertThrows(ValidationException.class, j::validate);
    }

    @Test
    void skillsAreParsedFromCommaList() {
        assertEquals(Arrays.asList("React", "Node.js"), Job.parseSkills(" React , Node.js ,"));
    }

    @Test
    void postedDateLabels() {
        Job j = validJob();
        j.setCreatedAt(LocalDateTime.now());
        assertEquals("Today", j.getPostedDateLabel());
        j.setCreatedAt(LocalDateTime.now().minusDays(3).minusHours(1));
        assertEquals("3 days ago", j.getPostedDateLabel());
        j.setCreatedAt(LocalDateTime.now().minusDays(8));
        assertEquals("1 week ago", j.getPostedDateLabel());
    }
}
