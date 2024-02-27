// performanceRoutes.js

import express from "express";
import Performance from "../schema/performanceSchema.js";

const router = express.Router();

router.post("/performance", async (req, res) => {
  const {
    quizName,
    userEmail,
    totalQuestions,
    correctAnswers,
    incorrectAnswers,
    percentage,
    answers,
  } = req.body;

  try {
    const latestPerformance = await Performance.findOne({
      quizName,
      userEmail,
    }).sort({ attemptNumber: -1 });

    let attemptNumber = 1;
    if (latestPerformance) {
      attemptNumber = latestPerformance.attemptNumber + 1;
    }

    const performance = new Performance({
      quizName,
      userEmail,
      totalQuestions,
      correctAnswers,
      incorrectAnswers,
      percentage,
      answers,
      attemptNumber,
    });
    const savedPerformance = await performance.save();
    res.status(201).json(savedPerformance);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get("/performances/:userEmail", async (req, res) => {
  try {
    const userEmail = req.params.userEmail;
    const performances = await Performance.find({ userEmail });

    if (!performances || performances.length === 0) {
      return res
        .status(404)
        .json({ message: "No performances found for the user" });
    }

    res.status(200).json({ performances });
  } catch (error) {
    console.error("Error retrieving performances:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export { router as performanceRoutes };
