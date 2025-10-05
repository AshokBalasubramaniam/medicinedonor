import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { admingetallpatientdetails, adminUpdatePatient } from '../../api';
import { logout } from '../../store/authSlice';
import AdminNavbar from "../admin/AdminNavbar";

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

  useEffect(() => {
    if (!token) {
      navigate('/adminpage');
      return;
    }
    fetchPatients();
  }, [token, dispatch, navigate]);

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

  async function handleApprove() {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(editPatient).forEach((key) => {
        if (editPatient[key]) formData.append(key, editPatient[key]);
      });
      if (dpFile) formData.append('image', dpFile);
      formData.append('approved', 'true');
      await adminUpdatePatient(token, editPatient.id, formData);
      alert('Patient approved!');
      setSelectedPatient(null);
      setPatients((prev) => prev.filter((p) => p._id !== editPatient.id));
      fetchPatients();
    } catch (err) {
      console.error('Approve error:', err);
      alert('Failed to approve');
    } finally {
      setLoading(false);
    }
  }

  async function handleReject() {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('approved', 'true');
      await adminUpdatePatient(token, editPatient.id, formData);
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

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (file) {
      setDpFile(file);
      setDpPreview(URL.createObjectURL(file));
    }
  }

  const style = {
    root: {
      padding: 20,
      marginBottom:20,
    },
    heading: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
      color: '#166534',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: 20,
       marginTop:50,
    },
    card: {
      background: '#fff',
      padding: 15,
      borderRadius: 10,
      boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
      width: 300,
      borderLeft: '6px solid #287215',
    },
    cardTitle: {
      margin: '0 0 10px',
      fontSize: 18,
      fontWeight: '600',
    },
    cardButton: {
      marginTop: 10,
      padding: '8px 14px',
      background: '#007bff',
      color: '#fff',
      border: 'none',
      borderRadius: 6,
      cursor: 'pointer',
    },
    pdRoot: {
      padding: 20,
    },
    pdCard: {
      background: '#fff',
      padding: 20,
      borderRadius: 12,
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
    pdHeading: {
      fontSize: 22,
      marginBottom: 20,
      textAlign: 'center',
      fontWeight: 'bold',
    },
    pdTop: {
      display: 'flex',
      gap: 20,
      marginBottom: 20,
      alignItems: 'flex-start',
    },
    pdImageWrap: {
      textAlign: 'center',
      flex: '0 0 150px',
    },
    pdImage: {
      width: 120,
      height: 120,
      borderRadius: '50%',
      objectFit: 'cover',
      marginBottom: 10,
    },
    pdFileLabel: {
      display: 'block',
      cursor: 'pointer',
      color: '#007bff',
      fontSize: 14,
    },
    pdSummary: {
      flex: 1,
    },
    pdName: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    pdMeta: {
      color: '#666',
      marginBottom: 10,
    },
    pdActions: {
      marginTop: 10,
    },
    pdButton: {
      marginRight: 10,
      padding: '8px 14px',
      border: 'none',
      borderRadius: 6,
      cursor: 'pointer',
      color: '#fff',
    },
    approveBtn: { background: '#28a745' },
    rejectBtn: { background: '#dc3545' },
    backBtn: { background: '#6c757d' },
    pdForm: { marginTop: 20 },
    pdGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: 20,
    },
    pdField: {
      display: 'flex',
      flexDirection: 'column',
    },
    pdLabel: {
      fontWeight: 500,
      marginBottom: 5,
    },
    pdInput: {
      padding: '10px 12px',
      border: '1px solid #ccc',
      borderRadius: 6,
      fontSize: 14,
      color: '#333',
      background: '#fff',
    },
    pdTextarea: {
      minHeight: 70,
      resize: 'vertical',
      padding: '10px 12px',
      border: '1px solid #ccc',
      borderRadius: 6,
      fontSize: 14,
      color: '#333',
      background: '#fff',
    },
  };

  if (!selectedPatient) {
    return (
      <div style={style.root}>
        <AdminNavbar />
        {patients.length === 0 ? (
          <p>No pending patients.</p>
        ) : (
          <div style={style.grid}>
            {patients.map((p) => (
              <div key={p.id} style={style.card}>
                <h3 style={style.cardTitle}>{p.name}</h3>
                <p>Email: {p.email}</p>
                <p>Age: {p.age}</p>
                <p>Mobile: {p.mobile}</p>
                <button
                  style={style.cardButton}
                  onClick={() => setSelectedPatient(p)}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={style.pdRoot}>
      <div style={style.pdCard}>
        <h2 style={style.pdHeading}>Patient Details (Admin View)</h2>

        <div style={style.pdTop}>
          <div style={style.pdImageWrap}>
            <img
              src={
                dpPreview ||
                editPatient.image ||
                'https://cdn-icons-png.flaticon.com/512/847/847969.png'
              }
              alt="Patient"
              style={style.pdImage}
            />
            <label style={style.pdFileLabel}>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <span>Change photo</span>
            </label>
          </div>

          <div style={style.pdSummary}>
            <div style={style.pdName}>{editPatient.name}</div>
            <div style={style.pdMeta}>
              {editPatient.age ? `${editPatient.age} yrs` : 'Age: -'} |{' '}
              {editPatient.sex}
            </div>
            <div style={style.pdActions}>
              <button
                style={{ ...style.pdButton, ...style.approveBtn }}
                onClick={handleApprove}
                disabled={loading}
              >
                {loading ? 'Approving…' : 'Approve'}
              </button>
              <button
                style={{ ...style.pdButton, ...style.rejectBtn }}
                onClick={handleReject}
                disabled={loading}
              >
                Reject
              </button>
              <button
                style={{ ...style.pdButton, ...style.backBtn }}
                onClick={() => setSelectedPatient(null)}
              >
                Back
              </button>
            </div>
          </div>
        </div>

        <form
          style={style.pdForm}
          onSubmit={(e) => {
            e.preventDefault();
            handleApprove();
          }}
        >
          <div style={style.pdGrid}>
            <div style={style.pdField}>
              <label style={style.pdLabel}>ID</label>
              <input style={style.pdInput} value={editPatient.id} disabled />
            </div>

            <div style={style.pdField}>
              <label style={style.pdLabel}>Name</label>
              <input
                style={style.pdInput}
                value={editPatient.name}
                onChange={(e) =>
                  setEditPatient({ ...editPatient, name: e.target.value })
                }
              />
            </div>

            <div style={style.pdField}>
              <label style={style.pdLabel}>Amount</label>
              <input
                type="number"
                style={style.pdInput}
                value={editPatient.amount || ''}
                onChange={(e) =>
                  setEditPatient({ ...editPatient, amount: e.target.value })
                }
              />
            </div>

            <div style={style.pdField}>
              <label style={style.pdLabel}>Email</label>
              <input style={style.pdInput} value={editPatient.email} disabled />
            </div>

            <div style={style.pdField}>
              <label style={style.pdLabel}>Age</label>
              <input
                type="number"
                style={style.pdInput}
                value={editPatient.age}
                onChange={(e) =>
                  setEditPatient({ ...editPatient, age: e.target.value })
                }
              />
            </div>

            <div style={style.pdField}>
              <label style={style.pdLabel}>Mobile</label>
              <input
                style={style.pdInput}
                value={editPatient.mobile}
                onChange={(e) =>
                  setEditPatient({ ...editPatient, mobile: e.target.value })
                }
              />
            </div>

            <div style={style.pdField}>
              <label style={style.pdLabel}>Sex</label>
              <select
                style={style.pdInput}
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

            <div style={style.pdField}>
              <label style={style.pdLabel}>Disease</label>
              <textarea
                style={style.pdTextarea}
                value={editPatient.disease}
                onChange={(e) =>
                  setEditPatient({ ...editPatient, disease: e.target.value })
                }
              />
            </div>

            <div style={style.pdField}>
              <label style={style.pdLabel}>Medicines</label>
              <textarea
                style={style.pdTextarea}
                value={editPatient.medicines}
                onChange={(e) =>
                  setEditPatient({ ...editPatient, medicines: e.target.value })
                }
              />
            </div>

            <div style={style.pdField}>
              <label style={style.pdLabel}>Relationship</label>
              <select
                style={style.pdInput}
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

            <div style={style.pdField}>
              <label style={style.pdLabel}>Admission</label>
              <input
                type="date"
                style={style.pdInput}
                value={editPatient.admission || ''}
                onChange={(e) =>
                  setEditPatient({ ...editPatient, admission: e.target.value })
                }
              />
            </div>

            <div style={style.pdField}>
              <label style={style.pdLabel}>Discharge</label>
              <input
                type="date"
                style={style.pdInput}
                value={editPatient.discharge || ''}
                onChange={(e) =>
                  setEditPatient({ ...editPatient, discharge: e.target.value })
                }
              />
            </div>

            <div style={style.pdField}>
              <label style={style.pdLabel}>Address</label>
              <textarea
                style={style.pdTextarea}
                value={editPatient.address}
                onChange={(e) =>
                  setEditPatient({ ...editPatient, address: e.target.value })
                }
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PendingPatients;
