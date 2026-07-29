import { useEffect, useState } from 'react';
import { X, Car } from 'lucide-react';

const emptyForm = { make: '', model: '', category: '', price: '', quantity: '', year: '', image_url: '' };

export default function VehicleFormModal({ open, initialData, onClose, onSubmit }) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        make: initialData.make || '',
        model: initialData.model || '',
        category: initialData.category || '',
        price: initialData.price ?? '',
        quantity: initialData.quantity ?? '',
        year: initialData.year || '',
        image_url: initialData.image_url || '',
      });
    } else {
      setForm(emptyForm);
    }
    setError('');
  }, [initialData, open]);

  if (!open) return null;

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!form.make || !form.model || !form.category || form.price === '' || form.quantity === '') {
      setError('Make, model, category, price and quantity are required.');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        ...form,
        price: Number(form.price),
        quantity: Number(form.quantity),
        year: form.year ? Number(form.year) : undefined,
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900/90 border border-slate-700/60 rounded-2xl shadow-2xl backdrop-blur-xl w-full max-w-lg p-6 relative text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-800">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Car className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-extrabold text-white">
            {initialData ? 'Edit Vehicle' : 'Add New Vehicle'}
          </h2>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3.5">
          <div>
            <label className="text-xs font-semibold text-slate-400 mb-1 block">Make</label>
            <input
              placeholder="e.g. Porsche"
              value={form.make}
              onChange={(e) => update('make', e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 mb-1 block">Model</label>
            <input
              placeholder="e.g. 911 GT3"
              value={form.model}
              onChange={(e) => update('model', e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 mb-1 block">Category</label>
            <input
              placeholder="e.g. Coupe, Electric"
              value={form.category}
              onChange={(e) => update('category', e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 mb-1 block">Year</label>
            <input
              placeholder="2024"
              type="number"
              value={form.year}
              onChange={(e) => update('year', e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 mb-1 block">Price ($)</label>
            <input
              placeholder="89000"
              type="number"
              value={form.price}
              onChange={(e) => update('price', e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 mb-1 block">Stock Quantity</label>
            <input
              placeholder="5"
              type="number"
              value={form.quantity}
              onChange={(e) => update('quantity', e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="col-span-2">
            <label className="text-xs font-semibold text-slate-400 mb-1 block">Image URL</label>
            <input
              placeholder="https://images.unsplash.com/..."
              value={form.image_url}
              onChange={(e) => update('image_url', e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="col-span-2 flex justify-end gap-3 mt-4 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 bg-slate-800 hover:bg-slate-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition disabled:opacity-50"
            >
              {submitting ? 'Saving...' : initialData ? 'Save Changes' : 'Add Vehicle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
