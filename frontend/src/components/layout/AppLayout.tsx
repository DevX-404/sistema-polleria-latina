import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Role } from '../../types/auth';
import {
  Flame,
  LayoutDashboard,
  UtensilsCrossed,
  Receipt,
  ChefHat,
  LogOut,
  Clock,
  Menu,
  X,
  Store,
  ChevronRight
} from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  allowedRoles?: Role[];
}

const NAV_ITEMS: NavItem[] = [
  {
    name: 'Administración',
    path: '/admin',
    icon: <LayoutDashboard className="w-5 h-5" />,
    allowedRoles: ['ADMIN'],
  },
  {
    name: 'Mesas y Comandas',
    path: '/mozo',
    icon: <UtensilsCrossed className="w-5 h-5" />,
    allowedRoles: ['ADMIN', 'MESERO'],
  },
  {
    name: 'Caja y Facturación',
    path: '/cajero',
    icon: <Receipt className="w-5 h-5" />,
    allowedRoles: ['ADMIN', 'CAJERO'],
  },
  {
    name: 'Cocina (KDS)',
    path: '/cocina',
    icon: <ChefHat className="w-5 h-5" />,
    allowedRoles: ['ADMIN', 'COCINA'],
  },
];

export const AppLayout: React.FC<AppLayoutProps> = ({ children, title, subtitle }) => {
  const { user, role, logout } = useAuth();
  const location = useLocation();

  const [currentTime, setCurrentTime] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const visibleNavItems = NAV_ITEMS.filter((item) => {
    if (!item.allowedRoles || !role) return true;
    return item.allowedRoles.includes(role);
  });

  return (
    <div className="min-h-screen bg-[#F6F7F9] flex text-gray-900 font-sans">
      {/* 1. Left Fixed Sidebar (Desktop) */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-[#1C1D1F] text-white flex-shrink-0 z-30 shadow-xl justify-between border-r border-white/5">
        <div>
          {/* Brand Header */}
          <div className="h-20 flex items-center gap-3 px-6 border-b border-white/10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#E52E2E] via-[#F59E0B] to-[#F1C40F] p-0.5 shadow-md shadow-red-950/30 flex items-center justify-center">
              <div className="w-full h-full bg-[#1C1D1F] rounded-[10px] flex items-center justify-center">
                <Flame className="w-6 h-6 text-[#F59E0B] fill-[#F59E0B]" />
              </div>
            </div>
            <div>
              <div className="text-base font-extrabold tracking-tight text-white leading-none">
                Pollería <span className="text-[#E52E2E]">Latina</span>
              </div>
              <span className="text-[10px] font-bold tracking-widest text-[#F59E0B] uppercase mt-1 inline-block">
                Sistema POS
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="px-4 py-6">
            <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 px-3 mb-3">
              Módulos del Sistema
            </div>
            <nav className="space-y-1.5">
              {visibleNavItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${
                      isActive
                        ? 'bg-[#E52E2E] text-white shadow-md shadow-red-950/40 font-bold'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span className={isActive ? 'text-white' : 'text-gray-400'}>{item.icon}</span>
                    <span>{item.name}</span>
                    {isActive && <ChevronRight className="w-4 h-4 ml-auto text-white/80" />}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Sidebar Footer: User Card & Logout */}
        <div className="p-4 border-t border-white/10 bg-[#161718]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-[#2A2C30] text-[#F59E0B] flex items-center justify-center font-bold text-sm border border-white/10 flex-shrink-0">
                {user?.username.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate">{user?.username}</div>
                <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wide truncate">
                  Rol: <span className="text-[#F59E0B] font-semibold">{role}</span>
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold bg-white/5 hover:bg-red-600/20 text-gray-300 hover:text-red-400 border border-white/5 hover:border-red-500/30 transition-all duration-150 active:scale-95"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* 2. Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 bg-[#1C1D1F] text-white flex flex-col justify-between p-4 z-10 shadow-2xl">
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <Flame className="w-6 h-6 text-[#F59E0B]" />
                  <span className="font-extrabold text-base">Pollería Latina</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1.5">
                {visibleNavItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-[#E52E2E] text-white font-bold shadow-md'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <button
              type="button"
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold bg-red-600/20 text-red-300 border border-red-500/30"
            >
              <LogOut className="w-4 h-4" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. Main Area with Topbar + Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between shadow-sm sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-black text-gray-900 leading-tight">{title}</h1>
              {subtitle && <p className="text-xs text-gray-500 hidden sm:block">{subtitle}</p>}
            </div>
          </div>

          {/* Right Status Strip */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Status "Local Abierto" */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 font-semibold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <Store className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Local abierto</span>
            </div>

            {/* Clock */}
            <div className="hidden md:flex items-center gap-1.5 text-xs font-mono font-medium text-gray-600 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-lg">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              <span>{currentTime}</span>
            </div>

            {/* User Profile Badge */}
            <div className="flex items-center gap-2 pl-2 sm:border-l sm:border-gray-200">
              <div className="w-8 h-8 rounded-full bg-[#1C1D1F] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {user?.username.charAt(0).toUpperCase()}
              </div>
              <div className="text-left hidden md:block">
                <div className="text-xs font-bold text-gray-900 leading-none">{user?.username}</div>
                <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">{role}</span>
              </div>
            </div>

            {/* Quick Logout for mobile/tablet */}
            <button
              onClick={logout}
              title="Cerrar sesión"
              className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
