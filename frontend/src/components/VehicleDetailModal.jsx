import React, { useState } from 'react';
import { X, Tag, Calendar, Gauge, ShoppingCart, ShieldCheck, Truck, Zap, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

export default function VehicleDetailModal({ vehicle, isOpen, onClose, onPurchase }) {
  const { isAdmin } = useAuth();
  const [busy, setBusy] = useState(false);

  if (!isOpen || !vehicle) return null;

  const outOfStock = vehicle.quantity === 0;

  const handleBuy = async () => {
    setBusy(true);
    await onPurchase(vehicle.id);
    setBusy(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl text-slate-800">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full transition bg-slate-100 hover:bg-slate-200"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Grid: Image Left, Details Right (Flipkart Style) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Left Column: Big Product Image */}
          <div className="flex flex-col gap-3">
            <div className="h-64 sm:h-72 w-full rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden relative group">
              {vehicle.image_url ? (
                <img
                  src={vehicle.image_url}
                  alt={`${vehicle.make} ${vehicle.model}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 font-extrabold text-5xl">
                  {vehicle.make?.[0]}
                  {vehicle.model?.[0]}
                </div>
              )}
              <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-slate-800 text-xs font-bold px-3 py-1 rounded-full border border-slate-200 shadow-sm flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-brand-600" /> {vehicle.category}
              </span>
            </div>

            {/* Quality Badges */}
            <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-medium text-slate-600 pt-1">
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Inspected</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center gap-1">
                <Truck className="w-4 h-4 text-brand-600" />
                <span>Free Delivery</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center gap-1">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Instant Title</span>
              </div>
            </div>
          </div>

          {/* Right Column: Title, Price, Specs & Buy Action */}
          <div className="flex flex-col">
            <div className="border-b border-slate-100 pb-4">
              <p className="text-xs font-bold uppercase tracking-wider text-brand-600">
                {vehicle.make} Dealership Collection
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </h2>

              <div className="flex items-center gap-4 mt-3">
                <span className="text-3xl font-extrabold text-emerald-600 tracking-tight">
                  {currency.format(vehicle.price)}
                </span>
                <span
                  className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                    outOfStock
                      ? 'bg-red-50 text-red-600 border border-red-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  {outOfStock ? 'Out of Stock' : `${vehicle.quantity} Available in Stock`}
                </span>
              </div>
            </div>

            {/* Technical Specs List */}
            <div className="py-4 space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Vehicle Specifications
              </h4>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">Model Year</span>
                  <span className="font-bold text-slate-800">{vehicle.year || '2024'}</span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">Body Style</span>
                  <span className="font-bold text-slate-800">{vehicle.category}</span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">Engine / Fuel</span>
                  <span className="font-bold text-slate-800">
                    {vehicle.category === 'Electric' ? 'Dual-Motor EV' : 'V6 / V8 Gasoline'}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">Warranty</span>
                  <span className="font-bold text-emerald-600">3-Year Dealership</span>
                </div>
              </div>
            </div>

            {/* Flipkart Style Buy Action */}
            <div className="mt-auto pt-4 border-t border-slate-100">
              <button
                onClick={handleBuy}
                disabled={outOfStock || busy}
                className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-base font-bold py-3 rounded-xl transition shadow-lg shadow-brand-600/20"
              >
                <ShoppingCart className="w-5 h-5" />
                {outOfStock ? 'Out of Stock' : 'Buy Now'}
              </button>
              <p className="text-[11px] text-slate-400 text-center mt-2 flex items-center justify-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                Includes instant digital payment receipt & invoice bill
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
