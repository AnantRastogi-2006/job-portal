package com.jobhub.exception;

/** Input is invalid (HTTP 400). */
public class ValidationException extends JobHubException {
    private static final long serialVersionUID = 1L;

    public ValidationException(String message) {
        super(message, 400);
    }
}
