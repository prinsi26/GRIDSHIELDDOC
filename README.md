# Gridshield - Role-Based Staff Management System

A full-stack admin panel with JWT authentication, role-based access control (RBAC), and staff management.

---

## Tech Stack

| Layer    | Technology                    |
|----------|-------------------------------|
| Frontend | React 18, React Router, Axios |
| Backend  | Node.js, Express 4            |
| Database | MongoDB, Mongoose             |
| Auth     | JWT, bcryptjs                 |

---

## Project Structure

```
gridshield/
├── backend/
│   ├── models/
│   │   ├── User.js         ← Staff + auth model
│   │   └── Role.js         ← Role definitions
│   ├── middleware/
│   │   └── auth.js         ← JWT + RBAC guards
│   ├── routes/
│   │   ├── auth.js         ← Login, /me, change-password
│   │   ├── staff.js        ← Staff CRUD + permissions
│   │   └── roles.js        ← Role management
│   ├── server.js
│   ├── seed.js             ← Creates admin + sample users
│   └── .env
└── frontend/
    └── src/
        ├── context/
        │   └── AuthContext.jsx   ← Global auth state
        ├── components/
        │   ├── Layout.jsx        ← Sidebar + topbar
        │   └── ProtectedRoute.jsx
        ├── pages/
        │   ├── Login.jsx
        │   ├── Dashboard.jsx
        │   ├── StaffList.jsx
        │   ├── NewStaff.jsx
        │   ├── EditStaff.jsx
        │   └── Permissions.jsx   ← Granular permission editor
        └── App.jsx
```

---

## Quick Start

### 1. Prerequisites
- Node.js 18+
- MongoDB running locally (`mongod`)

### 2. Setup Backend
```bash
cd backend
npm install
# Edit .env if needed (MONGO_URI, JWT_SECRET)
node seed.js        # Creates admin + sample staff
npm run dev         # Starts on http://localhost:5000
```

### 3. Setup Frontend
```bash
cd frontend
npm install
npm run dev         # Starts on http://localhost:5173
```

### 4. Login
Open http://localhost:5173

| Role   | Username | Password  |
|--------|----------|-----------|
| Admin  | admin    | admin123  |
| Staff  | bhavesh  | pass123   |
| Viewer | darshit  | pass123   |

---

## Roles & Permissions

### Roles
| Role   | Description                         |
|--------|-------------------------------------|
| Admin  | Full access to everything           |
| Staff  | Tickets, tasks, customers           |
| Viewer | Read-only                           |

### Granular Permissions
Each non-Admin user can have any combination of:
- `inquiry.view` / `inquiry.edit`
- `ticket.view` / `ticket.edit`
- `task.view` / `task.edit`
- `customer.view` / `customer.edit`
- `sales.view` / `sales.edit`
- `staff.view` / `staff.edit`
- `stock.view` / `stock.edit`

---

## API Endpoints

### Auth
| Method | Endpoint              | Access  | Description        |
|--------|-----------------------|---------|--------------------|
| POST   | /api/auth/login       | Public  | Login              |
| GET    | /api/auth/me          | Any     | Current user       |
| PUT    | /api/auth/change-password | Any | Change password    |

### Staff
| Method | Endpoint                    | Access | Description         |
|--------|-----------------------------|--------|---------------------|
| GET    | /api/staff                  | Admin  | List all staff      |
| GET    | /api/staff/:id              | Admin  | Get single staff    |
| POST   | /api/staff                  | Admin  | Create staff        |
| PUT    | /api/staff/:id              | Admin  | Update staff        |
| PUT    | /api/staff/:id/permissions  | Admin  | Update permissions  |
| PUT    | /api/staff/:id/toggle       | Admin  | Toggle active state |
| DELETE | /api/staff/:id              | Admin  | Delete staff        |

---

## Features

- JWT login with username + role type selector
- Protected routes — role-checked at both frontend and backend
- Staff CRUD with search, pagination, CSV export
- Granular permission editor with group select-all
- Toggle active/inactive status inline
- Live IP address and clock on login page
- Responsive sidebar with collapsible nav groups
