import client from './client';

export const VehiclesAPI = {
  getAll: () => client.get('/vehicles').then((r) => r.data),

  search: (params) => client.get('/vehicles/search', { params }).then((r) => r.data),

  create: (payload) => client.post('/vehicles', payload).then((r) => r.data),

  update: (id, payload) => client.put(`/vehicles/${id}`, payload).then((r) => r.data),

  remove: (id) => client.delete(`/vehicles/${id}`).then((r) => r.data),

  purchase: (id, quantity = 1) =>
    client.post(`/vehicles/${id}/purchase`, { quantity }).then((r) => r.data),

  restock: (id, quantity = 1) =>
    client.post(`/vehicles/${id}/restock`, { quantity }).then((r) => r.data),
};
