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
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 items-end">
      <div className="flex flex-col gap-1 col-span-2 sm:col-span-1">
        <label className="text-xs font-medium text-slate-500">Make</label>
        <input
          value={filters.make}
          onChange={(e) => update('make', e.target.value)}
          placeholder="Toyota"
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-400 focus:outline-none"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-slate-500">Model</label>
        <input
          value={filters.model}
          onChange={(e) => update('model', e.target.value)}
          placeholder="Corolla"
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-400 focus:outline-none"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-slate-500">Category</label>
        <input
          value={filters.category}
          onChange={(e) => update('category', e.target.value)}
          placeholder="SUV"
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-400 focus:outline-none"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-slate-500">Min Price</label>
        <input
          type="number"
          value={filters.minPrice}
          onChange={(e) => update('minPrice', e.target.value)}
          placeholder="0"
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-400 focus:outline-none"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-slate-500">Max Price</label>
        <input
          type="number"
          value={filters.maxPrice}
          onChange={(e) => update('maxPrice', e.target.value)}
          placeholder="100000"
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-400 focus:outline-none"
        />
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 flex items-center justify-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium py-2 px-3 rounded-lg transition"
        >
          <Search className="w-4 h-4" /> Search
        </button>
        <button
          type="button"
          onClick={handleClear}
          title="Clear filters"
          className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}
