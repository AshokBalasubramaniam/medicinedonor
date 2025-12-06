import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { loginSuccess } from '../../store/authSlice';
import { loginPatient } from '../../api';

function PatientAuth() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
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
        'radial-gradient(circle at 30% 40%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)',
      pointerEvents: 'none',
    },
    card: {
      background: 'rgba(255, 255, 255, 0.98)',
      backdropFilter: 'blur(10px)',
      padding: '3rem 2.5rem',
      borderRadius: '16px',
      boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
      textAlign: 'center',
      width: '100%',
      maxWidth: '420px',
      border: '1px solid rgba(255,255,255,0.2)',
      position: 'relative',
      zIndex: 1,
    },
    brand: {
      marginBottom: '2rem',
    },
    logo: {
      width: '64px',
      height: '64px',
      background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
      borderRadius: '16px',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '28px',
      marginBottom: '1rem',
      boxShadow: '0 8px 24px rgba(59, 130, 246, 0.2)',
    },
    heading: {
      marginBottom: '0.5rem',
      color: '#1f2937',
      fontWeight: '700',
      fontSize: '1.8rem',
    },
    subtitle: {
      color: '#64748b',
      fontSize: '0.95rem',
      marginBottom: '1.5rem',
    },
    input: {
      width: '100%',
      padding: '14px 16px',
      margin: '8px 0',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      fontSize: '1rem',
      outlineColor: '#3b82f6',
      transition: 'all 0.3s ease',
      background: '#f8fafc',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6)',
    },
    passwordWrapper: {
      position: 'relative',
      width: '100%',
      margin: '8px 0',
    },
    passwordToggle: {
      position: 'absolute',
      right: '14px',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'transparent',
      border: 'none',
      color: '#64748b',
      cursor: 'pointer',
      fontSize: '14px',
      padding: '4px',
    },
    button: {
      width: '100%',
      padding: '14px',
      background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      cursor: 'pointer',
      fontSize: '1.1rem',
      fontWeight: '600',
      marginTop: '1rem',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
      position: 'relative',
      overflow: 'hidden',
    },
    buttonHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(59, 130, 246, 0.4)',
    },
    backButton: {
      marginTop: '1rem',
      background: 'transparent',
      color: '#64748b',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      cursor: 'pointer',
      padding: '10px 16px',
      fontWeight: '500',
      fontSize: '0.95rem',
      transition: 'all 0.3s ease',
      width: '100%',
    },
    backButtonHover: {
      background: '#f8fafc',
      borderColor: '#d1d5db',
    },
    error: {
      color: '#ef4444',
      fontSize: '0.9rem',
      marginTop: '0.5rem',
      padding: '8px 12px',
      background: '#fef2f2',
      borderRadius: '8px',
      border: '1px solid #fecaca',
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
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!form.email.trim() || !form.password) {
      setError('Please provide email and password.');
      setLoading(false);
      return;
    }

    try {
      const res = await loginPatient(form.email, form.password);
      if (res?.token && res?.user) {
        dispatch(loginSuccess({ user: res.user, token: res.token }));
        navigate('/PatientDetails');
      } else {
        setError('Login failed: invalid server response');
        console.error('Unexpected login response:', res);
      }
    } catch (err) {
      setError(err.error || 'Login failed. Please check your email and password.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.containerBefore}></div>
      <div style={styles.card}>
        <div style={styles.brand}>
          <div style={styles.logo}>
            <i className="fa-solid fa-user-injured"></i>
          </div>
          <h2 style={styles.heading}>Patient Portal</h2>
          <p style={styles.subtitle}>Sign in to access your medical dashboard</p>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            onChange={handleChange}
            value={form.email}
            style={styles.input}
            required
            autoComplete="email"
          />
          <div style={styles.passwordWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              onChange={handleChange}
              value={form.password}
              style={styles.input}
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              style={styles.passwordToggle}
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <button
            type="submit"
            style={styles.button}
            disabled={loading}
            onMouseEnter={(e) => !loading && (e.target.style.transform = 'translateY(-2px)')}
            onMouseLeave={(e) => !loading && (e.target.style.transform = 'translateY(0)')}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <button
            type="button"
            style={styles.backButton}
            onClick={() => navigate('/')}
            onMouseEnter={(e) => e.target.style.background = '#f8fafc'}
            onMouseLeave={(e) => e.target.style.background = 'transparent'}
          >
            ← Back to Home
          </button>
        </form>
      </div>
    </div>
  );
}

export default PatientAuth;
