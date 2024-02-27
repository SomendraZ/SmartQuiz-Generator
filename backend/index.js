import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";

import { authRoutes } from "./routes/authRoute.js";
import { quizRoutes } from "./routes/quizRoute.js";
import { performanceRoutes } from "./routes/performanceRoute.js";

const app = express();
app.use(cors());
app.use(express.json());

dotenv.config();

// Routes
app.use("/google", authRoutes);
app.use("/generate", quizRoutes);
app.use("/view", quizRoutes);
app.use("/save", performanceRoutes);
app.use("/view", performanceRoutes);

mongoose.connect(process.env.MONGO_URI);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", async () => {
  console.log("Connected to MongoDB");
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Listening to PORT ${PORT}`);
});
