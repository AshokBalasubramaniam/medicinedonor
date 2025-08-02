import axios from 'axios';

const API = axios.create({
  baseURL: '/api', // Vite proxy to Rust backend at localhost:3000
  headers: {
    'Content-Type': 'application/json',
  },
});

export const loginPatient = async (email, password) => {
  const response = await API.post('/patientlogin', { email, password });
  return response.data;
};

export const registerPatient = async (name, email, password) => {
  const response = await API.post('/register', { name, email, password });
  return response.data;
};
