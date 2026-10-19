import React, { useEffect, useState } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { useAuth } from '../context/AuthContext';
import {
  TrendingUp,
  Users,
  Utensils,
  DollarSign,
  ShieldCheck,
  Package,
  Layers,
  Settings,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { token } = useAuth();
  const [backendStatus, setBackendStatus] = useState<string>('Verificando acceso...');
  const [isAuthVerified, setIsAuthVerified] = useState<boolean>(false);

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const res = await fetch('/api/test/admin', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setBackendStatus(data.message || 'Autorización ADMIN confirmada');
          setIsAuthVerified(true);
        } else {
          setBackendStatus(`Error ${res.status}: Acceso no autorizado`);
          setIsAuthVerified(false);
        }
      } catch {
        setBackendStatus('No se pudo conectar con el endpoint de prueba');
        setIsAuthVerified(false);
      }
    };
    verifyAdmin();
  }, [token]);

  return (
    <AppLayout
      title="Panel de Administración"
      subtitle="Supervisión general del restaurante, ventas y configuración"
    >
      {/* Backend API Verification Banner */}
      <div className="mb-6 p-4 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
              Seguridad Backend (@PreAuthorize("hasRole('ADMIN')"))
            </div>
            <div className="text-sm font-bold text-gray-900 flex items-center gap-1.5 mt-0.5">
              {isAuthVerified ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-500" />
              )}
              <span>{backendStatus}</span>
            </div>
          </div>
        </div>
        <span className="text-xs px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 font-semibold">
          Token JWT Verificado
        </span>
      </div>

      {/* KPI Cards (White Cards, Rounded-2xl, Border-gray-200, Shadow-sm) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Ventas de Hoy</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900">S/. 3,845.00</div>
          <div className="flex items-center gap-1 mt-2">
            <span className="inline-flex items-center text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-md">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +14.2%
            </span>
            <span className="text-xs text-gray-500">vs ayer</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Mesas Ocupadas</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-[#F59E0B] flex items-center justify-center">
              <Utensils className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900">9 / 15</div>
          <p className="text-xs text-gray-500 mt-2 font-medium">60% de ocupación en salón</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pollos a la Brasa</span>
            <div className="w-9 h-9 rounded-xl bg-red-50 text-[#E52E2E] flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900">42 Unid.</div>
          <p className="text-xs text-gray-500 mt-2 font-medium">Despachados en el turno</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Personal en Turno</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900">4 Usuarios</div>
          <p className="text-xs text-gray-500 mt-2 font-medium">Admin, Cajero, Mozo, Cocina</p>
        </div>
      </div>

      {/* Modules Grid */}
      <h2 className="text-base font-bold text-gray-900 mb-4">Módulos Administrativos</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:border-[#E52E2E] hover:shadow-md transition-all duration-200 group">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-[#E52E2E] flex items-center justify-center mb-4 group-hover:bg-[#E52E2E] group-hover:text-white transition-colors">
            <Package className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-gray-900 text-base mb-1">Carta y Productos</h3>
          <p className="text-gray-500 text-xs mb-4 leading-relaxed">
            Gestión del catálogo, combos familiares a la brasa, precios y modificadores de cocina.
          </p>
          <span className="text-xs text-[#E52E2E] font-bold inline-flex items-center gap-1 group-hover:underline">
            Configurar Catálogo →
          </span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:border-[#F59E0B] hover:shadow-md transition-all duration-200 group">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#F59E0B] flex items-center justify-center mb-4 group-hover:bg-[#F59E0B] group-hover:text-white transition-colors">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-gray-900 text-base mb-1">Distribución de Mesas</h3>
          <p className="text-gray-500 text-xs mb-4 leading-relaxed">
            Plano físico del salón, numeración, capacidades y zonas de atención para meseros.
          </p>
          <span className="text-xs text-[#F59E0B] font-bold inline-flex items-center gap-1 group-hover:underline">
            Ver Salón →
          </span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:border-gray-800 hover:shadow-md transition-all duration-200 group">
          <div className="w-12 h-12 rounded-xl bg-gray-100 text-gray-800 flex items-center justify-center mb-4 group-hover:bg-[#1C1D1F] group-hover:text-white transition-colors">
            <Settings className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-gray-900 text-base mb-1">Usuarios y PINs</h3>
          <p className="text-gray-500 text-xs mb-4 leading-relaxed">
            Control de accesos de personal, reinicio de PINs de 4 dígitos y desbloqueo de cuentas.
          </p>
          <span className="text-xs text-gray-700 font-bold inline-flex items-center gap-1 group-hover:underline">
            Gestionar Personal →
          </span>
        </div>
      </div>
    </AppLayout>
  );
};
