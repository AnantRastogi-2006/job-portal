package com.jobhub.jdbc;

import com.jobhub.dao.JobRepository;
import com.jobhub.exception.DataAccessException;
import com.jobhub.model.Job;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class JdbcJobRepository implements JobRepository {

    @Override
    public Job save(Job job) throws DataAccessException {
        String sql = "INSERT INTO jobs (title, company, salary, location, skills, description, "
                + "full_description, job_type, experience, posted_by) VALUES (?,?,?,?,?,?,?,?,?,?)";
        try (Connection c = Database.getConnection();
             PreparedStatement ps = c.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            ps.setString(1, job.getTitle());
            ps.setString(2, job.getCompany());
            ps.setString(3, job.getSalary());
            ps.setString(4, job.getLocation());
            ps.setString(5, job.getSkillsCsv());
            ps.setString(6, job.getDescription());
            ps.setString(7, job.getFullDescription());
            ps.setString(8, job.getJobType());
            ps.setString(9, job.getExperience());
            ps.setObject(10, job.getPostedBy());
            ps.executeUpdate();
            try (ResultSet keys = ps.getGeneratedKeys()) {
                if (keys.next()) job.setId(keys.getLong(1));
            }
            return job;
        } catch (SQLException e) {
            throw new DataAccessException("Could not save the job.", e);
        }
    }

    @Override
    public Optional<Job> findById(Long id) throws DataAccessException {
        try (Connection c = Database.getConnection();
             PreparedStatement ps = c.prepareStatement("SELECT * FROM jobs WHERE id = ?")) {
            ps.setLong(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? Optional.of(map(rs)) : Optional.empty();
            }
        } catch (SQLException e) {
            throw new DataAccessException("Could not load the job.", e);
        }
    }

    @Override
    public List<Job> findAll() throws DataAccessException {
        List<Job> out = new ArrayList<>();
        try (Connection c = Database.getConnection();
             PreparedStatement ps = c.prepareStatement("SELECT * FROM jobs ORDER BY created_at DESC, id DESC");
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) out.add(map(rs));
            return out;
        } catch (SQLException e) {
            throw new DataAccessException("Could not load jobs.", e);
        }
    }

    private Job map(ResultSet rs) throws SQLException {
        Job j = new Job();
        j.setId(rs.getLong("id"));
        j.setTitle(rs.getString("title"));
        j.setCompany(rs.getString("company"));
        j.setSalary(rs.getString("salary"));
        j.setLocation(rs.getString("location"));
        j.setSkills(Job.parseSkills(rs.getString("skills")));
        j.setDescription(rs.getString("description"));
        j.setFullDescription(rs.getString("full_description"));
        j.setJobType(rs.getString("job_type"));
        j.setExperience(rs.getString("experience"));
        long postedBy = rs.getLong("posted_by");
        j.setPostedBy(rs.wasNull() ? null : postedBy);
        Timestamp ts = rs.getTimestamp("created_at");
        if (ts != null) j.setCreatedAt(ts.toLocalDateTime());
        return j;
    }
}
