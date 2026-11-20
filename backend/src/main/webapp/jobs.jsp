<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="java.util.List, com.jobhub.model.Job, com.jobhub.jdbc.JdbcJobRepository, com.jobhub.util.Html" %>
<%
    // Server-rendered job board (JSP). The React app uses /api/jobs for the same data.
    List<Job> jobs = null;
    String error = null;
    try {
        jobs = new JdbcJobRepository().findAll();
    } catch (Exception e) {
        error = "Could not load jobs. Is MySQL running?";
    }
%>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>JobHub - Server-rendered jobs (JSP)</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; background: #f5f7fb; color: #1f2937; }
    header { background: #102A56; color: #fff; padding: 16px 32px; }
    main { max-width: 900px; margin: 24px auto; padding: 0 16px; }
    .card { background: #fff; border-radius: 10px; padding: 16px 20px; margin-bottom: 14px; box-shadow: 0 1px 4px rgba(0,0,0,.08); }
    .card h3 { margin: 0 0 4px; }
    .meta { color: #6b7280; font-size: 14px; }
    .skill { display: inline-block; background: #eef2ff; color: #4338ca; border-radius: 12px; padding: 2px 10px; margin: 6px 6px 0 0; font-size: 12px; }
    .error { color: #b91c1c; }
  </style>
</head>
<body>
  <header><h1>JobHub - Latest Jobs</h1></header>
  <main>
    <% if (error != null) { %>
      <p class="error"><%= Html.escape(error) %></p>
    <% } else if (jobs.isEmpty()) { %>
      <p>No jobs posted yet.</p>
    <% } else { for (Job j : jobs) { %>
      <div class="card">
        <h3><%= Html.escape(j.getTitle()) %></h3>
        <div class="meta"><%= Html.escape(j.getCompany()) %> &middot; <%= Html.escape(j.getLocation()) %>
          &middot; <%= Html.escape(j.getSalary()) %> &middot; Posted <%= Html.escape(j.getPostedDateLabel()) %></div>
        <p><%= Html.escape(j.getDescription()) %></p>
        <% for (String s : j.getSkills()) { %><span class="skill"><%= Html.escape(s) %></span><% } %>
      </div>
    <% } } %>
  </main>
</body>
</html>
