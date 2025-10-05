import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { admingetallpatientdetails } from '../../api';
import { logout } from '../../store/authSlice';
import AdminNavbar from "../admin/AdminNavbar";

function ApprovedPatients() {
  const Navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth?.token);
  const [patients, setPatients] = useState([]);
  const [allPatients, setAllPatients] = useState([]);
  const style = {
        root: {
      padding: 20,
      marginBottom:20,
    },
    approvegrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(1fr)',
      wrap: 'wrap',
      gap: '20px',
    },
    card: {
      background: '#fff',
      padding: '15px',
      borderRadius: '10px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
      width: '300px',
      borderLeft: '6px solid #287215ff',
    },
    heading: {
      textAlign: 'center',
      margin: '20px 0',
      color: '#166534',
      fontSize: '40px',
      fontWeight: '900',
    },
    search: {
      textAlign: 'end',
      marginBottom: '20px',
      padding: '10px',
      paddingRight: '150px',
    },
    input: {
      width: '300px',
      padding: '10px',
      borderRadius: '8px',
      border: '1px solid #ccc',
      fontSize: '16px',
    },
  };
  async function fetchPatient() {
    try {
      const data = await admingetallpatientdetails(token);
      const approved = data.filter((p) => p.approved === true);
      setAllPatients(approved); // store full list
      setPatients(approved);
    } catch (err) {
      alert(err?.error || 'Failed to fetch patients');
      dispatch(logout());
      Navigate('/adminpage');
    }
  }

  useEffect(() => {
    if (!token) {
      Navigate('/Dashboard');
      return;
    }

    fetchPatient();

    const timer = setTimeout(() => {
      dispatch(logout());
      Navigate('/adminpage');
      alert('Session expired. Please login again.');
    }, 200 * 60 * 1000);

    return () => clearTimeout(timer);
  }, [token, dispatch, Navigate]);

  const handleSearch = (value) => {
    if (value.trim() === '') {
      // if search box empty → reset to full list
      setPatients(allPatients);
    } else {
      const filtered = allPatients.filter(
        (p) =>
          (p.name?.toLowerCase() || '').includes(value.toLowerCase()) ||
          (p.email?.toLowerCase() || '').includes(value.toLowerCase()) ||
          (p.mobile?.toLowerCase() || '').includes(value.toLowerCase()) ||
          (p.date?.toLowerCase() || '').includes(value.toLowerCase())
      );
      setPatients(filtered);
    }
  };
  return (
    <div style={style.root}>
      <div>
<AdminNavbar />
 
      </div>
         
      <div style={style.search}>
        <input
          style={style.input}
          type="search"
          placeholder="Search by name, email, mobile, date"
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
        />
      </div>

      <div style={style.approvegrid}>
        {patients.length > 0 ? (
          patients.map((p) => (
            <div key={p._id} style={style.card}>
              <strong>{p.name}</strong>
              <p>Email: {p.email}</p>
              <p>mobile: {p.mobile}</p>
              <p>date:{p.date}</p>
              <p>Status: {p.approved ? 'Approved' : 'Pending'}</p>
              <p>amount: {p.amount}</p>
            </div>
          ))
        ) : (
          <p>No approved patients found.</p>
        )}
      </div>
    </div>
  );
}

export default ApprovedPatients;
