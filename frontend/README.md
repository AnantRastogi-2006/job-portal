JobHub
A full-stack job portal web application that connects
Job Seekers and Employers on a single platform. Job
seekers can search, filter, and apply to jobs, while
employers can post and manage their own listings —
all backed by real authentication and a live cloud
database.
Live Demo: job-portal-delta-topaz.vercel.app
Features
For Job Seekers
Sign up / log in with Email & Password, Google, or
GitHub
Search jobs by title, skills, or company
Filter jobs by location, job type, experience level,
work mode, and salary range
Apply to jobs with one click (duplicate
applications are blocked)
Track all applications and their status on the My
Applications page
For Employers
Separate Employer account role
Post new job listings (title, salary, location, skills,
description)
Posted jobs appear instantly for all job seekers in
real time
General
Responsive design — works on mobile, tablet, and
desktop
Light/Dark theme and font size settings
Role-based access control (Job Seekers and
Employers only see what's relevant to them)
Deployed and publicly accessible
Tech Stack
Layer Technology
Frontend React.js (JavaScript), CSS3
Icons lucide-react
Authentication
Firebase Authentication
(Email/Password, Google, GitHub)
Layer Technology
Database Cloud Firestore (NoSQL, real-time)
Hosting Vercel
Version
Control
Git & GitHub
This project uses Firebase as a Backend-as-a-Service
instead of a custom Node.js server — Firebase
Authentication handles user identity and sessions,
and Firestore acts as the live database for jobs and
applications, secured with custom Firestore Security
Rules.
Database Structure (Firestore)
jobs collection
title, company, location, salary, jobType,
experience, skills[], description,
fullDescription,
postedByUid, createdAt
applications collection
uid, jobId, jobTitle, company,
applicantName, applicantEmail, status,
appliedDate, createdAt
Firestore Security Rules ensure every user can only
read their own applications, while job listings are
publicly readable.
Getting Started
Prerequisites
Node.js (v16 or higher) and npm installed
A Firebase project with Authentication
(Email/Password, Google, GitHub providers) and
Firestore Database enabled
Installation
1. Clone the repository
git clone
https://github.com/AnantRastogi-
2006/job-portal.git
cd job-portal
2. Install dependencies
npm install
3. Configure Firebase
Open src/firebase.js and replace the
placeholder config with your own Firebase
project's config (found in Firebase Console →
Project Settings → General):
const firebaseConfig = {
 apiKey: "YOUR_API_KEY",
 authDomain:
"YOUR_PROJECT_ID.firebaseapp.com",
 projectId: "YOUR_PROJECT_ID",
 storageBucket:
"YOUR_PROJECT_ID.appspot.com",
 messagingSenderId: "YOUR_SENDER_ID",
 appId: "YOUR_APP_ID",
};
4. Set Firestore Security Rules
In Firebase Console → Firestore Database →
Rules, paste the rules from firestore.rules
(included in this repo) and click Publish.
5. Run the app locally
npm start
The app will open at http://localhost:3000 .
Project Structure
job-portal/
├── public/
│ └── index.html
├── src/
│ ├── assets/ # Images and
icons
│ ├── App.js # Main app
component (routing, pages, logic)
│ ├── App.css # All
styling
│ ├── firebase.js # Firebase
config & initialization
│ └── index.js
├── firestore.rules # Firestore
security rules
├── package.json
└── README.md
Deployment
The project is deployed on Vercel, connected directly
to this GitHub repository. Every push to the main
branch automatically triggers a new production build.
Future Scope
Custom Node.js + Express backend as an
alternative to Firebase
Resume upload support for job applications
Email notifications on application status changes
Admin dashboard to moderate job postings
Author
Anant Rastogi
B.Tech CSE