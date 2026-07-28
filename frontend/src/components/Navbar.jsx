import { Link, useNavigate } from 'react-router-dom';
import { Car, LogOut, LayoutDashboard, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav className="bg-brand-950 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
            <Car className="w-6 h-6 text-brand-400" />
            AutoNest Dealership
          </Link>

          <div className="flex items-center gap-4 text-sm">
            {isAuthenticated ? (
              <>
                <Link to="/" className="flex items-center gap-1 hover:text-brand-300 transition">
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>
                {isAdmin && (
                  <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" /> Admin
                  </span>
                )}
                <span className="hidden sm:inline text-slate-300">Hi, {user?.name?.split(' ')[0]}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-brand-300 transition">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-brand-500 hover:bg-brand-600 px-3 py-1.5 rounded-lg font-medium transition"
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
