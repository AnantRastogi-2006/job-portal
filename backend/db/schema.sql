-- Run once:  mysql -u root -p < db/schema.sql
CREATE DATABASE IF NOT EXISTS jobhub CHARACTER SET utf8mb4;
USE jobhub;

CREATE TABLE IF NOT EXISTS users (
  id            BIGINT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100)  NOT NULL,
  email         VARCHAR(150)  NOT NULL UNIQUE,
  password_hash VARCHAR(255)  NOT NULL,
  role          ENUM('jobseeker','employer') NOT NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS jobs (
  id               BIGINT AUTO_INCREMENT PRIMARY KEY,
  title            VARCHAR(150) NOT NULL,
  company          VARCHAR(150) NOT NULL,
  salary           VARCHAR(60)  NOT NULL,
  location         VARCHAR(100) NOT NULL,
  skills           VARCHAR(500) NOT NULL,           -- comma separated
  description      VARCHAR(500) NOT NULL,
  full_description TEXT         NOT NULL,
  job_type         VARCHAR(30)  NOT NULL DEFAULT 'Full-time',
  experience       VARCHAR(30)  NOT NULL DEFAULT '1+ years',
  posted_by        BIGINT NULL,
  created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (posted_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS applications (
  id         BIGINT AUTO_INCREMENT PRIMARY KEY,
  job_id     BIGINT NOT NULL,
  user_id    BIGINT NOT NULL,
  status     VARCHAR(20) NOT NULL DEFAULT 'Applied',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_job_user (job_id, user_id),
  FOREIGN KEY (job_id)  REFERENCES jobs(id)  ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Sample jobs (these replace the jobs that were hard-coded in App.js)
INSERT INTO jobs (title, company, salary, location, skills, description, full_description, job_type, experience, created_at) VALUES
('React Developer','Tech Corp','$80k - $120k','New York','React,JavaScript,CSS',
 'Build amazing web apps with React. Must have 2+ years experience.',
 'We are looking for an experienced React Developer to join our team. You will work on cutting-edge web applications serving millions of users. Requirements: Strong React skills, JavaScript proficiency, understanding of REST APIs.',
 'Full-time','2+ years', NOW() - INTERVAL 2 DAY),
('Node.js Developer','StartUp Inc','$70k - $110k','Remote','Node.js,Express,MongoDB',
 'Create scalable backend APIs. Remote-friendly position.',
 'Join our fast-growing startup building the future of backend infrastructure. You will design and implement scalable APIs, work with microservices, and mentor junior developers.',
 'Full-time','1.5+ years', NOW() - INTERVAL 5 DAY),
('Full Stack Developer','Web Solutions','$90k - $130k','San Francisco','React,Node.js,MongoDB',
 'Full stack development opportunity. Work on complete projects.',
 'This is a unique opportunity to work on full-stack projects from database design to UI implementation. You will have ownership of features and work in an agile environment.',
 'Full-time','3+ years', NOW() - INTERVAL 7 DAY),
('Frontend Developer','Design Studio','$75k - $115k','Los Angeles','React,CSS,JavaScript',
 'Create beautiful user interfaces. Design-focused role.',
 'We are looking for a Frontend Developer passionate about creating beautiful, intuitive user interfaces. Work closely with designers and backend developers to bring ideas to life.',
 'Full-time','2+ years', NOW() - INTERVAL 3 DAY);
