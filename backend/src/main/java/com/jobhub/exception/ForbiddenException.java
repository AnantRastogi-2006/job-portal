package com.jobhub.exception;

/** Not allowed (HTTP 403). */
public class ForbiddenException extends JobHubException {
    private static final long serialVersionUID = 1L;

    public ForbiddenException(String message) {
        super(message, 403);
    }
}
