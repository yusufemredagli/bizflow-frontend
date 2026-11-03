# BizFlow Frontend

Frontend application for **BizFlow**, a multi-tenant field service and business operations management platform.

BizFlow is designed to help organizations manage customers, service requests, technicians, assignments and operational workflows from a centralized interface.

The frontend communicates with the BizFlow REST API and provides role-aware interfaces for different organization members.

---

## Product Overview

BizFlow follows a multi-tenant architecture where users can belong to different companies and operate according to their assigned role.

Supported roles include:

- **OWNER** — company-level administration and operational control
- **MANAGER** — customer, request and team management
- **TECHNICIAN** — assigned service requests and operational workflows

Each company's data is isolated through the backend authorization architecture.

---

## Core Features

### Authentication & Authorization

User authentication and role-aware application flows integrated with the BizFlow backend API.

### Customer Management

Create, view and manage customers belonging to the active company.

### Service Request Management

Manage service requests through their operational lifecycle.

Requests can include customer information, status changes, assignments and related operational data.

### Technician Assignment

Managers can assign service requests to company technicians.

Assignments are handled through the company's membership structure rather than global users.

### Operational Dashboard

Centralized interface for monitoring customers, requests, assignments and operational activity.

### Responsive Interface

The application is designed to work across desktop and mobile screen sizes.

### Public Product Website

The repository also includes the public-facing BizFlow product website used to present the platform and its capabilities.

---

## Tech Stack

| Area | Technology |
|---|---|
| Frontend | React |
| Build Tool | Vite |
| Language | JavaScript |
| API | REST |
| Backend | Node.js / Express.js |
| Database | MySQL |
| ORM | Prisma |
| Authentication | JWT / RBAC |
| Version Control | Git / GitHub |

---

## Architecture

The frontend is separated from the backend application.

```text
User
  │
  ▼
BizFlow Frontend
React + Vite
  │
  │ REST API
  ▼
BizFlow Backend
Node.js + Express
  │
  ▼
Prisma ORM
  │
  ▼
MySQL
```

Authorization and tenant isolation are enforced by the backend.

The frontend is responsible for presenting role-appropriate workflows and communicating with the API.

---

## Repository Structure

```text
bizflow-frontend/
├── public/
├── src/
├── index.html
├── package.json
├── vite.config.js
├── MARKETING_WEBSITE.md
├── PRODUCTION_REVIEW.md
└── README.md
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yusufemredagli/bizflow-frontend.git
cd bizflow-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

Vite will start the local development environment.

The BizFlow backend must also be running for API-dependent application features.

---

## Backend

The backend is maintained in a separate repository:

**BizFlow Backend**

https://github.com/yusufemredagli/bizflow-backend

It contains the API, authentication, multi-tenant authorization, Prisma data layer and business logic used by the frontend.

---

## Engineering Focus

BizFlow was built to explore and implement real-world SaaS engineering concepts including:

- Multi-tenant application architecture
- Company-scoped data isolation
- Role-Based Access Control (RBAC)
- REST API integration
- Customer and service request workflows
- Technician assignment
- Audit and activity tracking
- Responsive operational dashboards

---

## Related Project

### PulseDesk

A more advanced real-time support operations platform built with TypeScript, NestJS, Next.js, PostgreSQL, Redis, BullMQ, Prisma and Socket.IO.

https://github.com/yusufemredagli/pulsedesk

---

## Author

**Yusuf Emre Dağlı**

Backend-Focused Full-Stack Developer

GitHub  
https://github.com/yusufemredagli

LinkedIn  
https://www.linkedin.com/in/yusuf-emre-dağlı-9394b722b
