import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { registerPatient, registerDonor } from './api';

function AuthPage() {
  const location = useLocation();
  const [role, setRole] = useState('patient');

  const [form, setForm] = useState({
    name: '',
    age: '',
    disease: '',
    hospitalname: '',
    medicine: '',
    customMedicine: '',
    doctor: '',
    date: '',
    time: '',
    mobile: '',
    employment: '',
    place: '',
    category: '',
    birthday: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const medicineOptions = [
    'Paracetamol',
    'Amoxicillin',
    'Ibuprofen',
    'Metformin',
    'Amlodipine',
    'Atorvastatin',
    'Omeprazole',
    'Losartan',
    'Azithromycin',
    'Levothyroxine',
    'Other',
  ];

  const doctorOptions = ['Dr. A', 'Dr. B', 'Dr. C'];

  useEffect(() => {
    if (location.state?.role) {
      setRole(location.state.role);
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const medicineToSend =
      form.medicine === 'Other' ? form.customMedicine : form.medicine;

    const payload = { ...form, medicine: medicineToSend };
    delete payload.customMedicine;

    try {
      if (role === 'patient') {
        await registerPatient(payload);
      } else {
        await registerDonor(payload);
      }
      alert('Registration successful!');
    } catch (err) {
      if (err.response?.status === 409) {
        alert('Email already registered.');
      } else {
        alert('Registration failed.');
      }
    }
  };

  const styles = {
    container: {
      maxWidth: '500px',
      margin: '2rem auto',
      padding: '2rem',
      border: '1px solid #ccc',
      borderRadius: '10px',
      backgroundColor: '#f9f9f9',
      fontFamily: 'Arial, sans-serif',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      height: '90vh', // fixed height
      overflow: 'hidden', // no page scroll
      display: 'flex',
      flexDirection: 'column',
    },
    formScroll: {
      flex: 1,
      overflowY: 'auto',
      paddingRight: '8px',
    },
    heading: {
      textAlign: 'center',
      marginBottom: '1rem',
      color: '#333',
    },
    select: {
      width: '100%',
      padding: '8px',
      marginBottom: '1rem',
      borderRadius: '4px',
      border: '1px solid #ccc',
    },
    input: {
      width: '100%',
      padding: '10px',
      marginBottom: '1rem',
      borderRadius: '4px',
      border: '1px solid #ccc',
    },
    button: {
      width: '100%',
      padding: '10px',
      backgroundColor: '#28a745',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: '1rem',
      marginTop: '10px',
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Register</h2>

      <select
        style={styles.select}
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="patient">Patient</option>
        <option value="donor">Donor</option>
      </select>

      <form onSubmit={handleSubmit} style={styles.formScroll}>
        <input
          style={styles.input}
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
          value={form.name}
          required
        />
        <input
          style={styles.input}
          type="number"
          name="age"
          placeholder="Age"
          onChange={handleChange}
          value={form.age}
          required
        />

        {role === 'patient' && (
          <>
            <input
              style={styles.input}
              type="text"
              name="disease"
              placeholder="Disease"
              onChange={handleChange}
              value={form.disease}
              required
            />
            <input
              style={styles.input}
              type="text"
              name="hospitalname"
              placeholder="Hospital Name"
              onChange={handleChange}
              value={form.hospitalname}
              required
            />

            <select
              style={styles.select}
              name="medicine"
              value={form.medicine}
              onChange={handleChange}
              required
            >
              <option value="">Select Medicine</option>
              {medicineOptions.map((med, i) => (
                <option key={i} value={med}>
                  {med}
                </option>
              ))}
            </select>

            {form.medicine === 'Other' && (
              <input
                style={styles.input}
                type="text"
                name="customMedicine"
                placeholder="Enter custom medicine"
                value={form.customMedicine}
                onChange={handleChange}
                required
              />
            )}

            <select
              style={styles.select}
              name="doctor"
              onChange={handleChange}
              value={form.doctor}
              required
            >
              <option value="">Select Doctor</option>
              {doctorOptions.map((doc, i) => (
                <option key={i} value={doc}>
                  {doc}
                </option>
              ))}
            </select>

            <input
              style={styles.input}
              type="date"
              name="date"
              onChange={handleChange}
              value={form.date}
              required
            />
            <input
              style={styles.input}
              type="time"
              name="time"
              onChange={handleChange}
              value={form.time}
              required
            />
            <input
              style={styles.input}
              type="tel"
              name="mobile"
              placeholder="Mobile"
              onChange={handleChange}
              value={form.mobile}
              required
            />
          </>
        )}

        {role === 'donor' && (
          <>
            <input
              style={styles.input}
              type="text"
              name="employment"
              placeholder="Employment"
              onChange={handleChange}
              value={form.employment}
              required
            />
            <input
              style={styles.input}
              type="text"
              name="place"
              placeholder="Place"
              onChange={handleChange}
              value={form.place}
              required
            />
            <select
              style={styles.select}
              name="category"
              onChange={handleChange}
              value={form.category}
              required
            >
              <option value="">Select Category</option>
              <option value="Trust">Trust</option>
              <option value="Personal">Personal</option>
              <option value="Birthday">Birthday</option>
              <option value="Other">Other</option>
            </select>
            <input
              style={styles.input}
              type="date"
              name="birthday"
              onChange={handleChange}
              value={form.birthday}
              required
            />
          </>
        )}

        <input
          style={styles.input}
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          value={form.email}
          required
        />
        <input
          style={styles.input}
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          value={form.password}
          required
        />
        <input
          style={styles.input}
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          onChange={handleChange}
          value={form.confirmPassword}
          required
        />

        <button type="submit" style={styles.button}>
          Register
        </button>
      </form>
    </div>
  );
}

export default AuthPage;
