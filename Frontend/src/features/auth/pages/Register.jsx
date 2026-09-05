import React, { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../hooks/useAuth";

function passwordScore(value) {
  let score = 0;
  if (value.length >= 6) score += 1;
  if (value.length >= 10) score += 1;
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score += 1;
  if (/\d/.test(value)) score += 1;
  if (/[^A-Za-z0-9]/.test(value)) score += 1;
  return Math.min(score, 4);
}

const strengthLabels = ["Too weak", "Weak", "Okay", "Strong", "Very strong"];

const Register = () => {
  const navigate = useNavigate();
  const { handleRegister } = useAuth();

  const [email, setemail] = useState("");
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const strength = useMemo(() => passwordScore(password), [password]);

  const validate = () => {
    const next = {};

    if (!username.trim()) {
      next.username = "Username is required.";
    }

    if (!email.trim()) {
      next.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = "Enter a valid email address.";
    }

    if (!password) {
      next.password = "Password is required.";
    } else if (password.length < 6) {
      next.password = "Use at least 6 characters.";
    }

    setFieldErrors(next);
    return Object.keys(next).length === 0;
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!validate()) {
      return;
    }

    try {
      setSubmitting(true);
      await handleRegister({
        username,
        email,
        password,
      });
      navigate("/");
    } catch (err) {
      console.error("Registration error:", err);
      const errorMessage = err?.response?.data?.message || 
                         err?.message || 
                         "Registration failed. Please try again.";
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-layout">
        <aside className="auth-aside">
          <p className="eyebrow">Create account</p>
          <h2>Turn your resume into interview confidence.</h2>
          <p>
            Generate personalized interview plans, skill-gap analysis, and resume PDFs from one workspace.
          </p>
          <div className="feature-list">
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>AI-powered interview preparation</span>
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
          <h1>Create an account</h1>
          <p className="auth-lead">
            Get started with your personalized interview preparation journey.
          </p>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="alert-error">{error}</div>}

            <div className="input-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                placeholder="Choose a username"
                autoComplete="username"
                onChange={(e) => setusername(e.target.value)}
              />
              {fieldErrors.username && (
                <span className="field-error">{fieldErrors.username}</span>
              )}
            </div>

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
              {fieldErrors.email && (
                <span className="field-error">{fieldErrors.email}</span>
              )}
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <div className="password-field">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={password}
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
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
              {password && (
                <div className="password-meter" data-score={strength}>
                  <span />
                  <span />
                  <span />
                  <span />
                  <small>{strengthLabels[strength]}</small>
                </div>
              )}
              {fieldErrors.password && (
                <span className="field-error">{fieldErrors.password}</span>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account?
            <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Register;
