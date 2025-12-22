import React, { useState, useEffect, useRef } from "react";


// LocalStorage key
const LS_KEY = "adiripo_notice_v1";

// Tags keyword map
const TAGS = {
  Academic: ["exam", "timetable", "semester", "schedule"],
  Event: ["fest", "workshop", "hackathon", "celebration"],
  Alert: ["urgent", "emergency", "alert", "power", "warning"],
  Achievement: ["award", "winner", "proud", "achievement"],
  Social: ["drive", "donation", "plant", "campaign", "clean"],
};

// Auto-tag function
const autoTag = (title = "", body = "") => {
  const text = (title + " " + body).toLowerCase();
  const tags = new Set();
  Object.entries(TAGS).forEach(([tag, words]) => {
    for (let w of words) if (text.includes(w)) { tags.add(tag); break; }
  });
  return Array.from(tags);
};

// Confetti function
const spawnConfetti = (container, n = 60) => {
  if (!container) return;
  const colors = ["#FF3B30","#FF9500","#FFCC00","#34C759","#5AC8FA","#5856D6"];
  for(let i=0;i<n;i++){
    const el = document.createElement("div");
    el.className = "ad-conf";
    el.style.left = Math.random()*100+"%";
    el.style.background = colors[Math.floor(Math.random()*colors.length)];
    el.style.width = 6 + Math.random()*10 + "px";
    el.style.height = 8 + Math.random()*14 + "px";
    container.appendChild(el);
    setTimeout(()=>el.remove(),3500+Math.random()*1000);
  }
};

export default function AdiripoNotice(){
  const [notices,setNotices] = useState(()=>JSON.parse(localStorage.getItem(LS_KEY))||[]);
  const [admin,setAdmin] = useState(false);
  const [form,setForm] = useState({title:"",body:"",template:"Academic",expiry:"",pinned:false,imageData:""});
  const [showExpired,setShowExpired] = useState(false);
  const [query] = useState("");
  const confRef = useRef(null);

  useEffect(()=>localStorage.setItem(LS_KEY,JSON.stringify(notices)),[notices]);

  const now = new Date();
  const active = notices.filter(n=>!n.expiry||new Date(n.expiry)>=now);
  const archived = notices.filter(n=>n.expiry&&new Date(n.expiry)<now);
  const visible = (showExpired?[...notices]:active)
    .filter(n=>(n.title+n.body+n.template+(n.tags||[]).join(" ")).toLowerCase().includes(query.toLowerCase()))
    .sort((a,b)=>(b.pinned?1:0)-(a.pinned?1:0) || new Date(b.createdAt)-new Date(a.createdAt));

  const templates = ["Academic","Event","Alert","Achievement","Social"];

  const resetForm = ()=>setForm({title:"",body:"",template:"Academic",expiry:"",pinned:false,imageData:""});

  const handlePost = e=>{
    e?.preventDefault();
    if(!form.title.trim()||!form.body.trim()){alert("Title & Body required"); return;}
    const tags = autoTag(form.title,form.body);
    const n = {...form,id:Date.now(),createdAt:new Date().toISOString(),tags,author:"Campus Admin",views:0};
    setNotices(prev=>[n,...prev]);
    resetForm();
    spawnConfetti(confRef.current,80);
  };

  const handleDelete=id=>{ if(!window.confirm("Delete notice?")) return; setNotices(prev=>prev.filter(x=>x.id!==id)); };
  const togglePin=id=>setNotices(prev=>prev.map(x=>x.id===id?{...x,pinned:!x.pinned}:x));
  const onImageChange=file=>{ if(!file) return; const reader=new FileReader(); reader.onload=e=>setForm(f=>({...f,imageData:e.target.result})); reader.readAsDataURL(file); };

  const stats = { total:notices.length, active:active.length, pinned:notices.filter(n=>n.pinned).length, archived:archived.length };

  return (
    <div className="ad-root">
      {/* Navbar */}
      <div className="ad-nav">
        <button className="ad-home" onClick={()=>window.location.href="/"}>← Home</button>
        <div className="ad-title">VISTAR NETRA — Digital Notice Board</div>
        <div className="ad-actions">
       
          <button className="ad-toggle" onClick={()=>setAdmin(a=>!a)}>{admin?"Switch to User":"Switch to Admin Panel"}</button>
        </div>
      </div>

      {/* Hero */}
      <div className="ad-hero">
        <div className="ad-hero-left">
          <div className="ad-badge">LIVE</div>
          <h2>{notices.find(n=>n.pinned)?.title||"Welcome to VISTAR NETRA"}</h2>
          <p>{notices.find(n=>n.pinned)?.body||"Stay updated with campus notices, events, alerts, and achievements!"}</p>
          <div className="ad-meta"><span>Notices: {stats.total}</span><span>Active: {stats.active}</span><span>Pinned: {stats.pinned}</span></div>
        </div>
        <div className="ad-hero-right">
          <div className="ad-hero-actions">
            <button className="ad-hype" onClick={()=>spawnConfetti(confRef.current,100)}>HYPE ✨</button>
            <label><input type="checkbox" checked={showExpired} onChange={e=>setShowExpired(e.target.checked)} /> Show expired</label>
          </div>
        </div>
      </div>

      {/* Marquee */}
      <div className="ad-marquee">
        <div className="ad-marquee-track">
          {notices.length===0?<span>No notices — Admin start posting 🎉</span>:
            notices.map(n=><span key={n.id} className="ad-marquee-item">{n.template} • {n.title} — </span>)}
        </div>
      </div>

      {/* Main */}
      <div className="ad-main">
        <div className="ad-left">
          {admin && (
            <div className="ad-admin">
              <h3>Post New Notice</h3>
              <form onSubmit={handlePost}>
                <input placeholder="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/>
                <textarea placeholder="Description" value={form.body} onChange={e=>setForm({...form,body:e.target.value})}/>
                <div className="ad-row">
                  <select value={form.template} onChange={e=>setForm({...form,template:e.target.value})}>{templates.map(t=><option key={t}>{t}</option>)}</select>
                  <input type="date" value={form.expiry||""} onChange={e=>setForm({...form,expiry:e.target.value})}/>
                  <label><input type="checkbox" checked={form.pinned} onChange={e=>setForm({...form,pinned:!form.pinned})}/> Pin</label>
                </div>
                <div className="ad-row">
                  <input type="file" accept="image/*" onChange={e=>onImageChange(e.target.files?.[0])}/>
                  <button type="submit">Post Notice</button>
                </div>
              </form>
            </div>
          )}

          {/* Notices */}
          <div className="ad-board">
            {visible.length===0?<div className="ad-empty">No notices match filter.</div>:
              visible.map(n=>(
                <div key={n.id} className={`ad-card ad-${n.template.toLowerCase()}`}>
                  <div className="ad-card-top">
                    <div>
                      <h4>{n.title}</h4>
                      <div className="ad-meta">{n.template} • {n.tags?.join(", ") || "General"} • {new Date(n.createdAt).toLocaleString()}</div>
                    </div>
                    <div className="ad-card-actions">
                      <button onClick={()=>togglePin(n.id)}>{n.pinned?"📌":"📍"}</button>
                      <button onClick={()=>setNotices(prev=>prev.map(x=>x.id===n.id?{...x,views:(x.views||0)+1}:x))}>👁️</button>
                      <button onClick={()=>handleDelete(n.id)}>✖</button>
                    </div>
                  </div>
                  {n.imageData&&<img src={n.imageData} alt="attached"/>}
                  <p>{n.body}</p>
                  {n.expiry&&<div className="ad-expiry">Expires: {new Date(n.expiry).toLocaleDateString()}</div>}
                </div>
              ))
            }
          </div>
        </div>

        {/* Right Panel */}
        <div className="ad-right">
          <div className="ad-stats">
            <h4>Analytics</h4>
            <div className="ad-stat-row"><div className="ad-stat-bar" style={{width:`${Math.min(100,(stats.active/(stats.total||1))*100)}%`}}></div><small>Active / Total</small></div>
            <div className="ad-stat-row"><div className="ad-stat-bar" style={{width:`${Math.min(100,(stats.pinned/(stats.total||1))*100)}%`}}></div><small>Pinned / Total</small></div>
            <div className="ad-stat-counters">
              <div><strong>{stats.total}</strong><span>Total</span></div>
              <div><strong>{stats.active}</strong><span>Active</span></div>
              <div><strong>{stats.archived}</strong><span>Archived</span></div>
            </div>
          </div>

          <div className="ad-legend">
            <h4>Templates</h4>
            <ul>{templates.map(t=><li key={t}><span className={`ad-leg ad-leg-${t.toLowerCase()}`}></span>{t}</li>)}</ul>
          </div>

          <div className="ad-help">
            <h4>Tips & Benefits</h4>
            <ol>
              <li>Auto-tagging reduces admin workload.</li>
              <li>Pinned notices highlight urgent info in hero banner.</li>
              <li>Image attachments boost user engagement.</li>
              <li>Expired/archive toggle keeps board clean.</li>
            </ol>
          </div>
        </div>
      </div>

      <div ref={confRef} className="ad-conf-wrap"/>
    </div>
  )
}


