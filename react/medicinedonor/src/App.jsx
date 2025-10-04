import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './Login';
import AuthPage from './Authpage';
import PatientAuth from './components/patients/patients';
import PatientDetails from './components/patients/PatientDetails';
import Adminpage from './components/admin/Adminpage';
import Adminhandle from './components/admin/Adminhandle';
import Forgetpassword from './components/admin/Forgetpassword';
import Home from './components/admin/Home';
import AdminPatientDetails from './components/admin/adminPatientDetails';
import Dashboard from './components/admin/Dashboard';
import Doctor from './components/admin/Doctor';
import PendingPatients from './components/admin/PendingPatients';
import ApprovedPatients from './components/admin/ApprovedPatients';
import CompletedPatients from './components/admin/CompletedPatients';
import Donorlogin from './components/donor/Donorlogin';
import Donorgetpatientdetails from './components/donor/Donorgetpatientdetails';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<AuthPage />} />
        <Route path="/patient" element={<PatientAuth />} />
        <Route path="/PatientDetails" element={<PatientDetails />} />
        <Route
          path="/DonorDetails"
          element={<div>Donor Page Coming Soon</div>}
        />
        <Route path="/adminpage" element={<Adminpage />} />
        <Route path="/Dashboard" element={<Dashboard/>} />
        <Route path='/pendingpatients' element={<PendingPatients/>} />
        <Route  path='/ApprovedPatients' element={<ApprovedPatients/>} />
        <Route path='/CompletedPatients' element={<CompletedPatients/>} />
        <Route path="/Donorlogin" element={<Donorlogin />} />
          <Route path='/Donorgetpatientdetails' element={<Donorgetpatientdetails/>}/>
        <Route path="/Doctor" element={<Doctor/>} />
        <Route path="/Adminhandle" element={<Adminhandle />} />
        <Route path="/Forgetpassword" element={<Forgetpassword />} />
        <Route path="/home" element={<Home />} />
       <Route path="/AdminPatientDetails/:id" element={<AdminPatientDetails />} />   
       <Route path='/adminlogin' />
      </Routes>
       <style>
      {`
        /* ✅ Remove up/down arrows in Chrome, Safari, Edge, Opera */
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        /* ✅ Remove up/down arrows in Firefox */
        input[type=number] {
          -moz-appearance: textfield;
        }
      `}
    </style>
    </Router>
    
  );
}

export default App;
