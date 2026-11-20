package com.jobhub.exception;

/** Wraps any java.sql.SQLException so the rest of the code never sees JDBC details. */
public class DataAccessException extends JobHubException {
    private static final long serialVersionUID = 1L;

    public DataAccessException(String message, Throwable cause) {
        super(message, 500, cause);
    }
}
