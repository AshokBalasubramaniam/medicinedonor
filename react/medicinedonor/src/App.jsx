
import Login from './Login'
import PatientAuth from  './components/patients/patients'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PatientDetails from './components/patients/PatientDetails';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/patient" element={<PatientAuth />} />
          <Route path="/PatientDetails" element={<PatientDetails />} />
      </Routes>
    </Router>
  );
}

export default App;

