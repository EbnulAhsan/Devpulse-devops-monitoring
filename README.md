# DevPulse — Bug & Feature Tracker API

DevPulse is a backend REST API for tracking bugs and feature requests within a development team. It supports role-based access control, allowing **contributors** to report issues and **maintainers** to manage their lifecycle.

**Live API:** [https://devpulsebackendfinal.vercel.app](https://devpulsebackendfinal.vercel.app)

---

## Features

- 🔐 **JWT-based authentication** with bcrypt password hashing
- 👥 **Role-based access control** — `contributor` and `maintainer` roles
- 🐛 **Issue management** — create, read, update, and delete bugs/feature requests
- 🔍 **Filtering & sorting** — filter issues by type/status, sort by newest/oldest
- ✅ **Centralized validation & error handling** for consistent API responses
- ☁️ **Serverless deployment** on Vercel with a PostgreSQL (NeonDB) database

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express 5 |
| Language | TypeScript |
| Database | PostgreSQL (NeonDB) |
| Auth | JWT (jsonwebtoken) + bcrypt |
| Build Tool | tsup |
| Deployment | Vercel (Serverless Functions) |

---

## Project Structure

```
devpulse-backend/
├── api/
│   └── index.js          # Vercel serverless entry point
├── src/
│   ├── app.ts             # Express app & middleware setup
│   ├── server.ts          # Local dev server entry point
│   ├── config/            # Environment config
│   ├── db/                # Database pool & table definitions
│   ├── auth/               # Auth routes, controller, service
│   ├── modules/issues/     # Issues routes, controller, service
│   ├── middleware/         # Auth guard, logger, error handler
│   ├── utility/            # Shared response helper
│   └── types/              # Shared TypeScript types
├── vercel.json
├── tsup.config.ts
└── package.json
```

---

## Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/EbnulAhsan/Assignment-2_devpulse-backend.git
cd Assignment-2_devpulse-backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file in the project root:

```env
PORT=5000
DATABASE_URL=postgresql://<user>:<password>@<host>/<database>?sslmode=require
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=10
NODE_ENV=development
```

### 4. Run in development mode
```bash
npm run dev
```
Server runs at `http://localhost:5000`.

### 5. Build for production
```bash
npm run build
```

---

## API Endpoints

Base URL (local): `http://localhost:5000`
Base URL (production): `https://devpulsebackendfinal.vercel.app`

### Auth Routes — `/api/auth`

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/auth/signup` | Register a new user | Public |
| POST | `/api/auth/login` | Log in and receive a JWT | Public |

**Signup request body:**
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "123456",
  "role": "contributor"
}
```

**Login request body:**
```json
{
  "email": "test@example.com",
  "password": "123456"
}
```

### Issue Routes — `/api/issues`

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/issues` | Create a new issue | Contributor, Maintainer |
| GET | `/api/issues` | Get all issues (supports `?type=`, `?status=`, `?sort=`) | Public |
| GET | `/api/issues/:id` | Get a single issue by ID | Public |
| PATCH | `/api/issues/:id` | Update an issue | Owner (Contributor) / Maintainer |
| DELETE | `/api/issues/:id` | Delete an issue | Maintainer only |

**Create issue request body:**
```json
{
  "title": "Database connection timeout under load",
  "description": "Pool exhausts after 50+ concurrent queries, causing 500 errors",
  "type": "bug"
}
```

> Protected routes require an `Authorization` header containing the JWT received at login.

### Permission Rules

- A **contributor** can only update their own issue, and only while it's `open`. They cannot change an issue's `status`.
- A **maintainer** can update or delete any issue, including changing its `status`.

---

## Database Schema

### `users`

| Column | Type | Constraints |
|---|---|---|
| id | SERIAL | PRIMARY KEY |
| name | VARCHAR(100) | NOT NULL |
| email | VARCHAR(150) | UNIQUE, NOT NULL |
| password | TEXT | NOT NULL (bcrypt hashed) |
| role | VARCHAR(20) | DEFAULT `contributor`, CHECK (`contributor`, `maintainer`) |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

### `issues`

| Column | Type | Constraints |
|---|---|---|
| id | SERIAL | PRIMARY KEY |
| title | VARCHAR(150) | NOT NULL |
| description | TEXT | NOT NULL |
| type | VARCHAR(30) | CHECK (`bug`, `feature_request`) |
| status | VARCHAR(30) | DEFAULT `open`, CHECK (`open`, `in_progress`, `resolved`) |
| reporter_id | INTEGER | NOT NULL (references `users.id`) |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

---

## Deployment

This project is deployed on **Vercel** as a serverless function:

- `vercel.json` routes all incoming requests to `api/index.js`
- `api/index.js` imports the built Express app (`dist/app.js`) and exports it directly as the request handler
- The build step (`tsup`) bundles the TypeScript source into `dist/` before deployment
- Required environment variables (`DATABASE_URL`, `JWT_SECRET`, etc.) must be configured in the Vercel project's **Environment Variables** settings

---

## Author

**Md Ebnul Ahsan**
Built as part of a backend development assignment.
