import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import quizImage from "../resources/SQ.png";
import "../styles/LoginPage.css";
const googleAuthEndpoint = process.env.REACT_APP_GOOGLE_AUTH_ENDPOINT;

const google =
  "https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png";

const LoginPage = ({ onLogin, dynamicPathPrefix }) => {
  const navigate = useNavigate();

  const handleLoginClick = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async ({ code }) => {
      try {
        const response = await axios.post(
          `${googleAuthEndpoint}`,
          null,
          {
            headers: {
              Authorization: `Bearer ${code}`,
            },
          }
        );
        const { jwt_token, user_name, user_email } = response.data;
        onLogin({
          jwtToken: jwt_token,
          userName: user_name,
          userEmail: user_email,
        });
      } catch (error) {
        toast.error("Sign-In failed.", {
          position: "top-left",
          autoClose: 2000,
        });
      }
    },
    onError: async (error) => {
      toast.error("Sign-In failed.", {
        position: "top-left",
        autoClose: 2000,
      });
    },
  });

  useEffect(() => {
    if (dynamicPathPrefix && dynamicPathPrefix !== "/") {
      navigate(`/${dynamicPathPrefix.split("/")[1]}/home`);
    }
  }, [dynamicPathPrefix, navigate]);

  return (
    <>
      <ToastContainer theme="dark" />
      <div className="container">
        <img src={quizImage} alt="SmartQuiz" className="quiz-image" />
        <h1 className="appName">Welcome to SmartQuiz Generator</h1>
        <p className="description">
          Log in to access features such as generating quizzes based on inputted
          text, tracking your performance, re-attempting any previous quiz
          anytime, and viewing all your previous performance.
        </p>
        <button className="handleLoginClick" onClick={handleLoginClick}>
          <div className="google">
            <img src={google} alt="" id="google" />
            Login with Google
          </div>
        </button>
      </div>
    </>
  );
};

export default LoginPage;
