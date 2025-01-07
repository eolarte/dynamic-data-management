import axios from 'axios';

const API_BASE_URL = 'http://localhost:5051/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const dataModelService = {
  async saveDataModel(model) {
    try {
      const response = await apiClient.post('/DynamicData/datamodels', model);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw new Error(error.response?.data?.error || 'Failed to save data model');
    }
  },

  async getDataModels() {
    try {
      const response = await apiClient.get('/DynamicData/datamodels');
      // Ensure we always return an array
      console.log(response);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('API Error:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch data models');
    }
  },

  async updateDataModel(id, model) {
    try {
      const response = await apiClient.put(`/DynamicData/datamodels/${id}`, model);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw new Error(error.response?.data?.error || 'Failed to update data model');
    }
  },

  async saveEmployeeData(employeeData) {
    try {
      const response = await apiClient.post('/DynamicData/employeedata', employeeData);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw new Error(error.response?.data?.error || 'Failed to save employee data');
    }
  },

  async getEmployeeData() {
    try {
      const response = await apiClient.get('/DynamicData/employeedata');
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('API Error:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch employee data');
    }
  },

  async getEmployeeDataById(id) {
    try {
      const response = await apiClient.get(`/DynamicData/employeedata/${id}`);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch employee data');
    }
  },

  async updateEmployeeData(id, data) {
    try {
      const response = await apiClient.put(`/DynamicData/employeedata/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw new Error(error.response?.data?.error || 'Failed to update employee data');
    }
  }
}; 