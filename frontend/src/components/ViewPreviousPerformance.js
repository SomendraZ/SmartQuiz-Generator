import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/AttemptPreviousQuizzes.css";
import homeImg from "../resources/home.png";
const viewPerformancesEndpoint =
  process.env.REACT_APP_VIEW_PERFORMANCES_ENDPOINT;

const ViewPreviousPerformance = ({ dynamicPathPrefix, userEmail }) => {
  const navigate = useNavigate();
  const [performances, setPerformances] = useState([]);
  // eslint-disable-next-line
  const [quizPerformance, setQuizPerformance] = useState(null);

  const handleHomeClick = () => {
    navigate(`${dynamicPathPrefix}/home`);
  };

  const month = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];

  const handlePerformanceClick = async (index) => {
    try {
      const selectedPerformance = performances[index];
      setQuizPerformance(selectedPerformance);
      navigate(
        `${dynamicPathPrefix}/performance/${encodeURIComponent(
          selectedPerformance.quizName
        )}`,
        {
          state: { performanceData: selectedPerformance, quizName: selectedPerformance.quizName, userEmail: userEmail },
        }
      );
    } catch (error) {
      console.error("Error fetching performance data:", error);
    }
  };

  useEffect(() => {
    const fetchPerformances = async () => {
      try {
        const response = await axios.get(
          `${viewPerformancesEndpoint}${userEmail}`
        );

        const performancesWithDates = response.data.performances.map(
          (performance) => ({
            ...performance,
            createdAt: new Date(performance.createdAt),
          })
        );

        const sortedPerformances = performancesWithDates.sort((a, b) =>
          a.quizName.localeCompare(b.quizName)
        );

        setPerformances(sortedPerformances);
      } catch (error) {
        console.error("Error fetching performances:", error);
      }
    };
    fetchPerformances();
  }, [userEmail]);

  return (
    <>
      <h1 className="navbar">
        Previous Performances
        <div className="navbar-right" onClick={handleHomeClick}>
          <img src={homeImg} alt="" className="home-image" />
        </div>
      </h1>
      <div className="quiz-container">
        <div className="previous-quiz-container">
          {performances.length === 0 ? (
            <button className="disabled-button" disabled>
              No Performances to Show
            </button>
          ) : (
            performances.map((performance, index) => (
              <button key={index} onClick={() => handlePerformanceClick(index)}>
                Date: {performance.createdAt.getDate()}/
                {month[performance.createdAt.getMonth()]}/
                {performance.createdAt.getFullYear()} |{" "}
                <b style={{ color: "black" }}>{performance.quizName}</b> |
                Attempt No:
                {performance.attemptNumber} |
                <b style={{ color: "black" }}>
                  {" "}
                  Score: {performance.percentage}%
                </b>
              </button>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default ViewPreviousPerformance;
