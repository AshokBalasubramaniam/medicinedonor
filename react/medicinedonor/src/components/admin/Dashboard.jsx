import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { admingetallpatientdetails, registerdoctor } from '../../api';
import { logout } from '../../store/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import AdminNavbar from "../admin/AdminNavbar";

function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [patients, setPatients] = useState([]);
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const token = useSelector((state) => state.auth?.token);

  const [doctor, setDoctor] = useState({
    fullName: '',
    email: '',
    phone: '',
    speciality: '',
    experience: '',
    profilePhoto: null,
    availableDays: '',
    availableTimings: '',
    maxPatients: '',
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
      console.warn('No auth token found, redirecting to login');
      navigate('/adminpage');
      return;
    }

    console.log('token dashboard', token);

    async function fetchPatient() {
      try {
        const data = await admingetallpatientdetails(token);
        setPatients(data);
      } catch (err) {
        console.error('Fetch details error:', err);
        alert(err.error || 'Failed to fetch patient details');
        dispatch(logout());
        navigate('/adminpage');
      }
    }

    fetchPatient();

    // auto logout after 200 minutes
    const timer = setTimeout(() => {
      dispatch(logout());
      navigate('/adminpage'); // ✅ redirect to admin login
      alert('Session expired. Please login again.');
    }, 200 * 60 * 1000);

    return () => clearTimeout(timer);
  }, [token, dispatch, navigate]);

  const [patient, setPatient] = useState(null);
  const [editpatient, setEditPatient] = useState({
    id: '',
    name: '',
    email: '',
    age: '',
    date: '',
    time: '',
    mobile: '',
    image: '',
    sex: '',
    relationshipstatus: '',
  });
  useEffect(() => {
    if (patient) {
      setEditPatient({
        id: patient.id || patient._id || '',
        name: patient.name || '',
        email: patient.email || '',
        age: patient.age ?? '',
        date: patient.date || '',
        time: patient.time || '',
        mobile: patient.mobile || '',
        sex: patient.sex || '',
        relationshipstatus: patient.relationshipstatus || '',
        image: patient.image || '',
      });
      if (patient.image) setDpPreview(patient.image);
    }
  }, [patient]);
  const [dpFile, setDpFile] = useState(null);
  const [dpPreview, setDpPreview] = useState(null);
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'profilePhoto') {
      setDoctor((prev) => ({
        ...prev,
        profilePhoto: files[0] || null,
      }));
    } else {
      setDoctor((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        fullName: doctor.fullName,
        email: doctor.email,
        phone: doctor.phone,
        speciality: doctor.speciality,
        experience: doctor.experience,
        qualification: '',
        availableDays: doctor.availableDays,
        availableTimings: doctor.availableTimings,
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
      setDpPreview(null);
    } catch (err) {
      console.error('Error registering doctor:', err);
      alert(err.response?.data?.message || 'Failed to register doctor');
    } finally {
      setLoading(false);
    }
  };

  // ✅ logout
  const handleLogout = () => {
    dispatch(logout()); // ✅ clear Redux auth
    navigate('/adminpage');
    localStorage.clear();
  };

  // ✅ internal styles
  const styles = {
    nav: {
      backgroundColor: '#0ea5a4',
      padding: '16px 32px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    navList: {
      listStyle: 'none',
      display: 'flex',
      gap: '25px',
      margin: 0,
      padding: 0,
    },
    link: {
      color: 'white',
      textDecoration: 'none',
      fontWeight: 600,
      fontSize: '16px',
      padding: '10px 14px',
      borderRadius: '6px',
    },
    activeLink: {
      backgroundColor: 'white',
      color: '#0ea5a4',
    },
    navRight: {
      display: 'flex',
      gap: '15px',
      alignItems: 'center',
    },
    mainContainer: {
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f6fa',
      minHeight: '100vh',
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
      cursor: 'pointer',
      transition: 'transform 0.2s ease',
    },
    button: {
      padding: '10px 20px',
      backgroundColor: '#3498db',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
    },
    logoutButton: {
      padding: '10px 20px',
      backgroundColor: '#e74c3c',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.5)',
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
    },
    form: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '20px',
    },
    input: {
      padding: '10px',
      borderRadius: '5px',
      border: '1px solid #ccc',
      fontSize: '14px',
      width: '100%',
    },
    select: {
      padding: '10px',
      borderRadius: '5px',
      border: '1px solid #ccc',
      fontSize: '14px',
    },
    submitBtn: {
      gridColumn: 'span 2',
      padding: '14px',
      backgroundColor: '#0ea5a4',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      fontSize: '16px',
      cursor: 'pointer',
    },
  };

  return (
    <div style={styles.mainContainer}>
     
      {/* ✅ Reusable Navbar */}
      <AdminNavbar onAddDoctor={() => setShowDoctorModal(true)} />
      {/* Stats Cards */}
      <div style={styles.cardsWrapper}>
        <div style={styles.card}>
          <h3>Total Patients</h3>
          <p>{patients.length}</p>
        </div>
        <div style={styles.card}>
          <h3>Approved Patients</h3>
          <p>{patients.filter((p) => p.approved).length}</p>
        </div>
        <div style={styles.card}>
          <h3>Not Approved</h3>
          <p>{patients.filter((p) => p.approved === false).length}</p>
        </div>
        <div style={styles.card}>
          <h3>Total Donors</h3>
          <p>12</p>
        </div>
      </div>

      {/* Doctor Modal */}
      {showDoctorModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2>Doctor Registration</h2>
            <form style={styles.form} onSubmit={handleSubmit}>
              <input
                style={styles.input}
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={doctor.fullName}
                onChange={handleChange}
                required
              />
              <input
                style={styles.input}
                type="email"
                name="email"
                placeholder="Email"
                value={doctor.email}
                onChange={handleChange}
                required
              />
              <input
                style={styles.input}
                type="text"
                name="phone"
                placeholder="Phone"
                value={doctor.phone}
                onChange={handleChange}
                required
              />
              <select
                style={styles.select}
                name="speciality"
                value={doctor.speciality}
                onChange={handleChange}
                required
              >
                <option value="">Select Speciality</option>
                {specialities.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <input
                style={styles.input}
                type="text"
                name="experience"
                placeholder="Years of Experience"
                value={doctor.experience}
                onChange={handleChange}
              />
              <input
                style={styles.input}
                type="file"
                name="profilePhoto"
                onChange={handleChange}
              />
              <input
                style={styles.input}
                type="text"
                name="availableDays"
                placeholder="Available Days"
                value={doctor.availableDays}
                onChange={handleChange}
              />
              <input
                style={styles.input}
                type="text"
                name="availableTimings"
                placeholder="Available Timings"
                value={doctor.availableTimings}
                onChange={handleChange}
              />
              <input
                style={styles.input}
                type="number"
                name="maxPatients"
                placeholder="Max Patients per Day"
                value={doctor.maxPatients}
                onChange={handleChange}
              />

              <button type="submit" style={styles.submitBtn} disabled={loading}>
                {loading ? 'Registering...' : 'Register Doctor'}
              </button>
            </form>
            <div style={{ marginTop: 20, textAlign: 'center' }}>
              <button
                style={{ ...styles.button, backgroundColor: 'red' }}
                onClick={() => setShowDoctorModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
