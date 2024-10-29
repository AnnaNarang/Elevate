import React, { useState, useEffect } from "react";
import "../components/styles/Workout.css"; // Import appropriate styles
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
export default function WorkoutPage() {
  const [currentExercise, setCurrentExercise] = useState(null);
  const [totalCaloriesBurned, setTotalCaloriesBurned] = useState(0);
  const [exerciseList, setExerciseList] = useState([]);
  const [completedExercises, setCompletedExercises] = useState([]);
  const [message, setMessage] = useState(""); // Message for feedback
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const checkAuthentication = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (accessToken) {
      // Decode the token and check its expiration
      const { exp } = jwtDecode(accessToken);
      if (Date.now() / 1000 >= exp) {
        console.log("exp");
        // Access token expired, try to refresh
        if (refreshToken) {
          const response = await fetch(
            "http://localhost:8000/api/users/token/refresh/",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ refresh: refreshToken }),
            }
          ).catch((err) => console.log(err));

          if (response.ok) {
            const data = await response.json();
            localStorage.setItem("accessToken", data.access);
            //console.log(true);
            setIsAuthenticated(true);
          } else {
            console.log(false);
            // Refresh token expired or invalid, log out
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            setIsAuthenticated(false);
          }
        }
      } else {
        // Access token is valid
        console.log("made it true");
        setIsAuthenticated(true);
      }
    } else {
      setIsAuthenticated(false);
    }
  };
  //console.log(isAuthenticated);

  // Fetch today's exercises from the backend API
  function fetchExercises() {
    //const userDetails = JSON.parse(localStorage.getItem("userDetails"));
    const token = localStorage.getItem("accessToken");
    fetch(`http://127.0.0.1:8000/api/workouts/exercises/today/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setExerciseList(data.exercises);
        if (data.exercises.length === 0) {
          return;
        }
        setCurrentExercise(data.exercises[0]); // Set first exercise as default
      })
      .catch((error) => console.error("Error fetching exercises:", error));
  }

  // Fetch completed exercises for today
  const fetchCompletedExercises = () => {
    //const userDetails = JSON.parse(localStorage.getItem("userDetails"));
    const token = localStorage.getItem("accessToken");
    // if (!token) {
    //   navigate("/login");
    // }
    fetch(`http://127.0.0.1:8000/api/workouts/completed_exercises/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        //console.log(data);
        setCompletedExercises(data.completed_exercises);
      })
      .catch((error) =>
        console.error("Error fetching completed exercises:", error)
      );
  };

  // Calculate total calories burned
  const calculateTotalCalories = () => {
    const totalCalories = exerciseList.reduce((total, exercise) => {
      if (completedExercises.includes(exercise.id)) {
        return total + exercise.calories_burned;
      }
      return total;
    }, 0);
    setTotalCaloriesBurned(totalCalories);
  };

  useEffect(() => {
    async function fetchexercisedandcompleted() {
      await checkAuthentication();
      const token = localStorage.getItem("accessToken");
      if (!token) {
        navigate("/login");
      } else {
        fetchExercises(); // Call fetchExercises on component mount
        fetchCompletedExercises();
      }
    }
    fetchexercisedandcompleted();
    // Call fetchCompletedExercises on component mount
  }, []);

  //console.log(exerciseList);
  useEffect(() => {
    calculateTotalCalories(); // Calculate total calories burned when exerciseList or completedExercises changes
  }, [exerciseList, completedExercises]);

  // Handle when the user selects an exercise
  const handleExerciseSelect = (exercise) => {
    setCurrentExercise(exercise);
    setMessage(""); // Clear previous messages when switching exercises
  };

  // Handle when the user marks an exercise as done
  const handleCompleteExercise = async (exerciseId) => {
    //const userDetails = JSON.parse(localStorage.getItem("userDetails"));
    await checkAuthentication();
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
    }
    //const token = localStorage.getItem("accessToken");
    fetch(`http://127.0.0.1:8000/api/workouts/mark_done/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        workout_exercise_id: exerciseId,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Update message and fetch completed exercises again
          setMessage("Exercise marked as done!");
          fetchCompletedExercises(); // Fetch completed exercises again to update state
        } else {
          setMessage(data.message || "Failed to mark exercise as done.");
        }
      })
      .catch((error) => {
        console.error("Error marking exercise done:", error);
        setMessage("Error occurred while marking exercise as done.");
      });
  };

  return (
    <div className="workout-container">
      {/* Left Section: List of Exercises */}
      {exerciseList.length > 0 ? (
        <div className="exercise-list">
          <h2>Your Workout</h2>
          <ul>
            {exerciseList.map((exercise) => (
              <li
                key={exercise.id}
                onClick={() => handleExerciseSelect(exercise)}
                className={
                  completedExercises.includes(exercise.id) ? "completed" : ""
                }
              >
                {exercise.exercise_name}
                {completedExercises.includes(exercise.id) && (
                  <span className="checkmark">✔</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No workout for today!</p>
      )}

      {/* Middle Section: Video and Details */}
      {currentExercise && (
        <div className="exercise-video-section">
          <h2>{currentExercise.exercise_name}</h2>
          <iframe
            className="exercise-video"
            src={currentExercise.video_url}
            title={currentExercise.exercise_name}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
          <p>{currentExercise.description}</p>
        </div>
      )}

      {/* Right Section: Reps, Sets, and Completion */}
      {currentExercise && (
        <div className="exercise-details">
          <h2>Exercise Details</h2>
          <p>
            <strong>Sets:</strong> {currentExercise.sets}
          </p>
          <p>
            <strong>Reps:</strong> {currentExercise.reps}
          </p>
          <p className="exercise-details-calorie">
            <strong>Calories Burned per Exercise:</strong>{" "}
            {currentExercise.calories_burned}
          </p>
          <button
            onClick={() => handleCompleteExercise(currentExercise.id)}
            disabled={completedExercises.includes(currentExercise.id)}
            className={`complete-exercise-button ${
              completedExercises.includes(currentExercise.id) ? "disabled" : ""
            }`}
          >
            {completedExercises.includes(currentExercise.id)
              ? "Completed"
              : "Mark as Done"}
          </button>
        </div>
      )}

      {/* Bottom Section: Total Calories Burned
      <div className="calories-burned-section">
        <h2>Total Calories Burned Today: {totalCaloriesBurned}</h2>
        {message && <p className="feedback-message">{message}</p>}
      </div> */}
    </div>
  );
}
