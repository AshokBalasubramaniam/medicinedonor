import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import { useNavigate } from 'react-router-dom';

function PatientDetails() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(logout());
      navigate('/patient');
      alert('Session expired. Please login again.');
    }, 2 * 60 * 1000); // 2 minutes

    return () => clearTimeout(timer);
  }, [dispatch, navigate]);

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h2>Welcome to Patient Details Page!</h2>
      <button onClick={() => {
        dispatch(logout());
        navigate('/patient');
      }}>Logout</button>
    </div>
  );
}

export default PatientDetails;
