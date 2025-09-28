import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { registerPatient, registerDonor } from './api';

function AuthPage() {
  const location = useLocation();
  const [role, setRole] = useState('patient');
  const initailForm={
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
    gender: '',
    relationship:'',
    birthday: '',
    email: '',
    password: '',
    confirmPassword: '',
    category: '',
    aadharno:'',
    panno:'',
    place: '',
    street:'',
    town:'',
    pincode:'',
    state:''
  }

  const [form, setForm] = useState(initailForm);

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
       setForm(initailForm);
      
    } catch (err) {
      if (err.response?.status === 409) {
        alert('Email already registered.');
      } else {
        alert('Registration failed.');
      }
    }
  };

  const styles = {
    page: {
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      backgroundColor: '#eaf8fc',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    header: {
    position: "fixed", 
    top: 0,
    left: 0,
    right: 0,
      backgroundColor: '#0b9a9a',
      width: '100%',
      padding: '20px 0',
      textAlign: 'center',
      color: 'white',
      fontWeight: 'bold',
      fontSize: '1.3rem',
    },
    card: {
      backgroundColor: 'white',
      padding: '40px',
      borderRadius: '10px',
      marginTop: '40px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      width: '100%',
      maxWidth:"1800px"
    },
    title: {
      textAlign: 'center',
      fontSize: '1.5rem',
      fontWeight: '600',
      marginBottom: '30px',
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr 1fr',
      gap: '20px 30px',
    },
    sectionHeader: {
      gridColumn: '1 / -1',
      fontWeight: '600',
      fontSize: '1.1rem',
      margin: '10px 0 10px',
      color: '#0b9a9a',
    },
    label: {
      fontSize: '0.9rem',
      marginBottom: '5px',
      fontWeight: '500',
      display: 'block',
    },
    input: {
      width: '90%',
      padding: '12px',
      borderRadius: '6px',
      border: '1px solid #ccc',
      fontSize: '1rem',
      boxSizing: 'border-box',
    },
    select: {
      width: '90%',
      padding: '12px',
      borderRadius: '6px',
      border: '1px solid #ccc',
      fontSize: '1rem',
    },
    button: {
      padding: '14px',
      backgroundColor: '#0b9a9a',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: '1rem',
   
    },
    roleSelect: {
      marginBottom: '20px',
      padding: '10px',
      borderRadius: '6px',
      border: '1px solid #ccc',
      fontSize: '1rem',
      width: '200px',
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>DOCTOR REGISTRATION</div>

      <div style={styles.card}>
        <h2 style={styles.title}>
          {role === 'patient' ? 'Patient Registration' : 'Donor Registration'}
        </h2>

        <div style={{ textAlign: 'center' }}>
          <select
            style={styles.roleSelect}
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="patient">Patient</option>
            <option value="donor">Donor</option>
          </select>
        </div>

        <form onSubmit={handleSubmit} style={styles.formGrid}>

          <div style={styles.sectionHeader}>Personal Details</div>

          <div>
            <label style={styles.label}>Full Name</label>
            <input
              style={styles.input}
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label style={styles.label}>Age</label>
            <input
              style={styles.input}
              type="number"
              name="age"
              value={form.age}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label style={styles.label}>Mobile</label>
            <input
              style={styles.input}
              type="text"
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label style={styles.label}>Gender</label>
            <select
              style={styles.select}
              name="gender"
              value={form.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label style={styles.label}>Birthday</label>
            <input
              style={styles.input}
              type="date"
              name="birthday"
              value={form.birthday}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label style={styles.label}>Relationship</label>
            <select
              style={styles.select}
              name="relationship"
              value={form.relationship}
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
            </select>
          </div>
          
    <div>
            <label style={styles.label}>AAdhar No</label>
            <input
              style={styles.input}
              type="text"
              name="aadharno"
              value={form.aadharno}
              onChange={handleChange}
              required
            />
          </div>
              <div>
            <label style={styles.label}>Pan No</label>
            <input
              style={styles.input}
              type="text"
              name="panno"
              value={form.panno}
              onChange={handleChange}
              required
            />
          </div>
          <div style={styles.sectionHeader}>Address Details</div>
          <div>
            <label style={styles.label}>Flat/House/no.Building name</label>
            <input
              style={styles.input}
              type="text"
              name="place"
              value={form.place}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label style={styles.label}>Street address</label>
             <input
              style={styles.input}
              type="text"
              name="street"
              value={form.street}
              onChange={handleChange}
              required
            />
          </div>
            <div>
            <label style={styles.label}>Town/city</label>
             <input
              style={styles.input}
              type="text"
              name="town"
              value={form.town}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label style={styles.label}>PinCode</label>
             <input
              style={styles.input}
              type="text"
              name="pincode"
              value={form.pincode}
              onChange={handleChange} 
              required
            />
          </div>
            <div>
            <label style={styles.label}>State</label>
             <input
              style={styles.input}
              type="text"
              name="state"
              value={form.state}
              onChange={handleChange}
              required
            />
          </div>
          
<div style={styles.sectionHeader}>Other Details</div>

          <div>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          {role === 'patient' && (
            <>
              <div>
                <label style={styles.label}>Disease</label>
                <input
                  style={styles.input}
                  type="text"
                  name="disease"
                  value={form.disease}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label style={styles.label}>Hospital Name</label>
                <input
                  style={styles.input}
                  type="text"
                  name="hospitalname"
                  value={form.hospitalname}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}

          {role === 'donor' && (
            <>
              <div>
                <label style={styles.label}>Employment</label>
                <input
                  style={styles.input}
                  type="text"
                  name="employment"
                  value={form.employment}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label style={styles.label}>Category</label>
                <select
                  style={styles.select}
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Trust">Trust</option>
                  <option value="Personal">Personal</option>
                  <option value="Birthday">Birthday</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label style={styles.label}>Confirm Password</label>
            <input
              style={styles.input}
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
<div style={styles.sectionHeader}>
          <button type="submit" style={styles.button}>
            REGISTER
          </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AuthPage;
