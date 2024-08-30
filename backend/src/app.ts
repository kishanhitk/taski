import "./types";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import taskRoutes from "./routes/tasks";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is healthy" });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3100;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}. Navigate to http://localhost:${PORT}`
  );
});
