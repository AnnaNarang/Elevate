import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "../components/styles/Progress.css"; // Import the CSS for styling

// Sample data for calories burned graph
const caloriesData = [
  { day: "Mon", calories: 300 },
  { day: "Tue", calories: 450 },
  { day: "Wed", calories: 400 },
  { day: "Thu", calories: 500 },
  { day: "Fri", calories: 350 },
  { day: "Sat", calories: 600 },
  { day: "Sun", calories: 550 },
];

const caloriesConsumedData = [
  { day: "Mon", calories: 2200 },
  { day: "Tue", calories: 2000 },
  { day: "Wed", calories: 1900 },
  { day: "Thu", calories: 2100 },
  { day: "Fri", calories: 1800 },
  { day: "Sat", calories: 2200 },
  { day: "Sun", calories: 2500 },
];

// Sample statistics
const exerciseStats = {
  week: 10,
  month: 45,
  totalCalories: 3500,
  workoutsThisWeek: 5,
  dietThisWeek: "On Track",
};

// Sample goals/missions with progress
const missions = [
  {
    id: 1,
    goal: "Complete 5 workouts this week",
    isCompleted: true,
    progress: 100,
  },
  {
    id: 2,
    goal: "Burn 2000 calories in a week",
    isCompleted: false,
    progress: 50,
  },
  {
    id: 3,
    goal: "Follow diet plan for 7 consecutive days",
    isCompleted: true,
    progress: 100,
  },
];

const Progress = () => {
  const [userMissions, setUserMissions] = useState(missions);

  // Function to show badges when goals are completed
  const renderBadge = (isCompleted) => {
    return isCompleted ? (
      <span className="badge">🏅</span>
    ) : (
      <span className="no-badge">No Badge Yet</span>
    );
  };

  return (
    <div className="track-progress-page">
      <h1 className="main-heading"></h1>

      {/* Calories Burned Graph */}
      <div className="progress-section">
        <h2 className="section-title">Calories Burned Per Day</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={caloriesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="calories"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {/* Calories Consumed Graph */}
      <div className="progress-section">
        <h2 className="section-title">Calories Consumed Per Day</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={caloriesConsumedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="calories"
              stroke="#82ca9d"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Weekly, Monthly Statistics */}
      <div className="progress-section">
        <h2 className="section-title">Exercise & Diet Statistics</h2>
        <div className="stats-container">
          <div className="stats-box">
            <h3>This Week</h3>
            <p>Workouts: {exerciseStats.workoutsThisWeek}</p>
            <p>Calories Burned: {exerciseStats.totalCalories}</p>
            <p>Diet Status: {exerciseStats.dietThisWeek}</p>
          </div>
          <div className="stats-box">
            <h3>This Month</h3>
            <p>Exercises Done: {exerciseStats.month}</p>
          </div>
          <div className="stats-box">
            <h3>Overall Progress</h3>
            <p>Total Exercises: {exerciseStats.week}</p>
            <p>Total Calories Burned: {exerciseStats.totalCalories}</p>
          </div>
        </div>
      </div>

      {/* Goals/Missions */}
      <div className="progress-section">
        <h2 className="section-title">Current Missions & Goals</h2>
        <div className="missions-container">
          {userMissions.map((mission) => (
            <div
              key={mission.id}
              className={`mission ${mission.isCompleted ? "completed" : ""}`}
            >
              <p>{mission.goal}</p>
              <div className="progress-bar">
                <div
                  className="progress"
                  style={{ width: `${mission.progress}%` }}
                ></div>
              </div>
              <p className="progress-percentage">
                {mission.progress}% Completed
              </p>
              {renderBadge(mission.isCompleted)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Progress;
