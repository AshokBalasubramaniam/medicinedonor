import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { loginSuccess } from '../../store/authSlice';
import { loginPatient } from '../../api';

function PatientAuth() {
  const [isBackHover, setBackHover] = useState(false);

  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #6dd5fa, #2980b9)',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    card: {
      background: '#fff',
      padding: '2.5rem 3rem',
      borderRadius: '12px',
      boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
      textAlign: 'center',
      width: '360px',
    },
    heading: {
      marginBottom: '2rem',
      color: '#2980b9',
      fontWeight: '700',
      fontSize: '1.8rem',
    },
    input: {
      width: '100%',
      padding: '12px 14px',
      margin: '12px 0',
      border: '1.8px solid #ccc',
      borderRadius: '8px',
      fontSize: '1rem',
      outlineColor: '#2980b9',
      transition: 'border-color 0.3s ease',
    },
    button: {
      width: '100%',
      padding: '12px',
      background: '#2980b9',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '1.1rem',
      fontWeight: '600',
      marginTop: '15px',
      transition: 'background-color 0.3s ease',
    },
    backButton: {
      marginTop: '10px',
      background: isBackHover ? '#2980b9' : '#eee',
      color: isBackHover ? 'white' : '#2980b9',
      border: '1.8px solid #2980b9',
      borderRadius: '8px',
      cursor: 'pointer',
      padding: '10px',
      fontWeight: '600',
      fontSize: '1rem',
      transition: 'background-color 0.3s ease, color 0.3s ease',
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
      if (res?.token && res?.user) {
        dispatch(loginSuccess({ user: res.user, token: res.token }));
        alert('Login successful!');
        navigate('/PatientDetails');
      } else {
        alert('Login failed: invalid server response');
        console.error('Unexpected login response:', res);
      }
    } catch (err) {
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
          <button
            type="button"
            style={styles.backButton}
            onClick={() => navigate(-1)}
            onMouseEnter={() => setBackHover(true)}
            onMouseLeave={() => setBackHover(false)}
          >
            Back
          </button>
        </form>
      </div>
    </div>
  );
}

export default PatientAuth;
