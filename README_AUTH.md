# Splitwise Frontend - Authentication System

A modern React + TypeScript frontend for the Splitwise authentication system with Redux state management and Tailwind CSS.

## Tech Stack

- **React 18** with TypeScript
- **Vite** - Build tool
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Hook Form** - Form handling
- **Zod** - Schema validation

## Features

- ✅ User Registration (Sign Up)
- ✅ User Login
- ✅ User Logout
- ✅ Protected Routes
- ✅ Persistent Authentication
- ✅ Form Validation
- ✅ Error Handling
- ✅ Responsive Design

## Getting Started

### Installation
npm install

### Running
npm run dev

The application will be available at: http://localhost:5173

## Available Routes

- `/` - Home/Landing page
- `/login` - Login page
- `/signup` - Sign up page
- `/dashboard` - Protected dashboard (requires authentication)

## API Endpoints

- POST /api/auth/signup
- POST /api/auth/login
- POST /api/auth/logout
- GET /api/user/current
