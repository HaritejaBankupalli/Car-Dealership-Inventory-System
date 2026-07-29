import React from 'react';
import { X, CheckCircle2, Printer, ShoppingBag, Car, Calendar, DollarSign, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function PaymentReceiptModal({ isOpen, onClose, vehicle, onOpenHistory }) {
  const { user } = useAuth();

  if (!isOpen || !vehicle) return null;

  const invoiceNumber = `INV-2026-${Math.floor(100000 + Math.random() * 900000)}`;
  const dateStr = new Date().toLocaleString();
  const totalPrice = Number(vehicle.price || 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl text-slate-800">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-lg transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Header */}
        <div className="flex flex-col items-center text-center pb-5 border-b border-slate-100">
          <div className="p-3 rounded-full bg-emerald-100 text-emerald-600 mb-2">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            Payment Successful
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-2">Official Purchase Receipt</h2>
          <p className="text-xs text-slate-500">Invoice ID: {invoiceNumber}</p>
        </div>

        {/* Receipt Content */}
        <div className="py-4 space-y-4 text-sm">
          {/* Customer & Date */}
          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <div>
              <p className="text-xs font-semibold text-slate-400">Billed To</p>
              <p className="font-bold text-slate-800">{user?.name || 'Customer'}</p>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-slate-400">Transaction Date</p>
              <p className="text-xs font-medium text-slate-700 mt-1">{dateStr}</p>
              <p className="text-[11px] text-slate-500">Method: JWT Instant Auth</p>
            </div>
          </div>

          {/* Vehicle Item */}
          <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-200/80 bg-white">
            {vehicle.image_url ? (
              <img
                src={vehicle.image_url}
                alt={vehicle.model}
                className="w-16 h-12 object-cover rounded-lg border border-slate-100"
              />
            ) : (
              <div className="w-16 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                <Car className="w-6 h-6" />
              </div>
            )}
            <div className="flex-1">
              <h4 className="font-bold text-slate-900">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </h4>
              <span className="inline-block px-2 py-0.5 text-[10px] font-semibold rounded bg-slate-100 text-slate-600">
                {vehicle.category}
              </span>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500">Qty: 1</p>
              <p className="font-bold text-slate-900">${totalPrice.toLocaleString()}</p>
            </div>
          </div>

          {/* Calculation Ledger */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span>${totalPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Dealership Processing Fee</span>
              <span className="text-emerald-600 font-medium">FREE ($0.00)</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Sales Tax</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
              <span>Total Paid</span>
              <span className="text-emerald-600">${totalPrice.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
          >
            <Printer className="w-4 h-4 text-slate-500" /> Print Bill
          </button>
          <button
            onClick={() => {
              onClose();
              if (onOpenHistory) onOpenHistory();
            }}
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition shadow-md"
          >
            <ShoppingBag className="w-4 h-4" /> My Purchases
          </button>
        </div>
      </div>
    </div>
  );
}
