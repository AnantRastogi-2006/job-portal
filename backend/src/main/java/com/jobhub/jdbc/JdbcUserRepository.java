package com.jobhub.jdbc;

import com.jobhub.dao.UserRepository;
import com.jobhub.exception.DataAccessException;
import com.jobhub.exception.ValidationException;
import com.jobhub.model.User;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class JdbcUserRepository implements UserRepository {

    @Override
    public User save(User user) throws DataAccessException {
        String sql = "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)";
        try (Connection c = Database.getConnection();
             PreparedStatement ps = c.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            ps.setString(1, user.getName());
            ps.setString(2, user.getEmail());
            ps.setString(3, user.getPasswordHash());
            ps.setString(4, user.getRole());
            ps.executeUpdate();
            try (ResultSet keys = ps.getGeneratedKeys()) {
                if (keys.next()) user.setId(keys.getLong(1));
            }
            return user;
        } catch (SQLException e) {
            throw new DataAccessException("Could not save the user.", e);
        }
    }

    @Override
    public Optional<User> findById(Long id) throws DataAccessException {
        return queryOne("SELECT * FROM users WHERE id = ?", id);
    }

    @Override
    public Optional<User> findByEmail(String email) throws DataAccessException {
        return queryOne("SELECT * FROM users WHERE email = ?", email == null ? "" : email.trim().toLowerCase());
    }

    @Override
    public List<User> findAll() throws DataAccessException {
        List<User> out = new ArrayList<>();
        try (Connection c = Database.getConnection();
             PreparedStatement ps = c.prepareStatement("SELECT * FROM users");
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) out.add(map(rs));
            return out;
        } catch (SQLException e) {
            throw new DataAccessException("Could not load users.", e);
        }
    }

    private Optional<User> queryOne(String sql, Object param) throws DataAccessException {
        try (Connection c = Database.getConnection();
             PreparedStatement ps = c.prepareStatement(sql)) {
            ps.setObject(1, param);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? Optional.of(map(rs)) : Optional.empty();
            }
        } catch (SQLException e) {
            throw new DataAccessException("Could not load the user.", e);
        }
    }

    private User map(ResultSet rs) throws SQLException, DataAccessException {
        try {
            return User.create(rs.getString("role"), rs.getLong("id"), rs.getString("name"),
                    rs.getString("email"), rs.getString("password_hash"));
        } catch (ValidationException e) {
            throw new DataAccessException("Corrupt user row in the database.", e);
        }
    }
}
