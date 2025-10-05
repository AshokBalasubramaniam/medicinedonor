import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";

function AdminNavbar({ onAddDoctor }) {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/adminpage");
    localStorage.clear();
  };

  const styles = {
    nav: {
      backgroundColor: "#0ea5a4",
      padding: "16px 32px",
      boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    navList: {
      listStyle: "none",
      display: "flex",
      gap: "25px",
      margin: 0,
      padding: 0,
    },
    link: {
      color: "white",
      textDecoration: "none",
      fontWeight: 600,
      fontSize: "16px",
      padding: "10px 14px",
      borderRadius: "6px",
    },
    activeLink: {
      backgroundColor: "white",
      color: "#0ea5a4",
    },
    navRight: {
      display: "flex",
      gap: "15px",
      alignItems: "center",
    },
    button: {
      padding: "10px 20px",
      backgroundColor: "#3498db",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "14px",
    },
    logoutButton: {
      padding: "10px 20px",
      backgroundColor: "#e74c3c",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "14px",
    },
  };

  const navItems = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/pendingpatients", label: "Pending" },
    { path: "/ApprovedPatients", label: "Approved" },
    { path: "/rejected-patient", label: "Rejected" },
    { path: "/CompletedPatients", label: "Completed" },
    { path: "/all-patients", label: "All" },
  ];

  return (
    <nav style={styles.nav}>
      <ul style={styles.navList}>
        {navItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              style={{
                ...styles.link,
                ...(location.pathname === item.path ? styles.activeLink : {}),
              }}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      <div style={styles.navRight}>
        {onAddDoctor && (
          <button style={styles.button} onClick={onAddDoctor}>
            ➕ Add Doctor
          </button>
        )}
        <button style={styles.logoutButton} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default AdminNavbar;
