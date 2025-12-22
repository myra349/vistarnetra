// src/components/AdminSurveillance.js
import React, { useState, useEffect, useRef } from "react";
import { FaBars, FaMoon, FaSun, FaPlay, FaPause, FaDownload } from "react-icons/fa";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import "../App.css";

// Define campus feeds & sample video URLs (simulation)
const VIDEO_FEEDS = {
  "Exam Hall": Array.from({ length: 10 }, (_, i) => `examhall-${i+1}.mp4`),
  "Corridor": Array.from({ length: 10 }, (_, i) => `corridor-${i+1}.mp4`),
  "Library": Array.from({ length: 10 }, (_, i) => `library-${i+1}.mp4`),
  "Canteen": Array.from({ length: 10 }, (_, i) => `canteen-${i+1}.mp4`),
  "Staff Room": Array.from({ length: 10 }, (_, i) => `staffroom-${i+1}.mp4`),
  "Open Area": Array.from({ length: 10 }, (_, i) => `openarea-${i+1}.mp4`)
  
};

const FEEDS = Object.keys(VIDEO_FEEDS);

// Generate random anomaly
const generateAnomaly = (feed) => {
  const types = [
    { type: "Fighting", severity: "High", desc: "Aggressive interaction" },
    { type: "Pushing", severity: "Medium", desc: "Two persons pushing" },
    { type: "Loitering", severity: "Low", desc: "Person staying idle" },
    { type: "Blocking", severity: "Medium", desc: "Path blocked by group" },
    { type: "Running", severity: "Medium", desc: "Sudden movement" },
    { type: "Fall", severity: "High", desc: "Person fell down" },
  ];
  const pick = types[Math.floor(Math.random() * types.length)];
  const persons = Math.floor(Math.random() * 4) + 1;
  const confidence = Math.round((0.7 + Math.random() * 0.3) * 100);
  return {
    id: Date.now() + "-" + Math.floor(Math.random() * 1000),
    type: pick.type,
    severity: pick.severity,
    personsInvolved: persons,
    time: new Date().toLocaleTimeString(),
    location: feed,
    confidence,
    description: `${pick.desc} near ${feed}. Estimated involved: ${persons}.`,
    bbox: Array.from({ length: persons }).map((_, i) => ({
      id: `b-${i}-${Math.floor(Math.random()*10000)}`,
      top: `${Math.floor(Math.random() * 70) + 10}%`,
      left: `${Math.floor(Math.random() * 70) + 10}%`,
      width: 80 + Math.floor(Math.random() * 60),
      height: 120 + Math.floor(Math.random() * 60),
      label: "Person",
    })),
    videoClip: VIDEO_FEEDS[feed][Math.floor(Math.random() * VIDEO_FEEDS[feed].length)]
  };
};

const Surveillance = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [detectionActive, setDetectionActive] = useState(true);
  const [currentFeed, setCurrentFeed] = useState(FEEDS[0]);
  const [currentVideos, setCurrentVideos] = useState(VIDEO_FEEDS[FEEDS[0]]);
  const [anomalies, setAnomalies] = useState([]);
  const [stats, setStats] = useState({ persons: 0, anomalies: 0, streams: FEEDS.length });
  const [chartData, setChartData] = useState([]);
  const videoRef = useRef(null);

  const playAlertSound = () => { new Audio("/alert-beep.mp3").play().catch(()=>{}); };
  const speakAlert = (msg) => { const u = new SpeechSynthesisUtterance(msg); speechSynthesis.speak(u); };

  // Simulation: generate anomalies
  useEffect(() => {
    if (!detectionActive) return;
    const interval = setInterval(() => {
      // update chart
      setChartData(prev => {
        const lastPersons = (prev.length && prev[prev.length-1].persons) || stats.persons;
        const nextPersons = Math.max(0, lastPersons + Math.floor(Math.random()*3));
        return [...prev.slice(-9), { time: new Date().toLocaleTimeString().slice(3,8), persons: nextPersons, anomalies: anomalies.length }];
      });
  
      // randomly create anomaly
      if (Math.random() < 0.35) {
        const newAnom = generateAnomaly(currentFeed);
        setAnomalies(prev => [newAnom, ...prev].slice(0,20));
        setStats(prev => ({ ...prev, anomalies: prev.anomalies+1, persons: prev.persons+newAnom.personsInvolved }));
        playAlertSound();
        speakAlert(`Alert: ${newAnom.type} in ${newAnom.location}`);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [detectionActive, currentFeed, anomalies.length, stats.persons]);

  useEffect(() => {
    setStats(prev => ({ ...prev, anomalies: anomalies.length }));
  }, [anomalies]);

  const switchFeed = (feed) => {
    setCurrentFeed(feed);
    setCurrentVideos(VIDEO_FEEDS[feed]);
    setAnomalies([]);
    setStats({ persons:0, anomalies:0, streams:FEEDS.length });
  };

  const downloadReport = () => {
    if (!anomalies.length) return alert("No anomalies to download.");
    const headers = ["id","type","severity","personsInvolved","time","location","confidence","description","bbox_count"];
    const rows = anomalies.map(a => [a.id,a.type,a.severity,a.personsInvolved,a.time,a.location,a.confidence,`"${a.description.replace(/"/g,'""')}"`,a.bbox.length].join(","));
    const csv = [headers.join(","),...rows].join("\n");
    const blob = new Blob([csv],{type:"text/csv"});
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Surveillance_Anomalies_${Date.now()}.csv`;
    link.click();
  };

  return (
    <div className={`admin-dashboard ${sidebarOpen?"sidebar-open":"sidebar-closed"} ${darkMode?"dark-mode":"light-mode"}`}>
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header"><h2>Admin Panel</h2><FaBars onClick={()=>setSidebarOpen(!sidebarOpen)} /></div>
        <ul>
          {FEEDS.map(feed => <li key={feed} className={feed===currentFeed?"active":""} onClick={()=>switchFeed(feed)}>{feed}</li>)}
        </ul>
        <div className="theme-switcher" onClick={()=>setDarkMode(!darkMode)}>{darkMode?<><FaSun/> Light</>:<><FaMoon/> Dark</>}</div>
      </aside>

      <main className="main-content">
        <h2>AI Surveillance Monitoring</h2>
        <p>Monitoring <b>{currentFeed}</b> in real-time with YOLOv8 (simulated).</p>

        {/* Controls */}
        <div className="admin-controls">
          <button onClick={()=>setDetectionActive(!detectionActive)}>{detectionActive?<><FaPause/> Pause</>:<><FaPlay/> Start</>}</button>
          <button onClick={downloadReport}><FaDownload/> Download Report</button>
        </div>

        {/* Stats */}
        <div className="stats-summary">
          <div className="stat-card"><div>Persons</div><div>{stats.persons}</div></div>
          <div className="stat-card"><div>Anomalies</div><div>{stats.anomalies}</div></div>
          <div className="stat-card"><div>Streams</div><div>{stats.streams}</div></div>
        </div>

        {/* Chart */}
        <div className="chart-section">
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={chartData}>
              <XAxis dataKey="time"/>
              <YAxis/>
              <Tooltip/>
              <Line type="monotone" dataKey="persons" stroke="#3b82f6" strokeWidth={2}/>
              <Line type="monotone" dataKey="anomalies" stroke="#ef4444" strokeWidth={2}/>
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Videos */}
        <div className="video-grid">
          {currentVideos.map((v,i)=><video key={i} src={v} controls width="300" height="180" autoPlay muted loop/>)}
        </div>

        {/* Anomalies list */}
        <div className="anomalies-list">
          {anomalies.length===0?<p>No anomalies detected yet.</p>:anomalies.map(a=>(
            <div key={a.id} className="anomaly-card">
              <div>{a.type} • {a.time} • {a.location}</div>
              <div>{a.description}</div>
              <div>
                <button onClick={()=>{ if(videoRef.current){videoRef.current.src=a.videoClip; videoRef.current.play().catch(()=>{}); } }}>Play Clip</button>
                <button onClick={()=>setAnomalies(prev=>prev.filter(an=>an.id!==a.id))}>Resolve</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Surveillance;









