import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './Login';
import AuthPage from './Authpage';
import PatientAuth from './components/patients/patients';
import PatientDetails from './components/patients/PatientDetails';
import Adminpage from './components/admin/Adminpage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<AuthPage />} />
        <Route path="/patient" element={<PatientAuth />} />
        <Route path="/PatientDetails" element={<PatientDetails />} />
        <Route path="/DonorDetails" element={<div>Donor Page Coming Soon</div>} /> 
     <Route path='/adminpage' element={<Adminpage />} />

      </Routes>
    </Router>
  );
}

export default App;
