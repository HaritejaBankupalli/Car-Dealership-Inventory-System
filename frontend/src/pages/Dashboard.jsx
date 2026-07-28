import { useEffect, useState } from 'react';
import { Plus, Frown } from 'lucide-react';
import { VehiclesAPI } from '../api/vehicles';
import VehicleCard from '../components/VehicleCard';
import SearchBar from '../components/SearchBar';
import VehicleFormModal from '../components/VehicleFormModal';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { isAdmin } = useAuth();
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Vehicle Inventory</h1>
          <p className="text-slate-500 text-sm">Browse, search, and manage available vehicles</p>
        </div>
        {isAdmin && (
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-medium px-4 py-2.5 rounded-lg transition self-start"
          >
            <Plus className="w-4 h-4" /> Add Vehicle
          </button>
        )}
      </div>

      <div className="mb-6">
        <SearchBar onSearch={handleSearch} onClear={loadAll} />
      </div>

      {errorMsg && <p className="mb-4 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{errorMsg}</p>}

      {loading ? (
        <p className="text-slate-500 text-center py-16">Loading vehicles...</p>
      ) : vehicles.length === 0 ? (
        <div className="flex flex-col items-center text-slate-400 py-20">
          <Frown className="w-10 h-10 mb-3" />
          <p>No vehicles match your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
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
