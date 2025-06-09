// services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://dentcase-backend.onrender.com/api',
});

export default api;
