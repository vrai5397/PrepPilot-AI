import React, { useEffect, useState } from "react";
import { useInterview } from "../hooks/useinterview";
import { useNavigate } from "react-router";
import { useAuth } from "../../auth/hooks/useAuth";

const Reports = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { loading, getReports, reports } = useInterview();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        await getReports();
      } catch (error) {
        console.log("Failed to fetch interview reports:", error);
      }
    };

    fetchReports();
  }, []);

  const filteredReports = reports?.filter((report) => {
    const matchesSearch = 
      (report.jobTitle || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (report.createdAt || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterStatus === "all" ||
      (filterStatus === "high" && report.matchScore >= 80) ||
      (filterStatus === "medium" && report.matchScore >= 60 && report.matchScore < 80) ||
      (filterStatus === "low" && report.matchScore < 60);

    return matchesSearch && matchesFilter;
  }) || [];

  const getMatchScoreLabel = (score) => {
    if (score >= 80) return "High";
    if (score >= 60) return "Medium";
    return "Low";
  };

  const getMatchScoreClass = (score) => {
    if (score >= 80) return "high";
    if (score >= 60) return "medium";
    return "low";
  };

  return (
    <main className="reports-page">
      <div className="reports-header">
        <div>
          <h1>Interview Reports</h1>
          <p className="reports-subtitle">
            View and manage your interview preparation history
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => navigate("/interview-builder")}
        >
          + New Interview Plan
        </button>
      </div>

      <div className="reports-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>
        <div className="filter-group">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Match Scores</option>
            <option value="high">High (80%+)</option>
            <option value="medium">Medium (60-79%)</option>
            <option value="low">Low (&lt;60%)</option>
          </select>
        </div>
      </div>

      {loading && (!reports || reports.length === 0) ? (
        <div className="reports-loading">
          <div className="page-loader-spinner" />
          <p>Loading reports...</p>
        </div>
      ) : filteredReports.length > 0 ? (
        <div className="reports-grid">
          {filteredReports.map((report) => (
            <div
              key={report._id}
              className="report-card"
              onClick={() => navigate(`/interview/${report._id}`)}
            >
              <div className="report-card-header">
                <h3>{report.jobTitle || "Interview Plan"}</h3>
                <div className={`match-score-badge match-score--${getMatchScoreClass(report.matchScore || 0)}`}>
                  {report.matchScore || 0}%
                </div>
              </div>
              <div className="report-card-body">
                <div className="report-meta">
                  <div className="report-meta-item">
                    <span className="meta-icon">📅</span>
                    <span>
                      {report.createdAt
                        ? new Date(report.createdAt).toLocaleDateString()
                        : "Unknown date"}
                    </span>
                  </div>
                  <div className="report-meta-item">
                    <span className="meta-icon">📊</span>
                    <span>{getMatchScoreLabel(report.matchScore || 0)} Match</span>
                  </div>
                </div>
                <div className="report-card-footer">
                  <span className="view-report-text">View full report →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-reports">
          <div className="no-reports-icon">📋</div>
          <h3>No interview reports found</h3>
          <p>
            {searchTerm || filterStatus !== "all"
              ? "Try adjusting your search or filters"
              : "Create your first interview plan to get started"}
          </p>
          {!searchTerm && filterStatus === "all" && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => navigate("/interview-builder")}
            >
              Create Interview Plan
            </button>
          )}
        </div>
      )}
    </main>
  );
};

export default Reports;