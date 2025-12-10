# Splitwise Frontend - Quick Start Guide

## 🚀 What's Been Built

A complete React + TypeScript authentication frontend with:
- ✅ Sign Up, Login, Logout functionality
- ✅ Form validation with Zod
- ✅ Redux Toolkit for state management
- ✅ Protected routes with authentication guards
- ✅ Persistent authentication with httpOnly cookies
- ✅ Tailwind CSS for styling
- ✅ Fully responsive design

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   └── ProtectedRoute.tsx       # Route protection component
│   ├── contexts/
│   │   └── AuthContext.tsx          # React Context (optional alternative)
│   ├── pages/
│   │   ├── Home.tsx                 # Landing page
│   │   ├── Login.tsx                # Login page with form
│   │   ├── SignUp.tsx               # Sign up page with form
│   │   └── Dashboard.tsx            # Protected dashboard
│   ├── schemas/
│   │   └── authSchemas.ts           # Zod validation schemas
│   ├── services/
│   │   └── authService.ts           # API service layer (Axios)
│   ├── store/
│   │   ├── store.ts                 # Redux store configuration
│   │   ├── authSlice.ts             # Redux auth slice
│   │   └── hooks.ts                 # Typed Redux hooks
│   ├── types/
│   │   └── auth.ts                  # TypeScript interfaces
│   ├── App.tsx                      # Main app with routing
│   ├── main.tsx                     # Entry point
│   └── index.css                    # Tailwind CSS imports
├── package.json
├── vite.config.ts
├── tsconfig.json
└── tailwind.config.js
```

## 🎯 Quick Start

### 1. Start Backend (Terminal 1)
```bash
cd ../backend
npm start
# Backend runs on http://localhost:8002
```

### 2. Start Frontend (Terminal 2)
```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:5173
```

### 3. Open Browser
Navigate to: **http://localhost:5173**

## 🔑 Key Features Implemented

### 1. Authentication Pages
- **Home** (`/`) - Landing page with call-to-action buttons
- **Sign Up** (`/signup`) - Registration form with validation
- **Login** (`/login`) - Login form
- **Dashboard** (`/dashboard`) - Protected page showing user info

### 2. Form Validation (Zod + React Hook Form)
```typescript
// Sign Up validations:
- Name: min 2 characters
- Username: min 3 characters, alphanumeric + underscore
- Email: valid email format
- Password: min 6 characters
- Confirm Password: must match
```

### 3. Redux State Management
```typescript
// Auth state includes:
- user: User | null
- loading: boolean
- error: string | null

// Actions available:
- loginUser()
- signUpUser()
- logoutUser()
- checkAuth()
```

### 4. Protected Routes
- Uses `ProtectedRoute` component
- Automatically redirects to login if not authenticated
- Checks authentication on mount
- Shows loading spinner during auth check

### 5. API Integration
```typescript
// All endpoints configured:
POST /api/auth/signup    // Sign up new user
POST /api/auth/login     // Login user
POST /api/auth/logout    // Logout user
GET  /api/user/current   // Get current user (persistent auth)
```

## 🛠️ Technologies Used

| Technology | Purpose |
|------------|---------|
| React 18 | UI framework |
| TypeScript | Type safety |
| Vite | Build tool & dev server |
| Redux Toolkit | State management |
| React Router | Client-side routing |
| Tailwind CSS | Styling |
| Axios | HTTP client |
| React Hook Form | Form handling |
| Zod | Schema validation |

## 🎨 Styling

Tailwind CSS is configured and ready to use:
- Responsive design (mobile-first)
- Modern color palette (indigo, gray)
- Form styling with focus states
- Loading states and animations
- Error message styling

## 🔒 Security Features

1. **httpOnly Cookies**: JWT stored in httpOnly cookies (not localStorage)
2. **CORS Configuration**: Backend configured to accept requests from frontend
3. **Credentials**: Axios configured with `withCredentials: true`
4. **Password Validation**: Minimum 6 characters enforced
5. **Protected Routes**: Dashboard only accessible when authenticated

## 📝 Usage Examples

### Sign Up a New User
1. Go to http://localhost:5173
2. Click "Get Started"
3. Fill form:
   - Name: John Doe
   - Username: johndoe
   - Email: john@example.com
   - Password: password123
   - Confirm: password123
4. Click "Sign up"
5. Automatically logged in and redirected to dashboard

### Login
1. Go to http://localhost:5173/login
2. Enter credentials:
   - Username: johndoe
   - Password: password123
3. Click "Sign in"
4. Redirected to dashboard

### Persistent Authentication
1. Login successfully
2. Refresh the page (F5)
3. You remain logged in (cookie persists)

### Logout
1. On dashboard, click "Logout"
2. Redirected to login page
3. Cookie cleared, can't access dashboard anymore

## 🐛 Troubleshooting

### Backend Not Running
Error: "Network Error" or failed API calls
Solution: Ensure backend is running on port 8002

### CORS Errors
Error: "blocked by CORS policy"
Solution: Backend CORS is configured. Restart backend if needed.

### Cookie Not Set
Error: Login works but not persisting
Solution: Check browser cookies (DevTools → Application → Cookies)

### Form Validation Issues
Error: Form submits with invalid data
Solution: Check browser console for Zod errors

## 📚 Next Steps

Now that authentication is complete, you can:

1. **Add Profile Management**: Edit user profile, change password
2. **Add Friends**: Search and add friends functionality
3. **Create Groups**: Group management features
4. **Track Expenses**: Main Splitwise functionality
5. **Add Settlements**: Payment tracking and settlement
6. **Email Verification**: Verify email on signup
7. **Password Reset**: Forgot password functionality
8. **Dashboard Enhancements**: Show expenses, balances, etc.

## 🎯 Testing Checklist

- [ ] Sign up with new user
- [ ] Test form validation (empty fields, short password, etc.)
- [ ] Login with created user
- [ ] Test invalid login
- [ ] Refresh page while logged in (persistent auth)
- [ ] Access dashboard while logged in
- [ ] Try accessing dashboard while logged out
- [ ] Logout successfully
- [ ] Navigate between pages

## 📞 Support

For issues:
1. Check browser console for errors
2. Check Network tab in DevTools
3. Verify backend is running
4. Review TESTING_GUIDE.md for detailed testing steps

---

**Built with ❤️ using React, TypeScript, Redux, and Tailwind CSS**