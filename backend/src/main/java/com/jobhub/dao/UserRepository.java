package com.jobhub.dao;

import com.jobhub.exception.DataAccessException;
import com.jobhub.model.User;
import java.util.Optional;

public interface UserRepository extends Repository<User, Long> {
    Optional<User> findByEmail(String email) throws DataAccessException;
}
