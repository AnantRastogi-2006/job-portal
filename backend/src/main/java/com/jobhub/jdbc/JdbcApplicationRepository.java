package com.jobhub.jdbc;

import com.jobhub.dao.ApplicationRepository;
import com.jobhub.exception.DataAccessException;
import com.jobhub.exception.ValidationException;
import com.jobhub.model.Application;
import com.jobhub.model.ApplicationStatus;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class JdbcApplicationRepository implements ApplicationRepository {

    private static final String SELECT =
            "SELECT a.id, a.job_id, a.user_id, a.status, a.created_at, "
          + "j.title AS job_title, j.company AS company, u.name AS applicant_name, u.email AS applicant_email "
          + "FROM applications a JOIN jobs j ON j.id = a.job_id JOIN users u ON u.id = a.user_id ";

    @Override
    public Application save(Application app) throws DataAccessException {
        String sql = "INSERT INTO applications (job_id, user_id, status) VALUES (?, ?, ?)";
        try (Connection c = Database.getConnection();
             PreparedStatement ps = c.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            ps.setLong(1, app.getJobId());
            ps.setLong(2, app.getUserId());
            ps.setString(3, app.getStatus().getLabel());
            ps.executeUpdate();
            try (ResultSet keys = ps.getGeneratedKeys()) {
                if (keys.next()) app.setId(keys.getLong(1));
            }
        } catch (SQLException e) {
            throw new DataAccessException("Could not save the application.", e);
        }
        return findById(app.getId()).orElse(app);
    }

    @Override
    public Optional<Application> findById(Long id) throws DataAccessException {
        List<Application> list = query(SELECT + "WHERE a.id = ?", id);
        return list.isEmpty() ? Optional.empty() : Optional.of(list.get(0));
    }

    @Override
    public List<Application> findAll() throws DataAccessException {
        return query(SELECT + "ORDER BY a.created_at DESC");
    }

    @Override
    public List<Application> findByUser(long userId) throws DataAccessException {
        return query(SELECT + "WHERE a.user_id = ? ORDER BY a.created_at DESC", userId);
    }

    @Override
    public List<Application> findByEmployer(long employerId) throws DataAccessException {
        return query(SELECT + "WHERE j.posted_by = ? ORDER BY a.created_at DESC", employerId);
    }

    @Override
    public boolean exists(long jobId, long userId) throws DataAccessException {
        return !query(SELECT + "WHERE a.job_id = ? AND a.user_id = ?", jobId, userId).isEmpty();
    }

    @Override
    public void updateStatus(long applicationId, ApplicationStatus status) throws DataAccessException {
        try (Connection c = Database.getConnection();
             PreparedStatement ps = c.prepareStatement("UPDATE applications SET status = ? WHERE id = ?")) {
            ps.setString(1, status.getLabel());
            ps.setLong(2, applicationId);
            ps.executeUpdate();
        } catch (SQLException e) {
            throw new DataAccessException("Could not update the application.", e);
        }
    }

    private List<Application> query(String sql, Object... params) throws DataAccessException {
        List<Application> out = new ArrayList<>();
        try (Connection c = Database.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            for (int i = 0; i < params.length; i++) ps.setObject(i + 1, params[i]);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) out.add(map(rs));
            }
            return out;
        } catch (SQLException e) {
            throw new DataAccessException("Could not load applications.", e);
        }
    }

    private Application map(ResultSet rs) throws SQLException, DataAccessException {
        Application a = new Application(rs.getLong("job_id"), rs.getLong("user_id"));
        a.setId(rs.getLong("id"));
        a.setJobTitle(rs.getString("job_title"));
        a.setCompany(rs.getString("company"));
        a.setApplicantName(rs.getString("applicant_name"));
        a.setApplicantEmail(rs.getString("applicant_email"));
        try {
            a.setStatus(ApplicationStatus.fromLabel(rs.getString("status")));
        } catch (ValidationException e) {
            throw new DataAccessException("Corrupt application status in the database.", e);
        }
        Timestamp ts = rs.getTimestamp("created_at");
        if (ts != null) a.setAppliedAt(ts.toLocalDateTime());
        return a;
    }
}
