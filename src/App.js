import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import "./r.css";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import Surveillance from "./components/Surveillance";
import IrregularSpaceDetection from "./components/SpaceManagement";
import Notifications from "./components/Notifications";
import NoticeForm from "./components/NoticeForm";
import ModernChatbot from "./components/ModernCircular";
import CircularGenerator from "./components/CircularGenerator";
import DigiNotice from "./components/DigiNotice form"   ;  
import SampleUsers from "./components/CircuLibrary";
import  ParentConnect from"./components/parentconnect";
import TimetableFrontend from "./components/TimetableFrontend";
import FacultyAnalysisModal from "./components/Facultyanalysismodel";


function App() {
  return (
    <Router>
      <Navbar />  {/* Navbar always visible */}
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/surveillance" element={<Surveillance />} />
        <Route path="/space" element={<IrregularSpaceDetection />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/circular-generator" element={<CircularGenerator />} />
        <Route path="/ ModernChatbot" element={<ModernChatbot />} />
        <Route path="/AIApp" element={<NoticeForm />} />
        <Route path="/settings" element={<DigiNotice />} />
        <Route path="/TimetableFrontend" element={<TimetableFrontend />} />
        <Route path="/CircuAIApp" element={<SampleUsers />} />
        <Route path="/ParentConnect" element={<ParentConnect />} />
        <Route path="/FacultyAnalysisModel" element={<FacultyAnalysisModal />}/>

      </Routes>
    </Router>
  );
}

export default App;
;

