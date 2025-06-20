import api from '@/../api/api';

export default {
  async getAll() {
    const res = await api.get('devices');
    return res.data;
  },
  async create(data) {
    const res = await api.post('devices', data);
    return res.data;
  },
  async update(id, data) {
    const res = await api.put(`devices/${id}`, data);
    return res.data;
  },
  async remove(id) {
    const res = await api.delete(`devices/${id}`);
    return res.data;
  }
};
