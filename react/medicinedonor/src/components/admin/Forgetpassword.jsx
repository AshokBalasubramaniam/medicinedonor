import React, { useState } from "react";
import { adminForgetPassword, adminResetPassword } from "../../api";

function Forgetpassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const [msg, setMsg] = useState("");

  const handleSendOtp = async () => {
    try {
      const res = await adminForgetPassword(email);
      if (res.status === 200) {
        setMsg("OTP sent to your email");
        setStep(2);
      }
    } catch (err) {
      setMsg(err.error || "Failed to send OTP");
    }
  };

  const handleResetPassword = async () => {
    try {
      const res = await adminResetPassword(email, otp, newPassword);
      if (res.status === 200) {
        setMsg("Password reset successful! You can now login.");
        setStep(3);
      }
    } catch (err) {
      setMsg(err.error || "Password reset failed");
    }
  };

  return (
    <div style={{ margin: "50px", textAlign: "center" }}>
      <h2>Forget Password</h2>
      {msg && <p>{msg}</p>}

      {step === 1 && (
        <div>
          <input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handleSendOtp}>Send OTP</button>
        </div>
      )}

      {step === 2 && (
        <div>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button onClick={handleResetPassword}>Reset Password</button>
        </div>
      )}

      {step === 3 && <a href="/adminpage">Go to Login</a>}
    </div>
  );
}

export default Forgetpassword;
