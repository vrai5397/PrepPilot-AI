import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const { handleResetPassword, handleValidateResetToken } = useAuth();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isValidToken, setIsValidToken] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setError("Invalid reset link. Please request a new password reset.");
        setIsValidToken(false);
        return;
      }

      try {
        await handleValidateResetToken({ token });
        setIsValidToken(true);
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            "Invalid or expired reset link. Please request a new password reset."
        );
        setIsValidToken(false);
      }
    };

    validateToken();
  }, [token, handleValidateResetToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!password) {
      setError("New password is required.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setSubmitting(true);
      await handleResetPassword({
        token,
        password,
      });
      setSuccess(true);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Could not reset password. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (isValidToken === false) {
    return (
      <main className="auth-page">
        <div className="auth-layout">
          <aside className="auth-aside">
            <p className="eyebrow">Invalid link</p>
            <h2>Password reset link expired or invalid.</h2>
            <p>
              The password reset link you clicked is no longer valid. This can happen if the link has expired or has already been used.
            </p>
          </aside>
          <div className="auth-card">
            <h1>Reset Link Invalid</h1>
            <p className="auth-lead">
              {error || "The reset link has expired or is invalid."}
            </p>
            <div className="auth-actions">
              <Link to="/forgot-password" className="btn btn-primary">
                Request New Reset Link
              </Link>
              <Link to="/login" className="btn btn-secondary">
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (success) {
    return (
      <main className="auth-page">
        <div className="auth-layout">
          <aside className="auth-aside">
            <p className="eyebrow">Password reset successful</p>
            <h2>Your password has been updated.</h2>
            <p>
              You can now sign in to your account with your new password.
            </p>
          </aside>
          <div className="auth-card">
            <div className="auth-success">
              <div className="success-icon">✓</div>
              <h3>Password Reset Successful</h3>
              <p>
                Your password has been successfully updated. You can now sign in with your new password.
              </p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => navigate("/login")}
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (isValidToken === null) {
    return (
      <main className="auth-page">
        <div className="auth-layout">
          <div className="auth-card">
            <div className="page-loader">
              <div className="page-loader-spinner" />
              <p>Validating reset link...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="auth-page">
      <div className="auth-layout">
        <aside className="auth-aside">
          <p className="eyebrow">Create new password</p>
          <h2>Choose a secure password.</h2>
          <p>
            Create a new password for your PrepPilot AI account. Make sure it's something you'll remember but hard for others to guess.
          </p>
          <div className="feature-list">
            <div className="feature-item">
              <span className="feature-icon">🔒</span>
              <span>Minimum 6 characters</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🛡️</span>
              <span>Secure password hashing</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>Instant account access</span>
            </div>
          </div>
        </aside>
        <div className="auth-card">
          <h1>Reset Password</h1>
          <p className="auth-lead">
            Create a new password for your account.
          </p>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="alert-error">{error}</div>}

            <div className="input-group">
              <label htmlFor="password">New password</label>
              <div className="password-field">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
                  onChange={(e) => setPassword(e.target.value)}
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

            <div className="input-group">
              <label htmlFor="confirm">Confirm new password</label>
              <input
                type={showPassword ? "text" : "password"}
                id="confirm"
                value={confirm}
                placeholder="Re-enter new password"
                autoComplete="new-password"
                onChange={(e) => setConfirm(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? "Resetting…" : "Reset Password"}
            </button>
          </form>

          <p className="auth-switch">
            Remembered your password?
            <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default ResetPassword;
