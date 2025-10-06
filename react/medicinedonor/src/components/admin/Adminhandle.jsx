import React from "react";
import { Link, useNavigate } from "react-router-dom";

function AdminHandle() {
	const navigate = useNavigate();

	const styles = {
		container: {
			width: "100%",
			backgroundColor: "#1f2937",
			padding: "12px 20px",
			boxShadow: "0 6px 18px rgba(0,0,0,0.2)",
			display: "flex",
			justifyContent: "center",
		},
		nav: {
			maxWidth: "1100px",
			width: "100%",
			display: "flex",
			alignItems: "center",
			justifyContent: "space-between",
			gap: "12px",
		},
		navList: {
			listStyle: "none",
			display: "flex",
			gap: "8px",
			margin: 0,
			padding: 0,
		},
		link: {
			textDecoration: "none",
			color: "#f8fafc",
			fontSize: "16px",
			padding: "8px 14px",
			borderRadius: "8px",
			fontWeight: 600,
		},
		logo: { color: "#fff", fontWeight: 700, fontSize: 18 },
		logout: {
			background: "transparent",
			border: "1px solid #ef4444",
			color: "#ef4444",
			padding: "8px 12px",
			borderRadius: 8,
			cursor: "pointer",
			fontWeight: 700,
		},
	};

	const handleLogout = () => {
		localStorage.removeItem("adminToken");
		navigate("/adminlogin");
	};
	return (
		<div style={styles.container}>
			<div style={styles.nav}>
				<div style={styles.logo}>ADMIN PANEL</div>

				<ul style={styles.navList}>
					<li>
						<Link to="/pending-patient" style={styles.link}>
							Pending
						</Link>
					</li>
					<li>
						<Link to="/approved-patient" style={styles.link}>
							Approved
						</Link>
					</li>
					<li>
						<Link to="/rejected-patient" style={styles.link}>
							Rejected
						</Link>
					</li>
					<li>
						<Link to="/completed-patient" style={styles.link}>
							Completed
						</Link>
					</li>
					<li>
						<Link to="/all-patients" style={styles.link}>
							All
						</Link>
					</li>
				</ul>

				<div>
					<button style={styles.logout} onClick={handleLogout}>
						Logout
					</button>
				</div>
			</div>
		</div>
	);
}

export default AdminHandle;
