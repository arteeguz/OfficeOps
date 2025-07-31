# OfficeOps - Office Space Management System Documentation

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [POC Scope](#2-poc-scope)
3. [System Architecture](#3-system-architecture)
4. [Technology Stack](#4-technology-stack)
5. [Project Setup](#5-project-setup-poc-development)
6. [Database Schema](#6-database-schema-poc)
7. [API Documentation](#7-api-documentation-poc-endpoints)
8. [Development Workflow](#8-development-workflow-poc)
9. [Future Features](#9-future-features-post-poc)

## 1. Project Overview

### Purpose
The Office Space Management System is a web application designed to replace manual Excel-based tracking of office seating arrangements. It provides real-time visibility into seat occupancy, enables easy seat assignments, and maintains historical records of all changes.

### Key Features

#### POC Features ✅
- **Seat Management**: Assign, move, or vacate seats with validation
- **Excel Import/Export**: Initial data import and ongoing bulk updates with conflict resolution
- **Reporting**: Generate reports by business group, floor, and department
- **Audit Trail**: Complete history of all seat assignments and changes
- **Basic Authentication**: Simple JWT-based login system

#### Future Features (Post-POC) 🔮
- **Visual Floor Plans**: Interactive view of office layout with seat status
- **IAM Integration**: Azure IAM for enterprise authentication
- **Advanced Monitoring**: Azure Data Lake integration for logs
- **Production Deployment**: Windows Server with IIS

### Users
- **Admins**: Full system access, bulk imports, configuration
- **Managers**: Assign/move employees within their departments
- **Employees**: View seat assignments and floor plans (read-only)

## 2. POC Scope

### What We're Building Now (POC)

#### Core Functionality:

**Data Management**
- Import employee and seat data from Excel
- Store in MongoDB with proper relationships
- Handle updates with conflict resolution

**Seat Operations**
- View all seats and their status
- Assign employees to vacant seats
- Move employees between seats
- Mark seats as vacant

**Reporting**
- Business group occupancy reports
- Floor-wise seat utilization
- Export current state to Excel

**Basic Security**
- Simple login system
- Role-based access (admin/manager/viewer)
- Session management

### What We're NOT Building Yet (Future)
- Visual floor plan interface
- Azure IAM integration
- Production deployment configuration
- Automated testing suites
- Log streaming to Azure Data Lake
- Advanced monitoring and alerting

## 3. System Architecture

### POC Architecture

#### Simple 3-Tier Architecture

```
┌─────────────────────┐
│   React Frontend    │
│ • Single Page App   │
│ • Basic forms/tables│
│ • Simple auth       │
└──────────┬──────────┘
           │ HTTP
┌──────────▼──────────┐
│ Node.js Backend     │
│ • REST API          │
│ • Business logic    │
│ • Excel processing  │
└──────────┬──────────┘
           │ MongoDB Driver
┌──────────▼──────────┐
│  MongoDB Database   │
│ • Document storage  │
│ • Local instance    │
│ • Basic indexes     │
└─────────────────────┘
```

### Data Flow (POC)
1. **Initial Import**: Excel → Column Mapping → Validation → MongoDB
2. **Daily Operations**: User Login → View Seats → Make Changes → Update Database
3. **Bulk Updates**: Upload Excel → Detect Conflicts → Resolve → Apply Changes
4. **Reporting**: Query Database → Generate Report → Download Excel

## 4. Technology Stack

### POC Stack (What we're using now)

#### Frontend
- **React 18**: UI framework
- **React Router**: Navigation
- **Axios**: HTTP client
- **Tailwind CSS**: Styling (or basic CSS for POC)

#### Backend
- **Node.js 18+**: Runtime environment
- **Express.js**: Web framework
- **Mongoose**: MongoDB ODM
- **Multer**: File uploads
- **ExcelJS**: Excel processing
- **JWT**: Basic authentication
- **Bcrypt**: Password hashing

#### Database
- **MongoDB**: Local instance
- **Mongoose**: Schema validation

### Future Stack Additions (Post-POC)
- React Query for caching
- Zustand for state management
- Azure IAM libraries
- Winston for logging
- PM2 for process management

## 5. Project Setup (POC Development)

### Prerequisites
- Node.js 18+ and npm
- MongoDB 6.0+
- Git
- Code editor (VS Code recommended)

### Quick Start Guide

#### Windows Setup

```powershell
# 1. Check prerequisites
node --version  # Should show v18.x.x or higher
npm --version   # Should show 8.x.x or higher
mongod --version # Should show v6.x.x

# 2. Clone and enter project
git clone <repository-url>
cd office-space-management

# 3. Setup Backend (Terminal 1)
cd backend
npm install
# Create .env file with:
# PORT=3000
# MONGODB_URI=mongodb://localhost:27017/office_space_poc
# JWT_SECRET=poc-secret-key-change-in-prod
# NODE_ENV=development

# Start MongoDB (if not running)
net start MongoDB

# Run backend
npm run dev

# 4. Setup Frontend (Terminal 2)
cd frontend
npm install
# Create .env file with:
# REACT_APP_API_URL=http://localhost:3000/api

# Run frontend
npm start
```

#### Mac Setup

```bash
# 1. Check prerequisites
node --version  # Should show v18.x.x or higher
npm --version   # Should show 8.x.x or higher
brew services list | grep mongodb # Should show started

# 2. Clone and enter project
git clone <repository-url>
cd office-space-management

# 3. Setup Backend (Terminal 1)
cd backend
npm install
# Create .env file with same values as Windows

# Run backend
npm run dev

# 4. Setup Frontend (Terminal 2)
cd frontend
npm install
# Create .env file with same values as Windows

# Run frontend
npm start
```

### POC Project Structure

```
office-space-management/
├── backend/
│   ├── src/
│   │   ├── controllers/    # POC: Basic CRUD operations
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # API endpoints
│   │   ├── middleware/     # POC: Basic auth only
│   │   ├── services/       # Excel import logic
│   │   └── utils/          # Helper functions
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # POC: Simple forms and tables
│   │   ├── pages/          # POC: Login, Dashboard, Import
│   │   ├── services/       # API calls
│   │   └── utils/          # Helpers
│   └── package.json
└── README.md
```

## 6. Database Schema (POC)

### Core Collections for POC

#### employees
```javascript
{
  _id: ObjectId,
  employeeNumber: String (unique, indexed),
  firstName: String,
  lastName: String,
  email: String,
  businessGroup: String,
  department: String,
  transitNumber: String,
  status: "active" | "inactive",
  createdAt: Date,
  updatedAt: Date
}
```

#### seats
```javascript
{
  _id: ObjectId,
  seatId: String (unique, indexed),
  building: String,
  floor: Number (indexed),
  status: "occupied" | "vacant",
  currentOccupant: ObjectId (ref: employees) | null,
  updatedAt: Date,
  updatedBy: String
}
```

#### assignmentHistory
```javascript
{
  _id: ObjectId,
  employeeId: ObjectId,
  seatId: String,
  action: "assigned" | "moved" | "vacated",
  startDate: Date,
  endDate: Date | null,
  assignedBy: String
}
```

#### users (Simple POC Authentication)
```javascript
{
  _id: ObjectId,
  username: String (unique),
  password: String (hashed),
  role: "admin" | "manager" | "viewer",
  createdAt: Date
}
```

### Basic Indexes for POC
```javascript
// Just the essential indexes for POC performance
db.employees.createIndex({ "employeeNumber": 1 });
db.seats.createIndex({ "seatId": 1 });
db.seats.createIndex({ "floor": 1 });
```

## 7. API Documentation (POC Endpoints)

### Authentication (Basic POC)

#### POST /api/auth/login
```javascript
// Simple login for POC
{
  "username": "admin",
  "password": "admin123"
}
```

### Core POC Operations

#### GET /api/seats
```javascript
// Get seats with basic filters
// Query: ?floor=3&status=vacant
```

#### PUT /api/seats/:seatId/assign
```javascript
// Assign employee to seat
{
  "employeeId": "65a1b2c3d4e5f6789012345a"
}
```

#### POST /api/import/upload
```javascript
// Upload Excel file for import
// Multipart form data with 'file' field
```

#### GET /api/reports/basic
```javascript
// Get basic occupancy report
// Returns summary by business group and floor
```

## 8. Development Workflow (POC)

### POC Development Process

#### Local Development Only
- Work on localhost
- Use sample Excel data
- Test with ~100-200 seat records

#### Simple Git Workflow
```bash
git add .
git commit -m "feat: add seat assignment"
git push origin main
```

#### Manual Testing
- Test Excel import with sample file
- Verify seat assignments work
- Check conflict resolution
- Export and verify data

### POC Deliverables
- ✅ Working import from Excel
- ✅ Basic CRUD operations
- ✅ Simple conflict resolution
- ✅ Export functionality
- ✅ Basic reports

## 9. Future Features (Post-POC)

### Phase 1: Enhanced UI
- Visual floor plan with drag-and-drop
- Real-time updates with WebSockets
- Advanced search and filtering

### Phase 2: Enterprise Integration
- Azure IAM authentication
- GDS employee validation
- API integration with HR systems

### Phase 3: Production Readiness
- Deployment to Windows Server/IIS
- Automated testing suites
- Performance optimization
- Database clustering

### Phase 4: Advanced Features
- Predictive analytics
- Space optimization algorithms
- Mobile application
- API for third-party integrations

### Phase 5: Monitoring & Compliance
- Azure Data Lake log streaming
- Compliance reporting
- Automated backups
- Disaster recovery

## POC Success Criteria

| Criteria | Target |
|----------|--------|
| Import Success | Can import 200+ records from Excel |
| Data Integrity | No duplicate assignments |
| Conflict Resolution | Can handle 10+ conflicts in bulk update |
| Performance | Operations complete in <2 seconds |
| Export | Can generate Excel report of current state |
| Stability | No crashes during normal operations |

## Next Steps After POC
1. Demo to Stakeholders
2. Gather Feedback
3. Plan Phase 1 Features
4. Estimate Timeline for Production
5. Define Infrastructure Requirements
