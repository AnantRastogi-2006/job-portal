package com.jobhub.servlet;

import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
import com.jobhub.exception.AuthException;
import com.jobhub.exception.DataAccessException;
import com.jobhub.exception.JobHubException;
import com.jobhub.exception.ValidationException;
import com.jobhub.model.User;
import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.Map;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/** Shared helpers for all API servlets: JSON in/out, session user, error handling. */
public abstract class BaseServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    protected static final Gson GSON = new Gson();
    private static final String SESSION_USER = "jobhub.user";

    protected void writeJson(HttpServletResponse resp, int status, Object body) throws IOException {
        resp.setStatus(status);
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        resp.getWriter().write(GSON.toJson(body));
    }

    protected <T> T readJson(HttpServletRequest req, Class<T> type) throws ValidationException {
        try {
            req.setCharacterEncoding("UTF-8");
            T body = GSON.fromJson(req.getReader(), type);
            if (body == null) throw new ValidationException("Request body is empty.");
            return body;
        } catch (JsonSyntaxException | IOException e) {
            throw new ValidationException("Request body is not valid JSON.");
        }
    }

    // ----- session / authentication -----
    protected void login(HttpServletRequest req, User user) {
        HttpSession old = req.getSession(false);
        if (old != null) old.invalidate();          // prevents session fixation
        req.getSession(true).setAttribute(SESSION_USER, user);
    }

    protected void logout(HttpServletRequest req) {
        HttpSession s = req.getSession(false);
        if (s != null) s.invalidate();
    }

    protected User currentUser(HttpServletRequest req) {
        HttpSession s = req.getSession(false);
        return s == null ? null : (User) s.getAttribute(SESSION_USER);
    }

    protected User requireUser(HttpServletRequest req) throws AuthException {
        User u = currentUser(req);
        if (u == null) throw new AuthException("Please log in first.");
        return u;
    }

    protected Map<String, Object> userDto(User u) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", u.getId());
        m.put("name", u.getName());
        m.put("email", u.getEmail());
        m.put("role", u.getRole());
        m.put("homePage", u.getHomePage());
        return m;
    }

    // ----- error handling -----
    protected void fail(HttpServletResponse resp, Exception e) throws IOException {
        int status = 500;
        String message = "Something went wrong. Please try again.";
        if (e instanceof DataAccessException) {
            log("Database error", e);              // details stay in the server log only
        } else if (e instanceof JobHubException) {
            status = ((JobHubException) e).getStatus();
            message = e.getMessage();
        } else {
            log("Unexpected error", e);
        }
        Map<String, String> body = new LinkedHashMap<>();
        body.put("error", message);
        writeJson(resp, status, body);
    }
}
