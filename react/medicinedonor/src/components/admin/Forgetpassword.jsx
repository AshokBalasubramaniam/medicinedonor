import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminForgetPassword, adminResetPassword } from "../../api";

// Professional Medical Password Reset Component Styles
const styles = {
  // Main Container
  container: {
    fontFamily: "'Inter', 'Segoe UI', 'Roboto', sans-serif",
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
    color: "#1e293b",
    display: "flex",
    flexDirection: "column",
  },

  // Header/Navigation
  header: {
    background: "linear-gradient(135deg, #0f766e 0%, #059669 100%)",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    position: "sticky",
    top: 0,
    zIndex: 50,
  },
  headerContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: "72px",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },
  logoIcon: {
    width: "40px",
    height: "40px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    color: "#059669",
    fontWeight: "bold",
  },
  logoText: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#ffffff",
    margin: 0,
  },
  backButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.5rem 1rem",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "8px",
    color: "#ffffff",
    textDecoration: "none",
    fontSize: "0.875rem",
    fontWeight: "500",
    transition: "all 0.2s ease-in-out",
    cursor: "pointer",
  },

  // Main Content
  mainContent: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem 1rem",
  },

  // Password Reset Card
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
    maxWidth: "480px",
    width: "100%",
    padding: "2.5rem",
    border: "1px solid #e2e8f0",
  },

  // Header Section
  headerSection: {
    textAlign: "center",
    marginBottom: "2rem",
  },
  icon: {
    width: "80px",
    height: "80px",
    backgroundColor: "#f0fdf4",
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 1.5rem",
    fontSize: "36px",
    color: "#16a34a",
  },
  title: {
    fontSize: "1.875rem",
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: "0.5rem",
    lineHeight: "1.2",
  },
  subtitle: {
    color: "#64748b",
    fontSize: "1rem",
    lineHeight: "1.5",
    margin: 0,
  },

  // Step Indicator
  stepIndicator: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "0.5rem",
    marginBottom: "2rem",
  },
  step: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.875rem",
    fontWeight: "600",
    border: "2px solid #e2e8f0",
    backgroundColor: "#ffffff",
    color: "#64748b",
    transition: "all 0.2s ease-in-out",
  },
  stepActive: {
    backgroundColor: "#059669",
    borderColor: "#059669",
    color: "#ffffff",
  },
  stepCompleted: {
    backgroundColor: "#10b981",
    borderColor: "#10b981",
    color: "#ffffff",
  },
  stepConnector: {
    width: "40px",
    height: "2px",
    backgroundColor: "#e2e8f0",
    transition: "all 0.2s ease-in-out",
  },
  stepConnectorActive: {
    backgroundColor: "#059669",
  },

  // Form Section
  formSection: {
    marginBottom: "2rem",
  },
  formGroup: {
    marginBottom: "1.5rem",
  },
  formLabel: {
    display: "block",
    fontSize: "0.875rem",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "0.5rem",
  },
  formInput: {
    width: "100%",
    padding: "0.875rem 1rem",
    border: "2px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "1rem",
    color: "#1e293b",
    backgroundColor: "#ffffff",
    outline: "none",
    transition: "all 0.2s ease-in-out",
    fontFamily: "inherit",
  },
  formInputFocus: {
    borderColor: "#059669",
    boxShadow: "0 0 0 3px rgba(5, 150, 105, 0.1)",
  },
  formTextarea: {
    ...this?.formInput,
    minHeight: "100px",
    resize: "vertical",
  },

  // Password Strength Indicator
  passwordStrength: {
    marginTop: "0.5rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  strengthBar: {
    flex: 1,
    height: "4px",
    backgroundColor: "#e2e8f0",
    borderRadius: "2px",
    overflow: "hidden",
  },
  strengthFill: {
    height: "100%",
    borderRadius: "2px",
    transition: "all 0.2s ease-in-out",
  },
  strengthText: {
    fontSize: "0.75rem",
    fontWeight: "500",
  },

  // Action Buttons
  buttonGroup: {
    display: "flex",
    gap: "1rem",
    marginTop: "2rem",
  },
  primaryButton: {
    flex: 1,
    padding: "0.875rem 1.5rem",
    background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease-in-out",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  primaryButtonHover: {
    transform: "translateY(-1px)",
    boxShadow: "0 4px 12px rgba(5, 150, 105, 0.3)",
  },
  primaryButtonDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
    transform: "none",
    boxShadow: "none",
  },
  secondaryButton: {
    flex: 1,
    padding: "0.875rem 1.5rem",
    backgroundColor: "#ffffff",
    color: "#64748b",
    border: "2px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease-in-out",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  secondaryButtonHover: {
    borderColor: "#cbd5e1",
    backgroundColor: "#f8fafc",
  },

  // Success State
  successSection: {
    textAlign: "center",
    padding: "2rem 0",
  },
  successIcon: {
    width: "80px",
    height: "80px",
    backgroundColor: "#f0fdf4",
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 1.5rem",
    fontSize: "36px",
    color: "#16a34a",
  },
  successTitle: {
    fontSize: "1.5rem",
    fontWeight: "700",
    color: "#16a34a",
    marginBottom: "0.5rem",
  },
  successMessage: {
    color: "#64748b",
    fontSize: "1rem",
    lineHeight: "1.5",
    marginBottom: "2rem",
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

  // Error Message
  errorMessage: {
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "8px",
    padding: "1rem",
    marginBottom: "1.5rem",
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

  // Success Message
  successMessage: {
    backgroundColor: "#f0fdf4",
    border: "1px solid #bbf7d0",
    borderRadius: "8px",
    padding: "1rem",
    marginBottom: "1.5rem",
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

  // OTP Input Container
  otpContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "0.5rem",
    marginBottom: "1rem",
  },
  otpInput: {
    width: "50px",
    height: "50px",
    border: "2px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "1.25rem",
    fontWeight: "600",
    textAlign: "center",
    outline: "none",
    transition: "all 0.2s ease-in-out",
  },
  otpInputFocus: {
    borderColor: "#059669",
    boxShadow: "0 0 0 3px rgba(5, 150, 105, 0.1)",
  },

  // Responsive Design
  "@media (max-width: 640px)": {
    card: {
      padding: "1.5rem",
      margin: "1rem",
    },
    stepIndicator: {
      gap: "0.25rem",
    },
    stepConnector: {
      width: "20px",
    },
    buttonGroup: {
      flexDirection: "column",
    },
  },
};

function Forgetpassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpInputs, setOtpInputs] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Helper functions
  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength <= 2) return { level: "weak", color: "#dc2626", width: "33%" };
    if (strength <= 3) return { level: "medium", color: "#d97706", width: "66%" };
    return { level: "strong", color: "#16a34a", width: "100%" };
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // Only allow single digit

    const newOtpInputs = [...otpInputs];
    newOtpInputs[index] = value;
    setOtpInputs(newOtpInputs);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }

    // Combine OTP
    setOtp(newOtpInputs.join(""));
  };

  const handleSendOtp = async () => {
    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const res = await adminForgetPassword(email);
      setSuccess("OTP sent successfully! Please check your email.");
      setStep(2);
    } catch (err) {
      setError(err.error || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setError("");
    setSuccess("");

    if (otp.length !== 6) {
      setError("Please enter the complete 6-digit OTP");
      return;
    }

    if (!newPassword) {
      setError("Please enter a new password");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await adminResetPassword(email, otp, newPassword);
      setSuccess("Password reset successful! You can now login with your new password.");
      setStep(3);
    } catch (err) {
      setError(err.error || "Password reset failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/adminpage");
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
          @media (max-width: 640px) {
            .step-indicator { gap: 0.25rem !important; }
            .step-connector { width: 20px !important; }
            .button-group { flex-direction: column !important; }
          }
        `}
      </style>

      <div style={styles.container}>
        {/* Header */}
        <header style={styles.header}>
          <div style={styles.headerContent}>
            <div style={styles.logo}>
              <div style={styles.logoIcon}>🏥</div>
              <h1 style={styles.logoText}>Medical Portal</h1>
            </div>
            <button
              style={styles.backButton}
              onClick={handleBackToLogin}
              onMouseOver={(e) => (e.target.style.backgroundColor = "rgba(255, 255, 255, 0.2)")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "rgba(255, 255, 255, 0.1)")}
            >
              ← Back to Login
            </button>
          </div>
        </header>

        <main style={styles.mainContent}>
          <div style={styles.card}>
            {/* Step Indicator */}
            {step < 3 && (
              <div style={styles.stepIndicator} className="step-indicator">
                <div style={{
                  ...styles.step,
                  ...(step >= 1 ? styles.stepActive : {}),
                  ...(step > 1 ? styles.stepCompleted : {})
                }}>
                  1
                </div>
                <div style={{
                  ...styles.stepConnector,
                  ...(step > 1 ? styles.stepConnectorActive : {})
                }} className="step-connector"></div>
                <div style={{
                  ...styles.step,
                  ...(step >= 2 ? styles.stepActive : {}),
                  ...(step > 2 ? styles.stepCompleted : {})
                }}>
                  2
                </div>
              </div>
            )}

            {/* Success State */}
            {step === 3 && (
              <div style={styles.successSection}>
                <div style={styles.successIcon}>✅</div>
                <h2 style={styles.successTitle}>Password Reset Complete</h2>
                <p style={styles.successMessage}>
                  Your password has been successfully reset. You can now login with your new password.
                </p>
                <button
                  style={styles.primaryButton}
                  onClick={handleBackToLogin}
                  onMouseOver={(e) => Object.assign(e.target.style, styles.primaryButtonHover)}
                  onMouseOut={(e) => Object.assign(e.target.style, styles.primaryButton)}
                >
                  🔐 Go to Login
                </button>
              </div>
            )}

            {/* Step 1: Email Input */}
            {step === 1 && (
              <>
                <div style={styles.headerSection}>
                  <div style={styles.icon}>🔐</div>
                  <h1 style={styles.title}>Reset Your Password</h1>
                  <p style={styles.subtitle}>
                    Enter your registered email address and we'll send you a verification code to reset your password.
                  </p>
                </div>

                {/* Error/Success Messages */}
                {error && (
                  <div style={styles.errorMessage}>
                    <span style={styles.errorIcon}>⚠️</span>
                    <p style={styles.errorText}>{error}</p>
                  </div>
                )}

                {success && (
                  <div style={styles.successMessage}>
                    <span style={styles.successIcon}>✅</span>
                    <p style={styles.successText}>{success}</p>
                  </div>
                )}

                <div style={styles.formSection}>
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>
                      📧 Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={styles.formInput}
                      placeholder="Enter your registered email"
                      onFocus={(e) => Object.assign(e.target.style, styles.formInputFocus)}
                      onBlur={(e) => Object.assign(e.target.style, styles.formInput)}
                      disabled={loading}
                    />
                  </div>

                  <button
                    style={{
                      ...styles.primaryButton,
                      ...(loading ? styles.primaryButtonDisabled : {})
                    }}
                    onClick={handleSendOtp}
                    disabled={loading}
                    onMouseOver={(e) => {
                      if (!loading) Object.assign(e.target.style, styles.primaryButtonHover);
                    }}
                    onMouseOut={(e) => {
                      if (!loading) Object.assign(e.target.style, styles.primaryButton);
                    }}
                  >
                    {loading ? (
                      <>
                        <div style={styles.loadingSpinner}></div>
                        Sending OTP...
                      </>
                    ) : (
                      <>📤 Send Verification Code</>
                    )}
                  </button>
                </div>
              </>
            )}

            {/* Step 2: OTP and Password Reset */}
            {step === 2 && (
              <>
                <div style={styles.headerSection}>
                  <div style={styles.icon}>🔢</div>
                  <h1 style={styles.title}>Verify & Reset</h1>
                  <p style={styles.subtitle}>
                    We've sent a 6-digit verification code to <strong>{email}</strong>.
                    Enter the code and your new password.
                  </p>
                </div>

                {/* Error Messages */}
                {error && (
                  <div style={styles.errorMessage}>
                    <span style={styles.errorIcon}>⚠️</span>
                    <p style={styles.errorText}>{error}</p>
                  </div>
                )}

                <div style={styles.formSection}>
                  {/* OTP Input */}
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>
                      🔐 Verification Code
                    </label>
                    <div style={styles.otpContainer}>
                      {otpInputs.map((digit, index) => (
                        <input
                          key={index}
                          id={`otp-${index}`}
                          type="text"
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          style={styles.otpInput}
                          maxLength="1"
                          onFocus={(e) => Object.assign(e.target.style, styles.otpInputFocus)}
                          onBlur={(e) => Object.assign(e.target.style, styles.otpInput)}
                          disabled={loading}
                        />
                      ))}
                    </div>
                    <p style={{
                      fontSize: "0.75rem",
                      color: "#64748b",
                      margin: "0.5rem 0 0 0",
                      textAlign: "center"
                    }}>
                      Didn't receive the code? Check your spam folder or{" "}
                      <button
                        style={{
                          color: "#059669",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          textDecoration: "underline"
                        }}
                        onClick={handleSendOtp}
                        disabled={loading}
                      >
                        resend
                      </button>
                    </p>
                  </div>

                  {/* New Password */}
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>
                      🔒 New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      style={styles.formInput}
                      placeholder="Enter new password (min 8 characters)"
                      onFocus={(e) => Object.assign(e.target.style, styles.formInputFocus)}
                      onBlur={(e) => Object.assign(e.target.style, styles.formInput)}
                      disabled={loading}
                    />
                    {newPassword && (
                      <div style={styles.passwordStrength}>
                        <div style={styles.strengthBar}>
                          <div style={{
                            ...styles.strengthFill,
                            backgroundColor: getPasswordStrength(newPassword).color,
                            width: getPasswordStrength(newPassword).width
                          }}></div>
                        </div>
                        <span style={{
                          ...styles.strengthText,
                          color: getPasswordStrength(newPassword).color
                        }}>
                          {getPasswordStrength(newPassword).level}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>
                      🔒 Confirm Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      style={styles.formInput}
                      placeholder="Confirm your new password"
                      onFocus={(e) => Object.assign(e.target.style, styles.formInputFocus)}
                      onBlur={(e) => Object.assign(e.target.style, styles.formInput)}
                      disabled={loading}
                    />
                  </div>

                  <div style={styles.buttonGroup} className="button-group">
                    <button
                      style={styles.secondaryButton}
                      onClick={() => setStep(1)}
                      disabled={loading}
                      onMouseOver={(e) => Object.assign(e.target.style, styles.secondaryButtonHover)}
                      onMouseOut={(e) => Object.assign(e.target.style, styles.secondaryButton)}
                    >
                      ← Back
                    </button>
                    <button
                      style={{
                        ...styles.primaryButton,
                        ...(loading ? styles.primaryButtonDisabled : {})
                      }}
                      onClick={handleResetPassword}
                      disabled={loading}
                      onMouseOver={(e) => {
                        if (!loading) Object.assign(e.target.style, styles.primaryButtonHover);
                      }}
                      onMouseOut={(e) => {
                        if (!loading) Object.assign(e.target.style, styles.primaryButton);
                      }}
                    >
                      {loading ? (
                        <>
                          <div style={styles.loadingSpinner}></div>
                          Resetting...
                        </>
                      ) : (
                        <>🔄 Reset Password</>
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </>
  );
}

export default Forgetpassword;
