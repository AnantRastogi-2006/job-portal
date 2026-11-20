package com.jobhub.jdbc;

import com.jobhub.exception.DataAccessException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * Opens JDBC connections to MySQL.
 * Override with environment variables: JOBHUB_DB_URL, JOBHUB_DB_USER, JOBHUB_DB_PASSWORD.
 */
public final class Database {
    private static final String URL = env("JOBHUB_DB_URL",
            "jdbc:mysql://localhost:3306/jobhub?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC");
    private static final String USER = env("JOBHUB_DB_USER", "root");
    private static final String PASSWORD = env("JOBHUB_DB_PASSWORD", "");

    static {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            throw new ExceptionInInitializerError(e);
        }
    }

    private Database() { }

    private static String env(String key, String fallback) {
        String v = System.getenv(key);
        return v == null || v.isEmpty() ? fallback : v;
    }

    public static Connection getConnection() throws DataAccessException {
        try {
            return DriverManager.getConnection(URL, USER, PASSWORD);
        } catch (SQLException e) {
            throw new DataAccessException("Could not connect to the database.", e);
        }
    }
}
