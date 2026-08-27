# HRMS API Reference

> **Base URL:** `http://localhost:5000/api`
> **Content-Type:** `application/json`
> **Last Updated:** 2026-08-27 (User Search API added)

---

## Quick Reference

| API Endpoint | Sample Payload | Success Response |
|---|---|---|
| `POST /api/auth/register` | `{ "userName": "john.doe", "password": "securePass123" }` | `{ "success": true, "message": "Registration successful", "data": { "user": { "id": 5, "userName": "john.doe" } } }` |
| `POST /api/auth/login` | `{ "userName": "john.doe", "passwordHash": "a9993e36..." }` | `{ "success": true, "message": "Login successful", "data": { "token": "eyJhbGci...", "user": { "id": 1, "userName": "john.doe" } } }` |
| `GET /api/employees?page=1&limit=10` | — | `{ "success": true, "message": "Employees retrieved successfully", "data": { "employees": [...], "pagination": { "page": 1, "limit": 10, "total": 25, "totalPages": 3 } } }` |
| `POST /api/departments` | `{ "department": "Engineering", "hod": 3, "isActive": true }` | `{ "success": true, "message": "Department created successfully", "data": { "department": { "id": 1, "department": "Engineering", "hod": 3, "createdAt": "...", "createdBy": 1, "isActive": 1 } } }` |
| `GET /api/departments?page=1&limit=10` | — | `{ "success": true, "message": "Departments retrieved successfully", "data": { "departments": [{ "id": 1, "department": "Engineering", "isActive": 1 }], "pagination": { "page": 1, "limit": 10, "total": 5, "totalPages": 1 } } }` |
| `DELETE /api/departments/:id` | — | `{ "success": true, "message": "Department deleted successfully", "data": { "department": { "id": 1, "department": "Engineering", "isActive": 0 } } }` |
| `GET /api/users/search?q=john` | — | `{ "success": true, "message": "Users retrieved successfully", "data": { "users": [{ "userId": 1, "userName": "john.doe" }] } }` |

---

## Table of Contents

1. [Response Envelope](#response-envelope)
2. [Authentication](#authentication)
3. [Rate Limiting](#rate-limiting)
4. [API Endpoints](#api-endpoints)
   - [POST /auth/register](#post-authregister)
   - [POST /auth/login](#post-authlogin)
   - [GET /employees](#get-employees)
   - [POST /departments](#post-departments)
   - [GET /departments](#get-departments)
   - [DELETE /departments/:id](#delete-departmentsid)
   - [GET /users/search](#get-userssearch)
5. [Error Codes Reference](#error-codes-reference)
6. [Common Error Messages](#common-error-messages)
7. [Middleware Stack](#middleware-stack)

---

## Response Envelope

Every API response follows this standard JSON envelope:

```json
{
  "success": true | false,
  "message": "Human-readable message",
  "data": { ... },
  "errors": [
    { "field": "fieldName", "message": "Field-level error" }
  ]
}
```

- `data` is present on **success** responses.
- `errors` is present only on **validation failures** (400) and contains field-level details.

---

## Authentication

- Most endpoints require a **JWT access token** in the `Authorization` header.
- Format: `Authorization: Bearer <token>`
- The token is obtained from the `POST /auth/login` endpoint.
- The token payload contains: `{ userId, userName, role }`.
- Token expiry is configurable via `JWT_EXPIRES_IN` env var (default: `1h`).

### Auth Middleware Behaviour

| Scenario | HTTP Status | Message |
|---|---|---|
| No `Authorization` header | 401 | `Unauthorized request` |
| Header does not start with `Bearer ` | 401 | `Unauthorized request` |
| Empty token after `Bearer ` | 401 | `Unauthorized request` |
| Token is expired | 401 | `Token has expired` |
| Token is malformed / invalid signature | 401 | `Invalid token` |
| Valid token | 200 | `req.user` is populated with decoded payload |

---

## Rate Limiting

Two rate limiters are applied:

| Limiter | Scope | Window | Max Requests | Response |
|---|---|---|---|---|
| **Global** | All API routes | 15 min | 100 | `429` — `Too many requests, please try again later` |
| **Auth** | `/auth/*` routes only | 15 min | 20 | `429` — `Too many requests, please try again later` |

Rate limit headers (`RateLimit-*`, `Retry-After`) are included in responses.

---

## API Endpoints

### POST /auth/register

Register a new user account.

- **URL:** `/api/auth/register`
- **Method:** `POST`
- **Auth Required:** Yes (JWT Bearer token)
- **Rate Limited:** Yes (auth rate limiter)

#### Request Body

| Field | Type | Required | Constraints | Description |
|---|---|---|---|---|
| `userName` | string | Yes | Trimmed, 2–100 chars | Unique username for the new user |
| `password` | string | Yes | 8–72 chars | Plain-text password (hashed server-side with bcrypt) |

#### Example Request

```http
POST /api/auth/register HTTP/1.1
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

{
  "userName": "john.doe",
  "password": "securePass123"
}
```

#### Success Response

- **Status:** `201 Created`
- **Message:** `Registration successful`

```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": 5,
      "userName": "john.doe"
    }
  }
}
```

#### Error Responses

| Status | Condition | Message |
|---|---|---|
| `400` | Validation failed (missing fields, invalid lengths) | `Unexpected request` |
| `401` | Missing or invalid JWT token | `Unauthorized request` |
| `405` | Wrong HTTP method (e.g. GET, PUT) | `Wrong method` |
| `409` | Username already exists | `Username already exists` |
| `429` | Too many requests | `Too many requests, please try again later` |

#### Validation Errors Detail

When validation fails, the `errors` array contains field-level messages:

```json
{
  "success": false,
  "message": "Unexpected request",
  "errors": [
    { "field": "userName", "message": "\"userName\" is required" },
    { "field": "password", "message": "\"password\" must be at least 8 characters long" }
  ]
}
```

---

### POST /auth/login

Authenticate a user and receive a JWT access token.

- **URL:** `/api/auth/login`
- **Method:** `POST`
- **Auth Required:** No (public endpoint)
- **Rate Limited:** Yes (auth rate limiter)

#### Request Body

| Field | Type | Required | Constraints | Description |
|---|---|---|---|---|
| `userName` | string | Yes | Trimmed, 2–100 chars | The user's username |
| `passwordHash` | string | Yes | Non-empty | Client-side SHA-256 hash of the plain-text password |

> **Note:** The password is SHA-256 hashed on the client before sending. The server then bcrypt-compares this hash against the stored bcrypt hash.

#### Example Request

```http
POST /api/auth/login HTTP/1.1
Content-Type: application/json

{
  "userName": "john.doe",
  "passwordHash": "a9993e364706816aba3e25717850c26c9cd0d89d"
}
```

#### Success Response

- **Status:** `200 OK`
- **Message:** `Login successful`

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "userName": "john.doe"
    }
  }
}
```

#### Error Responses

| Status | Condition | Message |
|---|---|---|
| `400` | Validation failed (missing fields) | `Unexpected request` |
| `404` | User not found | `User does not exist` |
| `401` | Invalid credentials / account inactive | `Invalid username or password` |
| `423` | Account locked (5+ failed attempts) | `Account locked due to too many failed attempts. Try again in X minutes.` |
| `405` | Wrong HTTP method | `Wrong method` |
| `429` | Too many requests | `Too many requests, please try again later` |

#### Account Lockout Details

- **Threshold:** 5 consecutive failed login attempts
- **Lock duration:** 15 minutes
- After lockout, the error message includes remaining time: `Account locked due to too many failed attempts. Try again in 12 minutes.`
- Successful login resets the failed attempt counter.

---

### GET /employees

Retrieve a paginated list of employees (users) from the system.

- **URL:** `/api/employees`
- **Method:** `GET`
- **Auth Required:** Yes (JWT Bearer token)
- **Rate Limited:** No (uses global rate limiter only)

#### Query Parameters

| Parameter | Type | Required | Default | Constraints | Description |
|---|---|---|---|---|---|
| `page` | integer | No | `1` | Min: `1` | Page number to retrieve |
| `limit` | integer | No | `10` | Min: `1`, Max: `50` | Number of records per page |

#### Request Headers

| Header | Required | Description |
|---|---|---|
| `Authorization` | Yes | `Bearer <token>` |

#### Example Request

```http
GET /api/employees?page=1&limit=10 HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

#### Success Response

- **Status:** `200 OK`
- **Message:** `Employees retrieved successfully`

```json
{
  "success": true,
  "message": "Employees retrieved successfully",
  "data": {
    "employees": [
      {
        "userId": 1,
        "userName": "john.doe",
        "role": "admin",
        "isActive": 1
      },
      {
        "userId": 2,
        "userName": "jane.smith",
        "role": "employee",
        "isActive": 0
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  }
}
```

#### Error Responses

| Status | Condition | Message |
|---|---|---|
| `400` | Invalid query parameters (e.g. negative page) | `Unexpected request` |
| `401` | Missing or invalid JWT token | `Unauthorized request` |
| `405` | Wrong HTTP method (e.g. POST, PUT) | `Wrong method` |
| `429` | Too many requests | `Too many requests, please try again later` |

---

### POST /departments

Create a new department.

- **URL:** `/api/departments`
- **Method:** `POST`
- **Auth Required:** Yes (JWT Bearer token)
- **Rate Limited:** Yes (auth rate limiter)

#### Request Body

| Field | Type | Required | Constraints | Description |
|---|---|---|---|---|
| `department` | string | Yes | Trimmed, 1–200 chars | Name of the department |
| `hod` | integer | No | Positive integer, must be a valid userId | UserId of the Head of Department |
| `isActive` | boolean | No | Default: `true` | Whether the department is active |

#### Example Request

```http
POST /api/departments HTTP/1.1
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

{
  "department": "Engineering",
  "hod": 3,
  "isActive": true
}
```

#### Success Response

- **Status:** `201 Created`
- **Message:** `Department created successfully`

```json
{
  "success": true,
  "message": "Department created successfully",
  "data": {
    "department": {
      "id": 1,
      "department": "Engineering",
      "hod": 3,
      "createdAt": "2026-08-26T10:30:00.000Z",
      "createdBy": 1,
      "isActive": 1
    }
  }
}
```

#### Error Responses

| Status | Condition | Message |
|---|---|---|
| `400` | Validation failed (missing department, invalid hod) | `Unexpected request` |
| `401` | Missing or invalid JWT token | `Unauthorized request` |
| `405` | Wrong HTTP method (e.g. GET, PUT) | `Wrong method` |
| `429` | Too many requests | `Too many requests, please try again later` |

---

### GET /departments

Retrieve a paginated list of departments.

- **URL:** `/api/departments`
- **Method:** `GET`
- **Auth Required:** Yes (JWT Bearer token)
- **Rate Limited:** No (uses global rate limiter only)

#### Query Parameters

| Parameter | Type | Required | Default | Constraints | Description |
|---|---|---|---|---|---|
| `page` | integer | No | `1` | Min: `1` | Page number to retrieve |
| `limit` | integer | No | `10` | Min: `1`, Max: `50` | Number of records per page |

#### Request Headers

| Header | Required | Description |
|---|---|---|
| `Authorization` | Yes | `Bearer <token>` |

#### Example Request

```http
GET /api/departments?page=1&limit=10 HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

#### Success Response

- **Status:** `200 OK`
- **Message:** `Departments retrieved successfully`

```json
{
  "success": true,
  "message": "Departments retrieved successfully",
  "data": {
    "departments": [
      {
        "id": 1,
        "department": "Engineering",
        "isActive": 1
      },
      {
        "id": 2,
        "department": "Marketing",
        "isActive": 1
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 5,
      "totalPages": 1
    }
  }
}
```

#### Error Responses

| Status | Condition | Message |
|---|---|---|
| `400` | Invalid query parameters (e.g. negative page) | `Unexpected request` |
| `401` | Missing or invalid JWT token | `Unauthorized request` |
| `405` | Wrong HTTP method (e.g. POST, PUT) | `Wrong method` |
| `429` | Too many requests | `Too many requests, please try again later` |

---

### DELETE /departments/:id

Soft-delete a department by setting its `IsActive` status to `0`.

- **URL:** `/api/departments/:id`
- **Method:** `DELETE`
- **Auth Required:** Yes (JWT Bearer token)
- **Rate Limited:** No (uses global rate limiter only)

#### Path Parameters

| Parameter | Type | Required | Constraints | Description |
|---|---|---|---|---|
| `id` | integer | Yes | Positive integer | ID of the department to delete |

#### Request Headers

| Header | Required | Description |
|---|---|---|
| `Authorization` | Yes | `Bearer <token>` |

#### Example Request

```http
DELETE /api/departments/1 HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

#### Success Response

- **Status:** `200 OK`
- **Message:** `Department deleted successfully`

```json
{
  "success": true,
  "message": "Department deleted successfully",
  "data": {
    "department": {
      "id": 1,
      "department": "Engineering",
      "isActive": 0
    }
  }
}
```

#### Error Responses

| Status | Condition | Message |
|---|---|---|
| `400` | Invalid ID parameter (e.g. non-numeric) | `Unexpected request` |
| `401` | Missing or invalid JWT token | `Unauthorized request` |
| `404` | Department not found | `Not found` |
| `405` | Wrong HTTP method (e.g. POST, GET) | `Wrong method` |
| `429` | Too many requests | `Too many requests, please try again later` |

---

### GET /users/search

Search users by userName for autocomplete. Returns up to 5 matching active users.

- **URL:** `/api/users/search`
- **Method:** `GET`
- **Auth Required:** Yes (JWT Bearer token)
- **Rate Limited:** No (uses global rate limiter only)

#### Query Parameters

| Parameter | Type | Required | Constraints | Description |
|---|---|---|---|---|
| `q` | string | Yes | Trimmed, 1–100 chars | Search term to match against userName (LIKE) |

#### Request Headers

| Header | Required | Description |
|---|---|---|
| `Authorization` | Yes | `Bearer <token>` |

#### Example Request

```http
GET /api/users/search?q=john HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

#### Success Response

- **Status:** `200 OK`
- **Message:** `Users retrieved successfully`

```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": {
    "users": [
      {
        "userId": 1,
        "userName": "john.doe"
      },
      {
        "userId": 3,
        "userName": "johnny"
      }
    ]
  }
}
```

#### Error Responses

| Status | Condition | Message |
|---|---|---|
| `400` | Invalid query parameters (missing `q`) | `Unexpected request` |
| `401` | Missing or invalid JWT token | `Unauthorized request` |
| `405` | Wrong HTTP method (e.g. POST, PUT) | `Wrong method` |
| `429` | Too many requests | `Too many requests, please try again later` |

---

## Error Codes Reference

| HTTP Status | Constant | When Used |
|---|---|---|
| `400` | `BAD_REQUEST` | Validation errors, malformed JSON |
| `401` | `UNAUTHORIZED` | Missing/invalid/expired JWT, invalid credentials |
| `403` | `FORBIDDEN` | Authenticated but not authorized |
| `404` | `NOT_FOUND` | Route not found, resource not found |
| `405` | `METHOD_NOT_ALLOWED` | Wrong HTTP method on a route |
| `409` | `CONFLICT` | Duplicate resource (e.g. username exists) |
| `423` | `LOCKED` | Account locked due to failed attempts |
| `429` | `TOO_MANY_REQUESTS` | Rate limit exceeded |
| `500` | `INTERNAL_SERVER_SERVER` | Unhandled server errors |

---

## Common Error Messages

All messages are centralized in `src/constants/messages.js`. **Never hardcode error messages** — always use the `MESSAGES` constants.

| Constant | Value | Used For |
|---|---|---|
| `UNEXPECTED_REQUEST` | `Unexpected request` | Validation errors, wrong payload |
| `WRONG_METHOD` | `Wrong method` | Wrong HTTP method (405) |
| `UNAUTHORIZED` | `Unauthorized request` | Missing/invalid token (401) |
| `FORBIDDEN` | `Forbidden` | Insufficient permissions (403) |
| `NOT_FOUND` | `Not found` | Route/resource not found (404) |
| `CONFLICT` | `Conflict` | Generic conflict (409) |
| `USER_NOT_FOUND` | `User does not exist` | Login with non-existent user |
| `INVALID_CREDENTIALS` | `Invalid username or password` | Wrong password or inactive account |
| `ACCOUNT_LOCKED` | `Account locked due to too many failed attempts` | Too many failed logins |
| `USERNAME_EXISTS` | `Username already exists` | Duplicate registration |
| `TOKEN_EXPIRED` | `Token has expired` | Expired JWT |
| `INVALID_TOKEN` | `Invalid token` | Malformed JWT |
| `TOO_MANY_REQUESTS` | `Too many requests, please try again later` | Rate limit exceeded |
| `REGISTER_SUCCESS` | `Registration successful` | Successful registration |
| `LOGIN_SUCCESS` | `Login successful` | Successful login |
| `DEPARTMENT_CREATED` | `Department created successfully` | Successful department creation |
| `DEPARTMENTS_RETRIEVED` | `Departments retrieved successfully` | Successful departments retrieval |
| `DEPARTMENT_DELETED` | `Department deleted successfully` | Successful department deletion |
| `INTERNAL_SERVER_ERROR` | `Internal server error` | Unhandled errors (500) |

---

## Middleware Stack

Every route follows this middleware chain (in order):

```
1. Rate Limiter        — 429 if exceeded
2. authenticate        — 401 if no/invalid token (skipped for public routes)
3. validate(schema)    — 400 if payload fails Joi validation
4. Controller          — Route handler
5. wrongMethod()       — 405 if wrong HTTP method (registered as router.all after the route)
```

### Route Registration Pattern

Every new route **must** follow this pattern:

```js
import { validate, authenticate, wrongMethod, authRateLimiter } from "../middlewares/index.js";
import { yourValidators } from "../validators/index.js";
import { yourController } from "../controllers/index.js";

router.post(
  "/your-endpoint",
  authRateLimiter,            // 1. Rate limit
  authenticate,               // 2. JWT auth (skip for public routes)
  validate(yourSchema),       // 3. Payload validation
  yourController.method,      // 4. Handler
);

router.all("/your-endpoint", wrongMethod(["POST"])); // 5. Wrong method catch
```

---

## Frontend Integration

The frontend API client (`src/api/client.ts`) provides typed helpers:

```typescript
import { api } from "@/api/client";
import { API_ENDPOINTS } from "@/config/endpoints";

// POST request
const data = await api.post<RegisterResponse>(API_ENDPOINTS.REGISTER, {
  userName,
  password,
});

// GET with pagination
const result = await api.get<EmployeesResponse>(API_ENDPOINTS.GET_EMPLOYEES, {
  page: 1,
  limit: 10,
});

// Error handling
try {
  await api.post(API_ENDPOINTS.LOGIN, payload);
} catch (err) {
  if (err instanceof ApiError) {
    console.log(err.status);  // 401, 404, 409, etc.
    console.log(err.message); // Human-readable message
    console.log(err.errors);  // Field-level validation errors
  }
}
```

### Endpoint Constants

Defined in `src/config/endpoints.ts`:

```typescript
export const API_ENDPOINTS = {
  REGISTER: "/auth/register",
  LOGIN: "/auth/login",
  GET_EMPLOYEES: "/employees",
  CREATE_DEPARTMENT: "/departments",
} as const;
```

---

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `5000` | Server port |
| `API_PREFIX` | `/api` | URL prefix for all routes |
| `JWT_SECRET` | `change-me-in-production` | Secret for signing JWTs |
| `JWT_EXPIRES_IN` | `1h` | Token expiry duration |
| `RATE_LIMIT_WINDOW_MS` | `900000` (15 min) | Global rate limit window |
| `RATE_LIMIT_MAX` | `100` | Max requests per global window |
| `AUTH_RATE_LIMIT_WINDOW_MS` | `900000` (15 min) | Auth rate limit window |
| `AUTH_RATE_LIMIT_MAX` | `20` | Max requests per auth window |
| `SQL_SERVER` | `localhost\SQLEXPRESS` | SQL Server address |
| `SQL_DATABASE` | `HRMS` | Database name |
| `SQL_PORT` | `1433` | SQL Server port |
| `CLIENT_ORIGIN` | `http://localhost:5173` | Allowed CORS origin(s) |
