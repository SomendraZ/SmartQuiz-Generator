import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import LoginPage from "./components/LoginPage";
import HomePage from "./components/HomePage";
import SubmitParagraphPage from "./components/SubmitParagraphPage";
import QuizPage from "./components/QuizPage";
import PerformancePage from "./components/PerformancePage";
import AttemptPreviousQuizzes from "./components/AttemptPreviousQuizzes";
import ViewPreviousPerformance from "./components/ViewPreviousPerformance";

const App = () => {
  const [jwtToken, setJwtToken] = useState(localStorage.getItem("jwtToken"));
  const [userName, setUserName] = useState(localStorage.getItem("userName"));
  const [userEmail, setUserEmail] = useState(localStorage.getItem("userEmail"));

  const handleLogin = ({
    jwtToken: token,
    userName: name,
    userEmail: email,
  }) => {
    setJwtToken(token);
    localStorage.setItem("jwtToken", token);
    setUserName(name);
    localStorage.setItem("userName", name);
    setUserEmail(email);
    localStorage.setItem("userEmail", email);
  };

  // Generate dynamic path based on user's first name in lowercase
  const dynamicPathPrefix = userName
    ? `/${userName.split(" ")[0].toLowerCase()}`
    : "";

  const router = createBrowserRouter([
    {
      path: "/",
      element: jwtToken ? (
        <Navigate to={`${dynamicPathPrefix}/home`} replace />
      ) : (
        <Navigate to="/login" replace />
      ),
    },
    {
      path: "/login",
      element: jwtToken ? (
        <Navigate to={`${dynamicPathPrefix}/home`} replace /> // Redirect to home page if token exists
      ) : (
        <LoginPage
          onLogin={handleLogin}
          dynamicPathPrefix={dynamicPathPrefix}
        />
      ),
    },
    {
      path: `${dynamicPathPrefix}/home`,
      element: jwtToken ? (
        <HomePage
          jwtToken={jwtToken}
          userName={userName}
          userEmail={userEmail}
          dynamicPathPrefix={dynamicPathPrefix}
        />
      ) : (
        <Navigate to="/login" replace />
      ),
    },
    {
      path: `${dynamicPathPrefix}/submitParagraph`,
      element: jwtToken ? (
        <SubmitParagraphPage
          dynamicPathPrefix={dynamicPathPrefix}
          userEmail={userEmail}
        />
      ) : (
        <Navigate to="/login" replace />
      ),
    },
    {
      path: `${dynamicPathPrefix}/quiz/:quizName`,
      element: jwtToken ? (
        <QuizPage dynamicPathPrefix={dynamicPathPrefix} userEmail={userEmail} />
      ) : (
        <Navigate to="/login" replace />
      ),
    },
    {
      path: `${dynamicPathPrefix}/performance/:quizName`,
      element: jwtToken ? (
        <PerformancePage
          dynamicPathPrefix={dynamicPathPrefix}
          userEmail={userEmail}
        />
      ) : (
        <Navigate to="/login" replace />
      ),
    },
    {
      path: `${dynamicPathPrefix}/attemptPreviousQuizzes`,
      element: jwtToken ? (
        <AttemptPreviousQuizzes
          dynamicPathPrefix={dynamicPathPrefix} 
          userEmail={userEmail}
        />
      ) : (
        <Navigate to="/login" replace />
      ),
    },
    {
      path: `${dynamicPathPrefix}/viewPreviousPerformance`,
      element: jwtToken ? (
        <ViewPreviousPerformance
          dynamicPathPrefix={dynamicPathPrefix}
          userEmail={userEmail}
        />
      ) : (
        <Navigate to="/login" replace />
      ),
    }
  ]);

  return (
    <React.StrictMode>
      <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
        <RouterProvider router={router} />
      </GoogleOAuthProvider>
    </React.StrictMode>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
