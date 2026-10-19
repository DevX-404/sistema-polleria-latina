import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, getRoleDefaultPath } from '../context/AuthContext';
import { Role } from '../types/auth';
import {
  Flame,
  Lock,
  Delete,
  RotateCcw,
  User,
  Shield,
  CreditCard,
  UtensilsCrossed,
  ChefHat,
  Loader2,
  AlertCircle
} from 'lucide-react';

interface PresetUser {
  username: string;
  label: string;
  role: Role;
  icon: React.ReactNode;
}

const PRESET_USERS: PresetUser[] = [
  {
    username: 'admin',
    label: 'Administrador',
    role: 'ADMIN',
    icon: <Shield className="w-5 h-5" />,
  },
  {
    username: 'cajero1',
    label: 'Cajero',
    role: 'CAJERO',
    icon: <CreditCard className="w-5 h-5" />,
  },
  {
    username: 'mozo1',
    label: 'Mesero / Mozo',
    role: 'MESERO',
    icon: <UtensilsCrossed className="w-5 h-5" />,
  },
  {
    username: 'cocina1',
    label: 'Cocina',
    role: 'COCINA',
    icon: <ChefHat className="w-5 h-5" />,
  },
];

export const Login: React.FC = () => {
  const { login, isAuthenticated, role, error, isLocked, isLoading, clearError } = useAuth();
  const navigate = useNavigate();

  const [selectedUser, setSelectedUser] = useState<string>('admin');
  const [isManualInput, setIsManualInput] = useState<boolean>(false);
  const [manualUsername, setManualUsername] = useState<string>('');
  const [pin, setPin] = useState<string>('');
  const [isShaking, setIsShaking] = useState<boolean>(false);

  // If already authenticated, redirect to default path
  useEffect(() => {
    if (isAuthenticated && role) {
      navigate(getRoleDefaultPath(role), { replace: true });
    }
  }, [isAuthenticated, role, navigate]);

  // Trigger shake animation when error occurs
  useEffect(() => {
    if (error) {
      setIsShaking(true);
      const timer = setTimeout(() => setIsShaking(false), 500);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const activeUsername = isManualInput ? manualUsername.trim() : selectedUser;

  // Handle digit input
  const handleDigit = (digit: string) => {
    if (isLocked || isLoading) return;
    if (pin.length < 4) {
      clearError();
      const newPin = pin + digit;
      setPin(newPin);

      // Auto submit when 4 digits are entered
      if (newPin.length === 4) {
        handleSubmit(newPin);
      }
    }
  };

  const handleDelete = () => {
    if (isLocked || isLoading) return;
    clearError();
    setPin((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    if (isLocked || isLoading) return;
    clearError();
    setPin('');
  };

  const handleSubmit = async (pinToSubmit?: string) => {
    const finalPin = pinToSubmit || pin;
    if (!activeUsername) {
      return;
    }
    if (finalPin.length !== 4) {
      return;
    }

    const success = await login(activeUsername, finalPin);
    if (!success) {
      setPin('');
    }
  };

  // Keyboard navigation support for desktop
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLocked || isLoading) return;
      if (e.key >= '0' && e.key <= '9') {
        handleDigit(e.key);
      } else if (e.key === 'Backspace') {
        handleDelete();
      } else if (e.key === 'Escape') {
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pin, isLocked, isLoading, activeUsername]);

  return (
    <div className="min-h-screen bg-[#1C1D1F] flex flex-col items-center justify-center p-4 select-none relative overflow-hidden">
      {/* Subtle radial warmth in background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-red-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-amber-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#E52E2E] via-[#F59E0B] to-[#F1C40F] p-0.5 shadow-xl shadow-red-950/30 mb-3">
            <div className="w-full h-full bg-[#1C1D1F] rounded-[14px] flex items-center justify-center">
              <Flame className="w-8 h-8 text-[#F59E0B] fill-[#F59E0B]" />
            </div>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">
            Pollería <span className="text-[#E52E2E]">Latina</span>
          </h1>
          <p className="text-gray-400 text-xs mt-1 uppercase tracking-widest font-semibold">
            Punto de Venta & Comandas
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-[#242629]/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/10">
          {/* User Selection Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#F59E0B]" />
                Selecciona tu Usuario
              </label>
              <button
                type="button"
                onClick={() => {
                  setIsManualInput(!isManualInput);
                  clearError();
                  setPin('');
                }}
                className="text-xs text-[#F59E0B] hover:text-amber-400 underline underline-offset-2 transition-colors font-medium"
              >
                {isManualInput ? 'Usuarios rápidos' : 'Otro usuario'}
              </button>
            </div>

            {!isManualInput ? (
              <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                {PRESET_USERS.map((preset) => {
                  const isSelected = selectedUser === preset.username;
                  return (
                    <button
                      key={preset.username}
                      type="button"
                      onClick={() => {
                        setSelectedUser(preset.username);
                        clearError();
                        setPin('');
                      }}
                      className={`flex items-center gap-2.5 p-3 rounded-2xl border text-left transition-all duration-150 active:scale-95 ${
                        isSelected
                          ? 'bg-[#E52E2E] border-[#E52E2E] text-white shadow-lg shadow-red-950/40 ring-1 ring-red-400/50'
                          : 'bg-[#1C1D1F]/70 hover:bg-[#2C2E32] border-white/5 text-gray-300 hover:text-white'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                          isSelected ? 'bg-black/25 text-white' : 'bg-[#2B2D31] text-gray-300'
                        }`}
                      >
                        {preset.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold truncate">{preset.username}</div>
                        <div className={`text-[10px] font-medium truncate ${isSelected ? 'text-red-100' : 'text-gray-400'}`}>
                          {preset.label}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div>
                <input
                  type="text"
                  placeholder="Ingresa tu username o ID..."
                  value={manualUsername}
                  onChange={(e) => {
                    setManualUsername(e.target.value);
                    clearError();
                  }}
                  className="w-full px-4 py-3 bg-[#1C1D1F] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#E52E2E] focus:ring-1 focus:ring-[#E52E2E] text-sm font-medium transition-all"
                />
              </div>
            )}
          </div>

          {/* PIN Dots Indicator */}
          <div className="mb-6 text-center">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest block mb-3">
              Ingresa tu PIN (4 dígitos)
            </span>

            <div
              className={`flex items-center justify-center gap-4 py-2 ${
                isShaking ? 'animate-shake' : ''
              }`}
            >
              {[0, 1, 2, 3].map((index) => {
                const isFilled = pin.length > index;
                return (
                  <div
                    key={index}
                    className={`w-5 h-5 rounded-full transition-all duration-200 transform ${
                      isFilled
                        ? 'bg-[#E52E2E] scale-125 shadow-lg shadow-red-600/40 ring-2 ring-red-400/40'
                        : 'bg-[#1C1D1F] border border-white/10 scale-100'
                    }`}
                  />
                );
              })}
            </div>
          </div>

          {/* Error / Locked Alert */}
          {error && (
            <div
              className={`mb-5 p-3.5 rounded-2xl border text-xs leading-relaxed flex items-start gap-2.5 ${
                isLocked
                  ? 'bg-red-950/70 border-red-500/50 text-red-200 shadow-lg shadow-red-950/40'
                  : 'bg-amber-950/50 border-amber-500/40 text-amber-200'
              }`}
            >
              {isLocked ? (
                <Lock className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5 animate-bounce" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1 font-medium">{error}</div>
            </div>
          )}

          {/* Numeric Keypad */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
              <button
                key={digit}
                type="button"
                disabled={isLocked || isLoading}
                onClick={() => handleDigit(digit.toString())}
                className="h-14 sm:h-16 rounded-2xl bg-[#2D2F33] hover:bg-[#383A3F] border border-white/5 hover:border-white/10 text-xl font-bold text-white transition-all duration-150 active:scale-95 active:bg-[#E52E2E] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center shadow-sm"
              >
                {digit}
              </button>
            ))}

            {/* Clear Button */}
            <button
              type="button"
              disabled={isLocked || isLoading || pin.length === 0}
              onClick={handleClear}
              className="h-14 sm:h-16 rounded-2xl bg-[#1C1D1F] hover:bg-[#252629] border border-white/5 text-xs font-bold text-gray-400 hover:text-white transition-all duration-150 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex flex-col items-center justify-center gap-1"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Limpiar</span>
            </button>

            {/* 0 Button */}
            <button
              type="button"
              disabled={isLocked || isLoading}
              onClick={() => handleDigit('0')}
              className="h-14 sm:h-16 rounded-2xl bg-[#2D2F33] hover:bg-[#383A3F] border border-white/5 hover:border-white/10 text-xl font-bold text-white transition-all duration-150 active:scale-95 active:bg-[#E52E2E] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center shadow-sm"
            >
              0
            </button>

            {/* Backspace Button */}
            <button
              type="button"
              disabled={isLocked || isLoading || pin.length === 0}
              onClick={handleDelete}
              className="h-14 sm:h-16 rounded-2xl bg-[#1C1D1F] hover:bg-[#252629] border border-white/5 text-xs font-bold text-gray-400 hover:text-white transition-all duration-150 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex flex-col items-center justify-center gap-1"
            >
              <Delete className="w-4 h-4" />
              <span>Borrar</span>
            </button>
          </div>

          {/* Status Indicator */}
          {isLoading && (
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[#F59E0B] font-semibold animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Verificando PIN...</span>
            </div>
          )}

          {/* Helper hint */}
          <div className="mt-5 pt-4 border-t border-white/10 text-center">
            <p className="text-[11px] text-gray-400">
              PIN de prueba predeterminado:{' '}
              <span className="font-mono font-bold text-[#F59E0B]">1234</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
