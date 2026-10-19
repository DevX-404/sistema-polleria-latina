import React, { useState } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import {
  Clock,
  CheckCircle,
  Flame,
  Play,
  Check
} from 'lucide-react';

interface TicketItem {
  name: string;
  quantity: number;
  modifiers?: string[];
}

interface KitchenTicket {
  id: number;
  orderNumber: string;
  tableNumber: number;
  timeElapsed: string;
  isUrgent?: boolean;
  status: 'PENDING' | 'COOKING' | 'READY';
  items: TicketItem[];
}

const INITIAL_TICKETS: KitchenTicket[] = [
  {
    id: 1,
    orderNumber: '#1042',
    tableNumber: 3,
    timeElapsed: '18 min',
    isUrgent: true,
    status: 'COOKING',
    items: [
      { name: '1/2 Pollo a la Brasa', quantity: 1, modifiers: ['Papas doradas', 'Ensalada clásica'] },
      { name: '1/4 Pollo', quantity: 1, modifiers: ['Parte Pecho', 'Ají extra'] },
      { name: 'Porción Crema Huancaína', quantity: 2 },
    ],
  },
  {
    id: 2,
    orderNumber: '#1043',
    tableNumber: 7,
    timeElapsed: '7 min',
    status: 'PENDING',
    items: [
      { name: '1 Pollo a la Brasa Entero Familiar', quantity: 1, modifiers: ['Papas crocantes', 'Ensalada mixta', 'Todas las cremas'] },
      { name: 'Porción Tequeños Brasa (6 unid.)', quantity: 1 },
    ],
  },
  {
    id: 3,
    orderNumber: '#1044',
    tableNumber: 11,
    timeElapsed: '2 min',
    status: 'PENDING',
    items: [
      { name: '1/4 Pollo', quantity: 2, modifiers: ['1x Pierna', '1x Pecho'] },
      { name: 'Chaufa de Pollo Especial', quantity: 1 },
    ],
  },
  {
    id: 4,
    orderNumber: '#1040',
    tableNumber: 5,
    timeElapsed: '24 min',
    status: 'READY',
    items: [
      { name: '1/2 Pollo a la Brasa', quantity: 1 },
      { name: 'Papas Nativas Fritas', quantity: 1 },
    ],
  },
];

export const CocinaDashboard: React.FC = () => {
  const [tickets, setTickets] = useState<KitchenTicket[]>(INITIAL_TICKETS);

  const updateStatus = (id: number, nextStatus: 'COOKING' | 'READY' | 'DONE') => {
    if (nextStatus === 'DONE') {
      setTickets((prev) => prev.filter((t) => t.id !== id));
    } else {
      setTickets((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: nextStatus } : t))
      );
    }
  };

  const pendingCount = tickets.filter((t) => t.status === 'PENDING').length;
  const cookingCount = tickets.filter((t) => t.status === 'COOKING').length;
  const readyCount = tickets.filter((t) => t.status === 'READY').length;

  return (
    <AppLayout
      title="Sistema KDS de Cocina"
      subtitle="Comandas en tiempo real, tiempos de cocción y despacho al salón"
    >
      {/* KDS Metric Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Por Atender</span>
            <div className="text-2xl font-black text-gray-900">{pendingCount} Comandas</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#F59E0B] flex items-center justify-center font-bold text-sm border border-amber-100">
            {pendingCount}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">En Brasa / Horno</span>
            <div className="text-2xl font-black text-[#E52E2E]">{cookingCount} En Proceso</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-50 text-[#E52E2E] flex items-center justify-center font-bold border border-red-100">
            <Flame className="w-5 h-5 text-[#E52E2E] animate-pulse" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Listos para Mozo</span>
            <div className="text-2xl font-black text-emerald-600">{readyCount} Despacho</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold border border-emerald-100">
            <Check className="w-5 h-5 text-emerald-600" />
          </div>
        </div>
      </div>

      {/* Tickets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {tickets.map((ticket) => {
          const isUrgent = ticket.isUrgent;
          const isReady = ticket.status === 'READY';
          const isCooking = ticket.status === 'COOKING';

          return (
            <div
              key={ticket.id}
              className={`bg-white rounded-2xl border flex flex-col justify-between overflow-hidden transition-all duration-200 shadow-sm hover:shadow-md ${
                isReady
                  ? 'border-emerald-400 ring-1 ring-emerald-400/30'
                  : isUrgent
                  ? 'border-red-500 ring-2 ring-red-400/20'
                  : isCooking
                  ? 'border-amber-400 ring-1 ring-amber-400/30'
                  : 'border-gray-200'
              }`}
            >
              {/* Ticket Header */}
              <div
                className={`p-4 border-b flex items-center justify-between ${
                  isReady
                    ? 'bg-emerald-50 border-emerald-100'
                    : isUrgent
                    ? 'bg-red-50 border-red-100'
                    : isCooking
                    ? 'bg-amber-50 border-amber-100'
                    : 'bg-gray-50 border-gray-100'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-gray-900">M#{ticket.tableNumber}</span>
                    <span className="text-xs font-mono font-bold text-gray-500">{ticket.orderNumber}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div
                    className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${
                      isUrgent
                        ? 'bg-red-100 text-red-700 animate-pulse border border-red-200'
                        : 'bg-white border border-gray-200 text-gray-700'
                    }`}
                  >
                    <Clock className="w-3 h-3 text-gray-500" />
                    <span>{ticket.timeElapsed}</span>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="p-4 space-y-3 flex-1">
                {ticket.items.map((item, idx) => (
                  <div key={idx} className="border-b border-gray-100 pb-2.5 last:border-0 last:pb-0">
                    <div className="flex items-start gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-red-50 text-[#E52E2E] flex items-center justify-center font-black text-xs flex-shrink-0 border border-red-100">
                        {item.quantity}x
                      </span>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-gray-900 leading-tight">{item.name}</div>
                        {item.modifiers && item.modifiers.length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {item.modifiers.map((mod, mIdx) => (
                              <span
                                key={mIdx}
                                className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200"
                              >
                                {mod}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Ticket Footer Actions */}
              <div className="p-3 border-t border-gray-100 bg-gray-50/80">
                {ticket.status === 'PENDING' && (
                  <button
                    type="button"
                    onClick={() => updateStatus(ticket.id, 'COOKING')}
                    className="w-full py-2.5 rounded-xl bg-[#E52E2E] hover:bg-[#DC2626] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Iniciar Preparación</span>
                  </button>
                )}

                {ticket.status === 'COOKING' && (
                  <button
                    type="button"
                    onClick={() => updateStatus(ticket.id, 'READY')}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Marcar Plato Listo</span>
                  </button>
                )}

                {ticket.status === 'READY' && (
                  <button
                    type="button"
                    onClick={() => updateStatus(ticket.id, 'DONE')}
                    className="w-full py-2.5 rounded-xl bg-white hover:bg-gray-100 text-emerald-700 font-bold text-xs flex items-center justify-center gap-1.5 border border-emerald-300 shadow-xs active:scale-95 transition-all"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Despachado al Salón</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </AppLayout>
  );
};
