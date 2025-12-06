import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { adminLogin } from '../../api';
import { loginSuccess } from '../../store/authSlice';

function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
 const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth || {});

  const styles = {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
      fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      position: 'relative',
      padding: '2rem',
    },
    containerBefore: {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage:
        'radial-gradient(circle at 20% 30%, rgba(245, 158, 11, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(239, 68, 68, 0.1) 0%, transparent 50%)',
      pointerEvents: 'none',
    },
    box: {
      width: '100%',
      maxWidth: 420,
      padding: 32,
      borderRadius: 16,
      boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
      background: 'rgba(255, 255, 255, 0.98)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255,255,255,0.1)',
      position: 'relative',
      zIndex: 1,
    },
    brand: {
      textAlign: 'center',
      marginBottom: 32,
    },
    logo: {
      width: 72,
      height: 72,
      background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
      borderRadius: 18,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: 32,
      marginBottom: 16,
      boxShadow: '0 8px 24px rgba(245, 158, 11, 0.3)',
    },
    title: {
      fontSize: 26,
      marginBottom: 8,
      fontWeight: 700,
      color: '#1f2937',
    },
    subtitle: {
      fontSize: 15,
      color: '#64748b',
      marginBottom: 0,
    },
    input: {
      width: '100%',
      padding: '14px 16px',
      marginBottom: 16,
      borderRadius: 12,
      border: '1px solid #e5e7eb',
      fontSize: 16,
      outlineColor: '#f59e0b',
      background: '#f8fafc',
      transition: 'all 0.3s ease',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6)',
    },
    inputFocus: {
      borderColor: '#f59e0b',
      boxShadow: '0 0 0 3px rgba(245, 158, 11, 0.1)',
    },
    button: {
      width: '100%',
      padding: 14,
      borderRadius: 12,
      border: 'none',
      background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
      color: '#fff',
      fontWeight: 600,
      cursor: 'pointer',
      fontSize: 16,
      marginTop: 8,
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
      position: 'relative',
      overflow: 'hidden',
    },
    buttonHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(245, 158, 11, 0.4)',
    },
    buttonDisabled: {
      opacity: 0.7,
      cursor: 'not-allowed',
      transform: 'none',
    },
    error: {
      color: '#ef4444',
      marginBottom: 16,
      fontSize: 14,
      padding: '10px 12px',
      background: '#fef2f2',
      borderRadius: 8,
      border: '1px solid #fecaca',
    },
    forgotLink: {
      textAlign: 'center',
      marginTop: 16,
      fontSize: 14,
      color: '#64748b',
    },
    forgotLinkA: {
      color: '#f59e0b',
      textDecoration: 'none',
      fontWeight: 500,
      transition: 'color 0.3s ease',
    },
    forgotLinkAHover: {
      color: '#d97706',
    },
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
    setLoading(true);

    if (!form.email.trim() || !form.password) {
      setError('Please provide email and password.');
      setLoading(false);
      return;
    }

    try {
      const res = await adminLogin(form.email, form.password);
      if (res?.token && res?.user) {
        dispatch(loginSuccess({ user: res.user, token: res.token }));
        navigate('/Dashboard');
      } else {
        setError('Login failed: invalid server response');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Login failed. Please try again.'
      );
      console.error('Admin login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.containerBefore}></div>
      <div style={styles.box}>
        <div style={styles.brand}>
          <div style={styles.logo}>
            <i className="fa-solid fa-user-shield"></i>
          </div>
          <div style={styles.title}>Admin Portal</div>
          <div style={styles.subtitle}>Secure access to system management</div>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleLogin}>
          <input
            style={styles.input}
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Administrator email"
            required
            autoComplete="email"
            onFocus={(e) => e.target.style.borderColor = '#f59e0b'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          />
          <input
            style={styles.input}
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Administrator password"
            required
            autoComplete="current-password"
            onFocus={(e) => e.target.style.borderColor = '#f59e0b'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          />
          <button
            type="submit"
            style={{...styles.button, ...(loading ? styles.buttonDisabled : {})}}
            disabled={loading}
            onMouseEnter={(e) => !loading && (e.target.style.transform = 'translateY(-2px)')}
            onMouseLeave={(e) => !loading && (e.target.style.transform = 'translateY(0)')}
          >
            {loading ? 'Signing in...' : 'Sign In as Admin'}
          </button>
        </form>

        <div style={styles.forgotLink}>
          <a
            href="/Forgetpassword"
            style={styles.forgotLinkA}
            onMouseEnter={(e) => e.target.style.color = '#d97706'}
            onMouseLeave={(e) => e.target.style.color = '#f59e0b'}
          >
            Forgot administrator password?
          </a>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
