import { useState } from 'react';
import { Gauge, Tag, Calendar, ShoppingCart, PackagePlus, Pencil, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

export default function VehicleCard({ vehicle, onPurchase, onRestock, onEdit, onDelete }) {
  const { isAdmin } = useAuth();
  const [busy, setBusy] = useState(false);
  const outOfStock = vehicle.quantity === 0;

  async function handlePurchase() {
    setBusy(true);
    await onPurchase(vehicle.id);
    setBusy(false);
  }

  async function handleRestock() {
    setBusy(true);
    await onRestock(vehicle.id);
    setBusy(false);
  }

  return (
    <div className="group rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-600 backdrop-blur-xl shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
      {/* Image Container */}
      <div className="h-44 bg-slate-950/60 relative overflow-hidden flex items-center justify-center">
        {vehicle.image_url ? (
          <img
            src={vehicle.image_url}
            alt={`${vehicle.make} ${vehicle.model}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-600">
            <span className="text-4xl font-extrabold tracking-widest uppercase">
              {vehicle.make?.[0]}
              {vehicle.model?.[0]}
            </span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />

        <span className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md text-slate-300 border border-slate-700 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
          <Tag className="w-3 h-3 text-slate-400" /> {vehicle.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-bold text-white text-lg tracking-tight group-hover:text-slate-200 transition">
              {vehicle.make} {vehicle.model}
            </h3>
            <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
              {vehicle.year && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" /> {vehicle.year}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Gauge className="w-3.5 h-3.5 text-slate-400" />
                <span className={outOfStock ? 'text-red-400 font-semibold' : 'text-slate-300'}>
                  {outOfStock ? 'Out of Stock' : `${vehicle.quantity} available`}
                </span>
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xl font-extrabold text-emerald-400 tracking-tight">
              {currency.format(vehicle.price)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-auto pt-3 flex flex-wrap gap-2 border-t border-slate-800/80">
          <button
            onClick={handlePurchase}
            disabled={outOfStock || busy}
            className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-slate-950 text-xs font-bold py-2.5 rounded-xl transition shadow-lg"
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
                className="p-2.5 rounded-xl bg-slate-800 text-emerald-400 hover:bg-emerald-500/20 border border-slate-700 hover:border-emerald-500/40 transition"
              >
                <PackagePlus className="w-4 h-4" />
              </button>

              <button
                onClick={() => onEdit(vehicle)}
                title="Edit vehicle"
                className="p-2.5 rounded-xl bg-slate-800 text-amber-400 hover:bg-amber-500/20 border border-slate-700 hover:border-amber-500/40 transition"
              >
                <Pencil className="w-4 h-4" />
              </button>

              <button
                onClick={() => onDelete(vehicle.id)}
                title="Delete vehicle"
                className="p-2.5 rounded-xl bg-slate-800 text-red-400 hover:bg-red-500/20 border border-slate-700 hover:border-red-500/40 transition"
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
