import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/HomePage.css";

const HomePage = ({ jwtToken, userName, userEmail, dynamicPathPrefix }) => {
  const navigate = useNavigate();
  const [localUserName, setLocalUserName] = useState("");

  useEffect(() => {
    const storedUserName = localStorage.getItem("userName");
    if (storedUserName) {
      setLocalUserName(storedUserName);
    }
  }, []);

  const handleLogoutClick = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    navigate(`/login`);
    window.location.reload();
  };

  const handleSubmitParagraphClick = () => {
    navigate(`${dynamicPathPrefix}/submitParagraph`);
  };

  const handlePreviousQuizzesClick = () => {
    navigate(`${dynamicPathPrefix}/attemptPreviousQuizzes`);
  };

  const handleViewPreviousPerformanceClick = () => {
    navigate(`${dynamicPathPrefix}/viewPreviousPerformance`);
  }
  return (
    <div>
      <nav className="navbar">
        <div className="navbar-left">
          <h1>Welcome, {localUserName}!</h1>
        </div>
        <div className="navbar-right">
          <button onClick={handleLogoutClick}>Logout</button>
        </div>
      </nav>
      <div className="homepage-container">
        <button onClick={handleSubmitParagraphClick}>
          Submit Paragraph to create new Quiz
        </button>
        <button onClick={handlePreviousQuizzesClick}>
          Attempt Previous Quizzes
        </button>
        <button onClick={handleViewPreviousPerformanceClick}>View Previous Performance</button>
      </div>
    </div>
  );
};

export default HomePage;
