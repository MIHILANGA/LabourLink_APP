// api.js
import axios from 'axios';

const API_URL = 'http://192.168.1.12:5000/api'; // Replace localhost with your IP


const api = axios.create({
  baseURL: API_URL,
  timeout: 5000,
});

export default api;
