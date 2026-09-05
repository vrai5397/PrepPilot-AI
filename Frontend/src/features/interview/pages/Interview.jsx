import React, { useEffect, useState } from "react";
import { useInterview } from "../hooks/useinterview";
import { Link, useParams } from "react-router";

const Interview = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [openQuestion, setOpenQuestion] = useState(0);
  const [error, setError] = useState("");

  const { interviewId } = useParams();

  const { report, loading, getReport, getResumePdf } = useInterview();

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setError("");
        await getReport(interviewId);
      } catch (error) {
        console.error("Failed to fetch interview report:", error);
        setError("Unable to load interview report.");
      }
    };

    if (interviewId) {
      fetchReport();
    }
  }, [interviewId]);

  const handleGeneratePdf = async () => {
    if (!interviewId) {
      setError("Interview report ID is missing.");
      return;
    }

    try {
      setError("");
      await getResumePdf(interviewId);
    } catch (error) {
      console.error("Failed to generate resume PDF:", error);
      setError("Failed to generate resume PDF. Please try again.");
    }
  };

  if (loading) {
    return (
      <main className="interview-page">
        <div className="page-loader">
          <div className="page-loader-spinner" />
          <h2>Loading interview report…</h2>
        </div>
      </main>
    );
  }

  if (error && !report) {
    return (
      <main className="interview-page">
        <div className="interview-status">
          <div className="alert-error">{error}</div>
          <Link to="/dashboard" className="btn btn-secondary">
            Back to dashboard
          </Link>
        </div>
      </main>
    );
  }

  if (!report) {
    return (
      <main className="interview-page">
        <div className="interview-status">
          <h2>No interview report found.</h2>
          <Link to="/dashboard" className="btn btn-secondary">
            Back to dashboard
          </Link>
        </div>
      </main>
    );
  }

  const questions =
    activeSection === "technical"
      ? report.technicalQuestions || []
      : activeSection === "behavioral"
        ? report.behavioralQuestions || []
        : [];

  const toggleQuestion = (index) => {
    setOpenQuestion(openQuestion === index ? -1 : index);
  };

  const changeSection = (section) => {
    setActiveSection(section);
    setOpenQuestion(section === "roadmap" ? -1 : 0);
  };

  const getMatchScoreLabel = (score) => {
    if (score >= 80) return "Strong match";
    if (score >= 60) return "Good match";
    return "Needs improvement";
  };

  const getMatchScoreClass = (score) => {
    if (score >= 80) return "high";
    if (score >= 60) return "medium";
    return "low";
  };

  return (
    <main className="interview-page">
      <div className="report-header">
        <div className="report-header-content">
          <div className="report-header-left">
            <p className="report-eyebrow">Interview Report</p>
            <h1>{report.jobTitle || "Interview Plan"}</h1>
            {report.createdAt && (
              <p className="report-date">
                Generated {new Date(report.createdAt).toLocaleDateString()}
              </p>
            )}
          </div>
          <div className="report-header-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleGeneratePdf}
              disabled={loading}
            >
              Download PDF
            </button>
            <Link to="/dashboard" className="btn btn-secondary">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      {error && <div className="alert-error report-inline-error">{error}</div>}

      <div className="report-layout">
        <aside className="report-sidebar">
          <nav className="sidebar-nav">
            <button
              type="button"
              className={`sidebar-nav-item ${activeSection === "overview" ? "active" : ""}`}
              onClick={() => changeSection("overview")}
            >
              <span className="nav-icon">📊</span>
              <span>Overview</span>
            </button>
            <button
              type="button"
              className={`sidebar-nav-item ${activeSection === "technical" ? "active" : ""}`}
              onClick={() => changeSection("technical")}
            >
              <span className="nav-icon">💻</span>
              <span>Technical Questions</span>
            </button>
            <button
              type="button"
              className={`sidebar-nav-item ${activeSection === "behavioral" ? "active" : ""}`}
              onClick={() => changeSection("behavioral")}
            >
              <span className="nav-icon">🤝</span>
              <span>Behavioral Questions</span>
            </button>
            <button
              type="button"
              className={`sidebar-nav-item ${activeSection === "roadmap" ? "active" : ""}`}
              onClick={() => changeSection("roadmap")}
            >
              <span className="nav-icon">🗺️</span>
              <span>Preparation Roadmap</span>
            </button>
          </nav>
        </aside>

        <section className="report-content">
          {activeSection === "overview" && (
            <div className="overview-section">
              <div className="overview-grid">
                <div className="overview-card">
                  <div className="overview-card-header">
                    <h3>Match Score</h3>
                    <div className={`match-score-large match-score--${getMatchScoreClass(report.matchScore || 0)}`}>
                      {report.matchScore || 0}%
                    </div>
                  </div>
                  <p className="overview-card-text">
                    {getMatchScoreLabel(report.matchScore || 0)} for this role
                  </p>
                </div>

                <div className="overview-card">
                  <div className="overview-card-header">
                    <h3>Skill Gaps</h3>
                    <div className="skill-gaps-count">
                      {report.skillGaps?.length || 0}
                    </div>
                  </div>
                  <p className="overview-card-text">
                    Areas to focus on for interview preparation
                  </p>
                </div>

                <div className="overview-card">
                  <div className="overview-card-header">
                    <h3>Total Questions</h3>
                    <div className="questions-count">
                      {(report.technicalQuestions?.length || 0) + (report.behavioralQuestions?.length || 0)}
                    </div>
                  </div>
                  <p className="overview-card-text">
                    Technical and behavioral questions with answers
                  </p>
                </div>
              </div>

              <div className="strengths-section">
                <h3>Strengths</h3>
                <div className="strengths-list">
                  {report.strengths && report.strengths.length > 0 ? (
                    report.strengths.map((strength, index) => (
                      <div key={index} className="strength-item">
                        <span className="strength-icon">✓</span>
                        <span>{strength}</span>
                      </div>
                    ))
                  ) : (
                    <p className="no-data">No strengths identified</p>
                  )}
                </div>
              </div>

              <div className="skill-gaps-section">
                <h3>Skill Gaps</h3>
                <div className="skill-gaps-detailed">
                  {report.skillGaps && report.skillGaps.length > 0 ? (
                    report.skillGaps.map((gap, index) => (
                      <div key={index} className={`skill-gap-card skill-gap--${gap.severity || 'medium'}`}>
                        <div className="skill-gap-header">
                          <span className="skill-gap-name">{gap.skill}</span>
                          <span className={`skill-gap-severity skill-gap-severity--${gap.severity || 'medium'}`}>
                            {gap.severity || 'Medium'}
                          </span>
                        </div>
                        {gap.description && (
                          <p className="skill-gap-description">{gap.description}</p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="no-data">No skill gaps identified</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeSection === "roadmap" && (
            <div className="roadmap-section">
              <h2>Preparation Roadmap</h2>
              <p className="section-description">
                Follow this plan to close gaps against the role and improve your interview performance.
              </p>
              {report.preparationPlan && report.preparationPlan.length > 0 ? (
                <div className="roadmap-timeline">
                  {report.preparationPlan.map((item, index) => (
                    <div className="roadmap-item" key={index}>
                      <div className="roadmap-day">
                        <span className="day-number">{String(item.day || index + 1).padStart(2, "0")}</span>
                        <span className="day-label">Day</span>
                      </div>
                      <div className="roadmap-content">
                        <h3>{item.focus}</h3>
                        {item.tasks && item.tasks.length > 0 && (
                          <ul className="roadmap-tasks">
                            {item.tasks.map((task, taskIndex) => (
                              <li key={taskIndex}>{task}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-data">
                  <p>No preparation plan available.</p>
                </div>
              )}
            </div>
          )}

          {(activeSection === "technical" || activeSection === "behavioral") && (
            <div className="questions-section">
              <div className="questions-header">
                <h2>
                  {activeSection === "technical" ? "Technical Questions" : "Behavioral Questions"}
                </h2>
                <span className="question-count">
                  {questions.length} questions
                </span>
              </div>

              <div className="questions-list">
                {questions.length > 0 ? (
                  questions.map((item, index) => (
                    <div
                      className={
                        openQuestion === index
                          ? "question-card open"
                          : "question-card"
                      }
                      key={index}
                    >
                      <button
                        type="button"
                        className="question-header"
                        onClick={() => toggleQuestion(index)}
                      >
                        <div className="question-title">
                          <span className="question-number">Q{index + 1}</span>
                          <span>{item.question}</span>
                        </div>
                        <span className="question-toggle">
                          {openQuestion === index ? "−" : "+"}
                        </span>
                      </button>

                      {openQuestion === index && (
                        <div className="question-body">
                          <div className="answer-section">
                            <span className="answer-label">Intention</span>
                            <p className="answer-text">{item.intention}</p>
                          </div>
                          <div className="answer-section">
                            <span className="answer-label">Model Answer</span>
                            <p className="answer-text">{item.answer}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="no-data">
                    <p>No questions available.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default Interview;
