import express from "express";
import { db } from "../config/database";
import { tasks } from "../models/schema";
import { authMiddleware } from "../middleware/auth";
import { eq } from "drizzle-orm";

const router = express.Router();

// router.use(authMiddleware);

router.post("/", async (req, res) => {
  try {
    const { title, description, status } = req.body;
    const [task] = await db
      .insert(tasks)
      .values({ title, description, status, userId: req.userId })
      .returning();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.get("/", async (req, res) => {
  const userTasks = await db
    .select()
    .from(tasks)
    .where(eq(tasks.userId, req.userId));
  res.json(userTasks);
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;
    const [updatedTask] = await db
      .update(tasks)
      .set({ title, description, status, updatedAt: new Date() })
      .where(eq(tasks.id, parseInt(id)))
      .returning();
    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.delete(tasks).where(eq(tasks.id, parseInt(id)));
    res.status(204).end();
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

export default router;
