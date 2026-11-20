package com.jobhub.exception;

/** Already exists (HTTP 409). */
public class DuplicateException extends JobHubException {
    private static final long serialVersionUID = 1L;

    public DuplicateException(String message) {
        super(message, 409);
    }
}
