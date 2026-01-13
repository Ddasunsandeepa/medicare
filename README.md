# MWN Healthcare Management System

## Project Overview
The MWN Healthcare Management System is a web-based application developed as part of the **CSE3722 – Rapid Application Development** module.  
The system is designed to support multi-branch healthcare clinics by managing patients, appointments, doctor availability, wellness packages, billing, and consultation records in a secure and efficient manner.

---

## Key Features
- JWT-based authentication with role-based access (Admin, Staff, Doctor)
- Patient registration and profile management
- Appointment scheduling with availability validation
- Prevention of double-booking and past-date bookings
- Doctor availability and consultation notes
- Wellness package management and billing
- Tax and membership-based discount calculation
- Session-based appointment validation
- Email notifications for appointments and payments
- Administrative reports and summaries

---

## Technology Stack
**Frontend**
- React
- CSS

**Backend**
- Node.js
- Express.js

**Database**
- MongoDB

**Authentication**
- JSON Web Tokens (JWT)

**Development Approach**
- Agile SDLC
- Rapid Application Development (RAD)

---

## User Roles
- **Admin** – User management, package creation, billing reports
- **Staff** – Patient management, appointment booking, billing
- **Doctor** – Availability management, consultations, appointment view
- **Patient** – Limited access via notifications and records

---

## Installation & Setup

### Backend
```bash
cd medicare-backend
npm install
npm start
```
### Frontend
```bash
cd medicare-frontend
npm install
npm run dev
```

 ### Environment Variables (Backend)

Create a .env file in the backend directory-
```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

 ### Deployment

The system is deployed in a local test environment for academic purposes and can be extended to cloud platforms in future enhancements.

 ### Future Enhancements

---
- Mobile application for patients
- AI-based appointment forecasting
- Online payment gateway integration
- Wearable health device integration

---
