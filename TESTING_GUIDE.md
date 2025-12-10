# Authentication System Testing Guide

## Prerequisites

1. **Backend Server**: Ensure the backend is running on port 8002
2. **MongoDB**: Database should be connected
3. **Frontend Server**: Run `npm run dev` in the frontend directory

## Testing Steps

### 1. Test Sign Up Flow

1. Navigate to http://localhost:5173
2. Click "Get Started" or "Sign Up"
3. Fill in the registration form:
   - **Name**: John Doe
   - **Username**: johndoe
   - **Email**: john@example.com
   - **Password**: password123
   - **Confirm Password**: password123
4. Click "Sign up"
5. **Expected Result**: 
   - Redirected to `/dashboard`
   - Dashboard shows welcome message with user name
   - Navigation bar shows "Welcome, John Doe!"

### 2. Test Form Validation

#### Sign Up Validation
Test each validation rule:

- **Empty fields**: Leave fields empty and try to submit
  - Should show "required" error messages

- **Name validation**: Enter "A" 
  - Should show "Name must be at least 2 characters"

- **Username validation**: 
  - Enter "ab" → Should show "Username must be at least 3 characters"
  - Enter "john@doe" → Should show "Username can only contain letters, numbers, and underscores"

- **Email validation**: Enter "invalid-email"
  - Should show "Please enter a valid email address"

- **Password validation**: Enter "12345"
  - Should show "Password must be at least 6 characters"

- **Confirm Password**: Enter different passwords
  - Should show "Passwords do not match"

### 3. Test Login Flow

1. After signing up, click "Logout" in the dashboard
2. Click "Sign In" on the home page
3. Enter credentials:
   - **Username**: johndoe
   - **Password**: password123
4. Click "Sign in"
5. **Expected Result**:
   - Redirected to `/dashboard`
   - User information displayed correctly

### 4. Test Invalid Login

1. Go to `/login`
2. Enter incorrect credentials:
   - **Username**: wronguser
   - **Password**: wrongpass
3. Click "Sign in"
4. **Expected Result**:
   - Error message displayed: "Invalid credentials" or similar
   - User stays on login page

### 5. Test Protected Routes

1. While logged out, try to access `/dashboard` directly
2. **Expected Result**:
   - Automatically redirected to `/login`

### 6. Test Persistent Authentication

1. Log in successfully
2. Refresh the page (F5 or Cmd+R)
3. **Expected Result**:
   - User remains logged in
   - Dashboard still shows user information
   - No redirect to login page

### 7. Test Logout

1. While logged in, click "Logout" button
2. **Expected Result**:
   - Redirected to `/login` page
   - Trying to access `/dashboard` now redirects to login
   - Cookie is cleared (check browser DevTools → Application → Cookies)

### 8. Test Navigation

1. **While Logged Out**:
   - Click "Sign In" → Goes to `/login`
   - Click "Get Started" → Goes to `/signup`
   - Links between login and signup pages work

2. **While Logged In**:
   - Access to dashboard is available
   - Logout functionality works

## Browser DevTools Testing

### Check Cookies (Application Tab)
1. Open DevTools → Application → Cookies → http://localhost:5173
2. After login, you should see a cookie named `token` (or similar)
3. Cookie should have:
   - `HttpOnly`: Yes
   - `Secure`: No (in development)
   - `SameSite`: Lax or Strict

### Check Network Requests (Network Tab)
1. Open DevTools → Network
2. During login, observe:
   - POST request to `http://localhost:8002/api/auth/login`
   - Response should include Set-Cookie header
   - Status: 200 OK

3. During getCurrentUser:
   - GET request to `http://localhost:8002/api/user/current`
   - Request should include the cookie
   - Status: 200 OK

### Check Redux State (Redux DevTools)
1. Install Redux DevTools browser extension
2. Monitor state changes:
   - `auth.user`: Should contain user data when logged in
   - `auth.loading`: Should be true during API calls
   - `auth.error`: Should contain error messages when errors occur

## Common Issues & Solutions

### 1. CORS Errors
**Issue**: "Access to XMLHttpRequest has been blocked by CORS policy"

**Solution**: 
- Ensure backend has CORS configured with origin `http://localhost:5173`
- Check `credentials: true` is set in backend CORS config

### 2. Cookie Not Being Set
**Issue**: Login succeeds but user not persisted

**Solution**:
- Verify `withCredentials: true` in axios config
- Check backend is setting httpOnly cookie
- Ensure cookie domain matches

### 3. Protected Route Not Working
**Issue**: Can access dashboard without logging in

**Solution**:
- Check Redux state for user data
- Verify ProtectedRoute component logic
- Ensure `checkAuth` is being called on app load

### 4. Form Validation Not Working
**Issue**: Form submits with invalid data

**Solution**:
- Check Zod schemas are properly defined
- Verify react-hook-form is using zodResolver
- Check form field registration

## API Response Examples

### Successful Login Response
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

## Performance Testing

1. **Load Time**: Initial page load should be < 2 seconds
2. **Form Submission**: Should respond within 1-2 seconds
3. **Navigation**: Client-side routing should be instantaneous
4. **Auth Check**: Should complete within 500ms

## Accessibility Testing

1. **Keyboard Navigation**: Tab through all form fields and buttons
2. **Screen Reader**: Test with screen reader (NVDA, JAWS, or VoiceOver)
3. **Color Contrast**: Verify text is readable
4. **Error Messages**: Ensure error messages are announced

## Mobile Testing

1. Open http://localhost:5173 on mobile device (same network)
2. Test all flows on smaller screens
3. Verify responsive design works correctly
4. Test touch interactions