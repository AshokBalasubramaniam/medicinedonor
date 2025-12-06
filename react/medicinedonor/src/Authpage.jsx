import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { registerPatient, registerDonor } from "./api";

function AuthPage() {
  const location = useLocation();
  const [role, setRole] = useState("patient");
  const initailForm = {
    name: "",
    age: "",
    disease: "",
    hospitalname: "",
    medicine: "",
    customMedicine: "",
    doctor: "",
    date: "",
    time: "",
    mobile: "",
    employment: "",
    gender: "",
    relationship: "",
    birthday: "",
    email: "",
    password: "",
    confirmPassword: "",
    category: "",
    aadharno: "",
    panno: "",
    place: "",
    street: "",
    town: "",
    pincode: "",
    state: "",
  };

  const [form, setForm] = useState(initailForm);

  const medicineOptions = [
    "Paracetamol",
    "Amoxicillin",
    "Ibuprofen",
    "Metformin",
    "Amlodipine",
    "Atorvastatin",
    "Omeprazole",
    "Losartan",
    "Azithromycin",
    "Levothyroxine",
    "Other",
  ];

  useEffect(() => {
    if (location.state?.role) {
      setRole(location.state.role);
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const medicineToSend =
      form.medicine === "Other" ? form.customMedicine : form.medicine;

    const payload = { ...form, medicine: medicineToSend };
    delete payload.customMedicine;

    try {
      if (role === "patient") {
        await registerPatient(payload);
      } else {
        await registerDonor(payload);
      }
      alert("Registration successful!");
      setForm(initailForm);
    } catch (err) {
      if (err.response?.status === 409) {
        alert("Email already registered.");
      } else {
        alert("Registration failed.");
      }
    }
  };

  // Professional Hospital Theme Styles
  const styles = {
    // Main Container
    container: {
      fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
      background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
      minHeight: "100vh",
      padding: "1rem",
    },

    // Hospital Header
    header: {
      background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
      borderRadius: "16px",
      padding: "2rem",
      marginBottom: "2rem",
      boxShadow: "0 10px 40px rgba(30, 64, 175, 0.15)",
      textAlign: "center",
      position: "relative",
      overflow: "hidden",
    },
    headerIcon: {
      width: "80px",
      height: "80px",
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 auto 1rem",
      fontSize: "40px",
      backdropFilter: "blur(10px)",
    },
    headerTitle: {
      fontSize: "2.5rem",
      fontWeight: "800",
      color: "#ffffff",
      marginBottom: "0.5rem",
      textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    headerSubtitle: {
      fontSize: "1.125rem",
      color: "rgba(255, 255, 255, 0.9)",
      fontWeight: "500",
    },

    // Main Content Card
    card: {
      backgroundColor: "#ffffff",
      borderRadius: "16px",
      boxShadow: "0 20px 60px rgba(0, 0, 0, 0.1)",
      overflow: "hidden",
      border: "1px solid #e2e8f0",
    },

    // Role Selector
    roleSelector: {
      backgroundColor: "#f8fafc",
      padding: "2rem",
      borderBottom: "2px solid #e2e8f0",
    },
    roleSelectorTitle: {
      textAlign: "center",
      fontSize: "1.25rem",
      fontWeight: "600",
      color: "#374151",
      marginBottom: "1.5rem",
    },
    roleTabs: {
      display: "flex",
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      padding: "0.5rem",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
      maxWidth: "400px",
      margin: "0 auto",
    },
    roleTab: {
      flex: 1,
      padding: "0.875rem 1.5rem",
      borderRadius: "8px",
      textAlign: "center",
      fontSize: "0.875rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
      border: "none",
      backgroundColor: "transparent",
      color: "#6b7280",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.5rem",
    },
    roleTabActive: {
      backgroundColor: "#3b82f6",
      color: "#ffffff",
      boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
    },

    // Form Content
    formContent: {
      padding: "2.5rem",
    },

    // Form Grid
    formGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: "1.5rem",
    },

    // Section Headers
    sectionHeader: {
      gridColumn: "1 / -1",
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
      marginBottom: "1.5rem",
      paddingBottom: "0.75rem",
      borderBottom: "2px solid #e2e8f0",
    },
    sectionIcon: {
      width: "40px",
      height: "40px",
      backgroundColor: "#eff6ff",
      borderRadius: "10px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#3b82f6",
      fontSize: "18px",
    },
    sectionTitle: {
      fontSize: "1.25rem",
      fontWeight: "700",
      color: "#1f2937",
      margin: 0,
    },

    // Form Groups
    formGroup: {
      display: "flex",
      flexDirection: "column",
    },
    formLabel: {
      fontSize: "0.875rem",
      fontWeight: "600",
      color: "#374151",
      marginBottom: "0.5rem",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
    },
    formInput: {
      padding: "0.875rem 1rem",
      border: "2px solid #e2e8f0",
      borderRadius: "8px",
      fontSize: "1rem",
      color: "#1f2937",
      backgroundColor: "#ffffff",
      outline: "none",
      transition: "all 0.2s ease-in-out",
      fontFamily: "inherit",
    },
    formInputFocus: {
      borderColor: "#3b82f6",
      boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
    },
    formSelect: {
      padding: "0.875rem 1rem",
      border: "2px solid #e2e8f0",
      borderRadius: "8px",
      fontSize: "1rem",
      color: "#1f2937",
      backgroundColor: "#ffffff",
      outline: "none",
      cursor: "pointer",
      fontFamily: "inherit",
      backgroundImage:
        "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e\")",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right 1rem center",
      backgroundSize: "1rem",
      paddingRight: "3rem",
    },
    formTextarea: {
      padding: "0.875rem 1rem",
      border: "2px solid #e2e8f0",
      borderRadius: "8px",
      fontSize: "1rem",
      color: "#1f2937",
      backgroundColor: "#ffffff",
      outline: "none",
      minHeight: "100px",
      resize: "vertical",
      fontFamily: "inherit",
    },

    // Submit Button
    submitSection: {
      gridColumn: "1 / -1",
      marginTop: "2rem",
      paddingTop: "2rem",
      borderTop: "2px solid #f1f5f9",
      textAlign: "center",
    },
    submitButton: {
      background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
      color: "#ffffff",
      border: "none",
      borderRadius: "12px",
      padding: "1rem 3rem",
      fontSize: "1.125rem",
      fontWeight: "700",
      cursor: "pointer",
      transition: "all 0.3s ease",
      boxShadow: "0 4px 16px rgba(59, 130, 246, 0.3)",
      display: "inline-flex",
      alignItems: "center",
      gap: "0.5rem",
      textTransform: "uppercase",
      letterSpacing: "0.05em",
    },
    submitButtonHover: {
      transform: "translateY(-2px)",
      boxShadow: "0 8px 24px rgba(59, 130, 246, 0.4)",
    },

    // Success Message
    successMessage: {
      backgroundColor: "#f0fdf4",
      border: "1px solid #bbf7d0",
      borderRadius: "8px",
      padding: "1rem",
      marginBottom: "1rem",
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
    },
    successIcon: {
      color: "#16a34a",
      fontSize: "20px",
    },
    successText: {
      fontSize: "0.875rem",
      color: "#166534",
      fontWeight: "500",
      margin: 0,
    },

    // Error Message
    errorMessage: {
      backgroundColor: "#fef2f2",
      border: "1px solid #fecaca",
      borderRadius: "8px",
      padding: "1rem",
      marginBottom: "1rem",
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
    },
    errorIcon: {
      color: "#dc2626",
      fontSize: "20px",
    },
    errorText: {
      fontSize: "0.875rem",
      color: "#dc2626",
      fontWeight: "500",
      margin: 0,
    },

    // Loading Spinner
    loadingSpinner: {
      width: "20px",
      height: "20px",
      border: "2px solid rgba(255, 255, 255, 0.3)",
      borderTop: "2px solid #ffffff",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
    },

    // Medical Icons
    medicalIcons: {
      personal: "👤",
      medical: "🏥",
      address: "🏠",
      account: "🔐",
      heart: "❤️",
      stethoscope: "🩺",
      pill: "💊",
      id: "🆔",
      email: "📧",
      phone: "📱",
      calendar: "📅",
      location: "📍",
    },

    // Responsive Design
    "@media (max-width: 768px)": {
      container: {
        padding: "0.5rem",
      },
      header: {
        padding: "1.5rem",
      },
      headerTitle: {
        fontSize: "2rem",
      },
      formContent: {
        padding: "1.5rem",
      },
      formGrid: {
        gridTemplateColumns: "1fr",
        gap: "1rem",
      },
      submitButton: {
        width: "100%",
        padding: "1rem 2rem",
      },
    },
  };

  return (
    <>
      {/* CSS Animations */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @media (max-width: 768px) {
            .hospital-form-grid { grid-template-columns: 1fr !important; }
          }
        `}
      </style>

      <div style={styles.container}>
        {/* Hospital Header */}
        <header style={styles.header}>
          <div style={styles.headerIcon}>
            {role === "patient" ? "🏥" : "💝"}
          </div>
          <h1 style={styles.headerTitle}>
            {role === "patient" ? "Patient Registration" : "Donor Registration"}
          </h1>
          <p style={styles.headerSubtitle}>
            {role === "patient"
              ? "Join our healthcare community and access quality medical services"
              : "Become a hero by donating medicine and helping those in need"}
          </p>
        </header>

        <div style={styles.card}>
          {/* Role Selector */}
          <div style={styles.roleSelector}>
            <h2 style={styles.roleSelectorTitle}>Choose Your Role</h2>
            <div style={styles.roleTabs}>
              <button
                style={{
                  ...styles.roleTab,
                  ...(role === "patient" ? styles.roleTabActive : {}),
                }}
                onClick={() => setRole("patient")}
              >
                <span style={{ fontSize: "1.25rem" }}>👨‍⚕️</span>
                Patient
              </button>
              <button
                style={{
                  ...styles.roleTab,
                  ...(role === "donor" ? styles.roleTabActive : {}),
                }}
                onClick={() => setRole("donor")}
              >
                <span style={{ fontSize: "1.25rem" }}>💝</span>
                Donor
              </button>
            </div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit}>
            <div style={styles.formContent}>
              <div style={styles.formGrid} className="hospital-form-grid">
                {/* Personal Information Section */}
                <div style={styles.sectionHeader}>
                  <div style={styles.sectionIcon}>
                    {styles.medicalIcons.personal}
                  </div>
                  <h3 style={styles.sectionTitle}>Personal Information</h3>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>
                    <span>{styles.medicalIcons.personal}</span>
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    style={styles.formInput}
                    placeholder="Enter your full name"
                    required
                    onFocus={(e) =>
                      Object.assign(e.target.style, styles.formInputFocus)
                    }
                    onBlur={(e) =>
                      Object.assign(e.target.style, styles.formInput)
                    }
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>
                    <span>{styles.medicalIcons.calendar}</span>
                    Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={form.age}
                    onChange={handleChange}
                    style={styles.formInput}
                    placeholder="Your age"
                    min="1"
                    max="150"
                    required
                    onFocus={(e) =>
                      Object.assign(e.target.style, styles.formInputFocus)
                    }
                    onBlur={(e) =>
                      Object.assign(e.target.style, styles.formInput)
                    }
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>
                    <span>{styles.medicalIcons.phone}</span>
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    name="mobile"
                    value={form.mobile}
                    onChange={handleChange}
                    style={styles.formInput}
                    placeholder="Enter mobile number"
                    required
                    onFocus={(e) =>
                      Object.assign(e.target.style, styles.formInputFocus)
                    }
                    onBlur={(e) =>
                      Object.assign(e.target.style, styles.formInput)
                    }
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>
                    <span>⚤</span>
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    style={styles.formSelect}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>
                    <span>{styles.medicalIcons.calendar}</span>
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="birthday"
                    value={form.birthday}
                    onChange={handleChange}
                    style={styles.formInput}
                    required
                    onFocus={(e) =>
                      Object.assign(e.target.style, styles.formInputFocus)
                    }
                    onBlur={(e) =>
                      Object.assign(e.target.style, styles.formInput)
                    }
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>
                    <span>{styles.medicalIcons.heart}</span>
                    Relationship Status
                  </label>
                  <select
                    name="relationship"
                    value={form.relationship}
                    onChange={handleChange}
                    style={styles.formSelect}
                    required
                  >
                    <option value="">Select Status</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                </div>

                {/* Medical Information Section (Patient Only) */}
                {role === "patient" && (
                  <>
                    <div style={styles.sectionHeader}>
                      <div style={styles.sectionIcon}>
                        {styles.medicalIcons.medical}
                      </div>
                      <h3 style={styles.sectionTitle}>Medical Information</h3>
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>
                        <span>{styles.medicalIcons.stethoscope}</span>
                        Medical Condition
                      </label>
                      <input
                        type="text"
                        name="disease"
                        value={form.disease}
                        onChange={handleChange}
                        style={styles.formInput}
                        placeholder="Describe your medical condition"
                        required
                        onFocus={(e) =>
                          Object.assign(e.target.style, styles.formInputFocus)
                        }
                        onBlur={(e) =>
                          Object.assign(e.target.style, styles.formInput)
                        }
                      />
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>
                        <span>{styles.medicalIcons.medical}</span>
                        Hospital/Clinic Name
                      </label>
                      <input
                        type="text"
                        name="hospitalname"
                        value={form.hospitalname}
                        onChange={handleChange}
                        style={styles.formInput}
                        placeholder="Name of hospital or clinic"
                        required
                        onFocus={(e) =>
                          Object.assign(e.target.style, styles.formInputFocus)
                        }
                        onBlur={(e) =>
                          Object.assign(e.target.style, styles.formInput)
                        }
                      />
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>
                        <span>👨‍⚕️</span>
                        Doctor Name
                      </label>
                      <input
                        type="text"
                        name="doctor"
                        value={form.doctor}
                        onChange={handleChange}
                        style={styles.formInput}
                        placeholder="Name of treating doctor"
                        required
                        onFocus={(e) =>
                          Object.assign(e.target.style, styles.formInputFocus)
                        }
                        onBlur={(e) =>
                          Object.assign(e.target.style, styles.formInput)
                        }
                      />
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>
                        <span>{styles.medicalIcons.pill}</span>
                        Prescribed Medicine
                      </label>
                      <select
                        name="medicine"
                        value={form.medicine}
                        onChange={handleChange}
                        style={styles.formSelect}
                        required
                      >
                        <option value="">Select Medicine</option>
                        {medicineOptions.map((medicine) => (
                          <option key={medicine} value={medicine}>
                            {medicine}
                          </option>
                        ))}
                      </select>
                    </div>

                    {form.medicine === "Other" && (
                      <div style={styles.formGroup}>
                        <label style={styles.formLabel}>
                          <span>📝</span>
                          Specify Medicine
                        </label>
                        <input
                          type="text"
                          name="customMedicine"
                          value={form.customMedicine}
                          onChange={handleChange}
                          style={styles.formInput}
                          placeholder="Enter medicine name"
                          required
                          onFocus={(e) =>
                            Object.assign(e.target.style, styles.formInputFocus)
                          }
                          onBlur={(e) =>
                            Object.assign(e.target.style, styles.formInput)
                          }
                        />
                      </div>
                    )}
                  </>
                )}

                {/* Donor Information Section (Donor Only) */}
                {role === "donor" && (
                  <>
                    <div style={styles.sectionHeader}>
                      <div style={styles.sectionIcon}>💼</div>
                      <h3 style={styles.sectionTitle}>Donor Information</h3>
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>
                        <span>💼</span>
                        Employment/Occupation
                      </label>
                      <input
                        type="text"
                        name="employment"
                        value={form.employment}
                        onChange={handleChange}
                        style={styles.formInput}
                        placeholder="Your occupation"
                        required
                        onFocus={(e) =>
                          Object.assign(e.target.style, styles.formInputFocus)
                        }
                        onBlur={(e) =>
                          Object.assign(e.target.style, styles.formInput)
                        }
                      />
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>
                        <span>🎯</span>
                        Donation Category
                      </label>
                      <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        style={styles.formSelect}
                        required
                      >
                        <option value="">Select Category</option>
                        <option value="Trust">Trust/Organization</option>
                        <option value="Personal">Personal Donation</option>
                        <option value="Birthday">Birthday Celebration</option>
                        <option value="Memorial">In Memory Of</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </>
                )}

                {/* Address Information Section */}
                <div style={styles.sectionHeader}>
                  <div style={styles.sectionIcon}>
                    {styles.medicalIcons.address}
                  </div>
                  <h3 style={styles.sectionTitle}>Address Information</h3>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>
                    <span>🏠</span>
                    Building/House/Flat Number
                  </label>
                  <input
                    type="text"
                    name="place"
                    value={form.place}
                    onChange={handleChange}
                    style={styles.formInput}
                    placeholder="Building or house number"
                    required
                    onFocus={(e) =>
                      Object.assign(e.target.style, styles.formInputFocus)
                    }
                    onBlur={(e) =>
                      Object.assign(e.target.style, styles.formInput)
                    }
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>
                    <span>🛣️</span>
                    Street Address
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={form.street}
                    onChange={handleChange}
                    style={styles.formInput}
                    placeholder="Street name and area"
                    required
                    onFocus={(e) =>
                      Object.assign(e.target.style, styles.formInputFocus)
                    }
                    onBlur={(e) =>
                      Object.assign(e.target.style, styles.formInput)
                    }
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>
                    <span>🏙️</span>
                    Town/City
                  </label>
                  <input
                    type="text"
                    name="town"
                    value={form.town}
                    onChange={handleChange}
                    style={styles.formInput}
                    placeholder="Town or city name"
                    required
                    onFocus={(e) =>
                      Object.assign(e.target.style, styles.formInputFocus)
                    }
                    onBlur={(e) =>
                      Object.assign(e.target.style, styles.formInput)
                    }
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>
                    <span>📮</span>
                    Pincode
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={form.pincode}
                    onChange={handleChange}
                    style={styles.formInput}
                    placeholder="6-digit pincode"
                    required
                    onFocus={(e) =>
                      Object.assign(e.target.style, styles.formInputFocus)
                    }
                    onBlur={(e) =>
                      Object.assign(e.target.style, styles.formInput)
                    }
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>
                    <span>🗺️</span>
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    style={styles.formInput}
                    placeholder="State name"
                    required
                    onFocus={(e) =>
                      Object.assign(e.target.style, styles.formInputFocus)
                    }
                    onBlur={(e) =>
                      Object.assign(e.target.style, styles.formInput)
                    }
                  />
                </div>

                {/* Account Information Section */}
                <div style={styles.sectionHeader}>
                  <div style={styles.sectionIcon}>
                    {styles.medicalIcons.account}
                  </div>
                  <h3 style={styles.sectionTitle}>Account Information</h3>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>
                    <span>{styles.medicalIcons.email}</span>
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    style={styles.formInput}
                    placeholder="Enter your email address"
                    required
                    onFocus={(e) =>
                      Object.assign(e.target.style, styles.formInputFocus)
                    }
                    onBlur={(e) =>
                      Object.assign(e.target.style, styles.formInput)
                    }
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>
                    <span>{styles.medicalIcons.id}</span>
                    Aadhar Number
                  </label>
                  <input
                    type="text"
                    name="aadharno"
                    value={form.aadharno}
                    onChange={handleChange}
                    style={styles.formInput}
                    placeholder="12-digit Aadhar number"
                    required
                    onFocus={(e) =>
                      Object.assign(e.target.style, styles.formInputFocus)
                    }
                    onBlur={(e) =>
                      Object.assign(e.target.style, styles.formInput)
                    }
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>
                    <span>📋</span>
                    PAN Number
                  </label>
                  <input
                    type="text"
                    name="panno"
                    value={form.panno}
                    onChange={handleChange}
                    style={styles.formInput}
                    placeholder="PAN number"
                    required
                    onFocus={(e) =>
                      Object.assign(e.target.style, styles.formInputFocus)
                    }
                    onBlur={(e) =>
                      Object.assign(e.target.style, styles.formInput)
                    }
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>
                    <span>🔒</span>
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    style={styles.formInput}
                    placeholder="Create a strong password"
                    required
                    onFocus={(e) =>
                      Object.assign(e.target.style, styles.formInputFocus)
                    }
                    onBlur={(e) =>
                      Object.assign(e.target.style, styles.formInput)
                    }
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>
                    <span>🔒</span>
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    style={styles.formInput}
                    placeholder="Confirm your password"
                    required
                    onFocus={(e) =>
                      Object.assign(e.target.style, styles.formInputFocus)
                    }
                    onBlur={(e) =>
                      Object.assign(e.target.style, styles.formInput)
                    }
                  />
                </div>

                {/* Submit Button */}
                <div style={styles.submitSection}>
                  <button
                    type="submit"
                    style={styles.submitButton}
                    onMouseOver={(e) =>
                      Object.assign(e.target.style, styles.submitButtonHover)
                    }
                    onMouseOut={(e) =>
                      Object.assign(e.target.style, styles.submitButton)
                    }
                  >
                    <span>🏥</span>
                    Complete Registration
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default AuthPage;
