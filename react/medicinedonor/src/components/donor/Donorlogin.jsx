import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { loginDonor } from "../../api";
import { loginSuccess } from "../../store/authSlice";

/**
 * DonorLogin component
 * - internal CSS included via <style> tag inside the component (scoped by classname)
 * - handles loading, error messages, show/hide password, accessibility
 * - redirects if already logged in
 */

function DonorLogin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth?.token);

  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // If already logged in, redirect to donor details page
  useEffect(() => {
    if (token) {
      navigate("/Donorgetpatientdetails");
    }
  }, [token, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Basic client-side validation
    if (!form.email.trim() || !form.password) {
      setError("Please provide email and password.");
      setLoading(false);
      return;
    }

    try {
      const res = await loginDonor(form.email, form.password);

      // Expecting { token, user } shape from your API
      if (res?.token && res?.user) {
        dispatch(loginSuccess({ user: res.user, token: res.token }));

        // Optionally store token in localStorage if "remember" checked
        if (form.remember) {
          try {
            localStorage.setItem("authToken", res.token);
          } catch (e) {
            console.warn("Failed to persist token:", e);
          }
        }

        setLoading(false);
        navigate("/Donorgetpatientdetails");
      } else {
        setLoading(false);
        setError("Login failed: unexpected server response.");
        console.error("Unexpected login response:", res);
      }
    } catch (err) {
      setLoading(false);
      // If your API returns structured error, show it, otherwise generic message
      const msg =
        (err && (err.message || err.error || err?.data?.message)) ||
        "Login failed. Please check your email and password.";
      setError(msg);
      console.error("Login error:", err);
    }
  };

  return (
    <div className="dl-root">
      <style>{`
        /* Internal (component-scoped) styles for DonorLogin */
        .dl-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
          padding: 32px;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
          position: relative;
        }

        .dl-root::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image:
            radial-gradient(circle at 20% 50%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%);
          pointer-events: none;
        }

        .dl-card {
          width: 100%;
          max-width: 420px;
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          box-shadow: 0 12px 40px rgba(16, 24, 40, 0.12);
          padding: 32px;
          box-sizing: border-box;
          border: 1px solid rgba(255,255,255,0.2);
          position: relative;
          z-index: 1;
        }

        .dl-brand {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
          text-align: center;
          flex-direction: column;
        }

        .dl-logo {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #10b981, #06b6d4);
          border-radius: 16px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 24px;
          box-shadow: 0 8px 24px rgba(16, 185, 129, 0.2);
          margin-bottom: 8px;
        }

        .dl-title {
          font-size: 24px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 4px;
        }

        .dl-sub {
          font-size: 14px;
          color: #64748b;
          font-weight: 400;
        }

        .dl-form {
          margin-top: 12px;
        }

        .dl-field {
          display: flex;
          flex-direction: column;
          margin-bottom: 14px;
        }

        .dl-label {
          font-size: 13px;
          color: #475569;
          margin-bottom: 8px;
        }

        .dl-input {
          height: 44px;
          padding: 10px 12px;
          border-radius: 10px;
          border: 1px solid #e6eef9;
          background: #fbfdff;
          outline: none;
          font-size: 15px;
          color: #0f172a;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.6);
          transition: box-shadow 160ms ease, border-color 160ms ease, transform 160ms ease;
        }

        .dl-input:focus {
          border-color: rgba(79,70,229,0.9);
          box-shadow: 0 6px 20px rgba(79,70,229,0.06);
          transform: translateY(-1px);
        }

        .dl-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
        }

        .dl-remember {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #475569;
        }

        .dl-submit {
          width: 100%;
          height: 48px;
          margin-top: 8px;
          border-radius: 12px;
          border: none;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          background: linear-gradient(135deg, #10b981, #06b6d4);
          color: #fff;
          box-shadow: 0 8px 24px rgba(16, 185, 129, 0.2);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .dl-submit::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
        }

        .dl-submit:hover::before {
          left: 100%;
        }

        .dl-submit:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(16, 185, 129, 0.3);
        }

        .dl-submit:active { transform: translateY(0); }
        .dl-submit[disabled] {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .dl-alt {
          margin-top: 14px;
          text-align: center;
          font-size: 13px;
          color: #64748b;
        }

        .dl-error {
          margin-top: 8px;
          color: #b91c1c;
          background: #fff5f5;
          padding: 8px 10px;
          border-radius: 8px;
          font-size: 13px;
          border: 1px solid rgba(185,28,28,0.08);
        }

        .dl-password-wrap {
          position: relative;
        }

        .dl-toggle {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          border: none;
          font-size: 13px;
          color: #0f172a;
          cursor: pointer;
          padding: 6px;
        }

        @media (max-width: 480px) {
          .dl-card { padding: 20px; border-radius: 12px; }
          .dl-root { padding: 18px; }
        }
      `}</style>

      <div className="dl-card" role="region" aria-labelledby="donor-login-title">
        <div className="dl-brand">
          <div className="dl-logo">
            <i className="fa-solid fa-hand-holding-heart"></i>
          </div>
          <div>
            <div className="dl-title" id="donor-login-title">Donor Portal</div>
            <div className="dl-sub">Sign in to manage your medicine donations</div>
          </div>
        </div>

        <form className="dl-form" onSubmit={handleSubmit} noValidate>
          <div className="dl-field">
            <label className="dl-label" htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              className="dl-input"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
              aria-required="true"
            />
          </div>

          <div className="dl-field dl-password-wrap">
            <label className="dl-label" htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              className="dl-input"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
              aria-required="true"
            />
            <button
              type="button"
              className="dl-toggle"
              onClick={() => setShowPassword((s) => !s)}
              aria-pressed={showPassword}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <div className="dl-row">
            <label className="dl-remember">
              <input
                type="checkbox"
                name="remember"
                checked={form.remember}
                onChange={handleChange}
                style={{ width: 16, height: 16 }}
              />
              Remember me
            </label>

            <div style={{ fontSize: 13 }}>
              <a
                href="/forgot-password"
                style={{ color: "#0f172a", textDecoration: "none", opacity: 0.8 }}
                onMouseOver={(e) => (e.currentTarget.style.opacity = "1")}
                onMouseOut={(e) => (e.currentTarget.style.opacity = "0.8")}
              >
                Forgot password?
              </a>
            </div>
          </div>

          {error && <div className="dl-error" role="alert">{error}</div>}

          <button
            className="dl-submit"
            type="submit"
            disabled={loading}
            aria-disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <div className="dl-alt">
            New to our platform?{" "}
            <a
              href="/register"
              style={{
                color: "#10b981",
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'color 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.color = '#059669'}
              onMouseLeave={(e) => e.target.style.color = '#10b981'}
            >
              Join as a Donor
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DonorLogin;
