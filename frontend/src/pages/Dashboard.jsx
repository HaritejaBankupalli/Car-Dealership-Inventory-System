import { useEffect, useState } from 'react';
import { Plus, Frown, Sparkles, ShoppingBag } from 'lucide-react';
import { VehiclesAPI } from '../api/vehicles';
import VehicleCard from '../components/VehicleCard';
import SearchBar from '../components/SearchBar';
import VehicleFormModal from '../components/VehicleFormModal';
import { useAuth } from '../context/AuthContext';

export default function Dashboard({ onOpenHistory }) {
  const { isAdmin, user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  async function loadAll() {
    setLoading(true);
    setErrorMsg('');
    try {
      const data = await VehiclesAPI.getAll();
      setVehicles(data.vehicles);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function handleSearch(filters) {
    setLoading(true);
    setErrorMsg('');
    try {
      const cleaned = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== ''));
      const data = await VehiclesAPI.search(cleaned);
      setVehicles(data.vehicles);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  }

  async function handlePurchase(id) {
    try {
      await VehiclesAPI.purchase(id, 1);
      loadAll();
      if (onOpenHistory) {
        setTimeout(() => {
          onOpenHistory();
        }, 500);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Purchase failed');
    }
  }

  async function handleRestock(id) {
    try {
      await VehiclesAPI.restock(id, 1);
      loadAll();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Restock failed');
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this vehicle from inventory?')) return;
    try {
      await VehiclesAPI.remove(id);
      loadAll();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Delete failed');
    }
  }

  function openAddModal() {
    setEditingVehicle(null);
    setModalOpen(true);
  }

  function openEditModal(vehicle) {
    setEditingVehicle(vehicle);
    setModalOpen(true);
  }

  async function handleFormSubmit(payload) {
    if (editingVehicle) {
      await VehiclesAPI.update(editingVehicle.id, payload);
    } else {
      await VehiclesAPI.create(payload);
    }
    loadAll();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl mb-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-400" /> Rotating 3D Studio
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            AutoNest Fleet Catalog
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Welcome back, <strong className="text-slate-200">{user?.name}</strong>. Browse, filter, purchase, and track your vehicle orders in real-time.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium px-4 py-2.5 rounded-xl transition text-sm shadow-lg"
          >
            <ShoppingBag className="w-4 h-4 text-emerald-400" />
            {isAdmin ? 'View Sales Ledger' : 'My Purchases'}
          </button>

          {isAdmin && (
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl transition text-sm shadow-lg shadow-emerald-500/10"
            >
              <Plus className="w-4.5 h-4.5" /> Add Vehicle
            </button>
          )}
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="mb-8">
        <SearchBar onSearch={handleSearch} onClear={loadAll} />
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
          {errorMsg}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <div className="w-10 h-10 border-4 border-slate-400 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-sm font-medium">Loading inventory...</p>
        </div>
      ) : vehicles.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-slate-400 py-24 bg-slate-900/60 border border-slate-800/80 rounded-2xl backdrop-blur-xl">
          <Frown className="w-12 h-12 mb-3 text-slate-500" />
          <p className="text-lg font-semibold text-slate-300">No vehicles match your criteria</p>
          <p className="text-xs text-slate-500 mt-1">Try clearing filters or checking back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {vehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onPurchase={handlePurchase}
              onRestock={handleRestock}
              onEdit={openEditModal}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <VehicleFormModal
        open={modalOpen}
        initialData={editingVehicle}
        onClose={() => setModalOpen(false)}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}
