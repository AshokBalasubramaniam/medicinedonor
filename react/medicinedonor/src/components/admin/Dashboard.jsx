import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { admingetallpatientdetails, registerdoctor } from '../../api';
import { logout } from '../../store/authSlice';
import AdminNavbar from '../admin/AdminNavbar';

function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth?.token);

  const [patients, setPatients] = useState([]);
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [doctor, setDoctor] = useState({
    fullName: '',
    email: '',
    phone: '',
    speciality: '',
    experience: '',
    availableDays: '',
    availableTimings: '',
    maxPatients: '',
    profilePhoto: null,
  });

  const specialities = [
    'Cardiologist',
    'Dermatologist',
    'Neurologist',
    'Pediatrician',
    'Psychologist',
    'Radiologist',
    'Surgeon',
    'Others',
  ];

  useEffect(() => {
    if (!token) {
      navigate('/adminpage');
      return;
    }

    async function fetchPatient() {
      try {
        const data = await admingetallpatientdetails(token);
        setPatients(data);
      } catch (err) {
        alert('Failed to fetch patient details');
        dispatch(logout());
        navigate('/adminpage');
      }
    }

    fetchPatient();

    const timer = setTimeout(() => {
      dispatch(logout());
      navigate('/adminpage');
      alert('Session expired. Please login again.');
    }, 200 * 60 * 1000);

    return () => clearTimeout(timer);
  }, [token, dispatch, navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profilePhoto') {
      setDoctor((prev) => ({ ...prev, profilePhoto: files[0] || null }));
    } else {
      setDoctor((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...doctor,
        maxPatients: Number(doctor.maxPatients),
        profilePhoto: doctor.profilePhoto ? doctor.profilePhoto.name : null,
      };

      await registerdoctor(payload, token);
      alert('Doctor registered successfully!');
      setShowDoctorModal(false);
      setDoctor({
        fullName: '',
        email: '',
        phone: '',
        speciality: '',
        experience: '',
        availableDays: '',
        availableTimings: '',
        maxPatients: '',
        profilePhoto: null,
      });
    } catch (err) {
      alert('Failed to register doctor');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/adminpage');
    localStorage.clear();
  };

  const styles = {
    mainContainer: {
      backgroundColor: '#f5f6fa',
      minHeight: '100vh',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
    },
    cardsWrapper: {
      display: 'flex',
      gap: '20px',
      marginTop: '20px',
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
    card: {
      flex: '1 1 220px',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
      padding: '20px',
      textAlign: 'center',
      transition: 'transform 0.2s ease',
      cursor: 'pointer',
    },
    cardHover: {
      transform: 'translateY(-5px)',
    },
    cardTitle: {
      color: '#333',
      marginBottom: '10px',
      fontSize: '18px',
    },
    cardValue: {
      fontSize: '22px',
      fontWeight: 'bold',
      color: '#0ea5a4',
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.55)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    },
    modalContent: {
      background: 'white',
      borderRadius: '10px',
      padding: '30px',
      width: '700px',
      maxHeight: '90vh',
      overflowY: 'auto',
      boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
    },
    form: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '20px',
    },
    input: {
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '6px',
      fontSize: '14px',
      width: '100%',
    },
    select: {
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '6px',
      fontSize: '14px',
    },
    submitBtn: {
      gridColumn: 'span 2',
      backgroundColor: '#0ea5a4',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      fontSize: '16px',
      padding: '14px',
      cursor: 'pointer',
    },
    cancelBtn: {
      backgroundColor: '#e74c3c',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      marginTop: '20px',
    },
    paymentSummary: {
      marginTop: '40px',
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
      padding: '20px',
    },
    paymentTitle: {
      marginBottom: '15px',
      color: '#0ea5a4',
      fontSize: '20px',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    th: {
      backgroundColor: '#0ea5a4',
      color: 'white',
      border: '1px solid #ddd',
      padding: '12px',
      textAlign: 'left',
    },
    td: {
      border: '1px solid #ddd',
      padding: '12px',
    },
    trEven: {
      backgroundColor: '#f2f2f2',
    },
  };

  return (
    <div style={styles.mainContainer}>
      <AdminNavbar onAddDoctor={() => setShowDoctorModal(true)} onLogout={handleLogout} />

      <div style={styles.cardsWrapper}>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Total Patients</h3>
          <p style={styles.cardValue}>{patients.length}</p>
        </div>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Approved Patients</h3>
          <p style={styles.cardValue}>{patients.filter((p) => p.approved).length}</p>
        </div>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Not Approved</h3>
          <p style={styles.cardValue}>{patients.filter((p) => p.approved === false).length}</p>
        </div>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Total Donors</h3>
          <p style={styles.cardValue}>12</p>
        </div>
      </div>

      {/* Doctor Modal */}
      {showDoctorModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2>Doctor Registration</h2>
            <form style={styles.form} onSubmit={handleSubmit}>
              <input style={styles.input} type="text" name="fullName" placeholder="Full Name" value={doctor.fullName} onChange={handleChange} required />
              <input style={styles.input} type="email" name="email" placeholder="Email" value={doctor.email} onChange={handleChange} required />
              <input style={styles.input} type="text" name="phone" placeholder="Phone" value={doctor.phone} onChange={handleChange} required />
              <select style={styles.select} name="speciality" value={doctor.speciality} onChange={handleChange} required>
                <option value="">Select Speciality</option>
                {specialities.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <input style={styles.input} type="text" name="experience" placeholder="Years of Experience" value={doctor.experience} onChange={handleChange} />
              <input style={styles.input} type="file" name="profilePhoto" onChange={handleChange} />
              <input style={styles.input} type="text" name="availableDays" placeholder="Available Days" value={doctor.availableDays} onChange={handleChange} />
              <input style={styles.input} type="text" name="availableTimings" placeholder="Available Timings" value={doctor.availableTimings} onChange={handleChange} />
              <input style={styles.input} type="number" name="maxPatients" placeholder="Max Patients per Day" value={doctor.maxPatients} onChange={handleChange} />
              <button type="submit" style={styles.submitBtn} disabled={loading}>
                {loading ? 'Registering...' : 'Register Doctor'}
              </button>
            </form>
            <div style={{ textAlign: 'center' }}>
              <button style={styles.cancelBtn} onClick={() => setShowDoctorModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Section */}
      <div style={styles.paymentSummary}>
        <h3 style={styles.paymentTitle}>Payment Overview</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Total Amount</th>
              <th style={styles.th}>Paid</th>
              <th style={styles.th}>Donor Name</th>
            </tr>
          </thead>
          <tbody>
            <tr style={styles.trEven}>
              <td style={styles.td}>John Doe</td>
              <td style={styles.td}>₹2500</td>
              <td style={styles.td}>₹1000</td>
              <td style={styles.td}>Rajesh Kumar</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
