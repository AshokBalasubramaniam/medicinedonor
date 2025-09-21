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
          background: linear-gradient(180deg, #f6fbff 0%, #eef7ff 100%);
          padding: 32px;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
        }

        .dl-card {
          width: 100%;
          max-width: 420px;
          background: #ffffff;
          border-radius: 14px;
          box-shadow: 0 8px 30px rgba(16, 24, 40, 0.08);
          padding: 28px;
          box-sizing: border-box;
          border: 1px solid rgba(20,40,80,0.04);
        }

        .dl-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 18px;
        }

        .dl-logo {
          width: 46px;
          height: 46px;
          background: linear-gradient(135deg,#4f46e5,#06b6d4);
          border-radius: 10px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 18px;
          box-shadow: 0 6px 18px rgba(79,70,229,0.12);
        }

        .dl-title {
          font-size: 20px;
          font-weight: 600;
          color: #0f172a;
        }

        .dl-sub {
          font-size: 13px;
          color: #475569;
          margin-top: 4px;
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
          height: 46px;
          margin-top: 6px;
          border-radius: 10px;
          border: none;
          font-weight: 600;
          font-size: 15px;
          cursor: pointer;
          background: linear-gradient(90deg, #4f46e5, #06b6d4);
          color: #fff;
          box-shadow: 0 8px 24px rgba(6,182,212,0.12);
          transition: transform 120ms ease, box-shadow 120ms ease, opacity 120ms ease;
        }

        .dl-submit:active { transform: translateY(1px); }
        .dl-submit[disabled] { opacity: 0.7; cursor: not-allowed; }

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
          <div className="dl-logo">D</div>
          <div>
            <div className="dl-title" id="donor-login-title">Donor Login</div>
            <div className="dl-sub">Sign in to access donor patient details</div>
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
            New donor?{" "}
            <a href="/donor-register" style={{ color: "#064e3b", fontWeight: 600 }}>
              Create an account
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DonorLogin;
