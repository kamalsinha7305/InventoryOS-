# InventoryOS — Full-Stack Inventory Management System
## Detailed Feature Listing & System Operations Documentation

---

## 📋 Table of Contents
1. [Executive Summary & Core Objectives](#-1-executive-summary--core-objectives)
2. [Technology Stack & Layer Architecture](#-2-technology-stack--layer-architecture)
3. [Role-Based Access Control (RBAC) Matrix](#-3-role-based-access-control-rbac-matrix)
4. [Detailed Feature Listing & How Every Module Works](#-4-detailed-feature-listing--how-every-module-works)
   - [4.1 Authentication & User Onboarding Module](#41-authentication--user-onboarding-module)
   - [4.2 Executive Dashboard & Real-Time Analytics Module](#42-executive-dashboard--real-time-analytics-module)
   - [4.3 Warehouse Storage & Multi-Location Management Module](#43-warehouse-storage--multi-location-management-module)
   - [4.4 Product Catalog & Inventory Tracking Module](#44-product-catalog--inventory-tracking-module)
   - [4.5 Purchase Orders (POs) & Stock Replenishment Workflow](#45-purchase-orders-pos--stock-replenishment-workflow)
5. [REST API Endpoint Reference](#-5-rest-api-endpoint-reference)
6. [Database Schema & Data Model](#-6-database-schema--data-model)
7. [Installation & Local Deployment Guide](#-7-installation--local-deployment-guide)

---

## 🚀 1. Executive Summary & Core Objectives

**InventoryOS** is an enterprise-grade full-stack inventory management and warehouse logistics platform. It provides real-time visibility into multi-warehouse stock counts, automated supplier purchase order workflows, and inventory capital valuation metrics.

### Primary Objectives:
- **Centralized Stock Control**: Real-time visibility into stock quantities, unit prices, and reorder thresholds across multi-regional warehouses.
- **Automated Replenishment**: Purchase order workflow that automatically adjusts stock counts and warehouse storage space upon order approval.
- **Visual Analytics**: Interactive SVG donut gauges, capacity progress trackers, and 6-month valuation trajectory area graphs.
- **Enterprise Security**: Role-based access control (RBAC) securing endpoints and UI capabilities for **Admin**, **Manager**, and **Executive** roles.

---

## 💻 2. Technology Stack & Layer Architecture

| Component Layer | Technology / Framework | Detailed Role & Implementation |
| :--- | :--- | :--- |
| **Frontend SPA** | Angular 15, TypeScript, RxJS | Modular Single-Page Application (SPA) utilizing lazy-loaded feature modules (Auth, Dashboard, Warehouses, Products, POs). |
| **UI & Styling** | Vanilla CSS, Custom Tokens, Outfit & Inter Fonts | Custom CSS design system utilizing HSL variables, glassmorphic cards, and responsive 55/45 split auth panels and card grids. |
| **Data Visualization** | Inline SVG Engine & Math Calculators | Custom cubic bezier curve path generators, radial health donut gauges, and animated progress bars. |
| **Backend Services** | Spring Boot 3.3.5, Java 17, Maven | RESTful backend controllers exposing JSON endpoints with transactional service layers. |
| **Security Layer** | Spring Security 6, JWT, BCrypt | Stateless JSON Web Token (JWT) filter inspecting Bearer tokens and enforcing Role-Based Access Control (RBAC). |
| **Database Storage** | Apache Derby Embedded DB, Hibernate JPA | Relational embedded database storing application data in `./data/inventorydb` with automatic seed initialization. |

---

## 🔐 3. Role-Based Access Control (RBAC) Matrix

| Role Name | Access Scope | Detailed Permitted Actions & Permissions |
| :--- | :--- | :--- |
| **🛡️ Admin** | Full System Authority | User creation/roles, warehouse & product deletion, PO approvals, complete settings control, and access to all reporting endpoints. |
| **💼 Manager** | Operational Management | Create & edit products, create & manage warehouses, issue Purchase Orders, and execute PO approvals to restock inventory. |
| **👁️ Executive** | Read-Only Analytics | Inspect executive dashboards, monitor live inventory valuation graphs, view warehouse capacity utilization, and inspect product catalog. |

---

## 📦 4. Detailed Feature Listing & How Every Module Works

### 4.1 Authentication & User Onboarding Module

#### 1. 55/45 Widescreen Split Panel Layout
- **Visual Presentation**: The Login and Registration pages feature a prominent 55% left purple gradient hero panel detailing platform statistics (99.9% uptime, real-time stock sync, multi-warehouse support) alongside a 45% right panel hosting input forms.

#### 2. Quick Demo Role Fill Buttons
- **How it Works**: On the Login screen, 3 quick shortcut buttons (**Admin**, **Manager**, **Executive**) allow users to instantly populate form credentials (`admin`/`admin123`, `manager`/`manager123`, `executive`/`executive123`) into input fields **without auto-submitting**. Users can inspect credentials and click "Sign In" when ready.

#### 3. Interactive Role Selection Grid
- **How it Works**: On the Create Account page, an interactive 3-card grid lets users choose their role (**Admin**, **Manager**, **Executive**). Clicking a card dynamically updates the underlying Angular reactive form state.

#### 4. Real-Time Input & Email Validation
- **How it Works**: Client-side validation highlights required fields upon submission and enforces strict regex checks for email syntax (preventing double `@` symbols or invalid domains).

#### 5. Backend Duplicate Checks & Custom Error Messages
- **How it Works**: The backend `AuthController` inspects requested usernames and emails against the database, returning clear JSON messages (e.g. *"Username 'papa' is already taken"*) if duplicates exist.

---

### 4.2 Executive Dashboard & Real-Time Analytics Module

#### 1. Live Real-Time KPI Cards
- **Total Products**: Calculated live via `productRepository.count()`.
- **Total Stock Value**: Summed live as $\sum (\text{unitPrice} \times \text{currentStock})$ across all inventory items (currently **$2,307,843**).
- **Low Stock Items**: Live count of products where `currentStock <= reorderLevel`.
- **Pending Orders**: Count of purchase orders in status `PENDING` or `CREATED`.

#### 2. Health Score SVG Donut Meter
- **How it Works**: Dynamic radial SVG donut meter displaying an overall health percentage (0–100%). The stroke color dynamically adapts (Green >= 80%, Amber 50-79%, Red <50%), and the percentage text is rendered upright in the center.

#### 3. 6-Month Valuation Trajectory Curve Graph
- **How it Works**: A custom SVG area chart generating a smooth cubic bezier curve (`M ... C ...`). The current month (August) displays 100% real live database total valuation ($2,307,843), while previous months project historical asset trajectory (+15.4% growth).

#### 4. Warehouse Utilization & Top Products Charts
- **Warehouse Capacity Bar Chart**: Color-coded horizontal progress bars representing individual warehouse capacity utilization (<70% Green, 70-90% Amber, >90% Red).
- **Top Products Chart**: Horizontal bar chart ranking the top 6 products with the highest current stock levels.

---

### 4.3 Warehouse Storage & Multi-Location Management Module

#### 1. Multi-Regional Warehouse Overview
- Cards displaying total capacity, available capacity, street location address, status badge (`ACTIVE` / `INACTIVE`), and a visual utilization progress bar.

#### 2. Warehouse Detail View & SVG Capacity Ring
- Detailed page for each facility featuring a radial SVG capacity ring (e.g. 29/30 units used), an aligned property grid (Name, Location, Status, Capacity), and a table of assigned products.

#### 3. Warehouse Creation & Capacity Boundaries
- Form to register new storage facilities with specified maximum unit capacity boundaries.

---

### 4.4 Product Catalog & Inventory Tracking Module

#### 1. Real-Time Client-Side Search Bar
- Instant text filtering on typing that matches Product Name, SKU code, Category name, or Supplier name.

#### 2. Low Stock Alert Warnings
- Automatic amber badge tags for products whose current stock falls at or below their designated reorder level.

#### 3. Product Form (Add/Edit)
- Input controls to register products with SKU, unit price, current stock, reorder level, category dropdown, and supplier dropdown.

---

### 4.5 Purchase Orders (POs) & Stock Replenishment Workflow

A **Purchase Order (PO)** is a formal procurement document issued by an inventory manager to a supplier, specifying requested products, quantities, unit cost, and target warehouse location.

#### Step-by-Step Replenishment Workflow:

```
  ┌───────────────────┐      ┌───────────────────┐      ┌───────────────────┐
  │ 1. PO Created     │─────►│ 2. Pending Status │─────►│ 3. Shipment       │
  │    (Manager/Admin)│      │    (Dashboard)    │      │    Arrives        │
  └───────────────────┘      └───────────────────┘      └─────────┬─────────┘
                                                                  │
  ┌───────────────────┐      ┌───────────────────┐                │
  │ 6. Status Changed │◄─────│ 5. Stock (+qty)   │◄───────────────┘
  │    to APPROVED    │      │    Space (-qty)   │   4. Approve Click
  └───────────────────┘      └───────────────────┘
```

1. **Step 1: Order Generation**: Manager/Admin issues a new PO selecting a product, quantity, supplier, unit cost, and warehouse. Order is saved with status `PENDING`.
2. **Step 2: Dashboard & Order Tracking**: The PO is listed on the Purchase Orders screen and reflected in the "Pending Orders" KPI metric on the executive dashboard.
3. **Step 3: Supplier Shipment Arrival**: When the physical shipment arrives at the destination warehouse, the manager clicks **Approve / Receive**.
4. **Step 4: Capacity Verification**: The system verifies that `warehouse.availableCapacity >= purchaseOrder.quantity`. If space is insufficient, an exception is thrown.
5. **Step 5: Automated Inventory Update**: Upon approval, the system executes two automatic database updates:
   - Increments product `currentStock` in DB (+quantity).
   - Deducts warehouse `availableCapacity` in DB (-quantity).
6. **Step 6: Completion**: Order status changes from `PENDING` to `APPROVED`, updating system valuation metrics in real time.

---

## 📡 5. REST API Endpoint Reference

| HTTP Method & Endpoint | Controller Class | Description & Payload Details |
| :--- | :--- | :--- |
| `POST /api/auth/login` | `AuthController` | Authenticates credentials and returns JWT bearer token and user roles. |
| `POST /api/auth/register` | `AuthController` | Registers new user record with requested role (`Admin`/`Manager`/`Executive`). |
| `GET /api/v1/products` | `ProductController` | Retrieves list of all products with stock quantities and prices. |
| `POST /api/v1/products` | `ProductController` | Creates a new product record linked to category and supplier. |
| `GET /api/v1/warehouses` | `WarehouseController` | Retrieves all warehouses with total and available capacities. |
| `GET /api/v1/warehouses/{id}` | `WarehouseController` | Fetches single warehouse details and housed inventory items. |
| `POST /api/v1/warehouses` | `WarehouseController` | Creates a new warehouse storage facility. |
| `GET /api/v1/purchase-orders` | `PurchaseOrderController` | Fetches all purchase orders with `PENDING` / `APPROVED` statuses. |
| `POST /api/v1/purchase-orders` | `PurchaseOrderController` | Issues new purchase order to a supplier in `PENDING` state. |
| `PUT /api/v1/purchase-orders/{id}/approve` | `PurchaseOrderController` | Approves PO, auto-increments stock, and deducts warehouse space. |

---

## 🛠️ 6. Local Installation & Deployment Guide

### Backend Execution (Spring Boot)
```bash
cd backend
./mvnw spring-boot:run
```
*API Base URL: `http://localhost:8080/api`*

### Frontend Execution (Angular 15)
```bash
cd frontend
npm install
ng serve
```
*App URL: `http://localhost:4200`*

### Pre-Configured Test Accounts:
- **Admin**: `admin` / `admin123`
- **Manager**: `manager` / `manager123`
- **Executive**: `executive` / `executive123`
