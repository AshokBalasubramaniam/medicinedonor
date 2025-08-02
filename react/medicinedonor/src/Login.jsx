import { Link } from 'react-router-dom'
import Loginimage from './assets/Pep-treatment_0.png'

const Login = () => {
  const styles = {
    container: {
      position: 'relative',
      width: '100%',
      height: '100vh',
      overflow: 'hidden',
    },
    Loginimage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block',
    },
    overlay: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      padding: '20px',
      borderRadius: '20px',
      textAlign: 'center',
    },
    icon: {
      fontSize: '3rem',
      marginBottom: '20px',
      color: 'white',
    },
    heading: {
      fontSize: '4rem',
      position: 'relative',
      bottom: '50px',
      color: '#0014f4',
    },
    list: {
      listStyle: 'none',
      padding: 15,
      margin: 0,
      display: 'flex',
      gap: '100px',
      justifyContent: 'center',
    },
    link: {
      color: 'white',
      textDecoration: 'none',
      fontWeight: 'bold',
    },
  }

  return (
    <div style={styles.container}>
      <img src={Loginimage} alt="Login" style={styles.Loginimage} />
      <div style={styles.overlay}>
        <i className="fa-solid fa-house-medical" style={styles.icon}></i>
        <h1 style={styles.heading}>Medicine Donor</h1>
        <ul style={styles.list}>
          <li>
            <Link to="/patient" style={styles.link}>Patient Login</Link>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Login
