Team-Task-Manager

Full-Stack MERN Team Collaboration & Task Management Platform

🔗 Live Demo

https://taktusteam.onrender.com/

📂 GitHub Repository

https://github.com/sharonbrayan/Team-Task-Manager


---

📌 Overview

Team-Task-Manager is a full-stack MERN application designed to manage team-based task workflows with secure authentication, role-based access control, and real-world collaboration features.

The system supports multiple teams, admin-controlled workspaces, and a Kanban-style task lifecycle (To-Do → In-Progress → Done), closely modeling how real teams operate.


---

🧠 Key Concepts Implemented

Secure authentication using JWT stored in httpOnly cookies

Role-Based Access Control (RBAC) for team admins and members

Multi-tenant architecture with team-level data isolation

RESTful API design with protected routes

Real-world task workflows and permission checks



---

✨ Features

🔐 Authentication & Security

User signup & login with encrypted passwords

JWT-based authentication stored in httpOnly cookies

Protected backend APIs and frontend routes

Session persistence across browser refresh


👥 Team Management

Create teams and invite members

Team creator acts as admin

Admin-only actions (team deletion, member control)

Team-scoped data isolation (users see only their teams)


✅ Task Management

Create, update, and delete tasks

Assign tasks to team members

Priority levels and optional due dates

Kanban workflow:

To-Do

In-Progress

Done



🎨 Frontend

Responsive UI built with React + Bootstrap

Separate views for authentication, dashboard, and team workspace

Clean state handling for teams and tasks



---


🔄 Authentication Flow

1. User logs in


2. Server issues JWT token


3. Token stored in httpOnly cookie


4. Middleware verifies token on every protected request


5. Role & team permissions checked before data access




---

🛠️ Tech Stack

Frontend

React.js

Bootstrap

Axios


Backend

Node.js

Express.js

JWT Authentication


Database

MongoDB (Mongoose)


Deployment

Render (Backend)

Vercel (Frontend)



---

🚀 Setup Instructions

# Clone repository
git clone https://github.com/sharonbrayan/Team-Task-Manager.git

# Backend setup
cd backend
npm install
npm run dev

# Frontend setup
cd frontend
npm install
npm start

Create a .env file using .env.example for environment variables.


---

🎯 Learning Outcomes

Designing secure authentication systems

Implementing RBAC in real applications

Structuring scalable backend APIs

Handling multi-user workflows

Bridging frontend and backend state securely
