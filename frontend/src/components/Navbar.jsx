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
    <nav className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5 font-extrabold text-xl tracking-tight text-white group">
            <div className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 group-hover:border-slate-500 transition">
              <Car className="w-5 h-5 text-emerald-400" />
            </div>
            <span>AutoNest<span className="text-slate-400 font-light"> 3D</span></span>
          </Link>

          <div className="flex items-center gap-3 text-sm">
            {isAuthenticated ? (
              <>
                <Link to="/" className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 transition">
                  <LayoutDashboard className="w-4 h-4 text-slate-400" /> Catalog
                </Link>

                <button
                  onClick={onOpenHistory}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition"
                >
                  <ShoppingBag className="w-4 h-4 text-emerald-400" />
                  <span>{isAdmin ? 'Sales Ledger' : 'My Purchases'}</span>
                </button>

                {isAdmin && (
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" /> Admin
                  </span>
                )}

                <span className="hidden md:inline text-xs font-medium text-slate-400">
                  Hi, {user?.name?.split(' ')[0]}
                </span>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg text-xs font-medium transition border border-slate-700"
                >
                  <LogOut className="w-3.5 h-3.5" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-slate-300 hover:text-white transition text-xs font-medium px-3 py-1.5">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-1.5 rounded-lg transition text-xs shadow-lg shadow-emerald-500/10"
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
