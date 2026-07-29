import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ThreeCarBackground from './components/ThreeCarBackground';
import PurchaseHistoryModal from './components/PurchaseHistoryModal';

function AppLayout() {
  const [historyOpen, setHistoryOpen] = useState(false);
  const { isAdmin } = useAuth();

  return (
    <div className="min-h-screen relative text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
      {/* Three.js 3D Rotating Car Background */}
      <ThreeCarBackground />

      {/* Glassmorphic Navbar */}
      <Navbar onOpenHistory={() => setHistoryOpen(true)} />

      {/* Main Content View */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard onOpenHistory={() => setHistoryOpen(true)} />
            </ProtectedRoute>
          }
        />
      </Routes>

      {/* Purchase History & Admin Sales Ledger Modal */}
      <PurchaseHistoryModal
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        isAdmin={isAdmin}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </AuthProvider>
  );
}
