import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, DollarSign, PackageCheck, Calendar, User, Search, RefreshCw } from 'lucide-react';
import { getMyPurchases, getAllPurchases } from '../api/purchases';

export default function PurchaseHistoryModal({ isOpen, onClose, isAdmin }) {
  const [purchases, setPurchases] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterText, setFilterText] = useState('');

  const fetchHistory = async () => {
    if (!isOpen) return;
    setLoading(true);
    setError(null);
    try {
      if (isAdmin) {
        const data = await getAllPurchases();
        setPurchases(data.purchases || []);
        setSummary(data.summary || null);
      } else {
        const data = await getMyPurchases();
        setPurchases(data.purchases || []);
        setSummary(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load purchase records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [isOpen, isAdmin]);

  if (!isOpen) return null;

  const filteredPurchases = purchases.filter((p) => {
    if (!filterText) return true;
    const text = filterText.toLowerCase();
    return (
      (p.make && p.make.toLowerCase().includes(text)) ||
      (p.model && p.model.toLowerCase().includes(text)) ||
      (p.category && p.category.toLowerCase().includes(text)) ||
      (p.user_name && p.user_name.toLowerCase().includes(text)) ||
      (p.user_email && p.user_email.toLowerCase().includes(text))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-xl flex flex-col text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white">
                {isAdmin ? 'Dealership Sales Ledger' : 'My Purchase History'}
              </h2>
              <p className="text-xs text-slate-400">
                {isAdmin
                  ? 'Complete history of customer vehicle purchases and dealership revenue'
                  : 'Track your personal vehicle orders and receipt details'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 rounded-lg transition hover:bg-slate-800 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Admin Summary KPIs */}
        {isAdmin && summary && (
          <div className="grid grid-cols-1 gap-3 py-4 sm:grid-cols-3">
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Total Revenue</p>
                <p className="text-lg font-bold text-emerald-400">
                  ${summary.totalRevenue.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                <PackageCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Units Sold</p>
                <p className="text-lg font-bold text-white">
                  {summary.totalUnitsSold} Vehicles
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Total Transactions</p>
                <p className="text-lg font-bold text-white">
                  {summary.totalOrders} Orders
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Search & Actions Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-3">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={isAdmin ? 'Filter by car or customer...' : 'Filter purchases...'}
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-sm rounded-lg bg-slate-950/60 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <button
            onClick={fetchHistory}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh List
          </button>
        </div>

        {/* Body / List */}
        <div className="flex-1 overflow-y-auto pr-1 my-2 space-y-3">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <RefreshCw className="w-8 h-8 animate-spin text-cyan-400 mb-2" />
              <p className="text-sm">Loading transactions...</p>
            </div>
          ) : error ? (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
              {error}
            </div>
          ) : filteredPurchases.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500 border border-dashed border-slate-800 rounded-xl">
              <ShoppingBag className="w-10 h-10 mb-2 stroke-[1.5]" />
              <p className="text-base font-semibold text-slate-400">No purchase records found</p>
              <p className="text-xs text-slate-600 mt-1">
                {filterText ? 'Try adjusting your search filter.' : 'Purchased vehicles will appear here.'}
              </p>
            </div>
          ) : (
            filteredPurchases.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-950/50 border border-slate-800/80 hover:border-slate-700 transition"
              >
                {/* Vehicle Info */}
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.model}
                      className="w-16 h-12 object-cover rounded-lg border border-slate-800 bg-slate-900"
                    />
                  ) : (
                    <div className="w-16 h-12 rounded-lg bg-slate-800 flex items-center justify-center text-slate-500 text-xs font-semibold">
                      Car
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">
                        {item.year} {item.make} {item.model}
                      </span>
                      <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        {item.category}
                      </span>
                    </div>

                    {isAdmin && (
                      <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-400">
                        <User className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Buyer: <strong>{item.user_name}</strong> ({item.user_email})</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(item.purchased_at).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Price & Quantity Info */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                  <div className="text-left sm:text-right">
                    <p className="text-xs text-slate-400">Unit Price</p>
                    <p className="text-sm font-medium text-slate-200">
                      ${Number(item.price_at_purchase).toLocaleString()}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-xs text-slate-400">Quantity</p>
                    <p className="text-sm font-semibold text-cyan-400">
                      x{item.quantity}
                    </p>
                  </div>

                  <div className="text-right pl-3 border-l border-slate-800">
                    <p className="text-xs text-slate-400">Total Paid</p>
                    <p className="text-base font-bold text-emerald-400">
                      ${Number(item.total_price).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
