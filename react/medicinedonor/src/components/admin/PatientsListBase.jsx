import React from 'react';
import { useNavigate } from 'react-router-dom';

export function PatientsListBase({ patients, title }) {
  const navigate = useNavigate();
  const card = {
    width: 300,
    background: '#fff',
    borderRadius: 12,
    padding: 16,
    boxShadow: '0 8px 20px rgba(0,0,0,0.06)',
  };

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ textAlign: 'center', marginBottom: 14 }}>{title}</h2>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 14,
          justifyContent: 'center',
        }}
      >
        {patients.map((p) => (
          <div key={p._id || p.id} style={card}>
            <div style={{ fontWeight: 700, fontSize: 18 }}>
              {p.name || p.fullName || '—'}
            </div>
            <div>Age: {p.age || '—'}</div>
            <div>Gender: {p.sex || p.gender || '—'}</div>
            <div>Hospital: {p.hospitalname || p.hospital || '—'}</div>
            <div>Approved: {p.approved ? '✅' : '❌'}</div>
            <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
              <button
                onClick={() => navigate(`/admin-patient/${p._id || p.id}`)}
                style={{
                  padding: '8px 10px',
                  borderRadius: 8,
                  cursor: 'pointer',
                }}
              >
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
