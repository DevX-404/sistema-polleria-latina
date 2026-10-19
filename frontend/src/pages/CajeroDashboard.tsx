import React, { useState } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import {
  CreditCard,
  Receipt,
  CircleDollarSign,
  QrCode,
  Clock,
  Printer
} from 'lucide-react';

interface PendingBill {
  tableNumber: number;
  waiter: string;
  itemsCount: number;
  total: number;
  timeWaiting: string;
}

const SAMPLE_BILLS: PendingBill[] = [
  { tableNumber: 3, waiter: 'mozo1', itemsCount: 4, total: 84.50, timeWaiting: '8 min' },
  { tableNumber: 7, waiter: 'mozo1', itemsCount: 2, total: 42.00, timeWaiting: '3 min' },
  { tableNumber: 11, waiter: 'mozo1', itemsCount: 6, total: 138.00, timeWaiting: '12 min' },
];

export const CajeroDashboard: React.FC = () => {
  const [selectedTable, setSelectedTable] = useState<number>(3);

  return (
    <AppLayout
      title="Caja y Facturación"
      subtitle="Cobro de comandas, emisión de boletas/facturas y arqueo de caja"
    >
      {/* Caja Status Strip (White Cards, Border-gray-200) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <CircleDollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">Total Cobrado Hoy</span>
            <div className="text-2xl font-black text-gray-900">S/. 2,150.00</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-[#E52E2E] flex items-center justify-center border border-red-100">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">Cuentas por Cobrar</span>
            <div className="text-2xl font-black text-[#E52E2E]">3 Mesas</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
            <QrCode className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">Yape / Plin</span>
            <div className="text-2xl font-black text-gray-900">S/. 1,320.00</div>
          </div>
        </div>
      </div>

      {/* Main Split: Pending Tables & Billing Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Pending Tables List */}
        <div className="lg:col-span-5 space-y-3">
          <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2 uppercase tracking-wide">
            <Clock className="w-4 h-4 text-[#F59E0B]" />
            Mesas que solicitaron Cuenta
          </h2>

          <div className="space-y-2.5">
            {SAMPLE_BILLS.map((bill) => {
              const isSelected = selectedTable === bill.tableNumber;
              return (
                <button
                  key={bill.tableNumber}
                  type="button"
                  onClick={() => setSelectedTable(bill.tableNumber)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all duration-150 flex items-center justify-between shadow-sm ${
                    isSelected
                      ? 'bg-white border-[#E52E2E] ring-2 ring-red-500/20 shadow-md'
                      : 'bg-white hover:bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${
                        isSelected
                          ? 'bg-[#E52E2E] text-white shadow-sm'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      M{bill.tableNumber}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-sm">Mesa #{bill.tableNumber}</div>
                      <div className="text-xs text-gray-500">
                        Atiende <span className="text-gray-700 font-semibold">{bill.waiter}</span> • {bill.itemsCount} ítems
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-base font-black text-gray-900">S/. {bill.total.toFixed(2)}</div>
                    <div className="text-[11px] text-amber-600 font-semibold flex items-center justify-end gap-1">
                      <Clock className="w-3 h-3" /> hace {bill.timeWaiting}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Payment Preview Box */}
        <div className="lg:col-span-7">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-5 border-b border-gray-100 pb-4">
              <div>
                <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                  <span>Detalle de Cobro: Mesa #{selectedTable}</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                    Lista para pago
                  </span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Comanda #1042 - Consumo en Salón</p>
              </div>
              <button
                type="button"
                className="px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" /> Imprimir Pre-cuenta
              </button>
            </div>

            {/* Sample items */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center justify-between text-xs py-2 border-b border-gray-100">
                <span className="text-gray-700 font-medium">1x 1/2 Pollo a la Brasa + Papas + Ensalada</span>
                <span className="text-gray-900 font-bold">S/. 42.00</span>
              </div>
              <div className="flex items-center justify-between text-xs py-2 border-b border-gray-100">
                <span className="text-gray-700 font-medium">1x 1/4 Pollo Parte Pecho</span>
                <span className="text-gray-900 font-bold">S/. 23.50</span>
              </div>
              <div className="flex items-center justify-between text-xs py-2 border-b border-gray-100">
                <span className="text-gray-700 font-medium">1x Jarra Chicha Morada Especial 1.5L</span>
                <span className="text-gray-900 font-bold">S/. 14.00</span>
              </div>
              <div className="flex items-center justify-between text-xs py-2">
                <span className="text-gray-700 font-medium">2x Porción Crema Huancaína Extra</span>
                <span className="text-gray-900 font-bold">S/. 5.00</span>
              </div>
            </div>

            {/* Totals */}
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 mb-6">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>Subtotal (Op. Gravada):</span>
                <span>S/. 71.61</span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                <span>IGV (18%):</span>
                <span>S/. 12.89</span>
              </div>
              <div className="flex items-center justify-between text-lg font-black text-gray-900 pt-2 border-t border-gray-200">
                <span>Total a Cobrar:</span>
                <span className="text-[#E52E2E] font-black text-2xl">S/. 84.50</span>
              </div>
            </div>

            {/* Payment Method Action Buttons */}
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                className="p-3.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 flex flex-col items-center justify-center gap-1.5 text-xs font-bold text-gray-900 transition-all active:scale-95 hover:border-gray-300"
              >
                <CircleDollarSign className="w-5 h-5 text-emerald-600" />
                <span>Efectivo</span>
              </button>
              <button
                type="button"
                className="p-3.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 flex flex-col items-center justify-center gap-1.5 text-xs font-bold text-gray-900 transition-all active:scale-95 hover:border-gray-300"
              >
                <QrCode className="w-5 h-5 text-purple-600" />
                <span>Yape / Plin</span>
              </button>
              <button
                type="button"
                className="p-3.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 flex flex-col items-center justify-center gap-1.5 text-xs font-bold text-gray-900 transition-all active:scale-95 hover:border-gray-300"
              >
                <CreditCard className="w-5 h-5 text-blue-600" />
                <span>Tarjeta POS</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
