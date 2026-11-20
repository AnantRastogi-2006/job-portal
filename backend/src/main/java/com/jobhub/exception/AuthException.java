package com.jobhub.exception;

/** Authentication required (HTTP 401). */
public class AuthException extends JobHubException {
    private static final long serialVersionUID = 1L;

    public AuthException(String message) {
        super(message, 401);
    }
}
