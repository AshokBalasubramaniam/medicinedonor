import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/authSlice';
import { useNavigate } from 'react-router-dom';
import { getPatientDetails } from '../../api';

function PatientDetails() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);

  const [patient, setPatient] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate('/patient'); // Redirect to login if no token
      return;
    }

    getPatientDetails(token)
      .then(data => setPatient(data))
      .catch(err => {
        alert(err.error || 'Failed to fetch patient details');
        dispatch(logout());
        navigate('/patient');
      });

    const timer = setTimeout(() => {
      dispatch(logout());
      navigate('/patient');
      alert('Session expired. Please login again.');
    }, 200 * 60 * 1000);

    return () => clearTimeout(timer);
  }, [token, dispatch, navigate]);

  if (!patient) return <p>Loading...</p>;

  return (
    <div>
      <h2>Welcome, {patient.name}</h2>
      <p>Age: {patient.age}</p>
      <p>Disease: {patient.disease}</p>
      <p>Approved: {patient.approved ? "Yes" : "No"}</p>
      <button onClick={() => {
        dispatch(logout());
        navigate('/patient');
      }}>Logout</button>
    </div>
  );
}

export default PatientDetails;
