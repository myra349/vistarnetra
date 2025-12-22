import React, { useState } from "react";
import axios from "axios";

// Sample 30 students with extended parameters
const students = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  name: `Student ${i + 1}`,
  roll: `CSE${100 + i}`,
  attendance: {
    total: 100,
    present: Math.floor(Math.random() * 41) + 60 // 60–100
  },
  semesterMarks: [
    {
      sem: 1,
      marks: {
        Math: Math.floor(Math.random() * 30 + 60),
        CS: Math.floor(Math.random() * 30 + 60),
        Eng: Math.floor(Math.random() * 30 + 60),
      },
    },
    {
      sem: 2,
      marks: {
        Math: Math.floor(Math.random() * 30 + 60),
        CS: Math.floor(Math.random() * 30 + 60),
        Eng: Math.floor(Math.random() * 30 + 60),
      },
    },
  ],
  behaviour: {
    punctuality: Math.floor(Math.random() * 5 + 6), // 6–10
    discipline: Math.floor(Math.random() * 5 + 6),
    participation: Math.floor(Math.random() * 5 + 6),
  },
  skills: {
    problemSolving: Math.floor(Math.random() * 5 + 6), // 6–10
    communication: Math.floor(Math.random() * 5 + 6),
    teamwork: Math.floor(Math.random() * 5 + 6),
  },
  activities: {
    sports: Math.floor(Math.random() * 11), // 0–10
    cultural: Math.floor(Math.random() * 11),
    clubs: Math.floor(Math.random() * 11),
  },
  facultyFeedback: [
    "Excellent problem-solving",
    "Needs focus in theory",
    "Good participation in class",
  ],
}));

export default function SuperStudentDashboard() {
  const [selected, setSelected] = useState(students[0]);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const attPerc = (s) =>
    ((s.attendance.present / s.attendance.total) * 100).toFixed(1);

  const avgMarks = (s) => {
    let total = 0,
      count = 0;
    s.semesterMarks.forEach((sem) =>
      Object.values(sem.marks).forEach((m) => {
        total += m;
        count++;
      })
    );
    return (total / count).toFixed(1);
  };

  const behScore = (s) => {
    const vals = Object.values(s.behaviour);
    return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1);
  };

  const barColor = (val) =>
    val < 50 ? "#ff4d4f" : val < 75 ? "#faad14" : "#52c41a";

  const simplePrediction = (s) => {
    const warnings = [];
    if (attPerc(s) < 75) warnings.push("Improve Attendance");
    if (avgMarks(s) < 70) warnings.push("Academic Improvement Needed");
    if (behScore(s) < 7) warnings.push("Behaviour Mentoring Suggested");
    return warnings.length ? warnings.join(" | ") : "Excellent Progress!";
  };

  const runAnalysis = async () => {
  try {
    setLoading(true);
    const res = await axios.post(
      "http://localhost:8000/analyze_student",
      selected,
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000, // 10 sec timeout safety
      }
    );
    setAnalysis(res.data);
  } catch (err) {
    console.error("Analysis failed:", err);
    alert("Analysis failed. Backend not responding.");
  } finally {
    setLoading(false);
  }
};
  return (
    <div
      style={{
        display: "flex",
        fontFamily: "Segoe UI, sans-serif",
        height: "100vh",
        background: "#f0f2f5",
      }}
    >
      {/* Left Sidebar */}
      <div
        style={{
          width: "260px",
          borderRight: "2px solid #ccc",
          padding: "10px",
          overflowY: "scroll",
          background: "#001529",
          color: "#fff",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Students</h2>
        {students.map((s) => (
          <div
            key={s.id}
            onClick={() => {
              setSelected(s);
              setAnalysis(null);
            }}
            style={{
              padding: "10px",
              marginBottom: "8px",
              borderRadius: "8px",
              cursor: "pointer",
              background: selected.id === s.id ? "#1890ff" : "transparent",
              transition: "0.3s",
            }}
          >
            <strong>{s.name}</strong>
            <br />
            <small>{s.roll}</small>
          </div>
        ))}
      </div>

      {/* Right Panel */}
      <div style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
        <h1>
          {selected.name} ({selected.roll})
        </h1>

        {/* Overview Cards */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
            gap: "15px",
          }}
        >
          <Card
            title="Attendance"
            value={`${attPerc(selected)}%`}
            color={barColor(attPerc(selected))}
          />
          <Card
            title="Average Marks"
            value={avgMarks(selected)}
            color={barColor(avgMarks(selected))}
          />
          <Card
            title="Behaviour Score"
            value={behScore(selected)}
            color={barColor(behScore(selected))}
          />
        </div>

        {/* Semester Marks */}
        <h2>Semester Marks</h2>
        {selected.semesterMarks.map((sem, idx) => (
          <div key={idx} style={{ marginBottom: "15px" }}>
            <h3>Semester {sem.sem}</h3>
            <div style={{ display: "flex", gap: "10px" }}>
              {Object.entries(sem.marks).map(([sub, mark]) => (
                <div
                  key={sub}
                  style={{
                    flex: 1,
                    padding: "10px",
                    background: "#fff",
                    borderRadius: "8px",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                  }}
                >
                  <strong>{sub}</strong>
                  <div
                    style={{
                      height: "10px",
                      background: "#f0f0f0",
                      borderRadius: "5px",
                      marginTop: "5px",
                    }}
                  >
                    <div
                      style={{
                        width: `${mark}%`,
                        height: "100%",
                        background: barColor(mark),
                        borderRadius: "5px",
                        transition: "0.5s",
                      }}
                    ></div>
                  </div>
                  <small>{mark}</small>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Behaviour Traits */}
        <h2>Behaviour Traits</h2>
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          {Object.entries(selected.behaviour).map(([k, v]) => (
            <div
              key={k}
              style={{
                flex: 1,
                padding: "10px",
                background: "#fff",
                borderRadius: "8px",
                textAlign: "center",
              }}
            >
              <strong>{k}</strong>
              <div
                style={{
                  width: "100%",
                  height: "10px",
                  background: "#f0f0f0",
                  borderRadius: "5px",
                  marginTop: "5px",
                }}
              >
                <div
                  style={{
                    width: `${v * 10}%`,
                    height: "100%",
                    background: barColor(v * 10),
                    borderRadius: "5px",
                    transition: "0.5s",
                  }}
                ></div>
              </div>
              <small>{v}/10</small>
            </div>
          ))}
        </div>

        {/* Skills Visual */}
        <h2>Skills Overview</h2>
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          {Object.entries(selected.skills).map(([k, v]) => (
            <div
              key={k}
              style={{
                flex: 1,
                padding: "10px",
                background: "#fff",
                borderRadius: "8px",
                textAlign: "center",
              }}
            >
              <strong>{k}</strong>
              <div
                style={{
                  width: "100%",
                  height: "10px",
                  background: "#f0f0f0",
                  borderRadius: "5px",
                  marginTop: "5px",
                }}
              >
                <div
                  style={{
                    width: `${v * 10}%`,
                    height: "100%",
                    background: barColor(v * 10),
                    borderRadius: "5px",
                    transition: "0.5s",
                  }}
                ></div>
              </div>
              <small>{v}/10</small>
            </div>
          ))}
        </div>

        {/* Faculty Feedback */}
        <h2>Faculty Feedback</h2>
        <ul
          style={{
            background: "#fff",
            padding: "15px",
            borderRadius: "10px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          {selected.facultyFeedback.map((f, i) => (
            <li key={i}>{f}</li>
          ))}
        </ul>

        {/* Prediction / Mentoring (simple) */}
        <h2 style={{ marginTop: "20px" }}>Quick Prediction / Mentoring Hint</h2>
        <div
          style={{
            padding: "15px",
            borderRadius: "10px",
            background: simplePrediction(selected).includes("Improve")
              ? "#fff1f0"
              : "#f6ffed",
            border: simplePrediction(selected).includes("Improve")
              ? "1px solid #ff4d4f"
              : "1px solid #52c41a",
            color: simplePrediction(selected).includes("Improve")
              ? "#cf1322"
              : "#389e0d",
            fontWeight: "bold",
          }}
        >
          {simplePrediction(selected)}
        </div>

        {/* RUN AI ANALYSIS BUTTON */}
        <button
          onClick={runAnalysis}
          disabled={loading}
          style={{
            marginTop: "15px",
            padding: "10px 15px",
            background: "#1890ff",
            border: "none",
            color: "white",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          {loading ? "Analyzing..." : "Run AI Analysis & Generate Report"}
        </button>

        {/* ANALYSIS RESULT */}
        {analysis && (
          <div
            style={{
              marginTop: "20px",
              padding: "18px",
              background: "#fff",
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <h2>AI Analysis Summary</h2>

            {/* Visual metrics */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
              <MetricBar
                label="Overall Score"
                value={analysis.metrics.overallScore}
              />
              <MetricBar
                label="Predicted Next Score"
                value={analysis.metrics.predictedNext}
              />
              <MetricBar
                label="Academic Score"
                value={analysis.metrics.academicScore}
              />
            </div>

            <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
              <MetricBar
                label="Attendance Score"
                value={analysis.metrics.attendanceScore}
              />
              <MetricBar
                label="Behaviour Score"
                value={analysis.metrics.behaviourScore}
              />
              <MetricBar
                label="Skills Score"
                value={analysis.metrics.skillScore}
              />
            </div>

            <p>
              <strong>Cluster:</strong> {analysis.metrics.cluster} &nbsp; |{" "}
              <strong>Risk Level:</strong> {analysis.metrics.riskLevel} &nbsp; |{" "}
              <strong>Feedback Sentiment:</strong>{" "}
              {analysis.metrics.feedbackSentiment}
            </p>

            <h3>Strengths</h3>
            <ul>
              {analysis.strengths.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>

            <h3>Improvement Areas</h3>
            <ul>
              {analysis.improvements.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>

            <h3>AI Generated Report</h3>
            <p style={{ lineHeight: "1.6" }}>{analysis.paragraph1}</p>
            <p style={{ lineHeight: "1.6", marginTop: "10px" }}>
              {analysis.paragraph2}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Simple metric bar visual
const MetricBar = ({ label, value }) => {
  const val = Number(value) || 0;
  const color = val < 50 ? "#ff4d4f" : val < 75 ? "#faad14" : "#52c41a";

  return (
    <div
      style={{
        flex: 1,
        padding: "10px",
        background: "#fafafa",
        borderRadius: "8px",
        border: "1px solid #e5e5e5",
      }}
    >
      <strong>{label}</strong>
      <div
        style={{
          height: "10px",
          background: "#f0f0f0",
          borderRadius: "5px",
          marginTop: "6px",
        }}
      >
        <div
          style={{
            width: `${val}%`,
            height: "100%",
            background: color,
            borderRadius: "5px",
            transition: "0.5s",
          }}
        ></div>
      </div>
      <small>{val.toFixed(1)} / 100</small>
    </div>
  );
};

const Card = ({ title, value, color }) => (
  <div
    style={{
      flex: 1,
      padding: "15px",
      background: "#fff",
      borderRadius: "10px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      textAlign: "center",
    }}
  >
    <h3>{title}</h3>
    <div style={{ fontSize: "24px", fontWeight: "bold", color }}>{value}</div>
    <div
      style={{
        height: "8px",
        background: "#f0f0f0",
        borderRadius: "4px",
        marginTop: "10px",
      }}
    >
      <div
        style={{
          width: typeof value === "string" && value.includes("%")
            ? value
            : `${value}%`,
          height: "100%",
          background: color,
          borderRadius: "4px",
          transition: "0.5s",
        }}
      ></div>
    </div>
  </div>
);
;



