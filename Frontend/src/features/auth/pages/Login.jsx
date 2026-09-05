import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const { handleLogin } = useAuth();

  const [email, setemail] = useState(() => {
    try {
      return localStorage.getItem("interviewprep-email") || "";
    } catch {
      return "";
    }
  });
  const [password, setpassword] = useState("");
  const [remember, setRemember] = useState(() => {
    try {
      return Boolean(localStorage.getItem("interviewprep-email"));
    } catch {
      return false;
    }
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Email and password are required.");
      return;
    }

    try {
      setSubmitting(true);
      await handleLogin({
        email,
        password,
      });
      try {
        if (remember) {
          localStorage.setItem("interviewprep-email", email.trim());
        } else {
          localStorage.removeItem("interviewprep-email");
        }
      } catch {
        /* ignore */
      }
      navigate("/");
    } catch (err) {
      setError(
        err?.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-layout">
        <aside className="auth-aside">
          <p className="eyebrow">Welcome back</p>
          <h2>Your next interview. Your best performance.</h2>
          <p>
            Sign in to access AI-powered mock interviews, personalized performance insights, and track your interview progress.
          </p>
          <div className="feature-list">
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>AI-powered mock interviews</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>Personalized performance insights</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>Track your interview progress</span>
            </div>
          </div>
        </aside>
        <div className="auth-card">
          <h1>Sign in</h1>
          <p className="auth-lead">Welcome back! Please enter your details.</p>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="alert-error">{error}</div>}

            <div className="input-group">
              <label htmlFor="email">Email address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                placeholder="Enter your email"
                autoComplete="email"
                onChange={(e) => setemail(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <div className="password-field">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={password}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  onChange={(e) => setpassword(e.target.value)}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="auth-row">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Remember me
              </label>
              <Link to="/forgot-password" className="auth-link">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account?
            <Link to="/register">Create an account</Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Login;
