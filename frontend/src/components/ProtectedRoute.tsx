import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth, getRoleDefaultPath } from '../context/AuthContext';
import { Role } from '../types/auth';
import { ShieldAlert, ArrowLeft, Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, role, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F6F7F9] flex flex-col items-center justify-center text-gray-600">
        <Loader2 className="w-10 h-10 animate-spin text-[#E52E2E] mb-4" />
        <p className="text-sm font-semibold tracking-wide">Cargando sesión...</p>
      </div>
    );
  }

  if (!isAuthenticated || !role) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    const destination = getRoleDefaultPath(role);

    return (
      <div className="min-h-screen bg-[#F6F7F9] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl max-w-md w-full text-center border border-gray-200 shadow-xl">
          <div className="w-16 h-16 bg-red-50 text-[#E52E2E] rounded-2xl flex items-center justify-center mx-auto mb-5 border border-red-100">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-2">Acceso No Autorizado (403)</h1>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            Tu rol actual (<span className="text-[#E52E2E] font-bold">{role}</span>) no tiene permisos para acceder a esta sección.
          </p>
          <Link
            to={destination}
            className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl font-bold bg-[#E52E2E] hover:bg-[#DC2626] text-white transition-all duration-200 shadow-md shadow-red-950/20 active:scale-95 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Ir a mi panel ({role})</span>
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
