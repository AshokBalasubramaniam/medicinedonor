import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPatientById, updatePatient } from '../../api';

export default function AdminPatientDetails() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    (async () => {
      try {
        const data = await getPatientById(id);
        setPatient(data);
        setForm(data);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [id]);

  if (!patient) return <div style={{ padding: 20 }}>Loading patient...</div>;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    try {
      const updated = await updatePatient(id, form);
      setPatient(updated);
      setEditing(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleApprove = async () => {
    try {
      const updated = await updatePatient(id, { approved: true });
      setPatient(updated);
    } catch (e) {
      console.error(e);
    }
  };
  const handleReject = async () => {
    try {
      const updated = await updatePatient(id, { approved: false });
      setPatient(updated);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div
      style={{
        maxWidth: 900,
        margin: '24px auto',
        padding: 20,
        background: '#fff',
        borderRadius: 12,
      }}
    >
      <h2 style={{ textAlign: 'center', marginBottom: 12 }}>Patient Details</h2>
      <div>
        <strong>Name:</strong> {patient.name}
      </div>
      <div>
        <strong>Age:</strong> {patient.age}
      </div>
      <div>
        <strong>Gender:</strong> {patient.sex || patient.gender}
      </div>
      <div style={{ marginTop: 12 }}>
        {!patient.approved && (
          <>
            <button onClick={handleApprove} style={{ marginRight: 8 }}>
              Approve
            </button>
            <button onClick={handleReject}>Reject</button>
          </>
        )}
      </div>
    </div>
  );
}
