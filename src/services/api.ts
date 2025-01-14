import axios from 'axios';

const baseURL = import.meta.env.VITE_HAPROXY_API_URL;

const api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const username = 'admin';
const password = 'adminpwd';

const setBasicAuthHeader = () => {
  const token = btoa(`${username}:${password}`);
  api.defaults.headers['Authorization'] = `Basic ${token}`;
};

setBasicAuthHeader();

export const haproxyApi = {
  async getVersion() {
    const response = await api.get('/services/haproxy/configuration/version');
    return response.data;
  },
  async getFrontends() {
    const response = await api.get('/services/haproxy/configuration/frontends');
    return response.data;
  },

 async createFrontend(frontend: any, version: string) {
  try {
      const response = await api.post(`/services/haproxy/configuration/frontends?version=${version}`, frontend);
      return response.data;
    } catch (error) {
      console.error('Failed to create frontend:', error);
      throw error; 
    }
  },

  async updateFrontend(name: string, frontend: any) {
    const response = await api.put(`/services/haproxy/configuration/frontends/${name}`, frontend);
    return response.data;
  },

  async deleteFrontend(name: string, cfgVersion: string) {
    try {
      const response = await api.delete(
        `/services/haproxy/configuration/frontends/${name}?version=${cfgVersion}`,
      );
      return response.data;
    } catch (error) {
      console.error('Failed to delete frontend:', error);
      throw error;
    }
  },

  async getFrontendDetails(frontendName: string) {
  const response = await api.get(`/services/haproxy/configuration/frontends/${frontendName}`);
  return response.data; // Cela suppose que l'API retourne les données sous `data`
  },


  async getBindsForFrontend(frontendName: string) {
    const response = await api.get(`/services/haproxy/configuration/frontends/${frontendName}/binds`);
    return response.data;
  },

  async createBind(frontendName: string, bindData: { name: string; address: string; port: number }, cfgVersion: string) {
    try {
      const response = await api.post(
        `/services/haproxy/configuration/frontends/${frontendName}/binds?version=${cfgVersion}`,
        bindData
      );
      return response.data;  
    } catch (error) {
      console.error('Failed to add bind:', error);
      throw error;  
    }
  },

  async getBackends() {
    const response = await api.get('/services/haproxy/configuration/backends');
    return response.data;
  },

  async createBackend(backend: any) {
    const response = await api.post('/services/haproxy/configuration/backends', backend);
    return response.data;
  },

  async updateBackend(name: string, backend: any) {
    const response = await api.put(`/services/haproxy/configuration/backends/${name}`, backend);
    return response.data;
  },

  async deleteBackend(name: string) {
    const response = await api.delete(`/services/haproxy/configuration/backends/${name}`);
    return response.data;
  },

  async applyConfiguration() {
    const response = await api.post('/services/haproxy/configuration/commit');
    return response.data;
  },

  async getInfo() {
    const response = await api.get('/info');
    return response.data.api;
  }
};
