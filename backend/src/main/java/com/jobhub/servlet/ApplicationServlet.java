package com.jobhub.servlet;

import com.jobhub.dao.ApplicationRepository;
import com.jobhub.dao.JobRepository;
import com.jobhub.exception.DuplicateException;
import com.jobhub.exception.ForbiddenException;
import com.jobhub.exception.NotFoundException;
import com.jobhub.exception.ValidationException;
import com.jobhub.jdbc.JdbcApplicationRepository;
import com.jobhub.jdbc.JdbcJobRepository;
import com.jobhub.model.Application;
import com.jobhub.model.ApplicationStatus;
import com.jobhub.model.User;
import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *   GET  /api/applications              job seeker -> my applications, employer -> applications received
 *   POST /api/applications   {jobId}    job seekers only
 *   PUT  /api/applications/{id}/status  {status}   employer who owns the job only
 */
@WebServlet("/api/applications/*")
public class ApplicationServlet extends BaseServlet {
    private static final long serialVersionUID = 1L;
    private static final DateTimeFormatter DATE = DateTimeFormatter.ofPattern("dd MMM yyyy");
    private final ApplicationRepository applications = new JdbcApplicationRepository();
    private final JobRepository jobs = new JdbcJobRepository();

    private static class ApplyRequest { long jobId; }

    private static class StatusRequest { String status; }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            User user = requireUser(req);
            List<Application> list = user.canPostJobs()
                    ? applications.findByEmployer(user.getId())
                    : applications.findByUser(user.getId());
            List<Map<String, Object>> out = new ArrayList<>();
            for (Application a : list) out.add(toDto(a));
            writeJson(resp, 200, out);
        } catch (Exception e) {
            fail(resp, e);
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            User user = requireUser(req);
            if (!user.canApplyToJobs()) {
                throw new ForbiddenException("Only Job Seeker accounts can apply for jobs.");
            }
            ApplyRequest body = readJson(req, ApplyRequest.class);
            if (!jobs.findById(body.jobId).isPresent()) {
                throw new NotFoundException("That job no longer exists.");
            }
            if (applications.exists(body.jobId, user.getId())) {
                throw new DuplicateException("You have already applied for this job.");
            }
            Application app = new Application(body.jobId, user.getId());
            app.validate();
            writeJson(resp, 201, toDto(applications.save(app)));
        } catch (Exception e) {
            fail(resp, e);
        }
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            User user = requireUser(req);
            if (!user.canPostJobs()) {
                throw new ForbiddenException("Only employers can change an application's status.");
            }
            String path = req.getPathInfo() == null ? "" : req.getPathInfo();   // /{id}/status
            String[] parts = path.split("/");
            if (parts.length != 3 || !"status".equals(parts[2])) {
                throw new NotFoundException("Unknown endpoint.");
            }
            long id;
            try {
                id = Long.parseLong(parts[1]);
            } catch (NumberFormatException e) {
                throw new ValidationException("Invalid application id.");
            }
            ApplicationStatus status = ApplicationStatus.fromLabel(readJson(req, StatusRequest.class).status);
            boolean owns = false;
            for (Application a : applications.findByEmployer(user.getId())) {
                if (a.getId() != null && a.getId() == id) owns = true;
            }
            if (!owns) throw new ForbiddenException("You can only update applications for your own jobs.");
            applications.updateStatus(id, status);
            writeJson(resp, 200, java.util.Collections.singletonMap("status", status.getLabel()));
        } catch (Exception e) {
            fail(resp, e);
        }
    }

    private static Map<String, Object> toDto(Application a) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", a.getId());
        m.put("jobId", a.getJobId());
        m.put("jobTitle", a.getJobTitle());
        m.put("company", a.getCompany());
        m.put("applicantName", a.getApplicantName());
        m.put("applicantEmail", a.getApplicantEmail());
        m.put("status", a.getStatus().getLabel());
        m.put("appliedDate", a.getAppliedAt().format(DATE));
        return m;
    }
}
