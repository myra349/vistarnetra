// timetable.js

export const TIME_SLOTS = [
  "9:00 - 10:00",
  "10:00 - 11:00",
  "11:00 - 12:00",
  "12:00 - 1:00",
  "2:00 - 3:00",
  "3:00 - 4:00",
  "4:00 - 5:00"
];

export const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const generateEmptyTimetable = () => {
  const table = {};
  DAYS.forEach(day => {
    table[day] = {};
    TIME_SLOTS.forEach(slot => {
      table[day][slot] = {
        subject: null,
        faculty: null,
        type: null
      };
    });
  });
  return table;
};

export const autoAssign = (timetable, subjectsList, facultyList) => {
  let s = 0;
  let f = 0;

  DAYS.forEach(day => {
    TIME_SLOTS.forEach(slot => {
      const subject = subjectsList[s % subjectsList.length];
      const faculty = facultyList[f % facultyList.length];

      timetable[day][slot] = {
        subject: subject.name,
        faculty: faculty.name,
        type: subject.type
      };

      s++;
      f++;
    });
  });

  return timetable;
};

export const SUBJECTS_SAMPLE = [
  { name: "DBMS", type: "Theory" },
  { name: "OS", type: "Theory" },
  { name: "CN", type: "Theory" },
  { name: "Java Lab", type: "Lab" },
  { name: "DSA", type: "Theory" }
];

export const FACULTY_SAMPLE = [
  { name: "Dr. Ramesh" },
  { name: "Ms. Priya" },
  { name: "Mr. Mahesh" },
  { name: "Dr. Divya" },
  { name: "Ms. Harika" }
];

