<h1> Team Task Manager – MERN Stack</h1>

A collaborative task management system built using the MERN stack (MongoDB, Express.js, React.js, Node.js).  
It allows users to create teams, manage tasks, assign work, track progress, and collaborate efficiently.

<h3>🚀 Features</h3>

 <h5>👤 Authentication</h5>
- User signup & login
- JWT authentication with httpOnly cookies
- Protected backend routes & protected frontend routes

<h5>👥 Team Management</h5>
- Create teams
- Invite members by email (existing users)
- Team creator acts as admin
- Admin-only delete team
- View all teams in dashboard

<h5>📝 Task Management</h5>
- Create, edit, and delete tasks
- Assign tasks to team members
- Set priority: low / medium / high
- Set optional due date
- Workflow statuses: To-Do → In-Progress → Done
- Clean Kanban-style board per team

<h5>💻 Frontend (React + Bootstrap)</h5>
- Responsive UI
- Landing page, login/signup, dashboard, and team view
- Status-based task grouping
- Priority and due date badges

<h5>🛠 Backend (Node.js + Express)</h5>
- Modular controllers and routes
- Secure authentication middleware
- Mongoose models (User, Team, Task)

<h5>🗂 Tech Stack</h5>
**Frontend:** React, Vite, Bootstrap, Axios  
**Backend:** Node.js, Express.js  
**Database:** MongoDB, Mongoose  
**Auth:** JWT + httpOnly cookies  
