import request from "supertest";
import express from "express";
import taskRoutes from "../tasks";
import { db } from "../../config/database";
import { authMiddleware } from "../../middleware/auth";
import { errorHandler } from "../../middleware/errorHandler";

// Mock the database and auth middleware
jest.mock("../../config/database");
jest.mock("../../middleware/auth");

const app = express();
app.use(express.json());
app.use(taskRoutes);
app.use(errorHandler); // Make sure this line is present

describe("Task Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (authMiddleware as jest.Mock).mockImplementation((req, res, next) => {
      req.userId = 1;
      next();
    });
  });

  describe("POST /", () => {
    it("should create a new task", async () => {
      const mockTask = { id: 1, title: "Test Task", status: "todo", userId: 1 };
      (db.insert as jest.Mock).mockReturnValue({
        values: jest.fn().mockReturnValue({
          returning: jest.fn().mockResolvedValue([mockTask]),
        }),
      });

      const response = await request(app)
        .post("/")
        .send({ title: "Test Task", status: "todo" });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockTask);
    });

    it("should return 400 if title or status is missing", async () => {
      const response = await request(app)
        .post("/")
        .send({ title: "Test Task" });

      expect(response.status).toBe(400);

      expect(response.body).toEqual({
        status: "error",
        message: "Title and status are required",
      });
    });
  });

  describe("GET /", () => {
    it("should return all tasks for the user", async () => {
      const mockTasks = [
        { id: 1, title: "Task 1", status: "todo", userId: 1 },
        { id: 2, title: "Task 2", status: "in_progress", userId: 1 },
      ];
      (db.select as jest.Mock).mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue(mockTasks),
        }),
      });

      const response = await request(app).get("/");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockTasks);
    });
  });

  // Add more tests for PUT, DELETE, and PATCH routes
});
