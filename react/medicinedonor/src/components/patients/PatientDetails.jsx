// src/components/patient/PatientDetails.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/authSlice';
import { useNavigate } from 'react-router-dom';
import { getPatientDetails, updatePatientDetails } from '../../api';

function PatientDetails() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth?.token);

  const [patient, setPatient] = useState(null);
  const [editpatient, setEditPatient] = useState({
    id: '',
    name: '',
    email: '',
    age: '',
    date: '',
    time: '',
    mobile: '',
    image: '',
    sex: '',
    relationshipstatus: '',
  });
  const [loading, setLoading] = useState(false);
  const [dpFile, setDpFile] = useState(null);
  const [dpPreview, setDpPreview] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate('/patient');
      return;
    }

    async function fetchPatient() {
      try {
        const data = await getPatientDetails(token);
        setPatient(data);
      } catch (err) {
        console.error('Fetch details error:', err);
        alert(err.error || 'Failed to fetch patient details');
        dispatch(logout());
        navigate('/patient');
      }
    }

    fetchPatient();

    // auto logout after 200 minutes (preserve your previous behavior)
    const timer = setTimeout(() => {
      dispatch(logout());
      navigate('/patient');
      alert('Session expired. Please login again.');
    }, 200 * 60 * 1000);

    return () => clearTimeout(timer);
  }, [token, dispatch, navigate]);

  useEffect(() => {
    if (patient) {
      setEditPatient({
        id: patient.id || patient._id || '',
        name: patient.name || '',
        email: patient.email || '',
        age: patient.age ?? '',
        date: patient.date || '',
        time: patient.time || '',
        mobile: patient.mobile || '',
        sex: patient.sex || '',
        relationshipstatus: patient.relationshipstatus || '',
        image: patient.image || '',
      });
      if (patient.image) setDpPreview(patient.image);
    }
  }, [patient]);

  if (!patient) return <div className="pd-loading">Loading patient details…</div>;

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('id', editpatient.id);
      formData.append('name', editpatient.name);
      formData.append('email', editpatient.email);
      formData.append('age', editpatient.age);
      formData.append('date', editpatient.date);
      formData.append('time', editpatient.time);
      formData.append('mobile', editpatient.mobile);
      formData.append('sex', editpatient.sex || '');
      formData.append('relationshipstatus', editpatient.relationshipstatus || '');

      if (dpFile) {
        formData.append('image', dpFile);
      }

      const res = await updatePatientDetails(token, formData);

      alert(res.message || 'Patient details updated successfully!');
      const updated = await getPatientDetails(token);
      setPatient(updated);
      if (updated.image) setDpPreview(updated.image);
    } catch (err) {
      console.error('Update error:', err);
      alert(err.error || 'Failed to update patient details');
    } finally {
      setLoading(false);
    }
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (file) {
      setDpFile(file);
      setDpPreview(URL.createObjectURL(file));
    }
  }

  // helper to render read-only field blocks
  const ReadOnlyField = ({ label, value }) => (
    <div className="pd-fo-row">
      <label className="pd-label">{label}</label>
      <div className="pd-read">{value ?? '-'}</div>
    </div>
  );

  return (
    <div className="pd-root">
      <div className="pd-card" role="main" aria-labelledby="pd-heading">
        <h2 id="pd-heading" className="pd-heading">Patient Details</h2>

        <div className="pd-top">
          <div className="pd-imageWrap">
            <img
              src={dpPreview || editpatient.image || 'https://cdn-icons-png.flaticon.com/512/847/847969.png'}
              alt="Patient"
              className="pd-image"
            />
            {!patient.approved && (
              <label className="pd-fileLabel">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="pd-fileInput"
                />
                <span className="pd-fileText">Change photo</span>
              </label>
            )}
          </div>

          <div className="pd-summary">
            <div className="pd-name">{patient.name}</div>
            <div className="pd-meta">
              <span>{patient.age ? `${patient.age} yrs` : 'Age: -'}</span>
              <span>{patient.gender || patient.sex || ''}</span>
            </div>
            <div className={`pd-approved ${patient.approved ? 'pd-yes' : 'pd-no'}`}>
              {patient.approved ? '✅ Approved' : '❌ Not approved'}
            </div>
            <div className="pd-actions">
              {!patient.approved ? (
                <button
                  className="pd-saveBtn"
                  onClick={() => {
                    // focus first editable input for convenience
                    const el = document.querySelector('.pd-field input, .pd-field select');
                    if (el) el.focus();
                  }}
                >
                  Edit
                </button>
              ) : null}

              <button
                className="pd-logout"
                onClick={() => {
                  dispatch(logout());
                  navigate('/patient');
                }}
                aria-label="Logout"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        <form className="pd-form" onSubmit={handleSubmit}>
          {/* Responsive grid of inputs */}
          <div className="pd-grid">
            <div className="pd-field">
              <label className="pd-label" htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                className="pd-input"
                value={editpatient.name}
                onChange={(e) => setEditPatient({ ...editpatient, name: e.target.value })}
                disabled={patient.approved}
                required
              />
            </div>
            <div className='pd-field'>
              <label className='pd-label' htmlFor='id'>id</label>
            {patient.id}

            </div>

            <div className="pd-field">
              <label className="pd-label" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                className="pd-input"
                value={editpatient.email}
                onChange={(e) => setEditPatient({ ...editpatient, email: e.target.value })}
                disabled
                required
              />
            </div>

            <div className="pd-field">
              <label className="pd-label" htmlFor="age">Age</label>
              <input
                id="age"
                type="number"
                className="pd-input"
                value={editpatient.age}
                onChange={(e) => setEditPatient({ ...editpatient, age: e.target.value })}
                disabled={patient.approved}
              />
            </div>

            <div className="pd-field">
              <label className="pd-label" htmlFor="mobile">Mobile</label>
              <input
                id="mobile"
                type="tel"
                className="pd-input"
                value={editpatient.mobile}
                onChange={(e) => setEditPatient({ ...editpatient, mobile: e.target.value })}
                disabled={patient.approved}
              />
            </div>

            


            <div className="pd-field">
              <label className="pd-label" htmlFor="sex">Sex</label>
              <select
                id="sex"
                className="pd-input"
                value={editpatient.sex || ''}
                onChange={(e) => setEditPatient({ ...editpatient, sex: e.target.value })}
                disabled={patient.approved}
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="pd-field">
              <label className="pd-label" htmlFor="relationshipstatus">Relationship</label>
              <select
                id="relationshipstatus"
                className="pd-input"
                value={editpatient.relationshipstatus || ''}
                onChange={(e) => setEditPatient({ ...editpatient, relationshipstatus: e.target.value })}
                disabled={patient.approved}
              >
                <option value="">Select</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
              </select>
            </div>

            {/* Read-only blocks for long info */}
            <div className="pd-field full">
              <label className="pd-label">Disease</label>
              <textarea className="pd-textarea" value={patient.disease || ''} disabled />
            </div>

            <div className="pd-field full">
              <label className="pd-label">Medicines</label>
              <textarea className="pd-textarea" value={patient.medicines || ''}  disabled={patient.approved}/>
            </div>

            <div className="pd-field">
              <label className="pd-label">Admission</label>
              <div className="pd-read">{patient.admissiondate || '-'}</div>
            </div>

            <div className="pd-field">
              <label className="pd-label">Discharge</label>
              <div className="pd-read">{patient.dischargedate || '-'} </div>
            </div>

            <div className="pd-field full">
              <label className="pd-label">Address</label>
              <textarea className="pd-textarea" value={patient.address || ''} disabled={patient.approved}/>
            </div>

            <div className="pd-field">
              <label className="pd-label">Aadhar</label>
              <div className="pd-read">{patient.aadhar || '-'} disabled={patient.approved}</div>
            </div>

            <div className="pd-field">
              <label className="pd-label">PAN</label>
              <div className="pd-read">{patient.pan || '-'} disabled={patient.approved}</div>
            </div>

            <div className="pd-field">
              <label className="pd-label">Emergency Contact</label>
              <div className="pd-read">{patient.emergencyContact || '-'} disabled={patient.approved}</div>
            </div>

            <div className="pd-field">
              <label className="pd-label">Zone</label>
              <div className="pd-read">{patient.zone || '-'}</div>
            </div>

            <div className="pd-field">
              <label className="pd-label">Hospital</label>
              <div className="pd-read">{patient.hospitalname || patient.hospital || '-'}</div>
            </div>

          </div>

          {/* Save button */}
          {!patient.approved && (
            <div className="pd-actionsBottom">
              <button type="submit" className="pd-submit" disabled={loading}>
                {loading ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          )}
        </form>

        <div className="pd-footer">
          <div className="pd-approvedText">Approved: {patient.approved ? '✅ Yes' : '❌ No'}</div>
        </div>
      </div>

      {/* Internal CSS */}
      <style>{`
        /* Root and card */
        .pd-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background: linear-gradient(135deg, #e6f7ff 0%, #d9ecff 50%, #c7e0ff 100%);
          font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
        }
        .pd-card {
          width: 100%;
          max-width: 1100px;
          background: #fff;
          border-radius: 14px;
          box-shadow: 0 10px 30px rgba(17, 24, 39, 0.08);
          padding: 20px;
          box-sizing: border-box;
        }
        .pd-heading {
          font-size: 1.6rem;
          text-align: center;
          color: #0f172a;
          margin-bottom: 12px;
        }

        /* Top summary and image */
        .pd-top {
          display: flex;
          gap: 18px;
          align-items: center;
          margin-bottom: 18px;
          flex-wrap: wrap;
        }
        .pd-imageWrap {
          width: 128px;
          min-width: 128px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .pd-image {
          width: 128px;
          height: 128px;
          border-radius: 50%;
          object-fit: cover;
          border: 4px solid #0ea5e9;
          background: #f3f4f6;
        }
        .pd-fileLabel {
          margin-top: 8px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 10px;
          border-radius: 8px;
          background: #eef2ff;
          color: #3730a3;
          font-weight: 600;
          font-size: 0.875rem;
        }
        .pd-fileInput {
          display: none;
        }
        .pd-fileText { font-size: 0.85rem; }

        .pd-summary {
          flex: 1;
          min-width: 200px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .pd-name {
          font-size: 1.1rem;
          font-weight: 700;
          color: #0b1220;
        }
        .pd-meta { color: #475569; display:flex; gap:10px; font-size:0.95rem; }
        .pd-approved { margin-top: 8px; font-weight:700; }
        .pd-approved.pd-yes { color: #16a34a; }
        .pd-approved.pd-no { color: #dc2626; }

        .pd-actions { display:flex; gap:8px; margin-top:12px; flex-wrap:wrap; }
        .pd-saveBtn, .pd-logout {
          padding: 8px 12px;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          font-weight: 700;
        }
        .pd-saveBtn { background: linear-gradient(90deg,#06b6d4,#0891b2); color:#fff;}
        .pd-logout { background:#ef4444; color:#fff; }

        /* Form grid */
        .pd-form { margin-top: 8px; }
        .pd-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }
        .pd-field { display:flex; flex-direction:column; gap:6px; }
        .pd-field.full { grid-column: 1 / -1; }
        .pd-label { font-weight:600; color:#0f172a; font-size:0.9rem; }
        .pd-input, .pd-textarea {
          border: 1px solid #e6edf6;
          background: #fff;
          padding: 10px 12px;
          border-radius: 8px;
          font-size: 0.95rem;
          color: #0b1220;
        }
        .pd-textarea { min-height: 84px; resize: vertical; }
        .pd-read { padding: 10px 12px; border-radius:8px; background:#f8fafc; border:1px solid #eff6ff; color:#0b1220; }

        .pd-actionsBottom { display:flex; justify-content:flex-end; margin-top:12px; }
        .pd-submit {
          background: linear-gradient(90deg,#0ea5e9,#0891b2);
          color: white;
          border: none;
          padding: 12px 18px;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 700;
        }
        .pd-submit[disabled] { opacity: 0.6; cursor: not-allowed; }

        .pd-footer { margin-top:14px; display:flex; justify-content:flex-end; color:#475569; font-weight:600; }

        /* Loading fallback */
        .pd-loading { min-height:100vh; display:flex; align-items:center; justify-content:center; font-size:1.125rem; color:#0b1220; }

        /* Responsive breakpoints */
        @media (min-width: 640px) {
          .pd-grid { grid-template-columns: repeat(2, 1fr); }
          .pd-field.full { grid-column: 1 / -1; }
        }
        @media (min-width: 980px) {
          .pd-top { gap: 24px; }
          .pd-card { padding: 28px; }
          .pd-grid { grid-template-columns: repeat(3, 1fr); }
          .pd-field.full { grid-column: 1 / -1; }
        }

      `}</style>
    </div>
  );
}

export default PatientDetails;
