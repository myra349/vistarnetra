import React, { useState } from "react";
import { Bar, } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement } from "chart.js";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement);

export default function StudentDashboard() {
  // Sample 30 students
  const studentsData = Array.from({length:30},(_,i)=>({
    id:i+1,
    name:`Student ${i+1}`,
    academic:{Math:Math.floor(Math.random()*41+60), Physics:Math.floor(Math.random()*41+60), Chemistry:Math.floor(Math.random()*41+60)},
    attendance:{total:180, present:Math.floor(Math.random()*31+150)},
    behaviour:{complaints:Math.floor(Math.random()*4), positive:Math.floor(Math.random()*6)},
    feedback:[
      {faculty:"Prof. Sharma", comment:"Good in labs", rating:Math.floor(Math.random()*2+4)},
      {faculty:"Prof. Rao", comment:"Needs improvement in theory", rating:Math.floor(Math.random()*3+2)}
    ],
    mentorNotes:""
  }));

  const [students,setStudents] = useState(studentsData);
  const [selectedStudent,setSelectedStudent] = useState(null);

  const updateMentorNotes = (id,note)=>{
    setStudents(prev=>prev.map(s=>s.id===id?{...s,mentorNotes:note}:s));
  }

  const StudentList = ()=>(
    <div style={{width:"200px",borderRight:"1px solid #ccc", overflowY:"auto"}}>
      <h3 style={{textAlign:"center"}}>Students</h3>
      {students.map(s=>(
        <div key={s.id} style={{padding:"8px", cursor:"pointer", backgroundColor:selectedStudent?.id===s.id?"#f0f0f0":"transparent"}} onClick={()=>setSelectedStudent(s)}>
          {s.name}
        </div>
      ))}
    </div>
  );

  const StudentDetails = ({student})=>{
    if(!student) return <div style={{padding:"20px"}}>Select a student to view details</div>;

    const academicData = {
      labels: Object.keys(student.academic),
      datasets:[{
        label:"Marks",
        data:Object.values(student.academic),
        backgroundColor:"rgba(75,192,192,0.6)"
      }]
    };

    const attendancePercent = (student.attendance.present/student.attendance.total)*100;
    const attendanceData = {
      labels:["Attendance"],
      datasets:[{
        label:"Percentage",
        data:[attendancePercent],
        backgroundColor:["rgba(255,99,132,0.6)"]
      }]
    };

    const behaviourData = {
      labels:["Complaints","Positive"],
      datasets:[{
        label:"Behaviour Count",
        data:[student.behaviour.complaints, student.behaviour.positive],
        backgroundColor:["rgba(255,159,64,0.6)","rgba(54,162,235,0.6)"]
      }]
    };

    return (
      <div style={{padding:"20px", flex:1}}>
        <h2>{student.name}</h2>
        <h4>Academic</h4>
        <Bar data={academicData} />
        <h4>Attendance</h4>
        <Bar data={attendanceData} />
        <h4>Behaviour</h4>
        <Bar data={behaviourData} />
        <h4>Faculty Feedback</h4>
        <ul>
          {student.feedback.map((f,i)=><li key={i}>{f.faculty}: {f.comment} (Rating: {f.rating})</li>)}
        </ul>
        <h4>Mentor Notes</h4>
        <textarea style={{width:"100%", height:"80px"}} value={student.mentorNotes} onChange={e=>updateMentorNotes(student.id,e.target.value)} />
      </div>
    );
  }

  return (
    <div style={{display:"flex", height:"100vh", fontFamily:"Arial"}}>
      <StudentList />
      <StudentDetails student={selectedStudent} />
    </div>
  );
}
