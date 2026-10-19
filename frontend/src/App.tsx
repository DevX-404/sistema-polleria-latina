import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth, getRoleDefaultPath } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { AdminDashboard } from './pages/AdminDashboard';
import { CajeroDashboard } from './pages/CajeroDashboard';
import { MozoDashboard } from './pages/MozoDashboard';
import { CocinaDashboard } from './pages/CocinaDashboard';

const RootRedirect: React.FC = () => {
  const { isAuthenticated, role, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (isAuthenticated && role) {
    return <Navigate to={getRoleDefaultPath(role)} replace />;
  }

  return <Navigate to="/login" replace />;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Login Route */}
          <Route path="/login" element={<Login />} />

          {/* Root Redirect to Role Dashboard */}
          <Route path="/" element={<RootRedirect />} />

          {/* Role Protected Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/cajero"
            element={
              <ProtectedRoute allowedRoles={['CAJERO']}>
                <CajeroDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/mozo"
            element={
              <ProtectedRoute allowedRoles={['MESERO']}>
                <MozoDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/cocina"
            element={
              <ProtectedRoute allowedRoles={['COCINA']}>
                <CocinaDashboard />
              </ProtectedRoute>
            }
          />

          {/* Fallback to root */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
