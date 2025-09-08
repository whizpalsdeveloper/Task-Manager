# Task Manager API Documentation

## Overview
This is a multi-panel task management system with three user roles:
- **Admin**: Can manage companies and view all data
- **Company**: Can manage tasks and users within their company
- **User**: Can manage their assigned tasks

## Authentication
All API endpoints (except registration and login) require authentication using Laravel Sanctum tokens.

### Register User
```
POST /api/register
Content-Type: application/json

{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "password_confirmation": "password123"
}
```

### Login
```
POST /api/login
Content-Type: application/json

{
    "email": "john@example.com",
    "password": "password123"
}
```

### Logout
```
POST /api/logout
Authorization: Bearer {token}
```

### Get Current User
```
GET /api/user
Authorization: Bearer {token}
```

## Admin Panel API

### Company Management

#### Get All Companies
```
GET /api/admin/companies
Authorization: Bearer {admin_token}
```

#### Create Company
```
POST /api/admin/companies
Authorization: Bearer {admin_token}
Content-Type: application/json

{
    "name": "New Company",
    "email": "company@example.com",
    "phone": "+1234567890",
    "address": "123 Main St",
    "website": "https://company.com",
    "logo": "logo.png",
    "status": "active",
    "admin_name": "Company Admin",
    "admin_email": "admin@company.com",
    "admin_password": "password123"
}
```

#### Get Company Details
```
GET /api/admin/companies/{id}
Authorization: Bearer {admin_token}
```

#### Update Company
```
PUT /api/admin/companies/{id}
Authorization: Bearer {admin_token}
Content-Type: application/json

{
    "name": "Updated Company",
    "email": "updated@company.com",
    "phone": "+1234567890",
    "address": "456 New St",
    "website": "https://updated.com",
    "logo": "new-logo.png",
    "status": "active"
}
```

#### Delete Company
```
DELETE /api/admin/companies/{id}
Authorization: Bearer {admin_token}
```

#### Get Company Customers (Users)
```
GET /api/admin/companies/{id}/customers
Authorization: Bearer {admin_token}
```

## Company Panel API

### Task Management

#### Get All Company Tasks
```
GET /api/company/tasks
Authorization: Bearer {company_token}
```

#### Create Task
```
POST /api/company/tasks
Authorization: Bearer {company_token}
Content-Type: application/json

{
    "title": "New Task",
    "description": "Task description",
    "assigned_to": 5,
    "due_date": "2024-12-31",
    "priority": "high"
}
```

#### Get Task Details
```
GET /api/company/tasks/{id}
Authorization: Bearer {company_token}
```

#### Update Task
```
PUT /api/company/tasks/{id}
Authorization: Bearer {company_token}
Content-Type: application/json

{
    "title": "Updated Task",
    "description": "Updated description",
    "assigned_to": 6,
    "due_date": "2024-12-31",
    "priority": "medium"
}
```

#### Delete Task
```
DELETE /api/company/tasks/{id}
Authorization: Bearer {company_token}
```

#### Get Company Users
```
GET /api/company/users
Authorization: Bearer {company_token}
```

## User Panel API

### Task Management

#### Get My Assigned Tasks
```
GET /api/user/tasks
Authorization: Bearer {user_token}
```

#### Create Personal Task
```
POST /api/user/tasks
Authorization: Bearer {user_token}
Content-Type: application/json

{
    "title": "Personal Task",
    "description": "My personal task",
    "due_date": "2024-12-31",
    "priority": "low"
}
```

#### Get Task Details
```
GET /api/user/tasks/{id}
Authorization: Bearer {user_token}
```

#### Update Task
```
PUT /api/user/tasks/{id}
Authorization: Bearer {user_token}
Content-Type: application/json

{
    "title": "Updated Task",
    "description": "Updated description",
    "due_date": "2024-12-31",
    "priority": "medium",
    "status": "in-progress",
    "notes": "Working on this task"
}
```

#### Delete Task
```
DELETE /api/user/tasks/{id}
Authorization: Bearer {user_token}
```

#### Update Task Status Only
```
PATCH /api/user/tasks/{id}/status
Authorization: Bearer {user_token}
Content-Type: application/json

{
    "status": "completed"
}
```

#### Add Notes to Task
```
POST /api/user/tasks/{id}/notes
Authorization: Bearer {user_token}
Content-Type: application/json

{
    "notes": "Additional notes about the task"
}
```

## Data Models

### User Model
```json
{
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "company_id": 1,
    "created_at": "2024-01-01T00:00:00.000000Z",
    "updated_at": "2024-01-01T00:00:00.000000Z"
}
```

### Company Model
```json
{
    "id": 1,
    "name": "Sample Company",
    "email": "company@example.com",
    "phone": "+1234567890",
    "address": "123 Main St",
    "website": "https://example.com",
    "logo": "logo.png",
    "status": "active",
    "created_at": "2024-01-01T00:00:00.000000Z",
    "updated_at": "2024-01-01T00:00:00.000000Z"
}
```

### Task Model
```json
{
    "id": 1,
    "user_id": 1,
    "company_id": 1,
    "assigned_to": 2,
    "title": "Task Title",
    "description": "Task description",
    "status": "pending",
    "due_date": "2024-12-31T00:00:00.000000Z",
    "notes": "Task notes",
    "priority": "medium",
    "completed_at": null,
    "created_at": "2024-01-01T00:00:00.000000Z",
    "updated_at": "2024-01-01T00:00:00.000000Z"
}
```

## Response Format

### Success Response
```json
{
    "message": "Operation successful",
    "data": { ... }
}
```

### Error Response
```json
{
    "message": "Error description",
    "errors": {
        "field": ["Validation error message"]
    }
}
```

## Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthenticated
- `403` - Unauthorized
- `404` - Not Found
- `422` - Validation Error
- `500` - Server Error

## Sample Test Data

After running the seeders, you'll have these test accounts:

### Admin Account
- Email: `admin@example.com`
- Password: `password`
- Role: `admin`

### Company Account
- Email: `company.admin@example.com`
- Password: `password`
- Role: `company`

### User Accounts
- Email: `john@example.com`
- Password: `password`
- Role: `user`

- Email: `jane@example.com`
- Password: `password`
- Role: `user`

## Features

### Admin Features
- Create, read, update, delete companies
- View all companies and their details
- View customers (users) of each company
- Manage company status (active/inactive)

### Company Features
- Create, read, update, delete tasks
- Assign tasks to users via email
- View all tasks in their company
- Get list of users in their company
- Email notifications when tasks are assigned

### User Features
- View assigned tasks
- Create personal tasks
- Update task status (pending, in-progress, completed)
- Add notes to tasks
- Update task details
- Delete tasks

## Security
- All routes are protected by authentication
- Role-based access control using middleware
- Users can only access their own company's data
- Tasks are scoped to the user's company
- Email notifications for task assignments
