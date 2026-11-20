package com.jobhub.servlet;

import com.jobhub.dao.UserRepository;
import com.jobhub.exception.AuthException;
import com.jobhub.exception.DuplicateException;
import com.jobhub.exception.NotFoundException;
import com.jobhub.exception.ValidationException;
import com.jobhub.jdbc.JdbcUserRepository;
import com.jobhub.model.User;
import com.jobhub.util.PasswordHasher;
import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *   POST /api/auth/register  {name,email,password,role}
 *   POST /api/auth/login     {email,password}
 *   POST /api/auth/logout
 *   GET  /api/auth/me
 */
@WebServlet("/api/auth/*")
public class AuthServlet extends BaseServlet {
    private static final long serialVersionUID = 1L;
    private final UserRepository users = new JdbcUserRepository();

    private static class Credentials {
        String name;
        String email;
        String password;
        String role;
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String path = req.getPathInfo() == null ? "" : req.getPathInfo();
        try {
            switch (path) {
                case "/register": register(req, resp); break;
                case "/login": loginUser(req, resp); break;
                case "/logout": logout(req); writeJson(resp, 200, java.util.Collections.singletonMap("ok", true)); break;
                default: throw new NotFoundException("Unknown endpoint.");
            }
        } catch (Exception e) {
            fail(resp, e);
        }
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            if (!"/me".equals(req.getPathInfo())) throw new NotFoundException("Unknown endpoint.");
            writeJson(resp, 200, userDto(requireUser(req)));
        } catch (Exception e) {
            fail(resp, e);
        }
    }

    private void register(HttpServletRequest req, HttpServletResponse resp) throws Exception {
        Credentials c = readJson(req, Credentials.class);
        if (c.password == null || c.password.length() < 6) {
            throw new ValidationException("Password must be at least 6 characters.");
        }
        User user = User.create(c.role, null, c.name, c.email,
                PasswordHasher.hash(c.password));         // subclass chosen by role
        user.validate();
        if (users.findByEmail(user.getEmail()).isPresent()) {
            throw new DuplicateException("An account with this email already exists. Please log in.");
        }
        users.save(user);
        login(req, user);
        writeJson(resp, 201, userDto(user));
    }

    private void loginUser(HttpServletRequest req, HttpServletResponse resp) throws Exception {
        Credentials c = readJson(req, Credentials.class);
        if (c.email == null || c.password == null || c.email.trim().isEmpty() || c.password.isEmpty()) {
            throw new ValidationException("Please enter your email and password.");
        }
        User user = users.findByEmail(c.email).orElse(null);
        if (user == null || !PasswordHasher.verify(c.password, user.getPasswordHash())) {
            throw new AuthException("Incorrect email or password.");
        }
        login(req, user);
        writeJson(resp, 200, userDto(user));
    }
}
