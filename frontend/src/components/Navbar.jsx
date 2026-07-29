import { Link, useNavigate } from 'react-router-dom';
import { Car, LogOut, LayoutDashboard, ShieldCheck, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onOpenHistory }) {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 text-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5 font-extrabold text-xl tracking-tight text-slate-900 group">
            <div className="p-2 rounded-xl bg-brand-50 border border-brand-100 text-brand-600 group-hover:bg-brand-100 transition">
              <Car className="w-5 h-5 text-brand-600" />
            </div>
            <span>AutoNest<span className="text-brand-600"> Dealership</span></span>
          </Link>

          <div className="flex items-center gap-3 text-sm">
            {isAuthenticated ? (
              <>
                <Link to="/" className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition">
                  <LayoutDashboard className="w-4 h-4 text-slate-500" /> Catalog
                </Link>

                <button
                  onClick={onOpenHistory}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 text-xs font-bold transition"
                >
                  <ShoppingBag className="w-4 h-4 text-brand-600" />
                  <span>{isAdmin ? 'Sales Ledger' : 'My Purchases'}</span>
                </button>

                {isAdmin && (
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" /> Admin
                  </span>
                )}

                <span className="hidden md:inline text-xs font-semibold text-slate-600">
                  Hi, {user?.name?.split(' ')[0]}
                </span>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium transition border border-slate-200"
                >
                  <LogOut className="w-3.5 h-3.5" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-slate-600 hover:text-slate-900 transition text-xs font-medium px-3 py-1.5">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-brand-600 hover:bg-brand-700 text-white font-bold px-4 py-1.5 rounded-lg transition text-xs shadow-sm"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
