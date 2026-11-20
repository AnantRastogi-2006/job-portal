package com.jobhub.dao;

import com.jobhub.exception.DataAccessException;
import java.util.List;
import java.util.Optional;

/** Generic data-access interface. JDBC classes implement it. */
public interface Repository<T, ID> {
    T save(T entity) throws DataAccessException;

    Optional<T> findById(ID id) throws DataAccessException;

    List<T> findAll() throws DataAccessException;
}
