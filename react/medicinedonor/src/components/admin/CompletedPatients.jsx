import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { admingetallpatientdetails } from '../../api';

function CompletedPatients() {
  const [patients, setPatients] = useState([]);
  const token = useSelector((state) => state.auth?.token);
  const navigate = useNavigate();

  async function fetchPatient() {
    try {
      const data = await admingetallpatientdetails(token);
      // filter only completed patients
      setPatients(data.filter((p) => p.approved === true && p.amount==0));
    } catch (err) {
      alert(`Fetch details error: ${err}`);
    }
  }

  useEffect(() => {
    if (!token) {
      navigate('/Dashboard');
      return;
    }
    fetchPatient();
  }, [token]); // include token

  return (
    <div>
      <h1>Completed Patients</h1>

      <div>
        {patients.length > 0 ? (
          patients.map((p) => (
            <div key={p._id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
              <strong>{p.name}</strong>
              <p>Email: {p.email}</p>
              <p>Mobile: {p.mobile}</p>
              <p>Date: {p.date}</p>
              <p>Amount: {p.amount}</p>
            </div>
          ))
        ) : (
          <p>No completed patients found.</p>
        )}
      </div>
    </div>
  );
}

export default CompletedPatients;
