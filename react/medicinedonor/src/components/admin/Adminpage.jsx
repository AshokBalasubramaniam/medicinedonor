import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { adminLogin } from '../../api';
import { loginSuccess } from '../../store/authSlice';

function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth || {});

  const styles = {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg,#eef2ff,#fff7ed)',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    box: {
      width: 360,
      padding: 28,
      borderRadius: 12,
      boxShadow: '0 12px 30px rgba(16,24,40,0.12)',
      background: '#fff',
    },
    title: {
      fontSize: 22,
      marginBottom: 12,
      fontWeight: 700,
      color: '#0f172a',
    },
    input: {
      width: '100%',
      padding: '10px 12px',
      marginBottom: 12,
      borderRadius: 8,
      border: '1px solid #e5e7eb',
      fontSize: 15,
      outlineColor: '#0ea5a4',
    },
    button: {
      width: '100%',
      padding: 10,
      borderRadius: 8,
      border: 'none',
      background: '#0ea5a4',
      color: '#fff',
      fontWeight: 700,
      cursor: 'pointer',
      marginTop: 5,
    },
    error: { color: '#ef4444', marginBottom: 8, fontSize: 14 },
  };

  // useEffect(() => {
  //   if (auth?.isAuthenticated) {
  //     navigate('/Adminpage');
  //     console.log('Already authenticated, redirecting to /Adminpage');
  //   }
  // }, [auth.isAuthenticated, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await adminLogin(form.email, form.password);
      if (res?.token && res?.user) {
        dispatch(loginSuccess({ user: res.user, token: res.token }));{
    
        alert('Admin login successful!');
        navigate('/Dashboard');
        }
      } else {
        alert('Login failed: invalid server response');
        setError('Invalid server response');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Login failed. Please try again.'
      );
      console.error('Admin login error:', err);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <div style={styles.title}>Admin Login</div>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleLogin}>
          <input
            style={styles.input}
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
          <input
            style={styles.input}
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            required
          />
          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>
        <div style={{ marginTop: 10, fontSize: 14 }}>
          <a href="/forgetpassword">Forgot password?</a>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
