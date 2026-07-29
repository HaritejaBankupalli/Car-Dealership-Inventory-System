import { useState } from 'react';
import { Gauge, Tag, Calendar, ShoppingCart, PackagePlus, Pencil, Trash2, Eye } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

export default function VehicleCard({ vehicle, onSelect, onPurchase, onRestock, onEdit, onDelete }) {
  const { isAdmin } = useAuth();
  const [busy, setBusy] = useState(false);
  const outOfStock = vehicle.quantity === 0;

  async function handlePurchase(e) {
    e.stopPropagation();
    setBusy(true);
    await onPurchase(vehicle);
    setBusy(false);
  }

  async function handleRestock(e) {
    e.stopPropagation();
    setBusy(true);
    await onRestock(vehicle.id);
    setBusy(false);
  }

  return (
    <div
      onClick={() => onSelect(vehicle)}
      className="group cursor-pointer rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-brand-300 transition-all duration-300 overflow-hidden flex flex-col"
    >
      {/* Image Container */}
      <div className="h-44 bg-slate-100 relative overflow-hidden flex items-center justify-center">
        {vehicle.image_url ? (
          <img
            src={vehicle.image_url}
            alt={`${vehicle.make} ${vehicle.model}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-400">
            <span className="text-4xl font-extrabold tracking-widest uppercase">
              {vehicle.make?.[0]}
              {vehicle.model?.[0]}
            </span>
          </div>
        )}

        <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-slate-700 border border-slate-200 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
          <Tag className="w-3 h-3 text-brand-600" /> {vehicle.category}
        </span>

        {/* Flipkart Style View Details Overlay Badge */}
        <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 text-slate-900 text-xs font-bold shadow-lg">
            <Eye className="w-4 h-4 text-brand-600" /> View Specs
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-lg tracking-tight group-hover:text-brand-600 transition">
              {vehicle.make} {vehicle.model}
            </h3>
            <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
              {vehicle.year && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" /> {vehicle.year}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Gauge className="w-3.5 h-3.5 text-slate-400" />
                <span className={outOfStock ? 'text-red-600 font-semibold' : 'text-slate-600'}>
                  {outOfStock ? 'Out of Stock' : `${vehicle.quantity} in stock`}
                </span>
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xl font-extrabold text-emerald-600 tracking-tight">
              {currency.format(vehicle.price)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-auto pt-3 flex flex-wrap gap-2 border-t border-slate-100">
          <button
            onClick={handlePurchase}
            disabled={outOfStock || busy}
            className="flex-1 flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-xs font-bold py-2.5 rounded-xl transition shadow-md shadow-brand-600/10"
          >
            <ShoppingCart className="w-4 h-4" />
            {outOfStock ? 'Sold Out' : 'Purchase'}
          </button>

          {isAdmin && (
            <>
              <button
                onClick={handleRestock}
                disabled={busy}
                title="Restock (+1)"
                className="p-2.5 rounded-xl bg-slate-100 text-emerald-700 hover:bg-emerald-100 border border-slate-200 transition"
              >
                <PackagePlus className="w-4 h-4" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(vehicle);
                }}
                title="Edit vehicle"
                className="p-2.5 rounded-xl bg-slate-100 text-amber-700 hover:bg-amber-100 border border-slate-200 transition"
              >
                <Pencil className="w-4 h-4" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(vehicle.id);
                }}
                title="Delete vehicle"
                className="p-2.5 rounded-xl bg-slate-100 text-red-700 hover:bg-red-100 border border-slate-200 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
