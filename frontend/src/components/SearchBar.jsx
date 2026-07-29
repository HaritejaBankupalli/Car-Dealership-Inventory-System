import { useState } from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({ onSearch, onClear }) {
  const [filters, setFilters] = useState({ make: '', model: '', category: '', minPrice: '', maxPrice: '' });

  function update(field, value) {
    setFilters((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSearch(filters);
  }

  function handleClear() {
    setFilters({ make: '', model: '', category: '', minPrice: '', maxPrice: '' });
    onClear();
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-2xl grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 items-end">
      <div className="flex flex-col gap-1 col-span-2 sm:col-span-1">
        <label className="text-xs font-semibold text-slate-400">Make</label>
        <input
          value={filters.make}
          onChange={(e) => update('make', e.target.value)}
          placeholder="Tesla, Porsche..."
          className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-slate-400 focus:outline-none transition"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-slate-400">Model</label>
        <input
          value={filters.model}
          onChange={(e) => update('model', e.target.value)}
          placeholder="Model S, 911..."
          className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-slate-400 focus:outline-none transition"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-slate-400">Category</label>
        <input
          value={filters.category}
          onChange={(e) => update('category', e.target.value)}
          placeholder="Electric, SUV..."
          className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-slate-400 focus:outline-none transition"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-slate-400">Min Price ($)</label>
        <input
          type="number"
          value={filters.minPrice}
          onChange={(e) => update('minPrice', e.target.value)}
          placeholder="0"
          className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-slate-400 focus:outline-none transition"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-slate-400">Max Price ($)</label>
        <input
          type="number"
          value={filters.maxPrice}
          onChange={(e) => update('maxPrice', e.target.value)}
          placeholder="250000"
          className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-slate-400 focus:outline-none transition"
        />
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold py-2.5 px-3 rounded-xl transition shadow-lg shadow-emerald-500/10"
        >
          <Search className="w-4 h-4" /> Filter
        </button>
        <button
          type="button"
          onClick={handleClear}
          title="Clear filters"
          className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}
