import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { handleForgotPassword } = useAuth();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setSubmitting(true);
      await handleForgotPassword({ email: email.trim() });
      setSuccess(true);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Could not send password reset email. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-layout">
        <aside className="auth-aside">
          <p className="eyebrow">Forgot your password?</p>
          <h2>Reset your password in seconds.</h2>
          <p>
            Enter your registered email and we'll send you a secure password reset link.
          </p>
          <div className="feature-list">
            <div className="feature-item">
              <span className="feature-icon">🔒</span>
              <span>Secure email delivery</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">⏱️</span>
              <span>30-minute link expiration</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>Quick password reset</span>
            </div>
          </div>
        </aside>
        <div className="auth-card">
          <h1>Reset Password</h1>
          <p className="auth-lead">
            Enter your email address to receive a password reset link.
          </p>

          {success ? (
            <div className="auth-success">
              <div className="success-icon">📧</div>
              <h3>Check your email</h3>
              <p>
                If an account exists for {email}, a password reset link has been sent to your inbox.
              </p>
              <p className="success-note">
                The link expires in 30 minutes. Don't forget to check your spam folder.
              </p>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/login")}
              >
                Back to Login
              </button>
            </div>
          ) : (
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
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? "Sending reset link…" : "Send reset link"}
              </button>
            </form>
          )}

          <p className="auth-switch">
            Remembered your password?
            <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default ForgotPassword;
