import { Link } from 'react-router-dom';
import Loginimage from './assets/Pep-treatment_0.png';

const Login = () => {
  const styles = {
    container: {
      position: 'relative',
      width: '100%',
      height: '100vh',
      overflow: 'hidden',
      fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    backgroundImage: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      opacity: 0.1,
      zIndex: 1,
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.3)',
      zIndex: 2,
    },
    content: {
      position: 'relative',
      zIndex: 3,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem',
    },
    header: {
      textAlign: 'center',
      marginBottom: '3rem',
      color: 'white',
    },
    logo: {
      fontSize: '3.5rem',
      marginBottom: '1rem',
      color: '#4ade80',
      textShadow: '0 2px 4px rgba(0,0,0,0.3)',
    },
    title: {
      fontSize: '2.8rem',
      fontWeight: '700',
      marginBottom: '0.5rem',
      color: 'white',
      textShadow: '0 2px 4px rgba(0,0,0,0.3)',
      letterSpacing: '-0.5px',
    },
    subtitle: {
      fontSize: '1.1rem',
      color: 'rgba(255,255,255,0.9)',
      fontWeight: '400',
      marginBottom: '1rem',
    },
    tagline: {
      fontSize: '0.95rem',
      color: 'rgba(255,255,255,0.8)',
      fontStyle: 'italic',
    },
    loginGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '2rem',
      width: '100%',
      maxWidth: '1000px',
      marginBottom: '2rem',
    },
    loginCard: {
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderRadius: '16px',
      padding: '2rem',
      textAlign: 'center',
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      border: '1px solid rgba(255,255,255,0.2)',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
    },
    loginCardHover: {
      transform: 'translateY(-5px)',
      boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
    },
    cardIcon: {
      fontSize: '3rem',
      marginBottom: '1rem',
      display: 'block',
    },
    patientIcon: {
      color: '#3b82f6',
    },
    donorIcon: {
      color: '#10b981',
    },
    adminIcon: {
      color: '#f59e0b',
    },
    cardTitle: {
      fontSize: '1.5rem',
      fontWeight: '600',
      marginBottom: '0.5rem',
      color: '#1f2937',
    },
    cardDescription: {
      fontSize: '0.9rem',
      color: '#6b7280',
      marginBottom: '1.5rem',
      lineHeight: '1.4',
    },
    loginButton: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      padding: '12px 24px',
      borderRadius: '8px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textDecoration: 'none',
      display: 'inline-block',
      width: '100%',
      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
    },
    loginButtonHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
    },
    registerSection: {
      textAlign: 'center',
      color: 'white',
    },
    registerText: {
      fontSize: '1rem',
      marginBottom: '1rem',
      color: 'rgba(255,255,255,0.9)',
    },
    registerButton: {
      background: 'transparent',
      color: '#4ade80',
      border: '2px solid #4ade80',
      padding: '12px 24px',
      borderRadius: '8px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textDecoration: 'none',
      display: 'inline-block',
    },
    registerButtonHover: {
      background: '#4ade80',
      color: 'white',
    },
  };

  return (
    <div style={styles.container}>
      <img src={Loginimage} alt="Medical Background" style={styles.backgroundImage} />
      <div style={styles.overlay}></div>
      <div style={styles.content}>
        <div style={styles.header}>
          <div style={styles.logo}>
            <i className="fa-solid fa-house-medical"></i>
          </div>
          <h1 style={styles.title}>Medicine Donor System</h1>
          <p style={styles.subtitle}>Connecting Patients with Medicine Donors</p>
          <p style={styles.tagline}>"Bridging the gap between need and generosity"</p>
        </div>

        <div style={styles.loginGrid}>
          <div style={styles.loginCard}>
            <i className="fa-solid fa-user-injured" style={{...styles.cardIcon, ...styles.patientIcon}}></i>
            <h3 style={styles.cardTitle}>Patient Portal</h3>
            <p style={styles.cardDescription}>
              Access your patient dashboard, view donation status, and manage your medicine requests.
            </p>
            <Link
              to="/patient"
              style={styles.loginButton}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              Patient Login
            </Link>
          </div>

          <div style={styles.loginCard}>
            <i className="fa-solid fa-hand-holding-heart" style={{...styles.cardIcon, ...styles.donorIcon}}></i>
            <h3 style={styles.cardTitle}>Donor Portal</h3>
            <p style={styles.cardDescription}>
              Manage your donations, view patient requests, and track your contribution impact.
            </p>
            <Link
              to="/Donorlogin"
              style={styles.loginButton}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              Donor Login
            </Link>
          </div>

          <div style={styles.loginCard}>
            <i className="fa-solid fa-user-shield" style={{...styles.cardIcon, ...styles.adminIcon}}></i>
            <h3 style={styles.cardTitle}>Admin Panel</h3>
            <p style={styles.cardDescription}>
              Administrative access to manage patients, donors, and system operations.
            </p>
            <Link
              to="/adminpage"
              style={styles.loginButton}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              Admin Login
            </Link>
          </div>
        </div>

        <div style={styles.registerSection}>
          <p style={styles.registerText}>New to our platform? Join our community of donors and patients.</p>
          <Link
            to="/register"
            style={styles.registerButton}
            onMouseEnter={(e) => {
              e.target.style.background = '#4ade80';
              e.target.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = '#4ade80';
            }}
          >
            Register Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
