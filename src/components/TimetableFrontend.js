// TimetableDashboard.js
// Full replacement: Timetable dashboard with configurable "info" screen, skip button, full bio modal,
// timetable view, auto-assign, subjects & faculty lists, and timeline.
// Requires: ./timetable (named exports), ./timeline (default export), ./timetable.css (optional styling)

import React, { useEffect, useRef, useState } from "react";

import {
  TIME_SLOTS,
  DAYS,
  generateEmptyTimetable,
  autoAssign,
  SUBJECTS_SAMPLE,
  FACULTY_SAMPLE
} from "./timetable";

import timelineData from "./timeline";


export default function TimetableDashboard() {
  // Timetable data
  const [timetable, setTimetable] = useState(() => generateEmptyTimetable());
  const [subjects] = useState(SUBJECTS_SAMPLE);
  const [faculty] = useState(FACULTY_SAMPLE);

  // UI states
  const [visibleDay, setVisibleDay] = useState("Monday");
  const [selectedFaculty, setSelectedFaculty] = useState(null);

  // Info-screen and bio modal states
  const [showInfoScreen, setShowInfoScreen] = useState(false);
  const [showBio, setShowBio] = useState(false);

  // Delay in seconds for info screen (user can change in control panel)
  const [infoDelaySec, setInfoDelaySec] = useState(60); // default 60s; user can set shorter

  // Progress for info screen (0..100)
  const [infoProgress, setInfoProgress] = useState(0);

  // Keep timer refs so we can clear them
  const infoTimerRef = useRef(null);
  const progressTimerRef = useRef(null);
  const infoStartTimestampRef = useRef(null);

  // Auto-generate timetable (simple rotation)
  const generate = () => {
    const newTable = generateEmptyTimetable();
    const result = autoAssign(newTable, subjects, faculty);
    setTimetable({ ...result });
  };

  // Cancel pending info -> bio transition and clear timers
  const clearInfoTimers = () => {
    if (infoTimerRef.current) {
      clearTimeout(infoTimerRef.current);
      infoTimerRef.current = null;
    }
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
    infoStartTimestampRef.current = null;
    setInfoProgress(0);
  };

  // Start info screen countdown and progress bar
  const startInfoScreen = () => {
    clearInfoTimers();
    setShowInfoScreen(true);
    setShowBio(false);
    setInfoProgress(0);
    infoStartTimestampRef.current = Date.now();

    // progress calculation interval
    const totalMs = Math.max(0, infoDelaySec * 1000);
    const stepMs = Math.max(50, Math.floor(totalMs / 100)); // update ~100 steps
    progressTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - infoStartTimestampRef.current;
      const pct = Math.min(100, Math.round((elapsed / totalMs) * 100));
      setInfoProgress(isNaN(pct) ? 0 : pct);
    }, stepMs);

    // final timeout for opening bio
    infoTimerRef.current = setTimeout(() => {
      setShowInfoScreen(false);
      setShowBio(true);
      clearInfoTimers();
    }, totalMs);
  };

  // When user clicks a faculty card
  const handleFacultyClick = (f) => {
    // set selected faculty
    setSelectedFaculty(f);

    // start info screen then bio
    startInfoScreen();
  };

  // Skip info screen and show bio immediately
  const skipToBio = () => {
    clearInfoTimers();
    setShowInfoScreen(false);
    setShowBio(true);
  };

  // Close bio modal and clear possible timers
  const closeBio = () => {
    clearInfoTimers();
    setShowBio(false);
    setShowInfoScreen(false);
    setSelectedFaculty(null);
  };

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      clearInfoTimers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Small utility to render faculty detailed section (extendable)
  const renderFacultyDetails = (f) => {
    if (!f) return null;

    // For demo, we support optional fields: photo, publications, projects, contact, researchInterests, prevExpDetails
    // If these fields don't exist in object, we show placeholders.
    return (
      <div className="space-y-3 text-gray-700 text-sm">
        <div className="flex gap-4 items-start">
          <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
            {/* Placeholder avatar (replace with f.photo if available) */}
            {f.photo ? (
              <img src={f.photo} alt={f.name} className="w-full h-full object-cover rounded-lg" />
            ) : (
              <div className="text-xs">No Photo</div>
            )}
          </div>
          <div className="flex-1">
            <p><strong>Department:</strong> {f.dept || "—"}</p>
            <p><strong>Experience:</strong> {f.exp ?? "—"} years</p>
            <p><strong>Specialization:</strong> {f.spec || "—"}</p>
            <p>
              <strong>Availability:</strong>{" "}
              <span className={f.available ? "text-green-600" : "text-red-600"}>
                {f.available ? "Available" : "Not Available"}
              </span>
            </p>
          </div>
        </div>

        <div>
          <p><strong>Preferred Subjects:</strong></p>
          <p className="text-sm text-gray-600">{(f.preferred && f.preferred.length) ? f.preferred.join(", ") : "—"}</p>
        </div>

        <div>
          <p><strong>Not Interested:</strong></p>
          <p className="text-sm text-gray-600">{(f.notInterested && f.notInterested.length) ? f.notInterested.join(", ") : "—"}</p>
        </div>

        <div>
          <p><strong>Previous Experience (short):</strong></p>
          <ul className="list-disc pl-5 text-gray-600">
            {(f.prevExpDetails && f.prevExpDetails.length) ? (
              f.prevExpDetails.map((p, i) => <li key={i}>{p}</li>)
            ) : (
              <li>Worked on teaching & lab sessions across core CS subjects.</li>
            )}
          </ul>
        </div>

        <div>
          <p><strong>Research / Interests:</strong></p>
          <p className="text-sm text-gray-600">{(f.researchInterests && f.researchInterests.length) ? f.researchInterests.join(", ") : "—"}</p>
        </div>

        <div>
          <p><strong>Selected Publications (if any):</strong></p>
          <ul className="list-decimal pl-5 text-gray-600">
            {(f.publications && f.publications.length) ? (
              f.publications.map((pub, i) => <li key={i}>{pub}</li>)
            ) : (
              <li>No publications listed.</li>
            )}
          </ul>
        </div>

        <div>
          <p><strong>Contact / Office Hours:</strong></p>
          <p className="text-sm text-gray-600">{f.contact || "Email: not provided"}</p>
        </div>
      </div>
    );
  };

  // Render component
  return (
    <div className="min-h-screen bg-gray-100 p-6 fade-in">

      <h1 className="text-3xl font-bold mb-3">📅 Timetable Dashboard</h1>
      <p className="text-gray-600 mb-6">
        Faculty info flow • Auto generation • Timetable display
      </p>

      {/* CONTROL PANEL */}
      <div className="panel mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-lg font-medium">Controls</h2>
          <p className="text-xs text-gray-500">Auto-generate timetable or adjust info-screen duration</p>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={generate} className="btn-primary px-4 py-2">Auto Generate Timetable</button>

          <label className="text-sm text-gray-700 flex items-center gap-2">
            <span className="text-xs text-gray-500">Info-screen (sec):</span>
            <input
              type="number"
              min="1"
              max="300"
              value={infoDelaySec}
              onChange={(e) => setInfoDelaySec(Math.max(1, Number(e.target.value || 1)))}
              className="p-2 border rounded w-20 text-sm"
              title="Set how many seconds the informative screen should appear"
            />
          </label>

          <button
            className="btn-secondary px-3 py-2"
            onClick={() => {
              setInfoDelaySec(60);
            }}
          >
            Reset Delay
          </button>
        </div>
      </div>

      {/* MAIN LAYOUT: Left - Timetable, Right - Subjects/Faculty/Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* TIMETABLE (left / wide) */}
        <div className="lg:col-span-2 panel overflow-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Timetable — {visibleDay}</h2>

            <div className="flex gap-2 items-center">
              {DAYS.map(day => (
                <button
                  key={day}
                  onClick={() => setVisibleDay(day)}
                  className={`px-3 py-1 rounded text-sm border ${visibleDay === day ? "bg-indigo-600 text-white" : ""}`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="p-3 border">Time Slot</th>
                  <th className="p-3 border">Subject</th>
                  <th className="p-3 border">Faculty</th>
                  <th className="p-3 border">Type</th>
                </tr>
              </thead>
              <tbody>
                {TIME_SLOTS.map(slot => (
                  <tr key={slot} className="hover:bg-gray-50 subject-card">
                    <td className="p-3 border font-medium">{slot}</td>
                    <td className="p-3 border">{timetable[visibleDay][slot].subject || "—"}</td>
                    <td className="p-3 border">{timetable[visibleDay][slot].faculty || "—"}</td>
                    <td className="p-3 border">{timetable[visibleDay][slot].type || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT COLUMN: Subjects, Faculty, Timeline */}
        <div className="panel space-y-4">
          {/* Subjects */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Subjects</h3>
            <ul className="grid grid-cols-1 gap-2">
              {subjects.map((s, i) => (
                <li key={i} className="subject-card p-2 rounded border">
                  <div className="font-medium">{s.name}</div>
                  <div className="text-xs text-gray-500">Type: {s.type}</div>
                </li>
              ))}
            </ul>
          </div>

          {/* Faculty */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Faculty</h3>
            <ul className="grid grid-cols-1 gap-2 max-h-56 overflow-auto">
              {faculty.map((f, i) => (
                <li
                  key={i}
                  className="faculty-card border p-3 rounded cursor-pointer hover:shadow"
                  onClick={() => handleFacultyClick(f)}
                  title="Click to view profile"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{f.name}</div>
                      <div className="text-xs text-gray-500">{f.spec}</div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs text-gray-500">{f.exp} yrs</div>
                      <div className={`text-xs mt-1 ${f.available ? "text-green-600" : "text-red-600"}`}>
                        {f.available ? "Available" : "Not Avail"}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Timeline */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Project Timeline</h3>
            <ul className="space-y-2">
              {timelineData.map(item => (
                <li key={item.id} className="p-2 border rounded subject-card">
                  <div className="font-medium">{item.title}</div>
                  <div className="text-xs text-gray-500">{item.time}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ------------------------
          INFO SCREEN (appears immediately after clicking faculty)
          - Shows progress bar and skip button
          - Auto-continues to bio when countdown ends
         ------------------------ */}
      {showInfoScreen && selectedFaculty && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl border fade-in">
            <h2 className="text-2xl font-bold mb-1">Preparing {selectedFaculty.name}'s profile…</h2>
            <p className="text-sm text-gray-600 mb-4">
              Showing a short informative preview. You can skip to profile immediately.
            </p>

            {/* Informative summary — keep short & informational */}
            <div className="text-sm text-gray-700 mb-4">
              <p><strong>Specialization:</strong> {selectedFaculty.spec || "—"}</p>
              <p><strong>Years of Experience:</strong> {selectedFaculty.exp ?? "—"}</p>
              <p className="mt-2 text-xs text-gray-500">Preparing full academic info & history.</p>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden mb-4">
              <div
                className="h-full bg-indigo-600 transition-all"
                style={{ width: `${infoProgress}%` }}
              />
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="text-xs text-gray-500">
                {Math.max(0, infoDelaySec - Math.round((infoProgress / 100) * infoDelaySec))}s remaining
              </div>

              <div className="flex gap-2">
                <button
                  className="px-3 py-1 bg-gray-100 rounded border text-sm"
                  onClick={() => {
                    // Cancel and close preview
                    clearInfoTimers();
                    setShowInfoScreen(false);
                    setSelectedFaculty(null);
                  }}
                >
                  Cancel
                </button>

                <button
                  className="px-3 py-1 bg-indigo-600 text-white rounded text-sm"
                  onClick={() => {
                    skipToBio();
                  }}
                >
                  Skip & Open Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------
          BIO MODAL (opens after info screen completes or via skip)
         ------------------------ */}
      {showBio && selectedFaculty && (
        <div className="fixed inset-0 bg-black/40 flex items-start md:items-center justify-center p-4 z-50 overflow-auto">
          <div className="bg-white p-6 rounded-xl w-full max-w-3xl shadow-2xl border fade-in">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold mb-1">{selectedFaculty.name}</h2>
                <p className="text-sm text-gray-500 mb-2">{selectedFaculty.dept || "Department"}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  className="px-3 py-1 bg-gray-100 rounded border text-sm"
                  onClick={() => {
                    // Close bio but keep selected faculty (user may reopen)
                    setShowBio(false);
                    setSelectedFaculty(null);
                  }}
                >
                  Close
                </button>
              </div>
            </div>

            <div className="mt-4">
              {renderFacultyDetails(selectedFaculty)}
            </div>

            <div className="mt-5 flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded-md"
                onClick={() => {
                  // Example action: mark as favourite or assign to course (placeholder)
                  alert(`${selectedFaculty.name} selected for assignment (demo).`);
                }}
              >
                Assign / Use
              </button>

              <button
                className="px-4 py-2 bg-gray-100 rounded-md border"
                onClick={closeBio}
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


