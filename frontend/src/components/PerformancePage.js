import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../styles/PerformancePage.css";
import homeImg from "../resources/home.png";
import reattemptImg from "../resources/reattempt.png";
const reattemptQuiz=process.env.REACT_APP_VIEW_QUIZ_ENDPOINT;

const PerformancePage = ({ dynamicPathPrefix }) => {
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState([]);
  const { performanceData, quizName, userEmail } = useLocation().state;

  const calculateScore = performanceData.correctAnswer;

  const [showExplanation, setShowExplanation] = useState(
    Array(performanceData.answers.length).fill(false)
  );

  const toggleExplanation = (index) => {
    const newShowExplanation = [...showExplanation];
    newShowExplanation[index] = !newShowExplanation[index];
    setShowExplanation(newShowExplanation);
  };

  const percentage = performanceData.percentage;
  let percentageClass = "";
  if (percentage === 100) {
    percentageClass = "sparkling";
  } else if (percentage >= 80) {
    percentageClass = "green";
  } else if (percentage >= 50) {
    percentageClass = "orange";
  } else {
    percentageClass = "red";
  }

  const renderPerformanceDetails = () => {
    return performanceData.answers.map((questionData, index) => {
      const userAnswer = performanceData.answers[index].userAnswer;
      const correctAnswer = performanceData.answers[index].correctAnswer;
      const isCorrect = userAnswer === correctAnswer;
      const explanation = performanceData.answers[index].explanation;

      return (
        <div className="performance-item" key={index}>
          <h2>
            {index + 1}) {questionData.question}
          </h2>
          <h3>
            <strong>Your Answer:</strong>{" "}
            <span className={isCorrect ? "correct-answer" : "incorrect-answer"}>
              {userAnswer}
            </span>
          </h3>
          <h3>
            <strong>Correct Answer:</strong> {correctAnswer}
          </h3>
          <div
            className="explanation-toggle"
            onClick={() => toggleExplanation(index)}
          >
            {/* Explanation {showExplanation[index] ? "🔓" : "🔒"} */}
            Explanation {showExplanation[index] ? "▲" : "▽"}
          </div>
          {showExplanation[index] && (
            <p className="explanation">
              <strong>Explanation:</strong> {explanation}
            </p>
          )}
        </div>
      );
    });
  };

  const handleHomeClick = () => {
    navigate(`${dynamicPathPrefix}/home`);
  };

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get(
          `${reattemptQuiz}${userEmail}/${quizName}`
        );
        setQuizData(response.data.quiz);
      } catch (error) {
        console.error("Error fetching quiz:", error);
      }
    };
    fetchQuiz();
  }, [userEmail, quizName]);

  const handleReAttemptQuiz = () => {
    try {
      navigate(`${dynamicPathPrefix}/quiz/${encodeURIComponent(quizName)}`, {
        state: { quizData },
      });
    } catch (error) {
      console.error("Error fetching quiz data:", error);
    }
  } 

  return (
    <>
      <h1 className="navbar">
        Performance Page
        <div className="navbar-right" onClick={handleHomeClick}>
          <img src={homeImg} alt="" className="home-image" />
        </div>
      </h1>
      <div className="performance-container">
        <img src={reattemptImg} alt="" className="reattempt-Img" onClick={handleReAttemptQuiz} />                   
        <h2 className="summary-heading">Your Performance Summary </h2>
        <div className="performance-summary">
          <p className="summary-text">
            Total Questions: {performanceData.totalQuestions}
          </p>
          <p className="summary-text">
            Correct Answers:{" "}
            {calculateScore ? calculateScore : performanceData.correctAnswers}
          </p>
          <p className="summary-text">
            Incorrect Answers: {performanceData.incorrectAnswers}
          </p>
          <p className={`percentage ${percentageClass}`}>
            Percentage: <span className={percentageClass}>{percentage}%</span>
          </p>
        </div>
        <hr />
        <div className="performance-details">{renderPerformanceDetails()}</div>
      </div>
    </>
  );
};

export default PerformancePage;
