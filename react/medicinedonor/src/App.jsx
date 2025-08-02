// import { Routes, Route } from 'react-router-dom'
// import Login from './Login'
// import PatientAuth from './components/patients/PatientAuth.jsx'
// import PatientDetails from './components/patients/PatientDetails'

// function App() {
//   return (
//     <Routes>
//       <Route path="/" element={<Login />} />
//       <Route path="/patient" element={<PatientAuth />} />
//       <Route path="/patientdetails" element={<PatientDetails />} />
//     </Routes>
//   )
// }

// export default App


import PatientAuth from  './components/patients/patients';

function App() {
  return (
    <div>
      <PatientAuth />
    </div>
  );
}

export default App;
