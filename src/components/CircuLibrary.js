import React, { useState, useEffect, useRef } from "react";


/* ===== USERS ===== */
const STUDENTS = ["Ravi", "Sita", "Rahul", "Ananya", "Vikram", "Neha", "Aditya"];
const FACULTY = ["Prof. Anil", "Dr. Meera", "Prof. Kiran", "Dr. Sushma"];
const CENTRAL = ["John", "Mary", "Ramesh"];

/* ===== QUERY CATEGORIES & PRIORITIES ===== */
const categories = ["Exams", "Facilities", "Library", "Lab", "Sports", "Events", "Fees"];
const priorities = ["High", "Medium", "Low"];

/* ===== SPECIFIC ISSUES ===== */
const issueMap = {
  Exams: [
    "Exam hall allotment incorrect",
    "Timetable clash found",
    "Marks not updated",
    "Re-evaluation request",
    "Hall ticket not generated"
  ],
  Library: [
    "Books not available",
    "Reading room full",
    "Library access not working",
    "E-resources down",
    "WiFi weak inside library"
  ],
  Facilities: [
    "Water cooler not working",
    "Restroom unclean",
    "AC not working",
    "Broken bench in corridor",
    "Electricity fluctuation"
  ],
  Lab: [
    "Computer not booting",
    "Network down",
    "Equipment missing",
    "Software license expired",
    "Server offline"
  ],
  Sports: [
    "Gym treadmill broken",
    "Cricket kit missing",
    "Ground booking conflict",
    "Coach unavailable",
    "Sports shoes not issued"
  ],
  Events: [
    "Registration link broken",
    "Event timing unclear",
    "Venue change not updated",
    "ID card requirement unclear",
    "Certificate not issued"
  ],
  Fees: [
    "Wrong late fee added",
    "Fee receipt missing",
    "Scholarship delayed",
    "Payment failed",
    "Excess deduction"
  ]
};

/* ===== FOLLOW-UP CHAT MESSAGES ===== */
const followUps = issueMap;

/* ===== GENERATE 50–75 DYNAMIC QUERIES ===== */
const generateQueries = (num = 60) => {
  const queries = [];
  for (let i = 1; i <= num; i++) {
    const roleRand = Math.random();
    let userRole = "student",
      userName = STUDENTS[Math.floor(Math.random() * STUDENTS.length)];
    if (roleRand > 0.7) {
      userRole = "faculty";
      userName = FACULTY[Math.floor(Math.random() * FACULTY.length)];
    } else if (roleRand > 0.9) {
      userRole = "central";
      userName = CENTRAL[Math.floor(Math.random() * CENTRAL.length)];
    }

    const category = categories[Math.floor(Math.random() * categories.length)];
    const issue = issueMap[category][Math.floor(Math.random() * issueMap[category].length)];

    queries.push({
      id: i,
      title: `Query #${i}: ${category}`,
      category,
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      status: ["Pending", "In Progress", "Resolved"][Math.floor(Math.random() * 3)],
      desc: `${userName} reports: ${issue}`,
      userRole,
      userName,
      createdAt: new Date(Date.now() - Math.random() * 1000000000).toISOString(),
      messages: [
        {
          from: userName,
          text: `Hello Admin, ${issue}`,
          time: new Date().toLocaleTimeString(),
        },
      ],
    });
  }
  return queries;
};

export default function CampusDashboard() {
  const [queries, setQueries] = useState(
    () => JSON.parse(localStorage.getItem("campus_queries")) || generateQueries(60)
  );
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [chatMessage, setChatMessage] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const confRef = useRef(null);
  const chatEndRef = useRef(null);

  /* ===== SAVE TO LOCAL STORAGE ===== */
  useEffect(() => {
    localStorage.setItem("campus_queries", JSON.stringify(queries));
  }, [queries]);

  /* ===== AUTO SCROLL CHAT ===== */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedQuery, queries]);

  /* ===== USER REAL-TIME FOLLOW-UP MESSAGE SIMULATION ===== */
  useEffect(() => {
    if (!selectedQuery) return;

    const interval = setInterval(() => {
      const msgs = followUps[selectedQuery.category];
      const randomMsg = msgs[Math.floor(Math.random() * msgs.length)];

      const msg = {
        from: selectedQuery.userName,
        text: randomMsg,
        time: new Date().toLocaleTimeString(),
      };

      setQueries((prev) =>
        prev.map((q) =>
          q.id === selectedQuery.id ? { ...q, messages: [...q.messages, msg] } : q
        )
      );
    }, 9000);

    return () => clearInterval(interval);
  }, [selectedQuery]);

  /* ===== CONFETTI ===== */
  const spawnConfetti = (container, n = 40) => {
    if (!container) return;
    const colors = ["#FF3B30", "#FF9500", "#FFCC00", "#34C759", "#5AC8FA", "#5856D6"];
    for (let i = 0; i < n; i++) {
      const el = document.createElement("div");
      el.className = "ap-conf";
      el.style.left = Math.random() * 100 + "%";
      el.style.background = colors[Math.floor(Math.random() * colors.length)];
      el.style.width = 6 + Math.random() * 10 + "px";
      el.style.height = 8 + Math.random() * 14 + "px";
      container.appendChild(el);
      setTimeout(() => el.remove(), 3500 + Math.random() * 1000);
    }
  };

  /* ===== STATUS UPDATE ===== */
  const updateStatus = (q, status) => {
    setQueries((prev) => prev.map((x) => (x.id === q.id ? { ...x, status } : x)));
    spawnConfetti(confRef.current, 30);
  };

  /* ===== ADMIN SEND MESSAGE ===== */
  const sendMessage = () => {
    if (!chatMessage.trim() || !selectedQuery) return;

    const msg = {
      from: "Admin",
      text: chatMessage,
      time: new Date().toLocaleTimeString(),
    };

    setQueries((prev) =>
      prev.map((q) =>
        q.id === selectedQuery.id ? { ...q, messages: [...q.messages, msg] } : q
      )
    );

    setChatMessage("");
  };

  /* ===== ANALYTICS ===== */
  const total = queries.length;
  const pending = queries.filter((q) => q.status === "Pending").length;
  const inProgress = queries.filter((q) => q.status === "In Progress").length;
  const resolved = queries.filter((q) => q.status === "Resolved").length;
  const studentsCount = queries.filter((q) => q.userRole === "student").length;
  const facultyCount = queries.filter((q) => q.userRole === "faculty").length;
  const centralCount = queries.filter((q) => q.userRole === "central").length;

  return (
    <div className="campus-root">
      <div className="campus-header">
        <h2>Campus Query Dashboard</h2>
      </div>

      {/* ===== ANALYTICS CARDS ===== */}
      <div className="campus-analytics">
        <div className="card">Total<br/><strong>{total}</strong></div>
        <div className="card pending">Pending<br/><strong>{pending}</strong></div>
        <div className="card inprogress">In Progress<br/><strong>{inProgress}</strong></div>
        <div className="card resolved">Resolved<br/><strong>{resolved}</strong></div>
        <div className="card student">Students<br/><strong>{studentsCount}</strong></div>
        <div className="card faculty">Faculty<br/><strong>{facultyCount}</strong></div>
        <div className="card central">Central Team<br/><strong>{centralCount}</strong></div>
      </div>

      {/* ===== MAIN LAYOUT ===== */}
      <div className="campus-main">

        {/* ===== QUERY LIST ===== */}
        <div className="campus-left">
          <h3>All Queries</h3>

          {queries.map((q) => (
            <div key={q.id} className={`query-card ${q.priority.toLowerCase()}`}>
              <div className="query-header">
                <h4>{q.title}</h4>
                <span>{q.status}</span>
              </div>
              <small>
                {q.userRole} • {q.userName} • {q.createdAt.slice(0, 10)}
              </small>
              <p>{q.desc}</p>

              <button onClick={() => { setSelectedQuery(q); setChatOpen(true); }}>
                Open Chat
              </button>

              <div className="query-actions">
                <select value={q.status} onChange={(e) => updateStatus(q, e.target.value)}>
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Resolved</option>
                </select>
              </div>
            </div>
          ))}
        </div>

        {/* ===== CHAT PANEL ===== */}
        <div className={`campus-right ${chatOpen ? "open" : "closed"}`}>
          {selectedQuery && chatOpen ? (
            <div className="chat-panel">
              <div className="chat-header">
                Chat with {selectedQuery.userName}
                <button className="chat-close" onClick={() => setChatOpen(false)}>✖</button>
              </div>

              <div className="chat-box">
                {selectedQuery.messages.map((m, i) => (
                  <div key={i} className={`msg ${m.from === "Admin" ? "self" : "other"}`}>
                    <strong>{m.from}</strong>: {m.text} <small>{m.time}</small>
                  </div>
                ))}
                <div ref={chatEndRef}></div>
              </div>

              <div className="chat-input">
                <input
                  placeholder="Type message..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}
                />
                <button onClick={sendMessage}>Send</button>
              </div>
            </div>
          ) : (
            <p>Select a query to chat</p>
          )}
        </div>
      </div>

      {/* CONFETTI */}
      <div ref={confRef} className="confetti-wrap" />
    </div>
  );
}




