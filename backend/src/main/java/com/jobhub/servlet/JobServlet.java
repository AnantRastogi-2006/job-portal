package com.jobhub.servlet;

import com.jobhub.dao.JobRepository;
import com.jobhub.exception.ForbiddenException;
import com.jobhub.jdbc.JdbcJobRepository;
import com.jobhub.model.Job;
import com.jobhub.model.User;
import java.io.IOException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *   GET  /api/jobs   -> every job (public)
 *   POST /api/jobs   -> create a job (employers only, enforced here on the server)
 */
@WebServlet("/api/jobs")
public class JobServlet extends BaseServlet {
    private static final long serialVersionUID = 1L;
    private final JobRepository jobs = new JdbcJobRepository();

    /** Only these fields are accepted from the browser. */
    private static class JobRequest {
        String title;
        String salary;
        String location;
        String skills;          // comma separated
        String description;
        String fullDescription;
        String jobType;
        String experience;
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            List<Map<String, Object>> out = new ArrayList<>();
            for (Job j : jobs.findAll()) out.add(toDto(j));
            writeJson(resp, 200, out);
        } catch (Exception e) {
            fail(resp, e);
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            User user = requireUser(req);
            if (!user.canPostJobs()) {                       // polymorphic permission check
                throw new ForbiddenException("Only Employer accounts can post jobs.");
            }
            JobRequest body = readJson(req, JobRequest.class);
            Job job = new Job();
            job.setTitle(body.title);
            job.setSalary(body.salary);
            job.setLocation(body.location);
            job.setSkills(Job.parseSkills(body.skills));
            job.setDescription(body.description);
            job.setFullDescription(body.fullDescription);
            job.setJobType(body.jobType);
            job.setExperience(body.experience);
            job.setCompany(user.getName());
            job.setPostedBy(user.getId());
            job.validate();
            jobs.save(job);
            writeJson(resp, 201, toDto(job));
        } catch (Exception e) {
            fail(resp, e);
        }
    }

    static Map<String, Object> toDto(Job j) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", j.getId());
        m.put("title", j.getTitle());
        m.put("company", j.getCompany());
        m.put("salary", j.getSalary());
        m.put("location", j.getLocation());
        m.put("skills", j.getSkills());
        m.put("description", j.getDescription());
        m.put("fullDescription", j.getFullDescription());
        m.put("jobType", j.getJobType());
        m.put("experience", j.getExperience());
        m.put("postedDate", j.getPostedDateLabel());
        return m;
    }
}
