import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "../styles/QuizPage.css";
import axios from "axios";
const savePerformanceEndpoint = process.env.REACT_APP_SAVE_PERFORMANCE_ENDPOINT;

const QuizPage = ({ dynamicPathPrefix, userEmail }) => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [shuffledQuizData, setShuffledQuizData] = useState([]);
  const [performanceData, setPerformanceData] = useState(null); // State to store performance data
  const { quizName } = useParams();
  const location = useLocation();
  const { quizData } = location.state;

  const shuffleQuizData = useCallback(() => {
    const shuffledQuestions = [...quizData.questions].sort(
      () => Math.random() - 0.5
    );
    const shuffledOptions = shuffledQuestions.map((question) => ({
      ...question,
      options: [...question.options].sort(() => Math.random() - 0.5),
    }));
    setShuffledQuizData(shuffledOptions);
  }, [quizData]);

  useEffect(() => {
    setCurrentQuestionIndex(0);
    shuffleQuizData();
  }, [shuffleQuizData]);

  useEffect(() => {
    if (performanceData !== null) {
      axios.post(`${savePerformanceEndpoint}`, performanceData);
      navigate(`${dynamicPathPrefix}/performance/${quizName}`, {
        state: {
          performanceData: performanceData,
          quizName: quizName,
          userEmail: userEmail,
        },
      });
    }
  }, [performanceData, dynamicPathPrefix, navigate, quizName, userEmail]);

  const handleAnswerClick = (optionIndex) => {
    const updatedUserAnswers = [...userAnswers, optionIndex];
    setUserAnswers(updatedUserAnswers);
    if (currentQuestionIndex + 1 === shuffledQuizData.length) {
      setPerformanceData(createPerformanceData(updatedUserAnswers));
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const createPerformanceData = (updatedUserAnswers) => {
    return {
      quizName: quizName,
      userEmail: userEmail,
      totalQuestions: shuffledQuizData.length,
      correctAnswers: calculateScore(updatedUserAnswers),
      incorrectAnswers:
        shuffledQuizData.length - calculateScore(updatedUserAnswers),
      percentage: percentage(updatedUserAnswers),
      answers: updatedUserAnswers.map((userAnswer, index) => ({
        question: shuffledQuizData[index].question,
        userAnswer: shuffledQuizData[index].options[userAnswer],
        correctAnswer: shuffledQuizData[index].answer,
        explanation: shuffledQuizData[index].explanation,
        isCorrect:
          shuffledQuizData[index].options[userAnswer] ===
          shuffledQuizData[index].answer,
      })),
    };
  };

  const calculateScore = (updatedUserAnswers) => {
    let score = 0;
    updatedUserAnswers.forEach((userAnswer, index) => {
      const correctIndex = shuffledQuizData[index].options.findIndex(
        (option) => option === shuffledQuizData[index].answer
      );
      if (userAnswer === correctIndex) {
        score++;
      }
    });
    return score;
  };

  const percentage = (updatedUserAnswers) => {
    return (calculateScore(updatedUserAnswers) / shuffledQuizData.length) * 100;
  };

  return (
    <>
      <h1 className="navbar">Quiz Page</h1>
      <div className="quiz-container">
        {currentQuestionIndex < shuffledQuizData.length && (
          <div>
            <h2>{shuffledQuizData[currentQuestionIndex].question}</h2>
            <ul>
              {shuffledQuizData[currentQuestionIndex].options.map(
                (option, index) => (
                  <li key={option} onClick={() => handleAnswerClick(index)}>
                    {option}
                  </li>
                )
              )}
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default QuizPage;
