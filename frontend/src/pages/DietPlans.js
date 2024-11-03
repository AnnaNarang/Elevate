// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import "../components/styles/Dietplans.css"; // Assuming you have some CSS for styling
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css"; // Toast notifications for feedback
// import { jwtDecode } from "jwt-decode";
// import dietplanCoffeeImage from "../images/dietplan_coffee.jpg";

// export default function DietPlansPage() {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [dietPlans, setDietPlans] = useState([]);
//   const [currentPlan, setCurrentPlan] = useState(null);
//   const navigate = useNavigate();

//   const notifyError = (message) =>
//     toast.error(message, { position: "top-right" });

//   const notifySuccess = (message) =>
//     toast.success(message, { position: "top-right" });

//   const checkAuthentication = async () => {
//     const accessToken = localStorage.getItem("accessToken");
//     const refreshToken = localStorage.getItem("refreshToken");

//     if (accessToken) {
//       // Decode the token and check its expiration
//       const { exp } = jwtDecode(accessToken);
//       if (Date.now() / 1000 >= exp) {
//         console.log("exp");
//         // Access token expired, try to refresh
//         if (refreshToken) {
//           const response = await fetch(
//             "http://localhost:8000/api/users/token/refresh/",
//             {
//               method: "POST",
//               headers: { "Content-Type": "application/json" },
//               body: JSON.stringify({ refresh: refreshToken }),
//             }
//           );

//           if (response.ok) {
//             const data = await response.json();
//             localStorage.setItem("accessToken", data.access);
//             setIsAuthenticated(true);
//           } else {
//             console.log(false);
//             // Refresh token expired or invalid, log out
//             localStorage.removeItem("accessToken");
//             localStorage.removeItem("refreshToken");
//             setIsAuthenticated(false);
//           }
//         }
//       } else {
//         // Access token is valid
//         setIsAuthenticated(true);
//       }
//     } else {
//       setIsAuthenticated(false);
//     }
//   };
//   useEffect(() => {
//     async function fetchplan() {
//       await checkAuthentication();
//       const token = localStorage.getItem("accessToken");
//       const headersNoauth = {
//         Authorization: `Bearer ${token}`,
//       };

//       if (!token) {
//         fetch("http://localhost:8000/api/diet/diet-plans/", {
//           headersNoauth,
//         })
//           .then((response) => response.json())
//           .then((plansData) => setDietPlans(plansData))
//           .catch(() =>
//             notifyError("Error fetching workout plans!", "top-right")
//           );
//       } else {
//         if (!isAuthenticated) {
//           fetch(`http://localhost:8000/api/diet/user-diet-plan/`, {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//           })
//             .then((response) => response.json())
//             .then((data) => {
//               if (data.diet_plan) {
//                 setCurrentPlan(data);
//               } else {
//               }
//             })
//             .catch(() =>
//               notifyError("Error fetching current workout plan!", "top-right")
//             );
//         } else {
//           fetch("http://localhost:8000/api/diet/diet-plans/", {
//             headersNoauth,
//           })
//             .then((response) => response.json())
//             .then((plansData) => setDietPlans(plansData))
//             .catch(() =>
//               notifyError("Error fetching workout plans!", "top-right")
//             );
//         }
//       }
//     }
//     fetchplan();
//   }, [isAuthenticated]);

//   const handleSelectPlan = async (planId, planName) => {
//     await checkAuthentication();
//     const token = localStorage.getItem("accessToken");
//     if (!token) {
//       alert("Login again to select the plan");
//       return;
//     }

//     const ans = window.confirm(`Confirm your workout plan:- ${planName}`);
//     if (!ans) {
//       return;
//     }

//     fetch("http://localhost:8000/api/diet/user-diet-plan/", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({
//         diet_plan_id: planId,
//       }),
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         setCurrentPlan(data);
//         notifySuccess("Plan selected successfully!", "top-right");
//       })
//       .catch(() => notifyError("Error selecting plan!", "top-right"));
//   };

//   const handleExitPlan = async () => {
//     const token = localStorage.getItem("accessToken");
//     await checkAuthentication();
//     if (!token) {
//       alert("Login Expired...");
//       navigate("/login");
//     }

//     const ans = window.confirm("Do you want to remove the current plan");
//     if (!ans) {
//       return;
//     }

//     fetch(`http://localhost:8000/api/diet/exit-diet-plan/`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     })
//       .then((response) => response.json())
//       .then(() => {
//         setCurrentPlan(null);
//         notifySuccess("Successfully exited the Diet plan!", "top-right");
//       })
//       .catch(() => notifyError("Error exiting Diet plan!", "top-right"))
//       .then(
//         fetch("http://localhost:8000/api/diet/diet-plans/")
//           .then((response) => response.json())
//           .then((plansData) => setDietPlans(plansData))
//           .catch(() =>
//             notifyError("Error fetching workout plans!", "top-right")
//           )
//       );
//   };

//   return (
//     <>
//       <ToastContainer />
//       <div className="diet-plans-page">
//         {!currentPlan ? (
//           <div>
//             <h2 className="section-title">Select a Diet Plan</h2>
//             <div className="outer-container">
//               <div className="plans-container">
//                 {dietPlans.length > 0 ? (
//                   dietPlans.map((plan) => (
//                     <div className="diet-plan-container" key={plan.id}>
//                       <div className="class-studio-video">
//                         <img src={dietplanCoffeeImage} className="plan-image" />
//                       </div>
//                       <div className="class-studio-text">
//                         <h1>{plan.plan_name}</h1>
//                         <p>{plan.description || "No description available."}</p>
//                         <span className="plan-category">
//                           {plan.category.category_name}
//                         </span>
//                         <div className="button-group">
//                           <button
//                             className="class-button"
//                             onClick={() =>
//                               handleSelectPlan(plan.id, plan.plan_name)
//                             }
//                           >
//                             Choose Plan
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   ))
//                 ) : (
//                   <p>No available diet plans. Refresh the page.</p>
//                 )}
//               </div>
//             </div>
//           </div>
//         ) : (
//           <div>
//             <h2 className="section-title">Your Current Diet Plan</h2>
//             <div className="outer-container">
//               {currentPlan && currentPlan.diet_plan ? (
//                 <div className="diet-plan-container">
//                   <div className="class-studio-video">
//                     <img
//                       src={dietplanCoffeeImage}
//                       className="plan-image"
//                       alt="image-of-food"
//                     />
//                   </div>
//                   <div className="class-studio-text">
//                     <h1>{currentPlan.diet_plan.plan_name}</h1>
//                     <p>
//                       {currentPlan.diet_plan.description ||
//                         "No description available."}
//                     </p>
//                     <span className="plan-category">
//                       {currentPlan.diet_plan.category.category_name}
//                     </span>
//                     <div className="button-group">
//                       <button
//                         className="class-button"
//                         onClick={() => navigate("/diet")}
//                       >
//                         Today's meals
//                       </button>
//                       <button
//                         className="class-button"
//                         onClick={() => handleExitPlan()}
//                       >
//                         Exit Plan
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ) : (
//                 <p>Loading diet plan details...</p>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// }
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../components/styles/Dietplans.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";
import dietplanCoffeeImage from "../images/dietplan_coffee.jpg";
import { motion } from "framer-motion"; // Import Framer Motion
export default function DietPlansPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [dietPlans, setDietPlans] = useState([]);
  const [currentPlan, setCurrentPlan] = useState(null);
  const navigate = useNavigate();

  const notifyError = (message) =>
    toast.error(message, { position: "top-right" });
  const notifySuccess = (message) =>
    toast.success(message, { position: "top-right" });

  const checkAuthentication = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (accessToken) {
      const { exp } = jwtDecode(accessToken);
      if (Date.now() / 1000 >= exp) {
        if (refreshToken) {
          const response = await fetch(
            "http://localhost:8000/api/users/token/refresh/",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ refresh: refreshToken }),
            }
          );
          if (response.ok) {
            const data = await response.json();
            localStorage.setItem("accessToken", data.access);
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            setIsAuthenticated(false);
          }
        }
      } else {
        setIsAuthenticated(true);
      }
    } else {
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    async function fetchPlans() {
      await checkAuthentication();
      const token = localStorage.getItem("accessToken");
      const headersNoauth = { Authorization: `Bearer ${token}` };

      if (!token) {
        fetch("http://localhost:8000/api/diet/diet-plans/", {
          headers: headersNoauth,
        })
          .then((response) => response.json())
          .then((plansData) => setDietPlans(plansData))
          .catch(() => notifyError("Error fetching workout plans!"));
      } else {
        if (!isAuthenticated) {
          fetch(`http://localhost:8000/api/diet/user-diet-plan/`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.diet_plan) setCurrentPlan(data);
            })
            .catch(() => notifyError("Error fetching current workout plan!"));
        } else {
          fetch("http://localhost:8000/api/diet/diet-plans/", {
            headers: headersNoauth,
          })
            .then((response) => response.json())
            .then((plansData) => setDietPlans(plansData))
            .catch(() => notifyError("Error fetching workout plans!"));
        }
      }
    }
    fetchPlans();
  }, [isAuthenticated]);

  const handleSelectPlan = async (planId, planName) => {
    await checkAuthentication();
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("Login again to select the plan");
      return;
    }

    const ans = window.confirm(`Confirm your workout plan: ${planName}`);
    if (!ans) return;

    fetch("http://localhost:8000/api/diet/user-diet-plan/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ diet_plan_id: planId }),
    })
      .then((response) => response.json())
      .then((data) => {
        setCurrentPlan(data);
        notifySuccess("Plan selected successfully!");
      })
      .catch(() => notifyError("Error selecting plan!"));
  };

  const handleExitPlan = async () => {
    const token = localStorage.getItem("accessToken");
    await checkAuthentication();
    if (!token) {
      alert("Login Expired...");
      navigate("/login");
    }

    const ans = window.confirm("Do you want to remove the current plan?");
    if (!ans) return;

    fetch("http://localhost:8000/api/diet/exit-diet-plan/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then(() => {
        setCurrentPlan(null);
        notifySuccess("Successfully exited the Diet plan!");
      })
      .catch(() => notifyError("Error exiting Diet plan!"))
      .then(
        fetch("http://localhost:8000/api/diet/diet-plans/")
          .then((response) => response.json())
          .then((plansData) => setDietPlans(plansData))
          .catch(() => notifyError("Error fetching workout plans!"))
      );
  };

  return (
    <>
      <ToastContainer />
      <div className="diet-plans-page">
        {!currentPlan ? (
          <div>
            <motion.h2
              className="section-title"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="diet-heading">Select a Diet Plan</h1>
            </motion.h2>
            <motion.div
              className="outer-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="plans-container">
                {dietPlans.length > 0 ? (
                  dietPlans.map((plan) => (
                    <motion.div
                      className="diet-plan-container"
                      key={plan.id}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                      whileHover={{ scale: 1.1 }}
                    >
                      <div className="class-studio-video">
                        <img
                          src={dietplanCoffeeImage}
                          className="plan-image"
                          alt="Diet plan"
                        />
                      </div>
                      <div className="class-studio-text">
                        <h1>{plan.plan_name}</h1>
                        <p>{plan.description || "No description available."}</p>
                        <span className="plan-category">
                          {plan.category.category_name}
                        </span>
                        <div className="button-group">
                          <motion.button
                            className="class-button"
                            onClick={() =>
                              handleSelectPlan(plan.id, plan.plan_name)
                            }
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Choose Plan
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p>No available diet plans. Refresh the page.</p>
                )}
              </div>
            </motion.div>
          </div>
        ) : (
          <div>
            <motion.h2
              className="section-title"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              Your Current Diet Plan
            </motion.h2>
            <motion.div
              className="outer-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              {currentPlan && currentPlan.diet_plan ? (
                <motion.div
                  className="diet-plan-container"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  whileHover={{ scale: 1.1 }}
                >
                  <div className="class-studio-video">
                    <img
                      src={dietplanCoffeeImage}
                      className="plan-image"
                      alt="Current Diet Plan"
                    />
                  </div>
                  <div className="class-studio-text">
                    <h1>{currentPlan.diet_plan.plan_name}</h1>
                    <p>
                      {currentPlan.diet_plan.description ||
                        "No description available."}
                    </p>
                    <span className="plan-category">
                      {currentPlan.diet_plan.category.category_name}
                    </span>
                    <div className="button-group">
                      <motion.button
                        className="class-button"
                        onClick={() => navigate("/diet")}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Today's meals
                      </motion.button>
                      <motion.button
                        className="class-button"
                        onClick={handleExitPlan}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Exit Plan
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <p>Loading diet plan details...</p>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </>
  );
}
