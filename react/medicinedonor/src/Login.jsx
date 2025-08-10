import { Link } from 'react-router-dom';
import Loginimage from './assets/Pep-treatment_0.png';

const Login = () => {
  const styles = {
    container: {
      position: 'relative',
      width: '100%',
      height: '100vh',
      overflow: 'hidden',
      fontFamily: 'Arial, sans-serif',
    },
    Loginimage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block',
      filter: 'brightness(0.7)', // Darkens background for better text contrast
    },
    overlay: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      padding: '40px 50px',
      borderRadius: '20px',
      textAlign: 'center',
      boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
      color: 'white',
      width: '80%',
      maxWidth: '500px',
    },
    icon: {
      fontSize: '3rem',
      marginBottom: '10px',
      color: '#00bfff',
    },
    heading: {
      fontSize: '2.5rem',
      marginBottom: '30px',
      color: '#00bfff',
      fontWeight: 'bold',
    },
    list: {
      listStyle: 'none',
      padding: 0,
      margin: '20px 0',
      display: 'flex',
      justifyContent: 'center',
      gap: '50px',
    },
    link: {
      color: '#fff',
      textDecoration: 'none',
      fontWeight: 'bold',
      padding: '10px 20px',
      border: '2px solid #00bfff',
      borderRadius: '10px',
      transition: 'all 0.3s ease',
    },
    linkHover: {
      backgroundColor: '#00bfff',
      color: '#000',
    },
    registerPrompt: {
      marginTop: '20px',
      fontSize: '1rem',
      color: '#ccc',
    },
    registerLink: {
      color: '#00bfff',
      textDecoration: 'underline',
      fontWeight: 'bold',
    },
  };

  return (
    <div style={styles.container}>
      <img src={Loginimage} alt="Login" style={styles.Loginimage} />
      <div style={styles.overlay}>
        <i className="fa-solid fa-house-medical" style={styles.icon}></i>
        <h1 style={styles.heading}>Medicine Donor</h1>
        <ul style={styles.list}>
          <li>
            <Link to="/patient" style={styles.link}>
              Patient Login
            </Link>
          </li>
          <li>
            <Link to="/donnorLogin" style={styles.link}>
              Donor Login
            </Link>
          </li>
        </ul>
        <div style={styles.registerPrompt}>
          <p>You don't have an account?</p>
          <Link to="/register" style={styles.registerLink}>Register</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
