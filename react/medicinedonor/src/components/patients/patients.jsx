import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { loginSuccess } from '../../store/authSlice';
import { loginPatient } from '../../api';

function PatientAuth() {
  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #00bfff, #1e90ff)',
    },
    card: {
      background: 'white',
      padding: '2rem',
      borderRadius: '10px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
      textAlign: 'center',
      width: '350px',
    },
    heading: {
      marginBottom: '1.5rem',
      color: '#1e90ff',
    },
    input: {
      width: '100%',
      padding: '10px',
      margin: '10px 0',
      border: '1px solid #ccc',
      borderRadius: '6px',
    },
    button: {
      width: '100%',
      padding: '10px',
      background: '#1e90ff',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '1rem',
    },
  };
  const auth = useSelector((state) => state.auth || {});
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [form, setForm] = useState({ email: '', password: '' });

  useEffect(() => {
    if (auth?.isAuthenticated) {
      navigate('/PatientDetails');
    }
  }, [auth.isAuthenticated, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginPatient(form.email, form.password);
      // If backend returned an error object, loginPatient would have rejected.
      // On success, res should be { user, token }
      if (res?.token && res?.user) {
        dispatch(loginSuccess({ user: res.user, token: res.token }));
        alert('Login successful!');
        navigate('/PatientDetails');
      } else {
        // Unexpected response shape
        alert('Login failed: invalid server response');
        console.error('Unexpected login response:', res);
      }
    } catch (err) {
      // err is normalized by axios interceptor: { error: "Invalid credentials" } or similar
      alert(err.error || 'Login failed. Please check your email and password.');
      console.error('Login error:', err);
    }
  };
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Patient Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            value={form.email}
            style={styles.input}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            value={form.password}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default PatientAuth;
