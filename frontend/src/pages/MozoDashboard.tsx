import React, { useState } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import {
  Plus,
  Users,
  CheckCircle2
} from 'lucide-react';

type TableStatus = 'AVAILABLE' | 'OCCUPIED' | 'RESERVED';

interface RestaurantTable {
  id: number;
  number: number;
  capacity: number;
  status: TableStatus;
  waiter?: string;
  orderTotal?: number;
  timeOccupied?: string;
}

const INITIAL_TABLES: RestaurantTable[] = [
  { id: 1, number: 1, capacity: 4, status: 'AVAILABLE' },
  { id: 2, number: 2, capacity: 2, status: 'AVAILABLE' },
  { id: 3, number: 3, capacity: 4, status: 'OCCUPIED', waiter: 'mozo1', orderTotal: 84.50, timeOccupied: '35 min' },
  { id: 4, number: 4, capacity: 6, status: 'AVAILABLE' },
  { id: 5, number: 5, capacity: 4, status: 'OCCUPIED', waiter: 'mozo1', orderTotal: 120.00, timeOccupied: '20 min' },
  { id: 6, number: 6, capacity: 2, status: 'RESERVED' },
  { id: 7, number: 7, capacity: 4, status: 'OCCUPIED', waiter: 'mozo1', orderTotal: 42.00, timeOccupied: '10 min' },
  { id: 8, number: 8, capacity: 8, status: 'AVAILABLE' },
  { id: 9, number: 9, capacity: 4, status: 'AVAILABLE' },
  { id: 10, number: 10, capacity: 2, status: 'AVAILABLE' },
  { id: 11, number: 11, capacity: 6, status: 'OCCUPIED', waiter: 'mozo1', orderTotal: 138.00, timeOccupied: '45 min' },
  { id: 12, number: 12, capacity: 4, status: 'AVAILABLE' },
];

export const MozoDashboard: React.FC = () => {
  const [filter, setFilter] = useState<'ALL' | TableStatus>('ALL');
  const [selectedTable, setSelectedTable] = useState<RestaurantTable | null>(INITIAL_TABLES[2]);

  const filteredTables = INITIAL_TABLES.filter((t) => {
    if (filter === 'ALL') return true;
    return t.status === filter;
  });

  const getStatusBadge = (status: TableStatus) => {
    switch (status) {
      case 'AVAILABLE':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            Libre
          </span>
        );
      case 'OCCUPIED':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-[#E52E2E] border border-red-200">
            Ocupada
          </span>
        );
      case 'RESERVED':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            Reservada
          </span>
        );
    }
  };

  return (
    <AppLayout
      title="Mapa de Mesas y Salón"
      subtitle="Toma de pedidos, comandas y asignación de mesas"
    >
      {/* Top action & filter bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setFilter('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
              filter === 'ALL'
                ? 'bg-[#E52E2E] text-white shadow-md'
                : 'bg-white border border-gray-200 text-gray-600 hover:text-gray-900'
            }`}
          >
            Todas ({INITIAL_TABLES.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('AVAILABLE')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
              filter === 'AVAILABLE'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white border border-gray-200 text-gray-600 hover:text-gray-900'
            }`}
          >
            Libres ({INITIAL_TABLES.filter((t) => t.status === 'AVAILABLE').length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('OCCUPIED')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
              filter === 'OCCUPIED'
                ? 'bg-[#E52E2E] text-white shadow-md'
                : 'bg-white border border-gray-200 text-gray-600 hover:text-gray-900'
            }`}
          >
            Ocupadas ({INITIAL_TABLES.filter((t) => t.status === 'OCCUPIED').length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('RESERVED')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
              filter === 'RESERVED'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white border border-gray-200 text-gray-600 hover:text-gray-900'
            }`}
          >
            Reservadas ({INITIAL_TABLES.filter((t) => t.status === 'RESERVED').length})
          </button>
        </div>

        {/* Primary Action Button */}
        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#E52E2E] hover:bg-[#DC2626] text-white font-bold text-xs shadow-md shadow-red-950/20 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Comanda</span>
        </button>
      </div>

      {/* Main Grid: Tables & Selected Table Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Table Cards Grid */}
        <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
          {filteredTables.map((table) => {
            const isSelected = selectedTable?.id === table.id;
            return (
              <button
                key={table.id}
                type="button"
                onClick={() => setSelectedTable(table)}
                className={`p-4 rounded-2xl border text-left transition-all duration-150 relative flex flex-col justify-between h-32 active:scale-95 bg-white shadow-sm hover:shadow-md ${
                  isSelected
                    ? 'border-[#E52E2E] ring-2 ring-red-500/20'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl font-black text-gray-900">M#{table.number}</span>
                  {getStatusBadge(table.status)}
                </div>

                <div className="mt-auto">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Users className="w-3.5 h-3.5 text-gray-400" />
                    <span>Cap: {table.capacity} personas</span>
                  </div>

                  {table.status === 'OCCUPIED' && (
                    <div className="text-[11px] font-bold text-[#E52E2E] mt-1 truncate">
                      S/. {table.orderTotal?.toFixed(2)} • {table.timeOccupied}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Table Details Sidebar */}
        <div className="lg:col-span-4">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm sticky top-24">
            {selectedTable ? (
              <div>
                <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
                  <div>
                    <h3 className="text-xl font-black text-gray-900">Mesa #{selectedTable.number}</h3>
                    <p className="text-xs text-gray-500">Capacidad para {selectedTable.capacity} personas</p>
                  </div>
                  {getStatusBadge(selectedTable.status)}
                </div>

                {selectedTable.status === 'OCCUPIED' ? (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                      <div className="text-xs text-gray-500">Mozo responsable:</div>
                      <div className="text-sm font-bold text-gray-900">{selectedTable.waiter}</div>
                      <div className="text-xs text-gray-500 mt-2">Tiempo transcurrido:</div>
                      <div className="text-sm font-bold text-[#F59E0B]">{selectedTable.timeOccupied}</div>
                      <div className="text-xs text-gray-500 mt-2">Total acumulado:</div>
                      <div className="text-2xl font-black text-[#E52E2E]">
                        S/. {selectedTable.orderTotal?.toFixed(2)}
                      </div>
                    </div>

                    <button
                      type="button"
                      className="w-full py-3 rounded-xl bg-[#E52E2E] hover:bg-[#DC2626] text-white font-bold text-xs transition-all shadow-md shadow-red-950/20"
                    >
                      + Agregar Productos a Comanda
                    </button>

                    <button
                      type="button"
                      className="w-full py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-xs border border-gray-200 transition-all"
                    >
                      Pedir Cuenta para Cobro
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                    <p className="text-sm font-bold text-gray-900 mb-1">Mesa Libre</p>
                    <p className="text-xs text-gray-500 mb-5">
                      Lista para sentar comensales y registrar comanda.
                    </p>
                    <button
                      type="button"
                      className="w-full py-3 rounded-xl bg-[#E52E2E] hover:bg-[#DC2626] text-white font-bold text-xs transition-all shadow-md shadow-red-950/20"
                    >
                      Ocupar y Abrir Comanda
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400 text-xs">
                Selecciona una mesa en el mapa para ver sus detalles.
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
