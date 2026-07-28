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
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow border border-slate-100 overflow-hidden flex flex-col">
      <div className="h-40 bg-gradient-to-br from-brand-100 to-brand-50 flex items-center justify-center relative">
        {vehicle.image_url ? (
          <img src={vehicle.image_url} alt={`${vehicle.make} ${vehicle.model}`} className="w-full h-full object-cover" />
        ) : (
          <span className="text-brand-700 text-4xl font-bold opacity-30">
            {vehicle.make?.[0]}
            {vehicle.model?.[0]}
          </span>
        )}
        <span className="absolute top-3 right-3 bg-white/90 text-xs font-semibold px-2 py-1 rounded-full text-brand-800 flex items-center gap-1">
          <Tag className="w-3 h-3" /> {vehicle.category}
        </span>
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-slate-800 text-lg leading-tight">
            {vehicle.make} {vehicle.model}
          </h3>
          <span className="text-brand-700 font-bold">{currency.format(vehicle.price)}</span>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500">
          {vehicle.year && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> {vehicle.year}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Gauge className="w-3.5 h-3.5" />
            {outOfStock ? 'Out of stock' : `${vehicle.quantity} in stock`}
          </span>
        </div>

        <div className="mt-auto pt-3 flex flex-wrap gap-2">
          <button
            onClick={handlePurchase}
            disabled={outOfStock || busy}
            className="flex-1 flex items-center justify-center gap-1.5 bg-brand-600 hover:bg-brand-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-sm font-medium py-2 rounded-lg transition"
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
                className="p-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition"
              >
                <PackagePlus className="w-4 h-4" />
              </button>
              <button
                onClick={() => onEdit(vehicle)}
                title="Edit vehicle"
                className="p-2 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 transition"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(vehicle.id)}
                title="Delete vehicle"
                className="p-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition"
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
