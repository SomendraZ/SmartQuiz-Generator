import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/AttemptPreviousQuizzes.css";
import homeImg from "../resources/home.png";
const viewPreviousQuizzesEndpoint =
  process.env.REACT_APP_VIEW_PREVIOUS_QUIZZES_ENDPOINT;

const AttemptPreviousQuizzes = ({ userEmail, dynamicPathPrefix }) => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  // eslint-disable-next-line
  const [quizData, setQuizData] = useState(null);

  const handleHomeClick = () => {
    navigate(`${dynamicPathPrefix}/home`);
  };

  const handleQuizClick = async (index) => {
    try {
      const selectedQuiz = quizzes[index];
      setQuizData(selectedQuiz);
      navigate(
        `${dynamicPathPrefix}/quiz/${encodeURIComponent(
          selectedQuiz.quizName
        )}`,
        {
          state: { quizData: selectedQuiz },
        }
      );
    } catch (error) {
      console.error("Error fetching quiz data:", error);
    }
  };

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get(
          `${viewPreviousQuizzesEndpoint}${userEmail}`
        );
        setQuizzes(response.data.quizzes);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };
    fetchQuizzes();
  }, [userEmail]);

  return (
    <>
      <h1 className="navbar">
        Previous Quizzes
        <div className="navbar-right" onClick={handleHomeClick}>
          <img src={homeImg} alt="" className="home-image" />
        </div>
      </h1>
      <div className="quiz-container">
        <div className="previous-quiz-container">
          {quizzes.length === 0 ? (
            <button className="disabled-button" disabled>
              No Quizzes to Show
            </button>
          ) : (
            quizzes.map((quiz, index) => (
              <button key={quiz.id} onClick={() => handleQuizClick(index)}>
                {quiz.quizName}
              </button>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default AttemptPreviousQuizzes;
