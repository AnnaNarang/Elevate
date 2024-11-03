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
      {/* <div className="diet-plans-page">
        {!currentPlan ? (
          <div>
            <motion.h2
              className="section-title"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="diet-heading">Discover Your Perfect Diet Plan</h1>
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
      </div> */}
      {/* <div className="p-6 max-w-4xl mx-auto">
        {!currentPlan ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
              Discover Your Perfect Diet Plan
            </h2>

            <div className="space-y-6">
              {dietPlans.length > 0 ? (
                dietPlans.map((plan) => (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-xl shadow-md overflow-hidden"
                  >
                    <div className="p-6 flex flex-col sm:flex-row gap-6">
                      <div className="w-full sm:w-48 h-48 flex-shrink-0">
                        <img
                          src={dietplanCoffeeImage}
                          className="w-full h-full object-cover rounded-lg"
                          alt="Diet plan"
                        />
                      </div>

                      <div className="flex-1 space-y-4">
                        <h3 className="text-2xl font-bold text-gray-900">
                          {plan.plan_name}
                        </h3>

                        <p className="text-gray-600">
                          {plan.description || "No description available."}
                        </p>

                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1 text-sm bg-orange-100 text-orange-800 rounded-full">
                            {plan.category.category_name}
                          </span>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            handleSelectPlan(plan.id, plan.plan_name)
                          }
                          className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
                        >
                          Choose Plan
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-center text-gray-500">
                  No available diet plans. Refresh the page.
                </p>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
              Your Current Diet Plan
            </h2>

            {currentPlan && currentPlan.diet_plan ? (
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6 flex flex-col sm:flex-row gap-6">
                  <div className="w-full sm:w-48 h-48 flex-shrink-0">
                    <img
                      src={dietplanCoffeeImage}
                      className="w-full h-full object-cover rounded-lg"
                      alt="Current Diet Plan"
                    />
                  </div>

                  <div className="flex-1 space-y-4">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {currentPlan.diet_plan.plan_name}
                    </h3>

                    <p className="text-gray-600">
                      {currentPlan.diet_plan.description ||
                        "No description available."}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 text-sm bg-orange-100 text-orange-800 rounded-full">
                        {currentPlan.diet_plan.category.category_name}
                      </span>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate("/diet")}
                        className="px-6 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
                      >
                        Today's meals
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleExitPlan}
                        className="px-6 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
                      >
                        Exit Plan
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-500">
                Loading diet plan details...
              </p>
            )}
          </motion.div>
        )}
      </div> */}
      <div className="p-6 max-w-3xl mx-auto">
        {!currentPlan ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-8 px-4">
              Discover Your Perfect Diet Plan
            </h2>

            <div className="space-y-6">
              {dietPlans.length > 0 ? (
                dietPlans.map((plan) => (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-xl shadow-md overflow-hidden"
                  >
                    <div className="p-6 flex flex-col sm:flex-row gap-6">
                      <div className="w-full sm:w-48 h-48 flex-shrink-0">
                        <img
                          src={dietplanCoffeeImage}
                          className="w-full h-full object-cover rounded-lg"
                          alt="Diet plan"
                        />
                      </div>

                      <div className="pl-10 flex-1 space-y-4 justify-start">
                        <h3 className="text-2xl font-bold text-gray-900 text-left">
                          {plan.plan_name}
                        </h3>

                        <p className="text-gray-600 text-left">
                          {plan.description || "No description available."}
                        </p>

                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1 text-sm bg-orange-100 text-orange-800 rounded-full">
                            {plan.category.category_name}
                          </span>
                        </div>
                        <div className="flex justify-start">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() =>
                              handleSelectPlan(plan.id, plan.plan_name)
                            }
                            className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
                          >
                            Choose Plan
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-left text-gray-500 px-4">
                  No available diet plans. Refresh the page.
                </p>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-8 px-4">
              Your Current Diet Plan
            </h2>

            {currentPlan && currentPlan.diet_plan ? (
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6 flex flex-col sm:flex-row gap-6">
                  <div className="w-full sm:w-48 h-48 flex-shrink-0">
                    <img
                      src={dietplanCoffeeImage}
                      className="w-full h-full object-cover rounded-lg"
                      alt="Current Diet Plan"
                    />
                  </div>

                  <div className="pl-10 flex-1 space-y-4">
                    <h3 className="text-2xl font-bold text-gray-900 text-left">
                      {currentPlan.diet_plan.plan_name}
                    </h3>

                    <p className="text-gray-600 text-left">
                      {currentPlan.diet_plan.description ||
                        "No description available."}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 text-sm bg-orange-100 text-orange-800 rounded-full">
                        {currentPlan.diet_plan.category.category_name}
                      </span>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate("/diet")}
                        className="px-6 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
                      >
                        Today's meals
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleExitPlan}
                        className="px-6 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
                      >
                        Exit Plan
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-left text-gray-500 px-4">
                Loading diet plan details...
              </p>
            )}
          </motion.div>
        )}
      </div>
    </>
  );
}
