import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import "../styles/SubmitParagraphPage.css";
import homeImg from "../resources/home.png";
const generateQuizEndpoint = process.env.REACT_APP_GENERATE_QUIZ_ENDPOINT;
const viewQuizNamesEndpoint = process.env.REACT_APP_VIEW_QUIZ_NAMES_ENDPOINT;

const SubmitParagraphPage = ({ dynamicPathPrefix, userEmail }) => {
  const navigate = useNavigate();
  const [quizName, setQuizName] = useState("");
  const [paragraph, setParagraph] = useState("");
  const [numberOfQuestions, setNumberOfQuestions] = useState(10);
  const handleHomeClick = () => {
    navigate(`${dynamicPathPrefix}/home`);
  };
  // eslint-disable-next-line
  const [quizData, setQuizData] = useState(null);

  const handleQuizClick = async () => {
    if (quizName.trim() === "") {
      toast.error("Please enter a quiz name", {
        position: "top-center",
        autoClose: 1250,
      });
    } else if (paragraph.trim() === "") {
      toast.error("Please enter a paragraph", {
        position: "top-center",
        autoClose: 1250,
      });
    } else {
      try {
        const existingQuizNames = quizData || [];
        const isNameExists = existingQuizNames.includes(quizName);

        if (isNameExists) {
          const existingNamesWithQuotes = existingQuizNames
            .map((name) => `"${name}"`)
            .join(", ");
          toast.error(
            `Quiz name already exists. Please enter a different name other than ${existingNamesWithQuotes}.`,
            {
              position: "top-center",
              autoClose: 3000,
            }
          );
        } else {
          toast.info("Generating quiz...", {
            position: "top-center",
            autoClose: false,
          });

          const response = await axios.post(`${generateQuizEndpoint}`, {
            quizName,
            userEmail,
            paragraph,
            numberOfQuestions,
          });

          const quizData = response.data.quiz;
          setQuizData(quizData);
          toast.dismiss();
          navigate(
            `${dynamicPathPrefix}/quiz/${encodeURIComponent(
              quizData.quizName
            )}`,
            {
              state: { quizData },
            }
          );
        }
      } catch (error) {
        console.error("Error submitting quiz:", error);
        toast.error(
          "Failed to submit paragraph data. Please try again later.",
          {
            position: "top-center",
            autoClose: 3000,
          }
        );
      }
    }
  };

  const handleInputChange = (event) => {
    setParagraph(event.target.value);
  };

  const handleQuizNameChange = (event) => {
    const newValue = event.target.value.replace(/\s/g, "_").toLowerCase();
    setQuizName(newValue);
  };

  const handleRadioChange = (event) => {
    setNumberOfQuestions(parseInt(event.target.value));
  };

  useEffect(() => {
    const fetchQuizNames = async () => {
      try {
        const response = await axios.get(
          `${viewQuizNamesEndpoint}${userEmail}`
        );
        setQuizData(response.data.quizNames);
      } catch (error) {
        console.error("Error fetching quiz names:", error);
      }
    };
    fetchQuizNames();
  }, [viewQuizNamesEndpoint, userEmail]);

  return (
    <>
      <ToastContainer theme="dark" />
      <div className="submit-paragraph-container">
        <h1 className="navbar">
          Quiz Details
          <div className="navbar-right" onClick={handleHomeClick}>
            <img src={homeImg} alt="" className="home-image" />
          </div>
        </h1>
        <input
          type="text"
          value={quizName}
          onChange={handleQuizNameChange}
          placeholder="Enter quiz name..."
          className="quiz-name-input"
        />
        <textarea
          value={paragraph}
          onChange={handleInputChange}
          placeholder="Enter your paragraph here..."
          className="paragraph-input"
        />
        <div className="radio-group">
          <h2>Number of MCQs to be generated&nbsp;:&nbsp;</h2>
          <input
            type="radio"
            id="10-questions"
            name="numberOfQuestions"
            value="10"
            checked={numberOfQuestions === 10}
            onChange={handleRadioChange}
          />
          <label htmlFor="10-questions">10 MCQs</label>
          <input
            type="radio"
            id="20-questions"
            name="numberOfQuestions"
            value="20"
            checked={numberOfQuestions === 20}
            onChange={handleRadioChange}
          />
          <label htmlFor="20-questions">20 MCQs</label>
          <input
            type="radio"
            id="30-questions"
            name="numberOfQuestions"
            value="30"
            checked={numberOfQuestions === 30}
            onChange={handleRadioChange}
          />
          <label htmlFor="30-questions">30 MCQs</label>
        </div>
        <button onClick={handleQuizClick} className="quiz-button">
          Start Quiz
        </button>
      </div>
    </>
  );
};

export default SubmitParagraphPage;
