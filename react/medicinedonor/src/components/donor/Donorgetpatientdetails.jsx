import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { admingetallpatientdetails } from "../../api";
import { logout } from "../../store/authSlice";
import PaymentModal from "./PaymentModal";
import donorimage from "../../assets/donorimage.png";

function Donorgetpatientdetails() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const token = useSelector((state) => state.auth?.token);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!token) {
      navigate("/donorlogin");
      return;
    }

    async function fetchPatients() {
      setLoading(true);
      try {
        const data = await admingetallpatientdetails(token);
        setPatients(data || []);
      } catch (err) {
        setError("Failed to fetch patient details");
        dispatch(logout());
        navigate("/donorlogin");
      } finally {
        setLoading(false);
      }
    }

    fetchPatients();

    const timer = setTimeout(
      () => {
        dispatch(logout());
        navigate("/donorlogin");
        alert("Session expired. Please login again.");
      },
      1 * 60 * 1000
    );

    return () => clearTimeout(timer);
  }, [token, dispatch, navigate]);

  const styles = {
    donorContainer: {
      fontFamily: "Arial, sans-serif",
      padding: 0,
      margin: 0,
    },
    navbar: {
      background: "#0b9a9a",
      height: "60px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    navbarTitle: {
      color: "black",
      fontSize: "40px",
      margin: 0,
    },
    mainContainer: {
      padding: "20px",
      position: "relative",
    },
    donorBanner: {
      width: "100%",
      height: "auto",
      minHeight: "810px",
      backgroundImage: `url(${donorimage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      borderRadius: "10px",
      marginBottom: "20px",
      position: "relative",
      overflow: "hidden",
    },
    donorBannerOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(255,255,255,0.4)",
      backdropFilter: "blur(1px)",
      borderRadius: "10px",
      padding: "20px",
    },
    error: {
      color: "red",
      marginTop: "10px",
    },
    patientGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
      gap: "20px",
      listStyle: "none",
      padding: 0,
      margin: 0,
    },
    patientCard: {
      border: "1px solid #ddd",
      borderRadius: "12px",
      padding: "16px",
      background: "#fff",
      boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
      transition: "transform 0.2s",
      borderLeft: "6px solid #0b9a9a",
    },
    cardActions: {
      textAlign: "right",
      marginTop: "10px",
    },
    payBtn: {
      padding: "8px 16px",
      background: "#007bff",
      border: "none",
      borderRadius: "6px",
      color: "#fff",
      cursor: "pointer",
      transition: "background 0.2s",
    },
  };
  const { user: donor } = useSelector((state) => state.auth);
  

  return (
    <div style={styles.donorContainer}>
      <nav style={styles.navbar}>
        <h2 style={styles.navbarTitle}>Donate & Save Lives</h2>
      </nav>

      <div style={styles.mainContainer}>
        <div style={styles.donorBanner}>
          <div style={styles.donorBannerOverlay}>
            {loading && <p>Loading...</p>}
            {error && <p style={styles.error}>{error}</p>}
            {donor && (
              <div
                style={{
                  marginBottom: "20px",
                  fontSize: "18px",
                  fontWeight: "500",
                }}
              >
                Donor Name: {donor.name || "N/A"} <br />
                Donor ID: {donor._id || "N/A"}
              </div>
            )}
            {patients.length > 0 ? (
              <ul style={styles.patientGrid}>
                {patients
                  .filter(
                    (p) =>
                      p.completed_payment !== true &&
                      p.approved === true &&
                      p.amount >= 1
                  )
                  .map((p) => (
                    <li key={p._id} style={styles.patientCard}>
                      <p>
                        <strong>ID:</strong> {p.id}
                      </p>
                      <p>
                        <strong>Name:</strong> {p.name}
                      </p>
                      <p>
                        <strong>Age:</strong> {p.age}
                      </p>
                      <p>
                        <strong>Disease:</strong> {p.disease}
                      </p>
                      <p>
                        <strong>Hospital:</strong> {p.hospital}
                      </p>
                      <p>
                        <strong>Total Amount:</strong> ₹ {p.amount}
                      </p>
                      <p>
                        <strong>Balance:</strong> ₹ {p.balance_amount}
                      </p>
                      <div style={styles.cardActions}>
                        <button
                          style={styles.payBtn}
                          onMouseOver={(e) =>
                            (e.target.style.background = "#0056b3")
                          }
                          onMouseOut={(e) =>
                            (e.target.style.background = "#007bff")
                          }
                          onClick={() => {
                            setSelected(p);
                            setOpen(true);
                          }}
                        >
                          Pay
                        </button>
                      </div>
                    </li>
                  ))}
              </ul>
            ) : (
              !loading && <p>No patients found.</p>
            )}

            {open && selected && (
              <PaymentModal
                patient={selected}
                onClose={() => {
                  setOpen(false);
                  setSelected(null);
                }}
                onSuccess={() => {
                  setOpen(false);
                  setSelected(null);
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Donorgetpatientdetails;
