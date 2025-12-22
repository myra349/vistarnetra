import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./jimmy.css";

const COLLEGE_HEADER_HTML = `
  <div class="college-header">
    <div class="college-name">ABC COLLEGE OF ENGINEERING & TECHNOLOGY</div>
    <div class="college-accreditation">
      Approved by AICTE | Affiliated to JNTUH | NAAC "A" Grade | ISO 9001:2015 Certified
    </div>
    <div class="college-address">
      XYZ Road, Hyderabad – 500001 |
      Website: www.abccollege.edu.in |
      Email: info@abccollege.edu.in |
      Ph: 040-12345678
    </div>
  </div>
`;

// MAIN COMPONENT
const AIApp = () => {
  const [started, setStarted] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const [messages, setMessages] = useState([
    { sender: "bot", text: "👋 Hello! I'm your Circu AI Assistant." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const [editorContent, setEditorContent] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");

  // 🔹 More advanced templates
  const templates = [
    // generic formats
    "Circular Outline",
    "Notice Outline",
    "Meeting Format",
    "Event Format",
    // student related
    "Attendance Shortage Circular",
    "Internal Marks Announcement",
    "Hall Ticket Distribution Notice",
    "Revaluation Notification",
    "ID Card Issue Circular",
    "Hostel Rules & Discipline Circular",
    "Discipline Code Circular",
    // staff / faculty
    "Staff Meeting Circular",
    "Timetable Allotment Circular",
    "Invigilation Duty Order",
    // admin / campus
    "Electricity Shutdown Notice",
    "Water Supply Shutdown Notice",
    "Campus Maintenance Notice",
    "CCTV Monitoring Notice",
    "Emergency Procedure Circular",
    // events
    "Cultural Fest Circular",
    "Sports Trials Notice",
    "Workshop / Seminar Circular",
    "NSS / NCC Enrollment Notice",
  ];

  // 🔹 OUTLINE ONLY (placeholders, no fixed matter)
  const templateContent = {
    "Circular Outline": `
      <div class="section">
        <div class="doc-meta-row">
          <span>Ref No: _______</span>
          <span>Date: __ / __ / ______</span>
        </div>

        <strong>CIRCULAR TITLE:</strong> ________________________________<br/><br/>

        This circular is issued to inform regarding:<br/>
        • ________________________________<br/>
        • ________________________________<br/>
        • ________________________________<br/><br/>

        <strong>Applicable To:</strong><br/>
        ☐ Students &nbsp;&nbsp; ☐ Faculty &nbsp;&nbsp; ☐ Staff &nbsp;&nbsp; ☐ All<br/><br/>

        <strong>Important Details:</strong><br/>
        Date: ______________________<br/>
        Time: ______________________<br/>
        Venue / Department: ____________________________<br/><br/>

        <strong>Instructions / Notes:</strong><br/>
        1. ________________________________<br/>
        2. ________________________________<br/>
        3. ________________________________<br/><br/>

        Issued By:<br/>
        Name: ______________________<br/>
        Designation: ________________<br/>
        Signature / Seal
      </div>
    `,

    "Notice Outline": `
      <div class="section">
        <div class="doc-meta-row">
          <span>Date: __ / __ / ____</span>
        </div>

        <strong>Subject:</strong> _______________________ <br/><br/>

        Notice content relates to:<br/>
        • __________________________<br/>
        • __________________________<br/>
        • __________________________<br/><br/>

        <strong>Deadline (if any):</strong> ______________________<br/><br/>

        By Order,<br/>
        Office / Dept: ______________________<br/>
        Signature:
      </div>
    `,

    "Meeting Format": `
      <div class="section">
        <strong>Meeting Type:</strong> _________________________<br/>
        <strong>Participants:</strong> _________________________<br/>
        <strong>Date:</strong> _________________________________<br/>
        <strong>Time:</strong> _________________________________<br/>
        <strong>Venue:</strong> ________________________________<br/><br/>

        <strong>Agenda:</strong><br/>
        1. ________________________<br/>
        2. ________________________<br/>
        3. ________________________<br/><br/>

        Attendance: ☐ Mandatory &nbsp;&nbsp; ☐ Optional<br/><br/>

        Convenor:<br/>
        Name & Designation: ___________________<br/>
        Signature & Seal
      </div>
    `,

    "Event Format": `
      <div class="section">
        <strong>Event Name:</strong> ___________________________<br/>
        <strong>Organised By:</strong> _________________________<br/><br/>

        Date: _________________________________<br/>
        Time: _________________________________<br/>
        Location: _____________________________<br/><br/>

        <strong>Eligibility:</strong><br/>
        ☐ All Students<br/>
        ☐ Specific Dept: ___________________<br/>
        ☐ Faculty<br/>
        ☐ Public<br/><br/>

        <strong>Requirements / Materials:</strong><br/>
        • ______________________<br/>
        • ______________________<br/><br/>

        Coordinator Contact:<br/>
        Name: ______________________<br/>
        Phone: _____________________<br/><br/>

        Signature / Seal
      </div>
    `,

    // STUDENT RELATED
    "Attendance Shortage Circular": `
      <div class="section">
        This is to inform the following students that their attendance is below the minimum requirement.<br/><br/>
        <strong>List of Students:</strong><br/>
        1. Name: ___________ | Reg No: ______ | Attendance: ____%<br/>
        2. Name: ___________ | Reg No: ______ | Attendance: ____%<br/><br/>

        <strong>Action Required:</strong><br/>
        • Attend all classes regularly<br/>
        • Meet the mentor / HoD for counselling<br/><br/>

        Issued By:<br/>
        Attendance Cell / HoD<br/>
        Signature / Seal
      </div>
    `,

    "Internal Marks Announcement": `
      <div class="section">
        Internal assessment marks for the following subjects have been published.<br/><br/>
        <strong>Details:</strong><br/>
        Semester: _________<br/>
        Branch / Section: _________<br/><br/>

        Students are advised to verify their marks on the notice board / portal and report discrepancies, if any, within the given time.<br/><br/>

        Issued By:<br/>
        Examination Cell<br/>
        Signature / Seal
      </div>
    `,

    "Hall Ticket Distribution Notice": `
      <div class="section">
        Hall tickets for the upcoming examinations will be issued as per the schedule given below:<br/><br/>

        Date: ___________________<br/>
        Time: ___________________<br/>
        Venue: __________________<br/><br/>

        <strong>Instructions:</strong><br/>
        • Students must clear all dues before collecting hall ticket<br/>
        • College ID card is compulsory for collection<br/><br/>

        Issued By:<br/>
        Examination Cell<br/>
        Signature / Seal
      </div>
    `,

    "Revaluation Notification": `
      <div class="section">
        Students who wish to apply for revaluation / recounting of their answer scripts may submit applications as per the details below:<br/><br/>

        Applicable Exams: ___________________<br/>
        Last Date for Application: ___________<br/>
        Application Fee (per subject): _______<br/><br/>

        Applications submitted after the due date will not be accepted.<br/><br/>

        Issued By:<br/>
        Examination Cell<br/>
        Signature / Seal
      </div>
    `,

    "ID Card Issue Circular": `
      <div class="section">
        New / Duplicate ID cards will be issued to students as per the schedule below:<br/><br/>

        Date: ___________________<br/>
        Time: ___________________<br/>
        Venue: __________________<br/><br/>

        <strong>Documents Required:</strong><br/>
        • Fee receipt / payment proof<br/>
        • Passport size photograph (if required)<br/><br/>

        Issued By:<br/>
        Office / Admin Section<br/>
        Signature / Seal
      </div>
    `,

    "Hostel Rules & Discipline Circular": `
      <div class="section">
        All hostel residents are instructed to strictly follow the updated hostel rules and regulations.<br/><br/>

        <strong>Important Points:</strong><br/>
        • Reporting time: ___________<br/>
        • Visitors timing: ___________<br/>
        • Prohibited activities: ___________________<br/><br/>

        Non-compliance may lead to disciplinary action.<br/><br/>

        Issued By:<br/>
        Hostel Warden<br/>
        Signature / Seal
      </div>
    `,

    "Discipline Code Circular": `
      <div class="section">
        This is to reiterate the code of conduct expected from all students on campus.<br/><br/>

        <strong>Key Guidelines:</strong><br/>
        • Dress code: ___________________<br/>
        • Usage of mobile phones: _______<br/>
        • Behaviour in classrooms / labs: _______<br/><br/>

        Any violation will be dealt with as per the disciplinary policy.<br/><br/>

        Issued By:<br/>
        Discipline Committee<br/>
        Signature / Seal
      </div>
    `,

    // STAFF / FACULTY
    "Staff Meeting Circular": `
      <div class="section">
        All teaching staff are hereby informed that a department staff meeting is scheduled as per the details below:<br/><br/>

        Date: ___________________<br/>
        Time: ___________________<br/>
        Venue: __________________<br/><br/>

        <strong>Agenda:</strong><br/>
        1. ________________________<br/>
        2. ________________________<br/>
        3. ________________________<br/><br/>

        HoD<br/>
        Signature / Seal
      </div>
    `,

    "Timetable Allotment Circular": `
      <div class="section">
        Faculty are informed that class / lab timetables for the upcoming semester have been finalized.<br/><br/>

        <strong>Instructions:</strong><br/>
        • Collect your timetable from office / portal<br/>
        • Ensure timely entry to classes<br/><br/>

        Issued By:<br/>
        Time Table Incharge / HoD<br/>
        Signature / Seal
      </div>
    `,

    "Invigilation Duty Order": `
      <div class="section">
        The following faculty members are assigned invigilation duties for the examinations scheduled between ______ and ______.<br/><br/>

        1. Name: ___________ | Date: ______ | Session: FN / AN | Room: ____<br/>
        2. Name: ___________ | Date: ______ | Session: FN / AN | Room: ____<br/><br/>

        Any changes / swaps must be approved by Examination Cell.<br/><br/>

        Issued By:<br/>
        Chief Superintendent<br/>
        Signature / Seal
      </div>
    `,

    // ADMIN / CAMPUS
    "Electricity Shutdown Notice": `
      <div class="section">
        This is to inform that there will be a scheduled power shutdown on campus as per the details below:<br/><br/>

        Date: ___________________<br/>
        Time: From ______ to ______<br/>
        Affected Blocks / Areas: ___________________<br/><br/>

        Staff and students are requested to plan their work accordingly.<br/><br/>

        Issued By:<br/>
        Admin Office / Maintenance<br/>
        Signature / Seal
      </div>
    `,

    "Water Supply Shutdown Notice": `
      <div class="section">
        Due to maintenance work, water supply will be temporarily suspended as per the details given below:<br/><br/>

        Date: ___________________<br/>
        Time: From ______ to ______<br/>
        Affected Areas: ___________________<br/><br/>

        Inconvenience caused is regretted.<br/><br/>

        Issued By:<br/>
        Admin Office / Maintenance<br/>
        Signature / Seal
      </div>
    `,

    "Campus Maintenance Notice": `
      <div class="section">
        Campus cleaning / maintenance activities are scheduled on the following date:<br/><br/>

        Date: ___________________<br/>
        Areas Covered: ___________________<br/><br/>

        Students and staff are requested to cooperate and avoid parking / movement in the specified zones during the activity.<br/><br/>

        Issued By:<br/>
        Admin Office<br/>
        Signature / Seal
      </div>
    `,

    "CCTV Monitoring Notice": `
      <div class="section">
        This is to inform all students and staff that the campus is under CCTV surveillance for safety and security purposes.<br/><br/>

        All are advised to maintain discipline and follow institutional rules and regulations.<br/><br/>

        Issued By:<br/>
        Principal / Admin<br/>
        Signature / Seal
      </div>
    `,

    "Emergency Procedure Circular": `
      <div class="section">
        In case of any emergency (fire, medical, etc.), the following procedure should be followed:<br/><br/>

        <strong>Emergency Contacts:</strong><br/>
        • Security: ___________<br/>
        • Medical: ___________<br/>
        • Fire / Rescue: _______<br/><br/>

        <strong>General Instructions:</strong><br/>
        1. Remain calm and do not panic<br/>
        2. Follow the instructions of staff / security<br/>
        3. Use designated exit routes only<br/><br/>

        Issued By:<br/>
        Safety Committee / Admin<br/>
        Signature / Seal
      </div>
    `,

    // EVENTS
    "Cultural Fest Circular": `
      <div class="section">
        The annual cultural fest is scheduled as per the details below:<br/><br/>

        Fest Name: ___________________<br/>
        Dates: _______________________<br/>
        Events: ______________________<br/><br/>

        <strong>Registration:</strong><br/>
        Last Date: ___________________<br/>
        Contact: _____________________<br/><br/>

        Issued By:<br/>
        Cultural Committee<br/>
        Signature / Seal
      </div>
    `,

    "Sports Trials Notice": `
      <div class="section">
        Selections / trials for the college sports teams will be conducted as per the schedule below:<br/><br/>

        Sport: ___________________<br/>
        Date: ____________________<br/>
        Time: ____________________<br/>
        Venue: ___________________<br/><br/>

        Eligibility: ___________________<br/><br/>

        Issued By:<br/>
        Physical Director<br/>
        Signature / Seal
      </div>
    `,

    "Workshop / Seminar Circular": `
      <div class="section">
        A workshop / seminar is being organized on the topic:<br/><br/>

        Title: ___________________________<br/>
        Resource Person(s): ______________<br/>
        Date: ____________________________<br/>
        Time: ____________________________<br/>
        Venue: ___________________________<br/><br/>

        Target Audience: ___________________<br/>
        Registration Details: _______________<br/><br/>

        Issued By:<br/>
        Co-ordinator<br/>
        Signature / Seal
      </div>
    `,

    "NSS / NCC Enrollment Notice": `
      <div class="section">
        Enrolment for NSS / NCC units is open for interested students.<br/><br/>

        Units Available: ___________________<br/>
        Eligibility Criteria: _______________<br/>
        Last Date to Apply: ________________<br/><br/>

        Students are encouraged to participate actively.<br/><br/>

        Issued By:<br/>
        NSS / NCC Program Officer<br/>
        Signature / Seal
      </div>
    `,
  };

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleStart = () => {
    setCelebrate(true);
    setTimeout(() => {
      setCelebrate(false);
      setStarted(true);
    }, 2500);
  };

  // Chat-only simple generation (optional)
  const handleChatSend = async (textFromClick) => {
    const sendText = textFromClick || input;
    if (!sendText.trim()) return;

    const userMessage = { sender: "user", text: sendText };
    setMessages((prev) => [...prev, userMessage]);
    if (!textFromClick) setInput("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://127.0.0.1:5000/generate_notice",
        { template: sendText, description: sendText },
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `CircuAI_${sendText}.pdf`);
      document.body.appendChild(link);
      link.click();

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "✅ Your circular has been generated and downloaded from chat!",
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "❌ Something went wrong while generating from chat.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleChatSend();
  };

  // 🔥 MAIN advanced PDF generate (workspace)
  const handleGenerateDocument = async () => {
    if (!editorContent.trim() && !description.trim()) {
      alert("Please select a template or type content / description.");
      return;
    }

    const docId = `ABC-${Date.now()}`;
    const descHTML = description
      ? `<br/><br/><strong>Description / Details:</strong><br/>${description.replace(
          /\n/g,
          "<br/>"
        )}`
      : "";

    const finalDocument = `
      <html>
        <head>
          <meta charset="UTF-8" />
          <style>
            body { font-family: Arial, sans-serif; font-size: 12px; }
            .college-header { text-align: center; margin-bottom: 8px; }
            .college-name { font-size: 18px; font-weight: 700; }
            .college-accreditation { font-size: 11px; }
            .college-address { font-size: 10px; }
            .doc-title { text-align: center; font-weight: 700; font-size: 16px; margin-top: 6px; }
            .doc-subtitle { text-align: center; font-size: 12px; margin-bottom: 8px; color: #555; }
            .doc-footer { margin-top: 32px; font-size: 10px; border-top: 1px solid #ccc; padding-top: 6px; }
          </style>
        </head>
        <body>
          ${editorContent}
          ${descHTML}
          <div class="doc-footer">
            <div>Document ID: ${docId}</div>
            <div>This is an auto-generated official document of ABC College of Engineering & Technology.</div>
          </div>
        </body>
      </html>
    `;

    setLoading(true);

    try {
      const res = await axios.post(
        "http://127.0.0.1:5000/generate_notice",
        {
          html: finalDocument,
          documentId: docId,
          enableWatermark: true,
          enableQR: true,
          enableSeal: true,
        },
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Circular_${selectedTemplate || "Document"}_${docId}.pdf`
      );
      document.body.appendChild(link);
      link.click();

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "✅ Advanced secured PDF generated (with watermark / seal / QR support).",
        },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text:
            "❌ Failed to generate advanced PDF. Please check backend server / libraries.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateClick = (temp) => {
    setSelectedTemplate(temp);
    const body = templateContent[temp] || "";

    const formatted = `
      ${COLLEGE_HEADER_HTML}
      <div class="doc-meta-row">
        <span>Ref No: _______</span>
        <span>Date: __ / __ / ______</span>
      </div>
      <div class="doc-title">${temp.toUpperCase()}</div>
      <hr/>
      ${body}
    `;

    setEditorContent(formatted);
  };

  return (
    <div className="circuai-wrapper">
      {!started ? (
        <div className="intro-wrapper">
          <h1 className="intro-title">Welcome to DOCU EDITOR AI</h1>
          <p className="intro-subtitle">Advanced College Circular Generator</p>
          <button className="start-btn" onClick={handleStart}>
            🚀 Start Workspace
          </button>

          {celebrate && (
            <>
              <div className="celebration-popup">🎉 Let's Begin! 🎉</div>
              <div className="confetti-wrapper">
                {[...Array(50)].map((_, i) => (
                  <div key={i} className="confetti"></div>
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="workspace-wrapper">
          {/* Sidebar */}
          <div className="workspace-sidebar">
            <h3>Templates</h3>
            <p className="sidebar-hint">
              Template select chesthe, Word laaga center title + outline auto
              vaste.
            </p>
            <div className="template-list">
              {templates.map((temp, idx) => (
                <button
                  key={idx}
                  className={`template-btn ${
                    selectedTemplate === temp ? "active" : ""
                  }`}
                  onClick={() => handleTemplateClick(temp)}
                >
                  {temp}
                </button>
              ))}
            </div>
          </div>

          {/* Main */}
          <div className="workspace-main">
            <h2>Circu AI Advanced Workspace</h2>

            {/* Toolbar */}
            <div className="editor-toolbar">
              <span className="toolbar-label">Formatting:</span>
              <button onClick={() => document.execCommand("bold")}>B</button>
              <button onClick={() => document.execCommand("italic")}>I</button>
              <button onClick={() => document.execCommand("underline")}>
                U
              </button>
              <button onClick={() => document.execCommand("justifyLeft")}>
                ⬅
              </button>
              <button onClick={() => document.execCommand("justifyCenter")}>
                ⬌
              </button>
              <button onClick={() => document.execCommand("justifyRight")}>
                ➡
              </button>
              <select
                onChange={(e) =>
                  document.execCommand("fontSize", false, e.target.value)
                }
                defaultValue="3"
              >
                <option value="2">Small</option>
                <option value="3">Normal</option>
                <option value="4">Large</option>
                <option value="5">X-Large</option>
              </select>
            </div>

            {/* Editor */}
            <div
              className="rich-editor"
              contentEditable
              onInput={(e) => setEditorContent(e.currentTarget.innerHTML)}
              dangerouslySetInnerHTML={{ __html: editorContent }}
            ></div>

            {/* Description */}
            <div className="description-box">
              <h3>Description / Details</h3>
              <p className="description-hint">
                Ee place lo actual matter rayandi – event details, reason, special
                instructions. Idhi template kinda final PDF lo merge avthundi.
              </p>
              <textarea
                className="description-input"
                placeholder="E.g., This circular is issued to inform that the college will remain closed..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
              />
            </div>

            <button
              className="generate-btn"
              onClick={handleGenerateDocument}
              disabled={loading}
            >
              {loading ? "Generating..." : "✅ Generate Secured Circular PDF"}
            </button>
          </div>

          {/* Chat Button */}
          <div
            className="chat-float-btn"
            onClick={() => setChatOpen(!chatOpen)}
            title="Circu AI Assistant"
          >
            💬
          </div>

          {/* Chat Window */}
          {chatOpen && (
            <div className="circusmart-window enhanced-chat">
              <div className="circusmart-header">
                Circu AI Bot
                <span className="close-btn" onClick={() => setChatOpen(false)}>
                  ✖️
                </span>
              </div>

              <div className="circusmart-messages">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`message ${msg.sender}`}>
                    {msg.text}
                  </div>
                ))}
                {loading && (
                  <div className="message bot typing">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="circusmart-input">
                <input
                  type="text"
                  placeholder="Type the circular topic..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <button onClick={() => handleChatSend()} disabled={loading}>
                  Send
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIApp;










