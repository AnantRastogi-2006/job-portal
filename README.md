# JobHub - Job Portal

A job portal where **employers** post jobs and **job seekers** apply for them.
Built with **React** (frontend) and **Java Servlets + JSP + JDBC + MySQL** (backend).

## Features
- Sign up / log in as Employer or Job Seeker (passwords stored as salted PBKDF2 hashes)
- Browse and filter jobs, view details, apply (job seekers only)
- Post jobs (employers only) - roles are enforced on the server (HTTP 403 otherwise)
- My Applications page
- Server-rendered job list with JSP at `/jobs.jsp`

## Tech stack
| Layer | Technology |
|---|---|
| Frontend | React, lucide-react, Jest + Testing Library |
| Backend | Java 11+, HttpServlet, JSP, JDBC, Gson, Maven, Jetty |
| Database | MySQL 8 |
| Tests | JUnit 5 (backend), Jest (frontend) |

## Requirements
JDK 11 or newer, Maven 3.8+, MySQL 8, Node.js 18+ and npm.

## How to run
1. **Database**
   ```
   mysql -u root -p < backend/db/schema.sql
   ```
2. **Backend** (new terminal)
   ```
   cd backend
   set JOBHUB_DB_PASSWORD=your_mysql_password      (PowerShell: $env:JOBHUB_DB_PASSWORD='your_mysql_password')
   mvn test
   mvn jetty:run
   ```
   Open http://localhost:8080/jobs.jsp to check the JSP page.
3. **Frontend** (second terminal)
   ```
   cd frontend
   npm install
   npm start
   ```
   Open http://localhost:3000 (`package.json` has `"proxy": "http://localhost:8080"`).
4. **Frontend tests**: `npm test`

## Project structure
```
backend/
  db/schema.sql                 tables + sample jobs
  src/main/java/com/jobhub/
    model/      User (abstract), Employer, JobSeeker, Job, Application, Validatable
    dao/        Repository interfaces
    jdbc/       JDBC implementations (PreparedStatement)
    servlet/    AuthServlet, JobServlet, ApplicationServlet
    exception/  JobHubException and subclasses
    util/       PasswordHasher, Html
  src/main/webapp/jobs.jsp
  src/test/java/            JUnit tests
frontend/src/
  pages/  components/  hooks/  services/  utils/
```

## API
| Method | URL | Who |
|---|---|---|
| POST | /api/auth/register, /api/auth/login, /api/auth/logout | anyone |
| GET | /api/auth/me | logged in |
| GET | /api/jobs | anyone |
| POST | /api/jobs | employer only |
| GET | /api/applications | job seeker: own, employer: received |
| POST | /api/applications | job seeker only |

## Team
- [Name 1] - [what they built]
- [Name 2] - [what they built]
