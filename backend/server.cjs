// server.js (FULL WORKING BACKEND)
// -------------------------------------------------------
// Timetable Backend with CORS fixed, clean structure, and
// fully working timetable generation logic.
// -------------------------------------------------------

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = 5000;

// -------------------------------------------------------
// SAMPLE DATA (Replace with DB in future)
// -------------------------------------------------------
let DATA = {
  sections: [
    { id: 'CSE-4A', name: 'CSE-4A' }
  ],
  subjects: [
    { id: 'M1', name: 'Math', periods_per_week: 3, type: 'theory' },
    { id: 'CS', name: 'Algorithms', periods_per_week: 3, type: 'theory' },
    { id: 'LAB1', name: 'CS Lab', periods_per_week: 2, type: 'lab' }
  ],
  teachers: [
    { id: 'T1', name: 'Raju', subjects: ['M1','CS'], max_per_day: 4 },
    { id: 'T2', name: 'Sita', subjects: ['CS','LAB1'], max_per_day: 4 }
  ],
  rooms: [
    { id: 'R101', name: 'Room 101', type: 'theory' },
    { id: 'LabA', name: 'Lab A', type: 'lab' }
  ],
  timeslots: [
    'Mon-9','Mon-10','Mon-11',
    'Tue-9','Tue-10','Tue-11',
    'Wed-9','Wed-10','Wed-11',
    'Thu-9','Thu-10','Thu-11',
    'Fri-9','Fri-10','Fri-11'
  ]
};

// -------------------------------------------------------
// UTILITY — PERIOD LIST BUILDER
// -------------------------------------------------------
function buildPeriodList(data) {
  const list = [];
  for (const sec of data.sections) {
    for (const sub of data.subjects) {
      for (let i = 0; i < sub.periods_per_week; i++) {
        list.push({
          section: sec.id,
          subject: sub.id,
          subjectType: sub.type,
        });
      }
    }
  }
  return list;
}

// -------------------------------------------------------
// TIMETABLE GENERATOR — BACKTRACKING
// -------------------------------------------------------
function generateTimetable(data) {
  const periodList = buildPeriodList(data);
  const timetable = [];

  const occupied = {
    section: {},
    teacher: {},
    room: {},
  };

  // Precompute room type lists
  const roomCandidates = {};
  for (const r of data.rooms) {
    roomCandidates[r.type] = roomCandidates[r.type] || [];
    roomCandidates[r.type].push(r.id);
  }

  // Check availability
  function canPlace(p, ts, teacherId, roomId) {
    if (occupied.section[p.section]?.[ts]) return false;
    if (occupied.teacher[teacherId]?.[ts]) return false;
    if (occupied.room[roomId]?.[ts]) return false;
    return true;
  }

  // Place
  function place(p, ts, teacherId, roomId) {
    timetable.push({ ...p, timeslot: ts, teacher: teacherId, room: roomId });

    occupied.section[p.section] = occupied.section[p.section] || {};
    occupied.teacher[teacherId] = occupied.teacher[teacherId] || {};
    occupied.room[roomId] = occupied.room[roomId] || {};

    occupied.section[p.section][ts] = true;
    occupied.teacher[teacherId][ts] = true;
    occupied.room[roomId][ts] = true;
  }

  // Remove
  function unplace() {
    const e = timetable.pop();
    delete occupied.section[e.section][e.timeslot];
    delete occupied.teacher[e.teacher][e.timeslot];
    delete occupied.room[e.room][e.timeslot];
  }

  // Backtracking solver
  function solve(i = 0) {
    if (i === periodList.length) return true;

    const p = periodList[i];
    const alreadyTeachers = data.teachers.filter(t => t.subjects.includes(p.subject));
    const roomList = roomCandidates[p.subjectType] || [];

    for (const ts of data.timeslots) {
      for (const t of alreadyTeachers) {
        for (const r of roomList) {
          if (canPlace(p, ts, t.id, r)) {
            place(p, ts, t.id, r);
            if (solve(i + 1)) return true;
            unplace();
          }
        }
      }
    }
    return false;
  }

  const ok = solve();
  if (!ok) return { error: "No feasible timetable with current data/constraints." };
  return { timetable };
}

// -------------------------------------------------------
// ENDPOINTS
// -------------------------------------------------------

// GET Current Data
app.get('/api/data', (req, res) => {
  res.json(DATA);
});

// Override Data (like admin editor)
app.post('/api/data', (req, res) => {
  DATA = req.body;
  res.json({ ok: true });
});

// Generate Timetable
app.get('/api/generate', (req, res) => {
  const out = generateTimetable(DATA);
  res.json({
    message: "Timetable Backend Running ✔",
    result: out,
  });
});

// -------------------------------------------------------
// START SERVER
// -------------------------------------------------------
app.listen(PORT, () => {
  console.log(`Timetable backend running at http://localhost:${PORT}`);
});