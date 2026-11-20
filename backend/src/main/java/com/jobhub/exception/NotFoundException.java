package com.jobhub.exception;

/** Not found (HTTP 404). */
public class NotFoundException extends JobHubException {
    private static final long serialVersionUID = 1L;

    public NotFoundException(String message) {
        super(message, 404);
    }
}
