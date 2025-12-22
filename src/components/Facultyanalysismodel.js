export default function FacultyAnalysisModal({ data, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="analysis-modal">

        <h2>{data.faculty_id} — Complete Faculty Analytics</h2>

        <div className="grid">
          <div className="card">Attendance: <b>{data.attendance_rate}%</b></div>
          <div className="card">Present Days: {data.present_days}</div>
          <div className="card">Absent Days: {data.absent_days}</div>
          <div className="card">Leave Days: {data.leave_days}</div>

          <div className="card">Class Efficiency: <b>{data.class_efficiency}%</b></div>
          <div className="card">Classes Taken: {data.classes_taken}</div>
          <div className="card">Missed Classes: {data.classes_missed}</div>

          <div className="card">Late Entries: {data.late_count}</div>
          <div className="card">Early Exits: {data.early_exit_count}</div>

          <div className="highlight">Performance Score: {data.performance_score}</div>
        </div>

        <h3>📊 Trends Over Time</h3>
        <pre>{JSON.stringify(data.trend, null, 2)}</pre>

        <h3>📅 Monthly Summary</h3>
        <pre>{JSON.stringify(data.monthly_summary, null, 2)}</pre>

        <h3>🔥 Heatmap (Late Pattern)</h3>
        <pre>{JSON.stringify(data.heatmap, null, 2)}</pre>

        <h3>🤖 AI Insights</h3>
        <ul>
          {data.insights.map((i, idx) => (
            <li key={idx}>{i}</li>
          ))}
        </ul>

        <button className="close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

