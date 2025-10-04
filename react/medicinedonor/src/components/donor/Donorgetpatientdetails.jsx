import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { admingetallpatientdetails } from '../../api';
import { logout } from '../../store/authSlice';
import PaymentModal from './PaymentModal';

function Donorgetpatientdetails() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const token = useSelector((state) => state.auth?.token);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!token) {
      navigate('/donorlogin');
      return;
    }

    async function fetchPatients() {
      setLoading(true);
      try {
        const data = await admingetallpatientdetails(token);
        setPatients(data || []);
      } catch (err) {
        setError('Failed to fetch patient details');
        dispatch(logout());
        navigate('/donorlogin');
      } finally {
        setLoading(false);
      }
    }

    fetchPatients();

    const timer = setTimeout(() => {
      dispatch(logout());
      navigate('/donorlogin');
      alert('Session expired. Please login again.');
    }, 200 * 60 * 1000);

    return () => clearTimeout(timer);
  }, [token, dispatch, navigate]);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>All Patient Details</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {patients.length > 0 ? (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {patients.map((p) => (
            <li
              key={p._id}
              style={{
                border: '1px solid #ddd',
                borderRadius: 8,
                padding: 10,
                marginBottom: 10,
                background: '#f9f9f9',
              }}
            >
              <p>
                <strong>id:</strong> {p.id}
              </p>
              <p>
                <strong>Name:</strong> {p.name}
              </p>
              <p>
                <strong>Age:</strong> {p.age}
              </p>
              <p>
                <strong>Disease:</strong> {p.disease}
              </p>
              <p>
                <strong>Hospital:</strong> {p.hospital}
              </p>
              <p>
                <strong>TottalAmount:</strong> {p.amount}
              </p>
              <p>
                <strong>balance:</strong>{p.balance_amount}
              </p>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>
                  ₹ {p.amount_due}
                </div>
                <button
                  onClick={() => {
                    setSelected(p);
                    setOpen(true);
                  }}
                >
                  Pay
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        !loading && <p>No patients found.</p>
      )}

      {open && selected && (
        <PaymentModal
          patient={selected}
          onClose={() => {
            setOpen(false);
            setSelected(null);
          }}
          onSuccess={() => {
            setOpen(false);
            setSelected(null);
          }}
        />
      )}
    </div>
  );
}

export default Donorgetpatientdetails;
