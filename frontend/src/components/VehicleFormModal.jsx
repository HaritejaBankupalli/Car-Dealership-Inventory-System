import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold text-slate-800 mb-4">
          {initialData ? 'Edit Vehicle' : 'Add New Vehicle'}
        </h2>

        {error && <p className="mb-3 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
          <input
            placeholder="Make (e.g. Toyota)"
            value={form.make}
            onChange={(e) => update('make', e.target.value)}
            className="col-span-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-400 focus:outline-none"
          />
          <input
            placeholder="Model (e.g. Corolla)"
            value={form.model}
            onChange={(e) => update('model', e.target.value)}
            className="col-span-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-400 focus:outline-none"
          />
          <input
            placeholder="Category (e.g. Sedan)"
            value={form.category}
            onChange={(e) => update('category', e.target.value)}
            className="col-span-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-400 focus:outline-none"
          />
          <input
            placeholder="Year"
            type="number"
            value={form.year}
            onChange={(e) => update('year', e.target.value)}
            className="col-span-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-400 focus:outline-none"
          />
          <input
            placeholder="Price (USD)"
            type="number"
            value={form.price}
            onChange={(e) => update('price', e.target.value)}
            className="col-span-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-400 focus:outline-none"
          />
          <input
            placeholder="Quantity in stock"
            type="number"
            value={form.quantity}
            onChange={(e) => update('quantity', e.target.value)}
            className="col-span-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-400 focus:outline-none"
          />
          <input
            placeholder="Image URL (optional)"
            value={form.image_url}
            onChange={(e) => update('image_url', e.target.value)}
            className="col-span-2 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-400 focus:outline-none"
          />

          <div className="col-span-2 flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-brand-600 hover:bg-brand-700 text-white transition disabled:opacity-60"
            >
              {submitting ? 'Saving...' : initialData ? 'Save Changes' : 'Add Vehicle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
