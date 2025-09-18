import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { admingetallpatientdetails, adminUpdatePatient } from '../../api';
import { logout } from '../../store/authSlice';

function PendingPatients() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth?.token);

  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [editPatient, setEditPatient] = useState({});
  const [loading, setLoading] = useState(false);
  const [dpFile, setDpFile] = useState(null);
  const [dpPreview, setDpPreview] = useState(null);

  async function fetchPatients() {
    try {
      const data = await admingetallpatientdetails(token);
      setPatients(data.filter((p) => p.approved === false));
    } catch (err) {
      console.error('Fetch patients error:', err);
      dispatch(logout());
      navigate('/adminpage');
    }
  }

  // ✅ Fetch patients
  useEffect(() => {
    if (!token) {
      navigate('/adminpage');
      return;
    }

    fetchPatients();
  }, [token, dispatch, navigate]);

  // ✅ When selecting a patient, load into form
  useEffect(() => {
    if (selectedPatient) {
      setEditPatient({
        id: selectedPatient.id || '',
        name: selectedPatient.name || '',
        email: selectedPatient.email || '',
        age: selectedPatient.age ?? '',
        date: selectedPatient.date || '',
        time: selectedPatient.time || '',
        mobile: selectedPatient.mobile || '',
        sex: selectedPatient.sex || '',
        relationshipstatus: selectedPatient.relationshipstatus || '',
        image: selectedPatient.image || '',
        disease: selectedPatient.disease || '',
        medicines: selectedPatient.medicines || '',
        address: selectedPatient.address || '',
        admission: selectedPatient.admission || '',
        discharge: selectedPatient.discharge || '',
      });
      if (selectedPatient.image) setDpPreview(selectedPatient.image);
    }
  }, [selectedPatient]);

  // ✅ Approve handler
  async function handleApprove() {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(editPatient).forEach((key) => {
        if (editPatient[key]) formData.append(key, editPatient[key]);
      });
      if (dpFile) formData.append('image', dpFile);
      formData.append('approved', 'true'); // approve
      const res = await adminUpdatePatient(token, editPatient.id, formData);
      alert('Patient approved!');
      setSelectedPatient(null); // go back to list
      setPatients((prev) => prev.filter((p) => p._id !== editPatient.id));
      fetchPatients();
    } catch (err) {
      console.error('Approve error:', err);
      alert('Failed to approve');
    } finally {
      setLoading(false);
    }
  }

  // ✅ Reject handler
  async function handleReject() {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('approved', 'true');

      const res = await adminUpdatePatient(token, editPatient.id, formData);
      alert('Patient rejected!');
      setSelectedPatient(null);
      setPatients((prev) => prev.filter((p) => p.id !== editPatient.id));
    } catch (err) {
      console.error('Reject error:', err);
      alert('Failed to reject');
    } finally {
      setLoading(false);
    }
  }

  // ✅ File input handler
  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (file) {
      setDpFile(file);
      setDpPreview(URL.createObjectURL(file));
    }
  }

  if (!selectedPatient) {
    return (
      <div className="pp-root">
        <h2 className="pp-heading">Pending Patients</h2>
        {patients.length === 0 ? (
          <p>No pending patients.</p>
        ) : (
          <div className="pp-grid">
            {patients.map((p) => (
              <div key={p.id} className="pp-card">
                <h3>{p.name}</h3>
                <p>Email: {p.email}</p>
                <p>Age: {p.age}</p>
                <p>Mobile: {p.mobile}</p>
                <button onClick={() => setSelectedPatient(p)}>
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}

        <style>{`
          .pp-root {
            padding: 20px;
          }
          .pp-heading {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 20px;
          }
          .pp-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
          }
          .pp-card {
            background: #fff;
            padding: 15px;
            border-radius: 10px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.1);
          }
          .pp-card h3 {
            margin: 0 0 10px;
          }
          .pp-card button {
            margin-top: 10px;
            padding: 8px 14px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
          }
          .pp-card button:hover {
            background: #0056b3;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="pd-root">
      <div className="pd-card">
        <h2 className="pd-heading">Patient Details (Admin View)</h2>

        <div className="pd-top">
          <div className="pd-imageWrap">
            <img
              src={
                dpPreview ||
                editPatient.image ||
                'https://cdn-icons-png.flaticon.com/512/847/847969.png'
              }
              alt="Patient"
              className="pd-image"
            />
            <label className="pd-fileLabel">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="pd-fileInput"
              />
              <span className="pd-fileText">Change photo</span>
            </label>
          </div>

          <div className="pd-summary">
            <div className="pd-name">{editPatient.name}</div>
            <div className="pd-meta">
              <span>
                {editPatient.age ? `${editPatient.age} yrs` : 'Age: -'}
              </span>
              <span>{editPatient.sex}</span>
            </div>
            <div className="pd-actions">
              <button
                className="pd-saveBtn"
                onClick={handleApprove}
                disabled={loading}
              >
                {loading ? 'Approving…' : 'Approve'}
              </button>
              <button
                className="pd-rejectBtn"
                onClick={handleReject}
                disabled={loading}
              >
                Reject
              </button>
              <button
                className="pd-backBtn"
                onClick={() => setSelectedPatient(null)}
              >
                Back
              </button>
            </div>
          </div>
        </div>

        <form
          className="pd-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleApprove();
          }}
        >
          <div className="pd-grid">
            <div className="pd-field">
              <label className="pd-label">ID</label>
              <input className="pd-input" value={editPatient.id} disabled />
            </div>

            <div className="pd-field">
              <label className="pd-label">Name</label>
              <input
                className="pd-input"
                value={editPatient.name}
                onChange={(e) =>
                  setEditPatient({ ...editPatient, name: e.target.value })
                }
              />
            </div>

            <div className="pd-field">
              <label className="pd-label">Amount</label>
              <input
                type="number"
                className="pd-input"
                value={editPatient.amount || ''}
                onChange={
                  (e) =>
                    setEditPatient({ ...editPatient, amount: e.target.value }) // ✅ fixed
                }
              />
            </div>

            <div className="pd-field">
              <label className="pd-label">Email</label>
              <input className="pd-input" value={editPatient.email} disabled />
            </div>

            <div className="pd-field">
              <label className="pd-label">Age</label>
              <input
                type="number"
                className="pd-input"
                value={editPatient.age}
                onChange={(e) =>
                  setEditPatient({ ...editPatient, age: e.target.value })
                }
              />
            </div>

            <div className="pd-field">
              <label className="pd-label">Mobile</label>
              <input
                className="pd-input"
                value={editPatient.mobile}
                onChange={(e) =>
                  setEditPatient({ ...editPatient, mobile: e.target.value })
                }
              />
            </div>

            <div className="pd-field">
              <label className="pd-label">Sex</label>
              <select
                className="pd-input"
                value={editPatient.sex || ''}
                onChange={(e) =>
                  setEditPatient({ ...editPatient, sex: e.target.value })
                }
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="pd-field full">
              <label className="pd-label">Disease</label>
              <textarea
                className="pd-textarea"
                value={editPatient.disease}
                onChange={(e) =>
                  setEditPatient({ ...editPatient, disease: e.target.value })
                }
              />
            </div>

            <div className="pd-field full">
              <label className="pd-label">Medicines</label>
              <textarea
                className="pd-textarea"
                value={editPatient.medicines}
                onChange={(e) =>
                  setEditPatient({ ...editPatient, medicines: e.target.value })
                }
              />
            </div>

            <div className="pd-field">
              <label className="pd-label">Relationship</label>
              <select
                className="pd-input"
                value={editPatient.relationshipstatus || ''}
                onChange={(e) =>
                  setEditPatient({
                    ...editPatient,
                    relationshipstatus: e.target.value,
                  })
                }
              >
                <option value="">Select</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
              </select>
            </div>

            <div className="pd-field">
              <label className="pd-label">Admission</label>
              <input
                type="date"
                className="pd-input"
                value={editPatient.admission || ''}
                onChange={(e) =>
                  setEditPatient({ ...editPatient, admission: e.target.value })
                }
              />
            </div>

            <div className="pd-field">
              <label className="pd-label">Discharge</label>
              <input
                type="date"
                className="pd-input"
                value={editPatient.discharge || ''}
                onChange={(e) =>
                  setEditPatient({ ...editPatient, discharge: e.target.value })
                }
              />
            </div>

            <div className="pd-field full">
              <label className="pd-label">Address</label>
              <textarea
                className="pd-textarea"
                value={editPatient.address}
                onChange={(e) =>
                  setEditPatient({ ...editPatient, address: e.target.value })
                }
              />
            </div>
          </div>
        </form>
      </div>

      <style>{`
        .pd-root {
          padding: 20px;
        }
        .pd-card {
          background: #fff;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .pd-heading {
          font-size: 22px;
          margin-bottom: 20px;
          text-align: center;
          font-weight: bold;
        }
        .pd-top {
          display: flex;
          gap: 20px;
          margin-bottom: 20px;
          align-items: flex-start;
        }
        .pd-imageWrap {
          text-align: center;
          flex: 0 0 150px;
        }
        .pd-image {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          object-fit: cover;
          margin-bottom: 10px;
        }
        .pd-fileLabel {
          display: block;
          cursor: pointer;
          color: #007bff;
          font-size: 14px;
        }
        .pd-fileInput {
          display: none;
        }
        .pd-summary {
          flex: 1;
        }
        .pd-name {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 8px;
        }
        .pd-meta span {
          margin-right: 12px;
          color: #666;
        }
        .pd-actions {
          margin-top: 10px;
        }
        .pd-saveBtn, .pd-rejectBtn, .pd-backBtn {
          margin-right: 10px;
          padding: 8px 14px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }
        .pd-saveBtn { background: #28a745; color: white; }
        .pd-saveBtn:hover { background: #218838; }
        .pd-rejectBtn { background: #dc3545; color: white; }
        .pd-rejectBtn:hover { background: #c82333; }
        .pd-backBtn { background: #6c757d; color: white; }
        .pd-backBtn:hover { background: #5a6268; }

        .pd-form { margin-top: 20px; }
        .pd-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }
        .pd-field {
          display: flex;
          flex-direction: column;
        }
        .pd-field.full { grid-column: span 2; }
        .pd-label {
          font-weight: 500;
          margin-bottom: 5px;
        }
        .pd-input, .pd-textarea, select {
          padding: 10px 12px;
          border: 1px solid #ccc;
          border-radius: 6px;
          font-size: 14px;
          background: #fff;
          color: #333;
        }
        .pd-input:focus, .pd-textarea:focus, select:focus {
          border-color: #007bff;
          outline: none;
          box-shadow: 0 0 0 2px rgba(0,123,255,0.2);
        }
        .pd-textarea {
          min-height: 70px;
          resize: vertical;
        }
      `}</style>
    </div>
  );
}

export default PendingPatients;
