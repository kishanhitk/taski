import express from "express";
import { db } from "../config/database";
import { tasks } from "../models/schema";
import { authMiddleware } from "../middleware/auth";
import { eq, and } from "drizzle-orm";
import { AppError } from "../utils/errors";
import { validateTaskStatus } from "../utils/validation";

const router = express.Router();

router.use(authMiddleware);

router.post("/", async (req, res, next) => {
  try {
    const { title, description, status } = req.body;

    if (!title || !status) {
      throw new AppError("Title and status are required", 400);
    }
    if (!validateTaskStatus(status)) {
      throw new AppError("Invalid task status", 400);
    }
    const [task] = await db
      .insert(tasks)
      .values({ title, description, status, userId: req.userId })
      .returning();
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  if (!req.userId) {
    throw new AppError("No token provided", 401);
  }
  try {
    const userTasks = await db
      .select()
      .from(tasks)
      .where(eq(tasks.userId, req.userId));

    res.json(userTasks);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  if (!req.userId) {
    throw new AppError("No token provided", 401);
  }
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;
    if (!title || !status) {
      throw new AppError("Title and status are required", 400);
    }
    if (!validateTaskStatus(status)) {
      throw new AppError("Invalid task status", 400);
    }
    const [updatedTask] = await db
      .update(tasks)
      .set({ title, description, status, updatedAt: new Date() })
      .where(and(eq(tasks.id, parseInt(id)), eq(tasks.userId, req.userId)))
      .returning();
    if (!updatedTask) {
      throw new AppError("Task not found or unauthorized", 404);
    }
    res.json(updatedTask);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  if (!req.userId) {
    throw new AppError("No token provided", 401);
  }
  try {
    const { id } = req.params;
    const result = await db
      .delete(tasks)
      .where(and(eq(tasks.id, parseInt(id)), eq(tasks.userId, req.userId)))
      .returning();
    if (result.length === 0) {
      throw new AppError("Task not found or unauthorized", 404);
    }
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", async (req, res, next) => {
  if (!req.userId) {
    throw new AppError("No token provided", 401);
  }
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
      throw new AppError("Status is required", 400);
    }
    if (!validateTaskStatus(status)) {
      throw new AppError("Invalid task status", 400);
    }
    const [updatedTask] = await db
      .update(tasks)
      .set({ status, updatedAt: new Date() })
      .where(and(eq(tasks.id, parseInt(id)), eq(tasks.userId, req.userId)))
      .returning();
    if (!updatedTask) {
      throw new AppError("Task not found or unauthorized", 404);
    }
    res.json(updatedTask);
  } catch (error) {
    next(error);
  }
});

export default router;
