import React from "react";
import "../App.css";

const CircularGenerator = () => {
  return (
    <div className="container circulars">
      <h2>Automatic Circulars</h2>
      <p>
        Administrators can auto-generate <b>official circulars</b> for exams,
        events, and notices. Generated circulars are auto-sent to faculty and
        students.
      </p>
      <div className="circular-item">Exam Schedule Circular (PDF)</div>
      <div className="circular-item">Lab Timetable Notification</div>
      <div className="circular-item">Holiday Notice</div>
    </div>
  );
};

export default CircularGenerator;

