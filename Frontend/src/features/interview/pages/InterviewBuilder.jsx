import React, { useEffect, useRef, useState } from "react";
import { useInterview } from "../hooks/useinterview";
import { useNavigate } from "react-router";
import { useAuth } from "../../auth/hooks/useAuth";

const InterviewBuilder = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { loading, generateReport, getReports, reports } = useInterview();

  const [currentStep, setCurrentStep] = useState("resume");
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [resume, setResume] = useState(null);
  const [targetRole, setTargetRole] = useState("");
  const [interviewType, setInterviewType] = useState("technical");
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const resumeInputRef = useRef(null);

  const steps = [
    { id: "resume", label: "Resume", status: resume ? "complete" : "pending" },
    { id: "about", label: "About you", status: selfDescription ? "complete" : "pending" },
    { id: "role", label: "Target role", status: targetRole ? "complete" : "pending" },
    { id: "preferences", label: "Preferences", status: interviewType ? "complete" : "pending" },
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      e.target.value = "";
      setResume(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5 MB.");
      e.target.value = "";
      setResume(null);
      return;
    }

    setError("");
    setResume(file);
  };

  const handleGenerateReport = async (e) => {
    e.preventDefault();

    if (!jobDescription.trim()) {
      setError("Job description is required.");
      return;
    }

    if (!resume && !selfDescription.trim()) {
      setError("Please upload a resume or provide a self-description.");
      return;
    }

    try {
      setError("");
      setIsGenerating(true);

      const data = await generateReport({
        jobDescription,
        selfDescription,
        resumeFile: resume,
      });

      console.log("Interview report:", data);

      if (data && data._id) {
        navigate(`/interview/${data._id}`);
      } else if (data && data.report && data.report._id) {
        navigate(`/interview/${data.report._id}`);
      } else {
        setError("Report generated but report ID was not received.");
      }
    } catch (error) {
      console.log("Generate report error:", error);
      setError(
        error?.response?.data?.message ||
          "Failed to generate interview report."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  if (isGenerating) {
    return (
      <main className="interview-builder">
        <div className="page-loader">
          <div className="page-loader-spinner" />
          <h1>Generating your interview plan</h1>
          <p>Analyzing the job description and your profile. This can take about 30 seconds.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="interview-builder">
      <div className="builder-layout">
        <aside className="builder-sidebar">
          <div className="sidebar-header">
            <h2>YOUR PROFILE</h2>
          </div>
          <nav className="sidebar-nav">
            {steps.map((step) => (
              <button
                key={step.id}
                type="button"
                className={`sidebar-nav-item ${currentStep === step.id ? "active" : ""}`}
                onClick={() => setCurrentStep(step.id)}
              >
                <span className="step-label">{step.label}</span>
                <span className={`step-status step-status--${step.status}`} />
              </button>
            ))}
          </nav>
          <div className="sidebar-tip">
            <div className="tip-icon">💡</div>
            <p>
              <strong>Pro tip:</strong> The more context you provide, the more personalized your interview questions will be.
            </p>
          </div>
        </aside>

        <section className="builder-main">
          <div className="builder-content">
            {currentStep === "resume" && (
              <div className="step-content">
                <h2>Start with your resume</h2>
                <p className="step-description">
                  Upload your resume to extract your skills and experience for better interview preparation.
                </p>
                <div className="upload-area">
                  <label className="upload-box" htmlFor="resume">
                    <input
                      ref={resumeInputRef}
                      type="file"
                      id="resume"
                      name="resume"
                      accept=".pdf"
                      onChange={handleFileChange}
                    />
                    <div className="upload-icon">📄</div>
                    {resume ? (
                      <>
                        <strong>{resume.name}</strong>
                        <small>Click to change file</small>
                      </>
                    ) : (
                      <>
                        <strong>Drop your resume here</strong>
                        <small>PDF only - Maximum 10MB</small>
                      </>
                    )}
                  </label>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => resumeInputRef.current?.click()}
                  >
                    Browse files
                  </button>
                </div>
                <p className="upload-note">
                  Your resume is only used to generate your interview strategy.
                </p>
              </div>
            )}

            {currentStep === "about" && (
              <div className="step-content">
                <h2>Tell us about yourself</h2>
                <p className="step-description">
                  Describe your experience, skills, and background to help us personalize your interview preparation.
                </p>
                <div className="form-group">
                  <label htmlFor="selfDescription">Self-description</label>
                  <textarea
                    id="selfDescription"
                    name="selfDescription"
                    value={selfDescription}
                    onChange={(e) => setSelfDescription(e.target.value)}
                    placeholder="Describe your experience, skills, years in the field, and any notable achievements..."
                    rows={8}
                  />
                </div>
              </div>
            )}

            {currentStep === "role" && (
              <div className="step-content">
                <h2>Target role</h2>
                <p className="step-description">
                  Enter the job description for the role you're applying for to generate targeted interview questions.
                </p>
                <div className="form-group">
                  <label htmlFor="targetRole">Job title</label>
                  <input
                    type="text"
                    id="targetRole"
                    name="targetRole"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    placeholder="e.g., Senior Software Engineer"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="jobDescription">Job description</label>
                  <textarea
                    id="jobDescription"
                    name="jobDescription"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the full job description here..."
                    rows={12}
                  />
                </div>
              </div>
            )}

            {currentStep === "preferences" && (
              <div className="step-content">
                <h2>Interview preferences</h2>
                <p className="step-description">
                  Customize your interview preparation based on your preferences.
                </p>
                <div className="form-group">
                  <label htmlFor="interviewType">Interview type</label>
                  <select
                    id="interviewType"
                    name="interviewType"
                    value={interviewType}
                    onChange={(e) => setInterviewType(e.target.value)}
                  >
                    <option value="technical">Technical Interview</option>
                    <option value="behavioral">Behavioral Interview</option>
                    <option value="mixed">Mixed (Technical + Behavioral)</option>
                  </select>
                </div>
              </div>
            )}

            {error && <div className="error-message">{error}</div>}

            <div className="step-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  const currentIndex = steps.findIndex((s) => s.id === currentStep);
                  if (currentIndex > 0) {
                    setCurrentStep(steps[currentIndex - 1].id);
                  }
                }}
                disabled={steps.findIndex((s) => s.id === currentStep) === 0}
              >
                Previous
              </button>
              {currentStep === "preferences" ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleGenerateReport}
                  disabled={loading}
                >
                  {loading ? "Generating…" : "Generate Interview Plan"}
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    const currentIndex = steps.findIndex((s) => s.id === currentStep);
                    if (currentIndex < steps.length - 1) {
                      setCurrentStep(steps[currentIndex + 1].id);
                    }
                  }}
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </section>

        <aside className="builder-context">
          <div className="context-header">
            <h2>AI CONTEXT</h2>
            <p className="context-subtitle">Live profile analysis</p>
          </div>
          <div className="context-list">
            {steps.map((step) => (
              <div key={step.id} className="context-item">
                <div className="context-item-label">{step.label}</div>
                <div className={`context-item-status context-item-status--${step.status}`}>
                  {step.status === "complete" ? "✓ Ready" : "○ Waiting"}
                </div>
              </div>
            ))}
          </div>
          <div className="context-divider" />
          <div className="ai-output">
            <h3>AI WILL GENERATE</h3>
            <ul className="ai-output-list">
              <li>Match score</li>
              <li>Interview questions (technical + behavioral)</li>
              <li>Skill gaps</li>
              <li>Preparation plan</li>
            </ul>
          </div>
          <div className="context-footer">
            <div className="footer-icon">🎯</div>
            <p>
              <strong>Built around you</strong>
              <br />
              <small>The AI creates personalized interview questions based on your unique profile and the target role.</small>
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default InterviewBuilder;