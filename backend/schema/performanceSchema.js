import { Schema, model } from "mongoose";

const performanceSchema = new Schema({
  quizName: {
    type: String,
    required: true,
  },
  attemptNumber: {
    type: Number,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  totalQuestions: {
    type: Number,
    required: true,
  },
  correctAnswers: {
    type: Number,
    required: true,
  },
  incorrectAnswers: {
    type: Number,
    required: true,
  },
  percentage: {
    type: Number,
    required: true,
  },
  answers: [
    {
      question: String,
      userAnswer: String,
      correctAnswer: String,
      explanation: String,
      isCorrect: Boolean,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Performance = model("Performance", performanceSchema);

export default Performance;
