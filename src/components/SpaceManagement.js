import React, { useState, useEffect } from "react";
import {
  FaBars,
  FaSun,
  FaMoon,
  FaUserShield,
  FaExclamationTriangle,
  FaVideo,
  FaDoorOpen,
 
  FaPlay,
  FaPause
} from "react-icons/fa";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import "../App.css";

const AdminDashboard = () => {
  // Sidebar + Theme
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  // Surveillance state
  const [aiActive, setAiActive] = useState(true);
  const [stats, setStats] = useState({ persons: 25, anomalies: 2, streams: 2 });
  const [alerts, setAlerts] = useState([]);
  const [boundingBoxes, setBoundingBoxes] = useState([
    { id: 1, top: "25%", left: "35%", width: 120, height: 100, label: "Person" },
    { id: 2, top: "60%", left: "55%", width: 90, height: 80, label: "Bag" }
  ]);

  // Space Management state
  const [rooms, setRooms] = useState([
    { id: 1, name: "Exam Hall 1", capacity: 100, occupied: 72 },
    { id: 2, name: "Canteen", capacity: 50, occupied: 28 },
    { id: 3, name: "Corridor A", capacity: 80, occupied: 45 }
  ]);

  // Graph data
  const [graphData, setGraphData] = useState([]);

  // Simulate surveillance
  useEffect(() => {
    if (!aiActive) return;
    const interval = setInterval(() => {
      setStats(prev => ({
        persons: prev.persons + Math.floor(Math.random()*3),
        anomalies: prev.anomalies + Math.floor(Math.random()*2),
        streams: prev.streams
      }));
      if(Math.random() < 0.4){
        const newAlert = `⚠️ Anomaly detected at ${new Date().toLocaleTimeString()}`;
        setAlerts(prev => [newAlert, ...prev.slice(0,4)]);
        const alertSound = new Audio("/alert-beep.mp3");
        alertSound.play().catch(()=>{});
      }
      setBoundingBoxes(prev => prev.map(box => ({
        ...box,
        top:`${Math.floor(Math.random()*60)+10}%`,
        left:`${Math.floor(Math.random()*70)+10}%`
      })));
    },4000);
    return () => clearInterval(interval);
  },[aiActive]);

  // Simulate space occupancy
  useEffect(()=>{
    const interval = setInterval(()=>{
      setRooms(prev=> prev.map(room=>{
        let change = Math.floor(Math.random()*5)-2;
        let newOcc = Math.max(0, Math.min(room.capacity, room.occupied + change));
        if(newOcc > room.capacity*0.9 && Math.random()<0.5){
          setAlerts(prevAlerts=>[`⚠️ ${room.name} almost full!`, ...prevAlerts.slice(0,4)]);
        }
        return {...room, occupied:newOcc};
      }));
    },4000);
    return ()=> clearInterval(interval);
  },[]);

  // Combine graph data
  useEffect(()=>{
    const interval = setInterval(()=>{
      const timestamp = new Date().toLocaleTimeString();
      const point = { time: timestamp, persons: stats.persons, anomalies: stats.anomalies };
      rooms.forEach(r=> point[r.name]=r.occupied);
      setGraphData(prev=>{
        const newData=[...prev, point];
        if(newData.length>12) newData.shift();
        return newData;
      });
    },4000);
    return ()=>clearInterval(interval);
  },[stats,rooms]);

  return (
    <div className={`admin-dashboard ${sidebarOpen?"sidebar-open":"sidebar-closed"} ${darkMode?"dark-mode":"light-mode"}`}>
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
          <FaBars className="toggle-btn" onClick={()=>setSidebarOpen(!sidebarOpen)} />
        </div>
        <ul>
          <li className="active">Dashboard</li>
          <li>Surveillance</li>
          <li>Space</li>
          <li>Users</li>
          <li>Reports</li>
          <li>Settings</li>
        </ul>
        <div className="theme-switcher" onClick={()=>setDarkMode(!darkMode)}>
          {darkMode?<FaSun/>:<FaMoon/>} {darkMode?"Light Mode":"Dark Mode"}
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <h2 className="dashboard-title">Smart Campus Admin Dashboard</h2>
        <p>Live surveillance and space management monitoring for college.</p>

        {/* AI & Space Alerts */}
        <div className="alerts-panel">
          <h4>Recent Alerts</h4>
          {alerts.length===0?<p>No alerts</p>:<ul>{alerts.map((a,i)=><li key={i}>{a}</li>)}</ul>}
        </div>

        {/* Stats Cards */}
        <div className="stats-cards">
          {/* Surveillance Stats */}
          <div className="stat-card neon-card">
            <FaUserShield className="stat-icon" />
            <h3>Persons Detected</h3>
            <p>{stats.persons}</p>
          </div>
          <div className="stat-card neon-card">
            <FaExclamationTriangle className="stat-icon" />
            <h3>Anomalies</h3>
            <p>{stats.anomalies}</p>
          </div>
          <div className="stat-card neon-card">
            <FaVideo className="stat-icon" />
            <h3>Streams Active</h3>
            <p>{stats.streams}</p>
          </div>

          {/* Space Stats */}
          {rooms.map((room,i)=>(
            <div key={i} className="stat-card neon-card"
                 style={{borderColor: room.occupied/room.capacity>0.9?"#ef4444":room.occupied/room.capacity>0.6?"#facc15":"#22c55e"}}>
              <FaDoorOpen className="stat-icon"/>
              <h3>{room.name}</h3>
              <p>{room.occupied}/{room.capacity} Occupied</p>
            </div>
          ))}
        </div>

        {/* AI Control */}
        <div className="admin-controls">
          <button className="control-btn" onClick={()=>setAiActive(!aiActive)}>
            {aiActive?<FaPause/>:<FaPlay/>} {aiActive?"Pause AI":"Resume AI"}
          </button>
        </div>

        {/* Video Section */}
        <div className="video-wrapper">
          <video controls autoPlay loop muted>
            <source src="sample-video.mp4" type="video/mp4"/>
            Your browser does not support the video tag.
          </video>
          <div className="video-overlay">🔍 Detection Active</div>
          {boundingBoxes.map(box=>(
            <div key={box.id} className="bounding-box"
                 style={{top:box.top,left:box.left,width:box.width,height:box.height}}>
              {box.label}
            </div>
          ))}
        </div>

        {/* Graph */}
        <div className="surveillance-graph">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={graphData} margin={{ top:5, right:20, bottom:5, left:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)"/>
              <XAxis dataKey="time" stroke="#bbb"/>
              <YAxis stroke="#bbb"/>
              <Tooltip contentStyle={{background:"#1e1e2f", borderRadius:"8px", border:"1px solid #555"}}/>
              <Line type="monotone" dataKey="persons" stroke="#3b82f6" strokeWidth={3} dot={{r:4}}/>
              <Line type="monotone" dataKey="anomalies" stroke="#ef4444" strokeWidth={3} dot={{r:4}}/>
              {rooms.map((r,i)=>(
                <Line key={i} type="monotone" dataKey={r.name} stroke={["#22c55e","#facc15","#f87171"][i%3]} strokeWidth={3} dot={{r:4}}/>
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;



