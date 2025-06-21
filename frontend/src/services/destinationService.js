import api from './api';

const destinationService = {
  getAllDestinations: async () => {
    try {
      const response = await api.get('/destinations');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getDestination: async (id) => {
    try {
      const response = await api.get(`/destinations/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getDestinationWeather: async (id) => {
    try {
      const response = await api.get(`/destinations/${id}/weather`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createDestination: async (destinationData) => {
    try {
      const response = await api.post('/destinations', destinationData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateDestination: async (id, destinationData) => {
    try {
      const response = await api.put(`/destinations/${id}`, destinationData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteDestination: async (id) => {
    try {
      const response = await api.delete(`/destinations/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default destinationService; 