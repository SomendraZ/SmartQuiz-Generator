import express from "express";
import bodyParser from "body-parser";
import { OpenAI } from "openai";
import Quiz from "../schema/quizSchema.js";

const router = express.Router();
router.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateQuestions(paragraph, numberOfQuestions) {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant designed to output JSON.",
      },
      {
        role: "user",
        content: `Please generate multiple-choice questions based on the following paragraph ${paragraph}. Generate ${numberOfQuestions} questions. Please ensure each question has plausible options, a correct answer, and an explanation.`,
      },
    ],
    model: "gpt-3.5-turbo-0125",
    response_format: { type: "json_object" },
  });

  const choices = JSON.parse(completion.choices[0].message.content).questions;

  const questions = [];

  for (let i = 0; i < numberOfQuestions; i++) {
    const question = {
      question: choices[i].question,
      options: choices[i].options,
      answer: choices[i].answer,
      explanation: choices[i].explanation,
    };

    questions.push(question);
  }

  return questions;
}

router.post("/quiz", async (req, res) => {
  try {
    const { quizName, userEmail, paragraph, numberOfQuestions } = req.body;

    const questions = await generateQuestions(paragraph, numberOfQuestions);

    const quiz = new Quiz({
      quizName,
      userEmail,
      paragraph,
      numberOfQuestions,
      questions,
    });

    await quiz.save();

    res.status(201).json({ message: "Quiz created successfully", quiz });
  } catch (error) {
    console.error("Error creating quiz:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/quizzes/:userEmail", async (req, res) => {
  try {
    const userEmail = req.params.userEmail;
    const quizzes = await Quiz.find({ userEmail });

    if (!quizzes || quizzes.length === 0) {
      return res.status(404).json({ message: "No quizzes found for the user" });
    }

    res.status(200).json({ quizzes });
  } catch (error) {
    console.error("Error retrieving quizzes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



export { router as quizRoutes };
