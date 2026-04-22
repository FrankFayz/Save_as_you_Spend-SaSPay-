import React, { useState } from "react";
import Landing from "./components/Landing/Landing";
import Signup from "./components/Auth/Signup";
import Login from "./components/Auth/Login";
import UserProfile from "./components/Auth/UserProfile";
import Dashboard from "./components/Dashboard/MainDashboard";

const App = () => {
  const [page, setPage] = useState("landing"); // Start with landing page
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState("dashboard");

  const handleLoginSuccess = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoggedIn(true);
    setCurrentView("dashboard");
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      localStorage.removeItem("user");
      localStorage.removeItem("authToken");
      setUser(null);
      setIsLoggedIn(false);
      setCurrentView("dashboard");
      setPage("landing");
    }
  };

  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const goToProfile = () => {
    setCurrentView("profile");
  };

  const goBackToDashboard = () => {
    setCurrentView("dashboard");
  };

  if (isLoggedIn) {
    if (currentView === "profile") {
      return <UserProfile user={user} onBack={goBackToDashboard} onUpdateUser={handleUpdateUser} />;
    }
    return <Dashboard user={user} onLogout={handleLogout} onProfileClick={goToProfile} />;
  }

  return (
    <>
      {page === "landing" ? (
        <Landing
          goToLogin={() => setPage("login")}
          goToSignup={() => setPage("signup")}
        />
      ) : page === "signup" ? (
        <Signup 
          goToLogin={() => setPage("login")}
          goToLanding={() => setPage("landing")}
        />
      ) : (
        <Login
          goToSignup={() => setPage("signup")}
          goToLanding={() => setPage("landing")}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </>
  );
};

export default App;