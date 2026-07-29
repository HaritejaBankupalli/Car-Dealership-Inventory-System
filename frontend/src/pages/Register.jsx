import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Car, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'customer' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const result = await register(form);
    setSubmitting(false);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xl w-full max-w-sm p-8 text-slate-800">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-brand-50 border border-brand-100 text-brand-600 p-3.5 rounded-2xl mb-3">
            <Car className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Create your account</h1>
          <p className="text-xs text-slate-500 mt-1">Join AutoNest to explore and purchase vehicles</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1 block">Full name</label>
            <input
              required
              placeholder="Alex Smith"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1 block">Email address</label>
            <input
              type="email"
              required
              placeholder="alex@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1 block">Password</label>
            <input
              type="password"
              required
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 mt-1">
            <input
              id="admin-checkbox"
              type="checkbox"
              className="rounded bg-white border-slate-300 text-brand-600 focus:ring-brand-500"
              checked={form.role === 'admin'}
              onChange={(e) => setForm({ ...form, role: e.target.checked ? 'admin' : 'customer' })}
            />
            <label htmlFor="admin-checkbox" className="cursor-pointer">
              Register as an admin (demo mode)
            </label>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold py-2.5 rounded-xl transition text-sm shadow-md mt-2 disabled:opacity-50"
          >
            <UserPlus className="w-4 h-4" /> {submitting ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-xs text-center text-slate-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-600 font-bold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
