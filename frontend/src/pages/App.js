import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from "../components/Navbar";
import Diet from "./Diet"
import Workout from "./Workout";
import Progress from "./Progress";
import Community from "./Community";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Home from "./Home";
import Knowledge from "./Knowledge";

function App() {
  return (
    <Router>
      <div>
        <NavBar />
        <Routes>
          <Route path="/diet" element={<Diet/>} />
          <Route path="/workout" element={<Workout/>} />
          <Route path="/progress" element={<Progress/>} />
          <Route path="/community" element={<Community/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/" element={<Home/>} />
          <Route path="/Knowledge" element={<Knowledge/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
