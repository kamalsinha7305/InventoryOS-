# Inventory Management System

A full-stack inventory management application built with Angular on the frontend and Spring Boot on the backend. It supports authentication, product management, warehouse tracking, purchase orders, and role-based access for admin, manager, and executive users.

## Overview

This project is designed for managing stock across warehouses, monitoring low-stock alerts, approving purchase orders, and tracking real-time inventory value. The backend exposes REST APIs, while the frontend provides dashboards and user interfaces for operational and executive workflows.

## Tech Stack

### Frontend

- Angular 15
- TypeScript
- RxJS
- HTML/CSS

### Backend

- Java 17
- Spring Boot 3.3.5
- Spring Security
- Spring Data JPA
- JWT Authentication
- Apache Derby Database

## Main Features

- User registration and login
- Role-based access control (Admin, Manager, Executive)
- Dashboard with KPI summary cards
- Product catalog management
- Warehouse management and capacity tracking
- Purchase order creation and approval workflow
- Low-stock monitoring
- Secure REST API with JWT authentication

## Project Structure

```text
Inventory_Management_system/
├── backend/
│   ├── data/
│   │   └── inventorydb/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/
│   │   │   │       └── example/
│   │   │   │           └── backend/
│   │   │   │       └── tcs/
│   │   │   └── resources/
│   │   │       ├── application.yml
│   │   │       ├── static/
│   │   │       └── templates/
│   │   └── test/
│   │       └── java/
│   ├── pom.xml
│   ├── mvnw
│   ├── mvnw.cmd
│   └── .gitignore
├── frontend/
│   ├── e2e/
│   ├── src/
│   │   ├── app/
│   │   │   ├── app-routing.module.ts
│   │   │   ├── app.component.ts
│   │   │   ├── app.module.ts
│   │   │   ├── auth/
│   │   │   ├── core/
│   │   │   ├── features/
│   │   │   └── shared/
│   │   ├── assets/
│   │   ├── environments/
│   │   ├── index.html
│   │   ├── main.ts
│   │   ├── polyfills.ts
│   │   └── styles.css
│   ├── angular.json
│   ├── package.json
│   ├── proxy.conf.json
│   └── tsconfig.json
├── DOCUMENTATION.md
├── InventoryOS_Detailed_Documentation.docx
├── InventoryOS_Documentation.docx
├── InventoryOS_Presentation.pptx
└── README.md
```

## Backend Structure

The backend is a Spring Boot application with layered components such as:

- Controllers for authentication, products, warehouses, and purchase orders
- Services for business logic
- Repositories for database access
- Models/entities for application data
- Security configuration with JWT
- Application configuration through `application.yml`

## Frontend Structure

The frontend uses Angular modular structure:

- `auth` module for login/register flows
- `core` for guards, interceptors, services, and shared models
- `features` for dashboard, products, purchase orders, and warehouses
- `shared` for reusable Angular elements

## Run the Application

### Prerequisites

- Java 17+
- Maven or Maven Wrapper
- Node.js 16+ recommended
- npm

### 1. Backend

From the project root:

```bash
cd backend
./mvnw spring-boot:run
```

Backend API will run on:

```text
http://localhost:8080
```

### 2. Frontend

From the project root:

```bash
cd frontend
npm install
npm start
```

Frontend app will run on:

```text
http://localhost:4200
```

## Default Login Accounts

- Admin: `admin` / `admin123`
- Manager: `manager` / `manager123`
- Executive: `executive` / `executive123`

## API Notes

The backend exposes endpoints under the `/api` base path. The app is configured with a frontend proxy to route requests to the backend during local development.

## Documentation

Additional project documentation is available in:

- [DOCUMENTATION.md](DOCUMENTATION.md)

## Notes

This repository includes generated documents and presentation files for the project, but the main working application code is in the `backend` and `frontend` directories.

## License

This project is intended for educational and internal project use unless specified otherwise by the repository owner.
