import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './store/store';
import { ThemeProvider } from './contexts/ThemeContext';

// Eager load critical pages (first pages users see)
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';

// Eager load essential components
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load protected pages (loaded on-demand)
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Groups = lazy(() => import('./pages/Groups'));
const GroupDetails = lazy(() => import('./pages/GroupDetails'));
const Friends = lazy(() => import('./pages/Friends'));
const Activity = lazy(() => import('./pages/Activity'));
const AcceptInvite = lazy(() => import('./pages/AcceptInvite'));

// Loading fallback component
const PageLoader: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
      <p className="text-gray-600 text-sm">Loading...</p>
    </div>
  </div>
);

const AppContent: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes - No lazy loading */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Protected Routes - Lazy loaded */}
        <Route element={<ProtectedRoute />}>
          <Route
            path="/dashboard"
            element={
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <Dashboard />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path="/groups"
            element={
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <Groups />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path="/groups/:groupId"
            element={
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <GroupDetails />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path="/friends"
            element={
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <Friends />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path="/activity"
            element={
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <Activity />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path="/invite/:token"
            element={
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <AcceptInvite />
                </Suspense>
              </ErrorBoundary>
            }
          />
        </Route>

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <Toaster />
        <AppContent />
      </ThemeProvider>
    </Provider>
  );
};

export default App;
