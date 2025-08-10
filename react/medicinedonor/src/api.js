import axios from 'axios';

const API = axios.create({
  baseURL: '/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});
API.interceptors.response.use(
  response => response,
  error => {
    // Normalize error object for callers
    return Promise.reject(error.response?.data || { error: 'Network error' });
  }
);

export const loginPatient = async (email, password) => {
  const response = await API.post('/patientlogin', { email, password });
  return response.data; // { user, token } or rejects with { error: ... }
}

export const getPatientDetails = async (token) => {
  const response = await API.get('/patientdetails', {
    headers: {
      Authorization: `Bearer ${token}`,  // <- Important
    },
  });
  return response.data;
};
export const loginDonor = async (email, password) => {
  const response = await API.post('/donorlogin', { email, password });
  return response.data;
};


export const registerPatient = async (patientData) => {
  const response = await API.post('/patient/register', patientData);
  return response.data;
};

// Donor Registration
export const registerDonor = async (donorData) => {
  const response = await API.post('/donor/register', donorData);
  return response.data;
};
export const adminLogin = async (email, password) => {
  const response = await API.post('/adminpage/login', { email, password });
  return response.data;
};