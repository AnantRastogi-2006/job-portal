package com.jobhub.exception;

/** Base class for every checked error in the application. Carries an HTTP status. */
public class JobHubException extends Exception {
    private static final long serialVersionUID = 1L;
    private final int status;

    public JobHubException(String message, int status) {
        super(message);
        this.status = status;
    }

    public JobHubException(String message, int status, Throwable cause) {
        super(message, cause);
        this.status = status;
    }

    public int getStatus() {
        return status;
    }
}
