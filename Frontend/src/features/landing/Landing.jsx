import React from "react";
import { Link } from "react-router";

const Landing = () => {
  return (
    <main className="landing">
      <section className="hero">
        <div className="hero-layout">
          <div className="hero-left">
            <div className="hero-badge">
              <span className="badge-icon">🎯</span>
              Your personal AI interview coach
            </div>
            <h1>
              Practice smarter.<br />
              <span className="highlight">Interview stronger.</span>
            </h1>
            <p className="hero-description">
              Upload your resume, define your target role, and receive personalized mock interviews, 
              skill-gap analysis, and preparation plans designed specifically for your career goals.
            </p>
            <div className="hero-actions">
              <Link to="/register" className="btn btn-primary">
                Start Interview Prep →
              </Link>
              <Link to="/login" className="btn btn-secondary">
                View Sample Report
              </Link>
            </div>
            <div className="hero-trust">
              <div className="trust-item">
                <span className="trust-icon">✓</span>
                <span>Role-specific interview questions</span>
              </div>
              <div className="trust-item">
                <span className="trust-icon">✓</span>
                <span>Instant AI feedback</span>
              </div>
              <div className="trust-item">
                <span className="trust-icon">✓</span>
                <span>Personalized preparation roadmap</span>
              </div>
              <div className="trust-item">
                <span className="trust-icon">✓</span>
                <span>Skill-gap identification</span>
              </div>
            </div>
          </div>
          <div className="hero-right">
            <div className="dashboard-preview">
              <div className="dashboard-header">
                <div className="dashboard-title">Interview Readiness Dashboard</div>
                <div className="dashboard-status">Live Analysis</div>
              </div>
              <div className="dashboard-stats">
                <div className="stat-card">
                  <div className="stat-label">Resume Match</div>
                  <div className="stat-value">87%</div>
                  <div className="stat-bar">
                    <div className="stat-fill" style={{ width: '87%' }}></div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Technical Questions</div>
                  <div className="stat-value">24</div>
                  <div className="stat-sub">Generated</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Behavioral Questions</div>
                  <div className="stat-value">15</div>
                  <div className="stat-sub">Generated</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Preparation Score</div>
                  <div className="stat-value">82%</div>
                  <div className="stat-bar">
                    <div className="stat-fill" style={{ width: '82%' }}></div>
                  </div>
                </div>
              </div>
              <div className="dashboard-readiness">
                <div className="readiness-label">Interview Readiness</div>
                <div className="readiness-value">High</div>
                <div className="readiness-indicator">
                  <div className="indicator-dot active"></div>
                  <div className="indicator-dot active"></div>
                  <div className="indicator-dot active"></div>
                  <div className="indicator-dot"></div>
                </div>
              </div>
            </div>
            <div className="floating-card card-1">
              <div className="card-icon">📄</div>
              <div className="card-label">Resume Analysis</div>
            </div>
            <div className="floating-card card-2">
              <div className="card-icon">🤖</div>
              <div className="card-label">AI Feedback</div>
            </div>
            <div className="floating-card card-3">
              <div className="card-icon">🎯</div>
              <div className="card-label">Skill Gap Detection</div>
            </div>
            <div className="floating-card card-4">
              <div className="card-icon">💬</div>
              <div className="card-label">Mock Interview</div>
            </div>
          </div>
        </div>
      </section>

      <section className="how" id="how">
        <div className="section-header">
          <h2>How it works</h2>
          <p>Three steps from job post to a practice plan.</p>
        </div>
        <div className="how-grid">
          <article className="how-card">
            <div className="how-number">01</div>
            <h3>Add the role</h3>
            <p>Paste the job description you are applying for.</p>
          </article>
          <article className="how-card">
            <div className="how-number">02</div>
            <h3>Share your profile</h3>
            <p>Upload a PDF resume or write a short self-description.</p>
          </article>
          <article className="how-card">
            <div className="how-number">03</div>
            <h3>Generate the plan</h3>
            <p>Review questions, gaps, a roadmap, and export a resume PDF.</p>
          </article>
        </div>
      </section>

      <section className="features" id="features">
        <div className="section-header">
          <h2>Features</h2>
          <p>Everything in PrepPilot AI is available after you create an account.</p>
        </div>
        <div className="feature-grid">
          <article className="feature-card">
            <h3>AI interview preparation</h3>
            <p>
              Paste a job description and your profile to generate targeted
              technical and behavioral questions.
            </p>
          </article>
          <article className="feature-card">
            <h3>Resume generation</h3>
            <p>
              Upload a PDF resume for analysis, then download a generated resume
              PDF from your interview report.
            </p>
          </article>
          <article className="feature-card">
            <h3>Interview reports</h3>
            <p>
              Review match score, skill gaps, model answers, and a preparation
              roadmap for each plan you create.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
};

export default Landing;
