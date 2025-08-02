import { useState } from 'react';
import { loginPatient, registerPatient } from '../../api'; 
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../store/authSlice';


function PatientAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const dispatch = useDispatch();

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    if (isLogin) {
      const res = await loginPatient(form.email, form.password);
      dispatch(loginSuccess({ user: res.user, token: res.token }));
      alert('Login successful!');
    } else {
       await registerPatient(form.name, form.email, form.password);
      alert('Registration successful!');
      setIsLogin(true);
    }
  } catch (err) {
    alert('Error occurred');
    console.error(err);
  }
};

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h2>{isLogin ? 'Patient Login' : 'Patient Registration'}</h2>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <>
            <input
              type="text"
              name="name"
              placeholder="Name"
              onChange={handleChange}
              value={form.name}
              required
            />
            <br />
          </>
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          value={form.email}
          required
        />
        <br />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          value={form.password}
          required
        />
        <br />
        <button type="submit" style={{ marginTop: '10px' }}>
          {isLogin ? 'Login' : 'Register'}
        </button>
      </form>

      <button
        onClick={() => setIsLogin(!isLogin)}
        style={{ marginTop: '20px', backgroundColor: 'transparent', border: 'none', color: 'blue', cursor: 'pointer' }}
      >
        {isLogin ? 'Need to register?' : 'Already registered? Login'}
      </button>
    </div>
  );
}

export default PatientAuth;
