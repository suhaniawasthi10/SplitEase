import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { checkAuth } from '../store/authSlice';

const ProtectedRoute: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state) => state.auth);
  const [isChecking, setIsChecking] = React.useState(false);

  useEffect(() => {
    // Check authentication status only once on mount if user is not already logged in
    if (!user) {
      setIsChecking(true);
      dispatch(checkAuth()).finally(() => setIsChecking(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Show loading spinner while checking authentication
  if (loading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Render child routes if authenticated
  return <Outlet />;
};

export default ProtectedRoute;