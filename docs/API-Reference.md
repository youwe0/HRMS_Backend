# HRMS API Reference

> **Base URL:** `http://localhost:5000/api`
> **Content-Type:** `application/json`
> **Last Updated:** 2026-09-05 (Permissions module — RBAC)

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
| `GET /api/users/search?q=john&searchFor=user` | — | `{ "success": true, "message": "Search results retrieved successfully", "data": { "results": [{ "id": 1, "label": "john.doe" }], "users": [{ "userId": 1, "userName": "john.doe" }] } }` |
| `POST /api/designations` | `{ "designation": "Senior Engineer", "isActive": true }` | `{ "success": true, "message": "Designation created successfully", "data": { "designation": { "id": 1, "designation": "Senior Engineer", "createdAt": "...", "createdBy": 1, "isActive": 1 } } }` |
| `GET /api/designations?page=1&limit=10` | — | `{ "success": true, "message": "Designations retrieved successfully", "data": { "designations": [{ "id": 1, "designation": "Senior Engineer", "isActive": 1 }], "pagination": { "page": 1, "limit": 10, "total": 5, "totalPages": 1 } } }` |
| `DELETE /api/designations/:id` | — | `{ "success": true, "message": "Designation deleted successfully", "data": { "designation": { "id": 1, "designation": "Senior Engineer", "isActive": 0 } } }` |
| `GET /api/resource-bundle` | — | `{ "success": true, "message": "Resource bundle retrieved successfully", "data": { "Blood_group": ["A+", "A-", ...], "Gender": ["Male", "Female", "Other"], "Employee_type": ["Permanent", "Probation", ...], "HolidayBasedOnType": ["State", "City", "Zone"] } }` |
| `POST /api/leave-types` | `{ "leaveName": "Annual Leave", "leaveCode": "AL", "applicableFor": "All employees" }` | `{ "success": true, "message": "Leave type created successfully", "data": { "leaveType": { "id": 1, "leaveName": "Annual Leave", "leaveCode": "AL", "applicableFor": "All employees", "createdBy": 1, "createdAt": "..." } } }` |
| `GET /api/leave-types?page=1&limit=10` | — | `{ "success": true, "message": "Leave types retrieved successfully", "data": { "leaveTypes": [{ "id": 1, "leaveName": "Annual Leave", "leaveCode": "AL" }], "pagination": { "page": 1, "limit": 10, "total": 5, "totalPages": 1 } } }` |
| `DELETE /api/leave-types/:id` | — | `{ "success": true, "message": "Leave type deleted successfully", "data": { "leaveType": { "id": 1, "leaveName": "Annual Leave", "leaveCode": "AL" } } }` |
| `GET /api/userDetail/:section` | — | `{ "success": true, "message": "...", "data": { "<sectionData>": { ... } } }` || `PUT /api/userDetail/:userId/:section` | `{ "employeeCode": "EC001", "department": "Engineering", "designation": "Senior Engineer", "dateOfJoining": "2024-01-15" }` | `{ "success": true, "message": "Employment details updated successfully", "data": { "employmentDetails": { ... } } }` |
| `POST /api/company-master-config` | `{ "moduleName": "Holiday_Based_On_Type", "basedOn": "State" }` | `{ "success": true, "message": "Company master config saved successfully", "data": { "config": { "id": 1, "moduleName": "Holiday_Based_On_Type", "basedOn": "State", ... } } }` |
| `GET /api/company-master-config` | — | `{ "success": true, "message": "Company master config retrieved successfully", "data": { "configs": [...] } }` |
| `POST /api/attendance/:userId` | `{ "clockTime": "2026-09-02T09:00:00.000Z" }` | `{ "success": true, "message": "Clock-in recorded successfully", "data": { "attendance": { "employeeCode": "EC001", "attendanceDate": "...", "clockIn": "...", "clockOut": null } } }` |
| `GET /api/attendance/:userId?fromDate=2026-09-01&toDate=2026-09-30` | — | `{ "success": true, "message": "Attendance retrieved successfully", "data": { "attendance": [...] } }` |
| `POST /api/permissions` | `{ "permissions": [{ "code": "employees.view", "name": "View Employees", "type": "button", "module": "employees" }] }` | `{ "success": true, "message": "Permissions synced successfully", "data": { "created": 1, "updated": 0 } }` |
| `GET /api/permissions?page=1&limit=50` | — | `{ "success": true, "message": "Permissions retrieved successfully", "data": { "permissions": [...], "pagination": { ... } } }` |



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
   - [POST /designations](#post-designations)
   - [GET /designations](#get-designations)
   - [DELETE /designations/:id](#delete-designationsid)
   - [GET /users/search](#get-userssearch)
   - [GET /resource-bundle](#get-resource-bundle)
   - [POST /leave-types](#post-leave-types)
   - [GET /leave-types](#get-leave-types)
   - [DELETE /leave-types/:id](#delete-leave-typesid)
   - [GET /userDetail/:section](#get-userdetailsection)
   - [PUT /userDetail/:userId/:section](#put-userdetailuseridsection)
   - [POST /company-master-config](#post-company-master-config)
   - [GET /company-master-config](#get-company-master-config)
   - [POST /attendance/:userId](#post-attendanceuserid)
   - [GET /attendance/:userId](#get-attendanceuserid)
   - [POST /permissions](#post-permissions)
   - [GET /permissions](#get-permissions)
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

### POST /designations

Create a new designation.

- **URL:** `/api/designations`
- **Method:** `POST`
- **Auth Required:** Yes (JWT Bearer token)
- **Rate Limited:** Yes (auth rate limiter)

#### Request Body

| Field | Type | Required | Constraints | Description |
|---|---|---|---|---|
| `designation` | string | Yes | Trimmed, 1–200 chars | Name of the designation |
| `isActive` | boolean | No | Default: `true` | Whether the designation is active |

#### Example Request

```http
POST /api/designations HTTP/1.1
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

{
  "designation": "Senior Engineer",
  "isActive": true
}
```

#### Success Response

- **Status:** `201 Created`
- **Message:** `Designation created successfully`

```json
{
  "success": true,
  "message": "Designation created successfully",
  "data": {
    "designation": {
      "id": 1,
      "designation": "Senior Engineer",
      "createdAt": "2026-08-27T10:30:00.000Z",
      "createdBy": 1,
      "isActive": 1
    }
  }
}
```

#### Error Responses

| Status | Condition | Message |
|---|---|---|
| `400` | Validation failed (missing designation) | `Unexpected request` |
| `401` | Missing or invalid JWT token | `Unauthorized request` |
| `405` | Wrong HTTP method (e.g. GET, PUT) | `Wrong method` |
| `429` | Too many requests | `Too many requests, please try again later` |

---

### GET /designations

Retrieve a paginated list of designations.

- **URL:** `/api/designations`
- **Method:** `GET`
- **Auth Required:** Yes (JWT Bearer token)
- **Rate Limited:** No (uses global rate limiter only)

#### Query Parameters

| Parameter | Type | Required | Constraints | Description |
|---|---|---|---|---|
| `page` | integer | No | `1` | Min: `1` | Page number to retrieve |
| `limit` | integer | No | `10` | Min: `1`, Max: `50` | Number of records per page |

#### Example Request

```http
GET /api/designations?page=1&limit=10 HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

#### Success Response

- **Status:** `200 OK`
- **Message:** `Designations retrieved successfully`

```json
{
  "success": true,
  "message": "Designations retrieved successfully",
  "data": {
    "designations": [
      {
        "id": 1,
        "designation": "Senior Engineer",
        "isActive": 1
      },
      {
        "id": 2,
        "designation": "Manager",
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

### DELETE /designations/:id

Soft-delete a designation by setting its `IsActive` status to `0`.

- **URL:** `/api/designations/:id`
- **Method:** `DELETE`
- **Auth Required:** Yes (JWT Bearer token)
- **Rate Limited:** No (uses global rate limiter only)

#### Path Parameters

| Parameter | Type | Required | Constraints | Description |
|---|---|---|---|---|
| `id` | integer | Yes | Positive integer | ID of the designation to delete |

#### Example Request

```http
DELETE /api/designations/1 HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

#### Success Response

- **Status:** `200 OK`
- **Message:** `Designation deleted successfully`

```json
{
  "success": true,
  "message": "Designation deleted successfully",
  "data": {
    "designation": {
      "id": 1,
      "designation": "Senior Engineer",
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
| `404` | Designation not found | `Not found` |
| `405` | Wrong HTTP method (e.g. POST, GET) | `Wrong method` |
| `429` | Too many requests | `Too many requests, please try again later` |

---

### GET /users/search

Generalized entity search for autocomplete. Supports searching across users, departments, and designations. Returns up to 5 matching active records.

- **URL:** `/api/users/search`
- **Method:** `GET`
- **Auth Required:** Yes (JWT Bearer token)
- **Rate Limited:** No (uses global rate limiter only)

#### Query Parameters

| Parameter | Type | Required | Default | Constraints | Description |
|---|---|---|---|---|---|
| `q` | string | Yes | — | Trimmed, 1–100 chars | Search term (LIKE match against the entity's name/title) |
| `searchFor` | string | No | `"user"` | One of: `user`, `department`, `designation` | Entity type to search |

#### Request Headers

| Header | Required | Description |
|---|---|---|
| `Authorization` | Yes | `Bearer <token>` |

#### Example Request — User Search

```http
GET /api/users/search?q=john&searchFor=user HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

#### Example Request — Department Search

```http
GET /api/users/search?q=eng&searchFor=department HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

#### Example Request — Designation Search

```http
GET /api/users/search?q=senior&searchFor=designation HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

#### Success Response (user search)

- **Status:** `200 OK`
- **Message:** `Search results retrieved successfully`

```json
{
  "success": true,
  "message": "Search results retrieved successfully",
  "data": {
    "results": [
      { "id": 1, "label": "john.doe" },
      { "id": 3, "label": "johnny" }
    ],
    "users": [
      { "userId": 1, "userName": "john.doe" },
      { "userId": 3, "userName": "johnny" }
    ]
  }
}
```

#### Success Response (department search)

```json
{
  "success": true,
  "message": "Search results retrieved successfully",
  "data": {
    "results": [
      { "id": 1, "label": "Engineering" },
      { "id": 5, "label": "Engineering Support" }
    ],
    "users": []
  }
}
```

#### Success Response (designation search)

```json
{
  "success": true,
  "message": "Search results retrieved successfully",
  "data": {
    "results": [
      { "id": 2, "label": "Senior Engineer" },
      { "id": 7, "label": "Senior Manager" }
    ],
    "users": []
  }
}
```

#### Response Fields

| Field | Type | Description |
|---|---|---| 
| `results` | `Array<{ id: number, label: string, sublabel?: string }>` | Generic search results — use `id` and `label` for any entity type |
| `users` | `Array<{ userId: number, userName: string }>` | Legacy user-specific results (populated only when `searchFor=user`), kept for backward compatibility |

#### Error Responses

| Status | Condition | Message |
|---|---|---|
| `400` | Invalid query parameters (missing `q`, invalid `searchFor`) | `Unexpected request` |
| `401` | Missing or invalid JWT token | `Unauthorized request` |
| `405` | Wrong HTTP method (e.g. POST, PUT) | `Wrong method` |
| `429` | Too many requests | `Too many requests, please try again later` |

---

### GET /userDetail/:section

A **single parameterized endpoint** that returns user detail data based on the `:section` path parameter. New sections (contact, education, etc.) are added by registering a handler in the controller — no new routes needed.

- **URL:** `/api/userDetail/:section`
- **Method:** `GET`
- **Auth Required:** Yes (JWT Bearer token)
- **Rate Limited:** No (uses global rate limiter only)

> The user ID is extracted from the JWT token payload — no request body or query params needed.

#### Path Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `section` | string | Yes | The detail section to retrieve. Currently supported: `employment-details` |

#### Request Headers

| Header | Required | Description |
|---|---|---|
| `Authorization` | Yes | `Bearer <token>` |

#### Example Request — Employment Details

```http
GET /api/userDetail/employment-details HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

#### Success Response (employment-details)

- **Status:** `200 OK`
- **Message:** `Employment details retrieved successfully`

```json
{
  "success": true,
  "message": "Employment details retrieved successfully",
  "data": {
    "employmentDetails": {
      "employeeCode": "EC001",
      "department": "Engineering",
      "designation": "Senior Engineer",
      "dateOfJoining": "2024-01-15"
    }
  }
}
```

#### Response Fields (employment-details)

| Field | Type | Description |
|---|---|---|
| `employmentDetails.employeeCode` | string | Unique employee code (e.g. `"EC001"`) |
| `employmentDetails.department` | string | Department name |
| `employmentDetails.designation` | string | Designation / job title |
| `employmentDetails.dateOfJoining` | string | Date of joining (ISO 8601 date) |

#### Adding a New Section

1. Create a service in `src/modules/<section>/<section>.service.js` with a `getByUserId({ userId })` method.
2. Register it in the `sections` map in `src/modules/userDetail/userDetail.controller.js`:
   ```js
   import * as contactDetailsService from "../contactDetails/contactDetails.service.js";
   // ... then in the sections map:
   "contact-details": {
     fetch: (userId) => contactDetailsService.getContactDetailsByUserId({ userId }),
     dataKey: "contactDetails",
     message: MESSAGES.CONTACT_DETAILS_RETRIEVED,
   },
   ```
3. Add the message constant to `src/shared/constants/messages.js`.
4. That's it — no new routes, no new controller files.

#### Error Responses

| Status | Condition | Message |
|---|---|---|
| `401` | Missing or invalid JWT token | `Unauthorized request` |
| `404` | Unknown section name | `Unknown section: "xyz". Valid sections: employment-details` |
| `404` | No data found for the section | `<dataKey> not found for this user` |
| `405` | Wrong HTTP method (e.g. POST, PUT) | `Wrong method` |
| `429` | Too many requests | `Too many requests, please try again later` |

---

### PUT /userDetail/:userId/:section

A **parameterized upsert endpoint** that creates or updates user detail data based on the `:section` path parameter. New sections are added by registering an upsert handler in the controller.

- **URL:** `/api/userDetail/:userId/:section`
- **Method:** `PUT`
- **Auth Required:** Yes (JWT Bearer token)
- **Rate Limited:** No (uses global rate limiter only)

> The `:userId` identifies the target user. The `:section` determines which table to update. If a record exists for the userId, it is updated; otherwise a new record is inserted.

#### Path Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `userId` | integer | Yes | The ID of the target user (positive integer) |
| `section` | string | Yes | The detail section to update. Currently supported: `employment-details` |

#### Request Headers

| Header | Required | Description |
|---|---|---|
| `Authorization` | Yes | `Bearer <token>` |

#### Request Body — employment-details

| Field | Type | Required | Constraints | Description |
|---|---|---|---|---|
| `employeeCode` | string | Yes | Trimmed, 1–20 chars, unique | Unique employee code (e.g. `"EC001"`) |
| `department` | string | Yes | Trimmed, 1–200 chars | Department name |
| `designation` | string | Yes | Trimmed, 1–200 chars | Designation / job title |
| `dateOfJoining` | string | Yes | ISO 8601 date | Date of joining |
| `createdBy` | integer | No | Positive integer | Defaults to the authenticated user's ID |

#### Example Request — Employment Details

```http
PUT /api/userDetail/1/employment-details HTTP/1.1
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

{
  "employeeCode": "EC001",
  "department": "Engineering",
  "designation": "Senior Engineer",
  "dateOfJoining": "2024-01-15"
}
```

#### Success Response (employment-details)

- **Status:** `200 OK`
- **Message:** `Employment details updated successfully`

```json
{
  "success": true,
  "message": "Employment details updated successfully",
  "data": {
    "employmentDetails": {
      "id": 1,
      "userId": 1,
      "employeeCode": "EC001",
      "department": "Engineering",
      "designation": "Senior Engineer",
      "dateOfJoining": "2024-01-15",
      "createdBy": 1,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

#### Adding a New Update Section

1. Create an upsert method in `src/modules/<section>/<section>.service.js` with an `upsert({ userId, data, createdBy })` signature.
2. Register it in the `updateSections` map in `src/modules/userDetail/userDetail.controller.js`:
   ```js
   import * as contactDetailsService from "../contactDetails/contactDetails.service.js";
   // ... then in the updateSections map:
   "contact-details": {
     upsert: (userId, data, createdBy) =>
       contactDetailsService.upsertContactDetails({ userId, data, createdBy }),
     dataKey: "contactDetails",
     message: MESSAGES.CONTACT_DETAILS_UPDATED,
   },
   ```
3. Add a Joi validation schema in the corresponding module's validator file.
4. Import and use the schema in `src/modules/userDetail/userDetail.routes.js`.
5. Add the message constant to `src/shared/constants/messages.js`.

#### Error Responses

| Status | Condition | Message |
|---|---|---|
| `400` | Invalid userId (non-numeric, negative) | `Invalid userId: "xyz". Must be a positive integer.` |
| `400` | Validation failed (missing required fields) | `Unexpected request` |
| `401` | Missing or invalid JWT token | `Unauthorized request` |
| `404` | Unknown section name | `Unknown section: "xyz". Valid sections: employment-details` |
| `405` | Wrong HTTP method (e.g. GET, POST) | `Wrong method` |
| `409` | Duplicate EmployeeCode for a different user | `Conflict` |
| `429` | Too many requests | `Too many requests, please try again later` |

---

### POST /company-master-config

Upsert a CompanyMasterConfig record. If a record with the same `moduleName` already exists and is active, its `basedOn` value is updated; otherwise a new record is created.

- **URL:** `/api/company-master-config`
- **Method:** `POST`
- **Auth Required:** Yes (JWT Bearer token)
- **Rate Limited:** Yes (auth rate limiter)

#### Request Body

| Field | Type | Required | Constraints | Description |
|---|---|---|---|---|
| `moduleName` | string | Yes | Trimmed, 1–200 chars | Name of the module (e.g. `"Holiday_Based_On_Type"`) |
| `basedOn` | string | Yes | Trimmed, 1–200 chars | The selected value (e.g. `"State"`, `"City"`, `"Zone"`) |

#### Example Request

```http
POST /api/company-master-config HTTP/1.1
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

{
  "moduleName": "Holiday_Based_On_Type",
  "basedOn": "State"
}
```

#### Success Response

- **Status:** `201 Created`
- **Message:** `Company master config saved successfully`

```json
{
  "success": true,
  "message": "Company master config saved successfully",
  "data": {
    "config": {
      "id": 1,
      "moduleName": "Holiday_Based_On_Type",
      "basedOn": "State",
      "createdBy": 1,
      "createdAt": "2026-09-02T10:00:00.000Z",
      "isActive": 1
    }
  }
}
```

#### Error Responses

| Status | Condition | Message |
|---|---|---|
| `400` | Validation failed (missing moduleName or basedOn) | `Unexpected request` |
| `401` | Missing or invalid JWT token | `Unauthorized request` |
| `405` | Wrong HTTP method (e.g. GET, PUT) | `Wrong method` |
| `429` | Too many requests | `Too many requests, please try again later` |

---

### GET /company-master-config

Retrieve all active CompanyMasterConfig records.

- **URL:** `/api/company-master-config`
- **Method:** `GET`
- **Auth Required:** Yes (JWT Bearer token)
- **Rate Limited:** No (uses global rate limiter only)

#### Example Request

```http
GET /api/company-master-config HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

#### Success Response

- **Status:** `200 OK`
- **Message:** `Company master config retrieved successfully`

```json
{
  "success": true,
  "message": "Company master config retrieved successfully",
  "data": {
    "configs": [
      {
        "id": 1,
        "moduleName": "Holiday_Based_On_Type",
        "basedOn": "State",
        "createdBy": 1,
        "createdAt": "2026-09-02T10:00:00.000Z",
        "isActive": 1
      }
    ]
  }
}
```

#### Error Responses

| Status | Condition | Message |
|---|---|---|
| `401` | Missing or invalid JWT token | `Unauthorized request` |
| `405` | Wrong HTTP method (e.g. POST, PUT) | `Wrong method` |
| `429` | Too many requests | `Too many requests, please try again later` |

---

### POST /attendance/:userId

Record a clock-in or clock-out event for the authenticated user.

- **URL:** `/api/attendance/:userId`
- **Method:** `POST`
- **Auth Required:** Yes (JWT Bearer token)
- **Rate Limited:** Yes (auth rate limiter)

#### Path Parameters

| Parameter | Type | Required | Constraints | Description |
|---|---|---|---|---|
| `userId` | integer | Yes | Positive integer | The user ID (must match the JWT owner) |

#### Request Body

| Field | Type | Required | Constraints | Description |
|---|---|---|---|---|
| `clockTime` | string | Yes | ISO 8601 datetime | The timestamp of the clock event |

#### Example Request

```http
POST /api/attendance/1 HTTP/1.1
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

{
  "clockTime": "2026-09-02T09:00:00.000Z"
}
```

#### Success Response — Clock In

- **Status:** `200 OK`
- **Message:** `Clock-in recorded successfully`

```json
{
  "success": true,
  "message": "Clock-in recorded successfully",
  "data": {
    "attendance": {
      "employeeCode": "EC001",
      "attendanceDate": "2026-09-02T00:00:00.000Z",
      "clockIn": "2026-09-02T09:00:00.000Z",
      "clockOut": null,
      "status": null
    }
  }
}
```

#### Success Response — Clock Out

- **Status:** `200 OK`
- **Message:** `Clock-out recorded successfully`

```json
{
  "success": true,
  "message": "Clock-out recorded successfully",
  "data": {
    "attendance": {
      "employeeCode": "EC001",
      "attendanceDate": "2026-09-02T00:00:00.000Z",
      "clockIn": "2026-09-02T09:00:00.000Z",
      "clockOut": "2026-09-02T17:30:00.000Z",
      "status": null
    }
  }
}
```

#### Error Responses

| Status | Condition | Message |
|---|---|---|
| `400` | Validation failed (missing clockTime, invalid userId) | `Unexpected request` |
| `401` | Missing or invalid JWT token | `Unauthorized request` |
| `404` | No employment details found for the user | `Employment details not found for this user` |
| `405` | Wrong HTTP method (e.g. GET, PUT) | `Wrong method` |
| `409` | Attendance already completed for today | `Attendance completed, try tomorrow` |
| `429` | Too many requests | `Too many requests, please try again later` |

---

### GET /attendance/:userId

Retrieve attendance records for a user within a date range.

- **URL:** `/api/attendance/:userId`
- **Method:** `GET`
- **Auth Required:** Yes (JWT Bearer token)
- **Rate Limited:** No (uses global rate limiter only)

#### Path Parameters

| Parameter | Type | Required | Constraints | Description |
|---|---|---|---|---|
| `userId` | integer | Yes | Positive integer | The user ID |

#### Query Parameters

| Parameter | Type | Required | Constraints | Description |
|---|---|---|---|---|
| `fromDate` | string | Yes | ISO 8601 date | Start date (YYYY-MM-DD) |
| `toDate` | string | Yes | ISO 8601 date | End date (YYYY-MM-DD) |

#### Example Request

```http
GET /api/attendance/1?fromDate=2026-09-01&toDate=2026-09-30 HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

#### Success Response

- **Status:** `200 OK`
- **Message:** `Attendance retrieved successfully`

```json
{
  "success": true,
  "message": "Attendance retrieved successfully",
  "data": {
    "attendance": [
      {
        "employeeCode": "EC001",
        "attendanceDate": "2026-09-02T00:00:00.000Z",
        "shift": null,
        "clockIn": "2026-09-02T09:00:00.000Z",
        "clockOut": "2026-09-02T17:30:00.000Z",
        "status": null,
        "isActive": 1,
        "createdAt": "2026-09-02T09:00:00.000Z"
      },
      {
        "employeeCode": "EC001",
        "attendanceDate": "2026-09-01T00:00:00.000Z",
        "shift": null,
        "clockIn": "2026-09-01T08:55:00.000Z",
        "clockOut": "2026-09-01T17:25:00.000Z",
        "status": null,
        "isActive": 1,
        "createdAt": "2026-09-01T08:55:00.000Z"
      }
    ]
  }
}
```

#### Error Responses

| Status | Condition | Message |
|---|---|---|
| `400` | Validation failed (missing fromDate/toDate, invalid userId) | `Unexpected request` |
| `401` | Missing or invalid JWT token | `Unauthorized request` |
| `405` | Wrong HTTP method (e.g. POST, PUT) | `Wrong method` |
| `429` | Too many requests | `Too many requests, please try again later` |

---

### POST /permissions

Bulk-sync permissions. Inserts new permissions and updates existing ones (matched by Code).

- **URL:** `/api/permissions`
- **Method:** `POST`
- **Auth Required:** Yes (JWT Bearer token)
- **Rate Limited:** Yes (auth rate limiter)

#### Request Body

| Field | Type | Required | Constraints | Description |
|---|---|---|---|---|
| `permissions` | array | Yes | Min 1 item | Array of permission objects |
| `permissions[].code` | string | Yes | Trimmed, 1–150 chars, unique | Permission code (e.g. `employees.view`) |
| `permissions[].name` | string | Yes | Trimmed, 1–200 chars | Human label (e.g. "View Employees") |
| `permissions[].type` | string | Yes | One of: `module`, `page`, `section`, `button` | Permission type |
| `permissions[].module` | string | Yes | Trimmed, 1–50 chars | Top-level module grouping |
| `permissions[].parentCode` | string | No | Trimmed, max 150 chars, nullable | Parent permission code (self-reference) |
| `permissions[].isActive` | boolean | No | Default: `true` | Whether the permission is active |

#### Example Request

```http
POST /api/permissions HTTP/1.1
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

{
  "permissions": [
    {
      "code": "employees.module",
      "name": "Employees Module",
      "type": "module",
      "module": "employees",
      "parentCode": null
    },
    {
      "code": "employees.page",
      "name": "Employees Page",
      "type": "page",
      "module": "employees",
      "parentCode": "employees.module"
    },
    {
      "code": "employees.button.view",
      "name": "View Employees",
      "type": "button",
      "module": "employees",
      "parentCode": "employees.page"
    }
  ]
}
```

#### Success Response

- **Status:** `200 OK`
- **Message:** `Permissions synced successfully`

```json
{
  "success": true,
  "message": "Permissions synced successfully",
  "data": {
    "created": 2,
    "updated": 1
  }
}
```

#### Error Responses

| Status | Condition | Message |
|---|---|---|
| `400` | Validation failed (missing permissions, invalid type) | `Unexpected request` |
| `401` | Missing or invalid JWT token | `Unauthorized request` |
| `405` | Wrong HTTP method (e.g. GET, PUT) | `Wrong method` |
| `429` | Too many requests | `Too many requests, please try again later` |

---

### GET /permissions

Retrieve a paginated list of all permissions.

- **URL:** `/api/permissions`
- **Method:** `GET`
- **Auth Required:** Yes (JWT Bearer token)
- **Rate Limited:** No (uses global rate limiter only)

#### Query Parameters

| Parameter | Type | Required | Default | Constraints | Description |
|---|---|---|---|---|---|
| `page` | integer | No | `1` | Min: `1` | Page number to retrieve |
| `limit` | integer | No | `10` | Min: `1`, Max: `50` | Number of records per page |

#### Example Request

```http
GET /api/permissions?page=1&limit=50 HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

#### Success Response

- **Status:** `200 OK`
- **Message:** `Permissions retrieved successfully`

```json
{
  "success": true,
  "message": "Permissions retrieved successfully",
  "data": {
    "permissions": [
      {
        "id": 1,
        "code": "employees.module",
        "name": "Employees Module",
        "type": "module",
        "module": "employees",
        "parentCode": null,
        "isActive": 1,
        "createdAt": "2026-09-05T10:00:00.000Z",
        "createdBy": 1
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 75,
      "totalPages": 2
    }
  }
}
```

#### Error Responses

| Status | Condition | Message |
|---|---|---|
| `400` | Invalid query parameters | `Unexpected request` |
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

All messages are centralized in `src/shared/constants/messages.js`. **Never hardcode error messages** — always use the `MESSAGES` constants.

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
| `DESIGNATION_CREATED` | `Designation created successfully` | Successful designation creation |
| `DESIGNATIONS_RETRIEVED` | `Designations retrieved successfully` | Successful designations retrieval |
| `DESIGNATION_DELETED` | `Designation deleted successfully` | Successful designation deletion |
| `EMPLOYMENT_DETAILS_RETRIEVED` | `Employment details retrieved successfully` | Successful employment details retrieval |
| `EMPLOYMENT_DETAILS_UPDATED` | `Employment details updated successfully` | Successful employment details update |
| `COMPANY_MASTER_CONFIG_CREATED` | `Company master config saved successfully` | Successful company master config save |
| `COMPANY_MASTER_CONFIG_RETRIEVED` | `Company master config retrieved successfully` | Successful company master config retrieval |
| `ATTENDANCE_CLOCKED_IN` | `Clock-in recorded successfully` | Successful clock-in |
| `ATTENDANCE_CLOCKED_OUT` | `Clock-out recorded successfully` | Successful clock-out |
| `ATTENDANCE_COMPLETED` | `Attendance completed, try tomorrow` | Attendance already completed for today |
| `ATTENDANCE_RETRIEVED` | `Attendance retrieved successfully` | Successful attendance retrieval |
| `RESOURCE_BUNDLE_RETRIEVED` | `Resource bundle retrieved successfully` | Successful resource bundle retrieval |
| `PERMISSIONS_SYNCED` | `Permissions synced successfully` | Successful permissions bulk sync |
| `PERMISSIONS_RETRIEVED` | `Permissions retrieved successfully` | Successful permissions retrieval |
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
import { validate, authenticate, wrongMethod, authRateLimiter } from "../../shared/middlewares/index.js";
import * as yourValidators from "./your.validator.js";
import * as yourController from "./your.controller.js";

router.post(
  "/your-endpoint",
  authRateLimiter,            // 1. Rate limit
  authenticate,               // 2. JWT auth (skip for public routes)
  validate(yourValidators.yourSchema),  // 3. Payload validation
  yourController.method,      // 4. Handler
);

router.all("/your-endpoint", wrongMethod(["POST"])); // 5. Wrong method catch
```

---

### GET /resource-bundle

Retrieve all static lookup data (blood groups, genders, etc.) in a single response.

- **URL:** `/api/resource-bundle`
- **Method:** `GET`
- **Auth Required:** No (public endpoint)
- **Rate Limited:** Yes (global rate limiter)

#### Example Request

```http
GET /api/resource-bundle HTTP/1.1
```

#### Success Response

- **Status:** `200 OK`
- **Message:** `Resource bundle retrieved successfully`

```json
{
  "success": true,
  "message": "Resource bundle retrieved successfully",
  "data": {
    "Blood_group": [
      "A+",
      "A-",
      "B+",
      "B-",
      "O+",
      "O-",
      "AB+",
      "AB-"
    ],
    "Gender": [
      "Male",
      "Female",
      "Other"
    ],
    "Employee_type": [
      "Permanent",
      "Probation",
      "Contractor",
      "OffRole"
    ],
    "HolidayBasedOnType": [
      "State",
      "City",
      "Zone"
    ]
  }
}
```

#### Error Responses

| Status | Condition | Message |
|---|---|---|
| `405` | Wrong HTTP method (e.g. POST, PUT) | `Wrong method` |
| `429` | Too many requests | `Too many requests, please try again later` |

---

### POST /leave-types

Create a new leave type.

- **URL:** `/api/leave-types`
- **Method:** `POST`
- **Auth Required:** Yes (JWT Bearer token)
- **Rate Limited:** Yes (auth rate limiter)

#### Request Body

| Field | Type | Required | Constraints | Description |
|---|---|---|---|---|
| `leaveName` | string | Yes | Trimmed, 1–200 chars | Name of the leave type |
| `leaveCode` | string | Yes | Trimmed, 1–50 chars | Short code for the leave type |
| `applicableFor` | string | No | Trimmed, max 200 chars, nullable | Who this leave applies to |

#### Example Request

```http
POST /api/leave-types HTTP/1.1
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

{
  "leaveName": "Annual Leave",
  "leaveCode": "AL",
  "applicableFor": "All employees"
}
```

#### Success Response

- **Status:** `201 Created`
- **Message:** `Leave type created successfully`

```json
{
  "success": true,
  "message": "Leave type created successfully",
  "data": {
    "leaveType": {
      "id": 1,
      "leaveName": "Annual Leave",
      "leaveCode": "AL",
      "applicableFor": "All employees",
      "createdBy": 1,
      "createdAt": "2026-08-30T10:30:00.000Z"
    }
  }
}
```

#### Error Responses

| Status | Condition | Message |
|---|---|---|
| `400` | Validation failed (missing leaveName/leaveCode) | `Unexpected request` |
| `401` | Missing or invalid JWT token | `Unauthorized request` |
| `405` | Wrong HTTP method (e.g. GET, PUT) | `Wrong method` |
| `429` | Too many requests | `Too many requests, please try again later` |

---

### GET /leave-types

Retrieve a paginated list of leave types.

- **URL:** `/api/leave-types`
- **Method:** `GET`
- **Auth Required:** Yes (JWT Bearer token)
- **Rate Limited:** No (uses global rate limiter only)

#### Query Parameters

| Parameter | Type | Required | Default | Constraints | Description |
|---|---|---|---|---|---|
| `page` | integer | No | `1` | Min: `1` | Page number to retrieve |
| `limit` | integer | No | `10` | Min: `1`, Max: `50` | Number of records per page |

#### Example Request

```http
GET /api/leave-types?page=1&limit=10 HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

#### Success Response

- **Status:** `200 OK`
- **Message:** `Leave types retrieved successfully`

```json
{
  "success": true,
  "message": "Leave types retrieved successfully",
  "data": {
    "leaveTypes": [
      {
        "id": 1,
        "leaveName": "Annual Leave",
        "leaveCode": "AL",
        "applicableFor": "All employees",
        "createdBy": 1,
        "createdAt": "2026-08-30T10:30:00.000Z"
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
| `400` | Invalid query parameters | `Unexpected request` |
| `401` | Missing or invalid JWT token | `Unauthorized request` |
| `405` | Wrong HTTP method (e.g. POST, PUT) | `Wrong method` |
| `429` | Too many requests | `Too many requests, please try again later` |

---

### DELETE /leave-types/:id

Delete a leave type.

- **URL:** `/api/leave-types/:id`
- **Method:** `DELETE`
- **Auth Required:** Yes (JWT Bearer token)
- **Rate Limited:** No (uses global rate limiter only)

#### Path Parameters

| Parameter | Type | Required | Constraints | Description |
|---|---|---|---|---|
| `id` | integer | Yes | Positive integer | ID of the leave type to delete |

#### Example Request

```http
DELETE /api/leave-types/1 HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

#### Success Response

- **Status:** `200 OK`
- **Message:** `Leave type deleted successfully`

```json
{
  "success": true,
  "message": "Leave type deleted successfully",
  "data": {
    "leaveType": {
      "id": 1,
      "leaveName": "Annual Leave",
      "leaveCode": "AL"
    }
  }
}
```

#### Error Responses

| Status | Condition | Message |
|---|---|---|
| `400` | Invalid ID parameter (e.g. non-numeric) | `Unexpected request` |
| `401` | Missing or invalid JWT token | `Unauthorized request` |
| `404` | Leave type not found | `Not found` |
| `405` | Wrong HTTP method (e.g. POST, GET) | `Wrong method` |
| `429` | Too many requests | `Too many requests, please try again later` |

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
