import React, { useState } from 'react';
import { registerdoctor } from '../../api';

function Doctor() {
  const [loading, setLoading] = useState(false);

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

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profilePhoto') {
      setDoctor({ ...doctor, profilePhoto: files[0]?.name || null }); // store file name
    } else {
      setDoctor({ ...doctor, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ map frontend -> backend struct
      const payload = {
        fullname: doctor.fullName,
        email: doctor.email,

        specialization:
          doctor.speciality === 'Others'
            ? doctor.otherSpeciality
            : doctor.speciality,
        otherspeciality: doctor.otherSpeciality || null,
        phone: doctor.phone,

        yearsofexperience: doctor.experience,

        availabledays: doctor.availableDays,
        availabletimings: doctor.availableTimings,
        maxpatients: doctor.maxPatients ? parseInt(doctor.maxPatients) : null,

        profilephoto: doctor.profilePhoto,
      };

      const response = await registerdoctor(payload);
      alert(response.message || 'Doctor registered successfully!');

      // reset form
      setDoctor({
        fullName: '',
        email: '',

        phone: '',
        speciality: '',

        profilePhoto: null,
        availableDays: '',
        availableTimings: '',
        maxPatients: '',
      });
    } catch (err) {
      alert(
        'Error registering doctor: ' +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ simple fullscreen form styles (keep from your code)
  const styles = {
    container: {
      width: '100vw',
      height: '100vh',
      padding: '20px',
      backgroundColor: '#f5f6fa',
      fontFamily: 'Arial, sans-serif',
      overflow: 'auto',
    },
    heading: {
      textAlign: 'center',
      color: '#2c3e50',
      marginBottom: '20px',
      fontSize: '30px',
    },
    form: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '20px',
      height: 'calc(100% - 60px)',
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
    },
    label: { marginBottom: '6px', fontWeight: 'bold', color: '#2c3e50' },
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
      backgroundColor: '#fff',
      width: '100%',
    },
    textarea: {
      padding: '10px',
      borderRadius: '5px',
      border: '1px solid #ccc',
      fontSize: '14px',
      resize: 'vertical',
      minHeight: '80px',
      width: '100%',
    },
    button: {
      gridColumn: 'span 2',
      padding: '14px',
      backgroundColor: '#3498db',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      fontSize: '16px',
      cursor: 'pointer',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Doctor Registration</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        {/* form fields here (same as your original code) */}
        {/* Submit */}
        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? 'Registering...' : 'Add Doctor'}
        </button>
      </form>
    </div>
  );
}

export default Doctor;
