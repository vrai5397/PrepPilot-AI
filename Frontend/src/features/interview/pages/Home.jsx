import React, { useEffect, useRef, useState } from "react";
import { useInterview } from "../hooks/useinterview";
import { useNavigate } from "react-router";
import { useAuth } from "../../auth/hooks/useAuth";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { loading, generateReport, getReports, reports } = useInterview();

  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [resume, setResume] = useState(null);
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const resumeInputRef = useRef(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        await getReports();
      } catch (error) {
        console.log("Failed to fetch previous interview reports:", error);
      }
    };

    fetchReports();
  }, []);

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

  const calculateAverageMatchScore = () => {
    if (!reports || reports.length === 0) return 0;
    const total = reports.reduce((sum, report) => sum + (report.matchScore || 0), 0);
    return Math.round(total / reports.length);
  };

  if (isGenerating) {
    return (
      <main className="dashboard">
        <div className="page-loader">
          <div className="page-loader-spinner" />
          <h1>Generating your interview plan</h1>
          <p>Analyzing the job description and your profile. This can take about 30 seconds.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="dashboard">
      <section className="dashboard-header">
        <div>
          <h1>
            Welcome back, {user?.username || "User"}
          </h1>
          <p className="dashboard-subtitle">
            Ready for your next interview?
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => navigate("/interview-builder")}
        >
          + Prepare Interview
        </button>
      </section>

      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon stat-icon--violet">
            <span>📋</span>
          </div>
          <div className="stat-content">
            <div className="stat-value">{reports?.length || 0}</div>
            <div className="stat-label">Interview Plans</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon--cyan">
            <span>📊</span>
          </div>
          <div className="stat-content">
            <div className="stat-value">{calculateAverageMatchScore()}%</div>
            <div className="stat-label">Average Match Score</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon stat-icon--amber">
            <span>📄</span>
          </div>
          <div className="stat-content">
            <div className="stat-value">{reports?.length || 0}</div>
            <div className="stat-label">Reports</div>
          </div>
        </div>
      </section>

      <section className="dashboard-section">
        <div className="section-header">
          <h2>Recent Reports</h2>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/reports")}
          >
            View All
          </button>
        </div>

        {loading && (!reports || reports.length === 0) ? (
          <div className="no-reports">
            <p>Loading reports…</p>
          </div>
        ) : reports && reports.length > 0 ? (
          <div className="reports-grid">
            {reports.slice(0, 6).map((report) => (
              <div
                key={report._id}
                className="report-card"
                onClick={() => navigate(`/interview/${report._id}`)}
              >
                <div className="report-card-header">
                  <h3>{report.jobTitle || "Interview Plan"}</h3>
                  <div className={`match-score-badge match-score-${report.matchScore >= 80 ? 'high' : report.matchScore >= 60 ? 'medium' : 'low'}`}>
                    {report.matchScore ?? 0}%
                  </div>
                </div>
                <div className="report-card-body">
                  <p className="report-date">
                    {report.createdAt
                      ? new Date(report.createdAt).toLocaleDateString()
                      : "Unknown date"}
                  </p>
                  <div className="report-actions">
                    <span className="report-action">View report →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-reports">
            <div className="no-reports-icon">📋</div>
            <h3>No interview plans yet</h3>
            <p>Create your first interview plan to get started with personalized preparation.</p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => navigate("/interview-builder")}
            >
              Create Interview Plan
            </button>
          </div>
        )}
      </section>

      <section className="dashboard-section">
        <div className="section-header">
          <h2>Quick Actions</h2>
        </div>
        <div className="quick-actions-grid">
          <button
            type="button"
            className="quick-action-card"
            onClick={() => navigate("/interview-builder")}
          >
            <div className="quick-action-icon">🎯</div>
            <h3>New Interview Plan</h3>
            <p>Create a new interview preparation plan</p>
          </button>
          <button
            type="button"
            className="quick-action-card"
            onClick={() => navigate("/reports")}
          >
            <div className="quick-action-icon">📊</div>
            <h3>View All Reports</h3>
            <p>Browse your interview preparation history</p>
          </button>
          <button
            type="button"
            className="quick-action-card"
            onClick={() => navigate("/profile")}
          >
            <div className="quick-action-icon">👤</div>
            <h3>Update Profile</h3>
            <p>Manage your account settings</p>
          </button>
        </div>
      </section>
    </main>
  );
};

export default Home;
