// timeline.js
// Final clean version

export const timelineData = [
  {
    id: 1,
    title: "Faculty Selection",
    description: "Collect faculty details, experience, availability, preferences, and restrictions.",
    time: "Phase 1"
  },
  {
    id: 2,
    title: "Subject Mapping",
    description: "Map faculty to subjects based on interest, past experience, and likelihood score.",
    time: "Phase 2"
  },
  {
    id: 3,
    title: "Semester Subject Loading",
    description: "Load all 7 semesters with 5 theory subjects and 4 labs.",
    time: "Phase 3"
  },
  {
    id: 4,
    title: "Timetable Rules Setup",
    description: "Define constraints: no clashes, max hours/day, lab slot rules, teacher availability.",
    time: "Phase 4"
  },
  {
    id: 5,
    title: "Auto Generation",
    description: "Generate timetable automatically using weightage + priority algorithm.",
    time: "Phase 5"
  },
  {
    id: 6,
    title: "Manual Editing",
    description: "Allow admin to adjust periods manually on a drag-and-drop grid.",
    time: "Phase 6"
  },
  {
    id: 7,
    title: "Validation & Conflict Fixing",
    description: "Check for faculty clashes, subject overload, or unassigned subjects.",
    time: "Phase 7"
  },
  {
    id: 8,
    title: "Publishing",
    description: "Export the final timetable as PDF, Excel, and dashboard view.",
    time: "Phase 8"
  }
];

export default timelineData;


