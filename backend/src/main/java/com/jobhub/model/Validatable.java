package com.jobhub.model;

import com.jobhub.exception.ValidationException;

/** Interface: anything that can check its own data before it is saved. */
public interface Validatable {
    void validate() throws ValidationException;
}
