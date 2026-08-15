# HRMS Backend

Production-grade REST API for the HRMS platform, built with **Node.js + Express** and a strict, layered architecture.

## Tech Stack

- **Node.js + Express.js** (ESM)
- **MongoDB + Mongoose**
- **JWT** authentication (access token + rotating refresh token in an httpOnly cookie)
- **Joi** request validation
- **Winston** logging

## Folder Structure

```
backend/
├── src/
│   ├── config/          # Environment variables, DB config, constants config (exports objects only)
│   ├── routes/          # Route definitions ONLY (path → controller mapping)
│   ├── controllers/     # req/res handling ONLY — calls services, returns responses
│   ├── services/        # ALL business logic — talks to models, framework-independent
│   ├── models/          # Mongoose schemas ONLY
│   ├── middlewares/     # Auth checks, error handlers, rate limiters, request logging
│   ├── validators/      # Joi schemas, used inside route middleware only
│   ├── utils/           # Pure, generic helpers (JWT, password hashing, pagination, logger)
│   ├── helpers/         # Domain-specific formatters (formatUserResponse, ...)
│   ├── constants/       # Roles, HTTP status codes, error messages, enums
│   ├── db/              # MongoDB connection
│   ├── jobs/            # Scheduled background tasks (node-cron)
│   ├── sockets/         # Socket.IO handlers
│   ├── loaders/         # App bootstrap (DB connect, job startup) — keeps server.js minimal
│   ├── app.js           # Express app instance + middleware mounting only
│   └── server.js        # Entry point — starts the server, nothing else
├── tests/               # Unit + integration tests (node:test + supertest)
├── logs/                # Auto-generated Winston log files
├── public/              # Static assets served to the client
├── uploads/             # User-uploaded files
├── scripts/             # One-off scripts (seeders)
└── docs/                # API documentation
```

## Architecture Rules

1. A controller **never** calls a model directly — it must go through a service.
2. A route file **only** imports controllers, validators, and middlewares — no inline logic.
3. Modules are named **feature-first**: `user.routes.js`, `user.controller.js`, `user.service.js`, `user.model.js`.
4. Every incoming request passes through a **validator middleware** before reaching the controller.
5. All errors are handled by a **centralized error middleware**.

## Getting Started

```bash
cd backend
cp .env.example .env        # then edit values
npm install
npm run dev                 # starts on http://localhost:5000
```

### Seed data

```bash
npm run seed                # creates an admin user + default departments
```

Default admin (from `.env`): `admin@hrms.com` / `Admin@1234`

### Tests

```bash
npm test                    # node:test + supertest (no MongoDB required)
```

## API Overview

| Method | Endpoint                          | Access          | Description                  |
| ------ | --------------------------------- | --------------- | ---------------------------- |
| POST   | `/api/auth/register`              | Public          | Self-register as employee    |
| POST   | `/api/auth/login`                 | Public          | Login, returns JWT pair      |
| POST   | `/api/auth/refresh`               | Public (cookie) | Rotate refresh token         |
| POST   | `/api/auth/logout`                | Authenticated   | Revoke refresh token         |
| GET    | `/api/auth/me`                    | Authenticated   | Current user profile         |
| POST   | `/api/auth/change-password`       | Authenticated   | Change own password          |
| GET    | `/api/users`                      | Admin, HR       | List users (paginated)       |
| POST   | `/api/users`                      | Admin, HR       | Create a user                |
| GET    | `/api/users/:id`                  | Admin, HR       | Get a user                   |
| PATCH  | `/api/users/:id`                  | Admin, HR       | Update a user                |
| DELETE | `/api/users/:id`                  | Admin, HR       | Delete a user                |
| GET    | `/api/employees`                  | Admin, HR       | List employees (paginated)   |
| POST   | `/api/employees`                  | Admin, HR       | Create an employee profile   |
| GET    | `/api/employees/:id`              | Admin, HR       | Get an employee              |
| PATCH  | `/api/employees/:id`              | Admin, HR       | Update an employee           |
| DELETE | `/api/employees/:id`              | Admin, HR       | Delete an employee           |
| GET    | `/api/departments`                | Authenticated   | List departments             |
| POST   | `/api/departments`                | Admin, HR       | Create a department          |
| GET    | `/api/departments/:id`            | Authenticated   | Get a department             |
| PATCH  | `/api/departments/:id`            | Admin, HR       | Update a department          |
| DELETE | `/api/departments/:id`            | Admin, HR       | Delete a department          |
| GET    | `/api/health`                     | Public          | Health check                 |

See [`docs/api.md`](docs/api.md) for request/response details.

### Auth flow

1. `POST /api/auth/login` → returns `{ user, accessToken }` and sets an httpOnly `refreshToken` cookie.
2. Send `Authorization: Bearer <accessToken>` on protected routes.
3. When the access token expires, `POST /api/auth/refresh` rotates the refresh token and returns a new access token.
