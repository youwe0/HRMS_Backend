# HRMS API Documentation

Base URL: `http://localhost:5000/api`

All responses use a consistent envelope:

```json
{ "success": true, "message": "Login successful", "data": {} }
```

Errors:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [{ "field": "email", "message": "\"email\" must be a valid email" }]
}
```

## Authentication

### POST /auth/register — Public

Self-register (always creates an `employee`-role account).

```json
{ "name": "Jane Doe", "email": "jane@example.com", "password": "Password123" }
```

### POST /auth/login — Public

```json
{ "email": "admin@hrms.com", "password": "Admin@1234" }
```

Response: `{ user, accessToken }` plus an httpOnly `refreshToken` cookie.

### POST /auth/refresh — Public (cookie)

Rotates the refresh token (reads the `refreshToken` cookie, or `body.refreshToken`).
Response: `{ user, accessToken }` plus a new `refreshToken` cookie.

### POST /auth/logout — Authenticated

Revokes the current refresh token and clears the cookie. Send `Authorization: Bearer <accessToken>`.

### POST /auth/change-password — Authenticated

```json
{
  "currentPassword": "OldPass123",
  "newPassword": "NewPass123",
  "confirmPassword": "NewPass123"
}
```

Revokes all refresh tokens for the user.

### GET /auth/me — Authenticated

Returns the current user.

## Users (Admin, HR)

All routes require `Authorization: Bearer <accessToken>` and role `admin` or `hr`.

| Method | Endpoint   | Body / Query                                              |
| ------ | ---------- | --------------------------------------------------------- |
| GET    | /users     | `page`, `limit`, `search`, `role`, `isActive` (query)     |
| POST   | /users     | `{ name, email, password, role?, isActive? }`             |
| GET    | /users/:id | —                                                         |
| PATCH  | /users/:id | any subset of `{ name, email, password, role, isActive }` |
| DELETE | /users/:id | —                                                         |

## Departments

All routes require authentication. Writes additionally require `admin` or `hr`.

| Method | Endpoint         | Body / Query                                     |
| ------ | ---------------- | ------------------------------------------------ |
| GET    | /departments     | `page`, `limit`, `search`, `isActive` (query)    |
| POST   | /departments     | `{ name, code, description?, head?, isActive? }` |
| GET    | /departments/:id | —                                                |
| PATCH  | /departments/:id | any subset of the create body                    |
| DELETE | /departments/:id | blocked while employees belong to it             |

## Employees (Admin, HR)

All routes require role `admin` or `hr`.

| Method | Endpoint       | Body / Query                                                                                     |
| ------ | -------------- | ------------------------------------------------------------------------------------------------ |
| GET    | /employees     | `page`, `limit`, `status`, `department`, `search` (query)                                        |
| POST   | /employees     | `{ user, department, employeeId, designation, joiningDate, phone?, address?, salary?, status? }` |
| GET    | /employees/:id | —                                                                                                |
| PATCH  | /employees/:id | any subset of the create body                                                                    |
| DELETE | /employees/:id | —                                                                                                |

`user` must be an existing user id; `department` an existing department id.
`employeeId` must be unique.

## Health

### GET /health — Public

```json
{
  "success": true,
  "message": "API is healthy",
  "data": {
    "status": "ok",
    "environment": "development",
    "uptime": 12.3,
    "timestamp": "...",
    "database": "connected"
  }
}
```

## Realtime (optional)

When `ENABLE_SOCKETS=true`, Socket.IO is available on the same server.
Connect with `auth: { token: "<accessToken>" }`, then join your room `user:<userId>`.
