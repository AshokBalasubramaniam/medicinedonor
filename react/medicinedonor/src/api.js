import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
});

// Normalize ALL errors so callers always get { error, status }
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const data = error?.response?.data;

    let normalized = { status, error: 'Network error' };
    if (data) {
      if (typeof data === 'string') normalized = { status, error: data };
      else if (data.error) normalized = { status, error: data.error };
      else if (data.message) normalized = { status, error: data.message };
      else normalized = { status, error: JSON.stringify(data) };
    }
    return Promise.reject(normalized);
  }
);

export const loginPatient = async (email, password) => {
  const res = await API.post(
    '/patientlogin',
    { email, password },
    { headers: { 'Content-Type': 'application/json' } } // ✅ JSON only
  );
  return res.data;
};
export const adminLogin = async (email, password) => {
  const res = await API.post(
    '/adminpage',
    { email, password },
    { headers: { 'Content-Type': 'application/json' } }
  );
  return res.data; // <-- consistent with loginPatient
};
export const admingetallpatientdetails = async (token) => {
  const res = await API.get('/adminpage/getpatients', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
export const getPatientDetails = async (token) => {
  const res = await API.get('/patientdetails', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updatePatientDetails = async (token, updatedData) => {
  const res = await API.put('/patientdetails/update', updatedData, {
    headers: { Authorization: `Bearer ${token}` },
    // ❌ Do NOT set Content-Type → browser will add boundary
  });
  return res.data;
};


export const loginDonor = async (email, password) => {
  const res = await API.post(
    '/donorlogin',
    { email, password },
    { headers: { 'Content-Type': 'application/json' } }
  );
  return res.data;
};

export const registerPatient = async (patientData) => {
  const res = await API.post('/patient/register', patientData, {
    headers: { 'Content-Type': 'application/json' },
  });
  return res.data;
};

export const registerDonor = async (donorData) => {
  const res = await API.post('/donor/register', donorData, {
    headers: { 'Content-Type': 'application/json' },
  });
  return res.data;
};

export const adminForgetPassword = async (email) => {
  const res = await API.post(
    '/adminpage/forget',
    { email },
    { headers: { 'Content-Type': 'application/json' } }
  );
  return res;
};

export const adminResetPassword = async (email, otp, newPassword) => {
  const res = await API.post(
    '/adminpage/reset',
    { email, otp, new_password: newPassword },
    { headers: { 'Content-Type': 'application/json' } }
  );
  return res;
};

export const admingetpatientdetails = async () => {
  const res = await API.get('/adminpage/patients');
  return res.data;
};

// Get one patient by id
export const getPatientById = async (id) => {
  const res = await API.get(`/adminpage/patients/${id}`);
  return res.data;
};

export const updatePatient = async (id, data) => {
  const res = await API.put(`/adminpage/patients/${id}`, data); // ✅ use PUT
  return res.data; // return updated patient
};

export const registerdoctor = async (payload, token) => {
  const res = await axios.post('/api/admin/registerdoctor', payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return res.data;
};

export const adminUpdatePatient = async (token, id, payload) => {
  const res = await axios.put(`/api/admin/updatepatient/${id}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};
console.log(adminUpdatePatient);