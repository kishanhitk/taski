import express from "express";
import {
  generateToken,
  loginUser,
  registerUser,
} from "../services/authService";
import { OAuth2Client } from "google-auth-library";
import { eq } from "drizzle-orm";
import { users } from "../models/schema";
import { db } from "../config/database";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await registerUser(email, password);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await loginUser(email, password);
    res.json({ user, token });
  } catch (error) {
    res.status(401).json({ error: (error as Error).message });
  }
});

router.post("/google/callback", async (req, res) => {
  const { id_token, access_token } = req.body;
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  try {
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const googleId = payload?.sub;

    // Check if user exists or create a new one
    let [user] = await db
      .select()
      .from(users)
      .where(eq(users.googleId, googleId));
    if (!user) {
      [user] = await db
        .insert(users)
        .values({
          email: payload?.email,
          googleId: googleId,
          // Add any other necessary fields
        })
        .returning();
    }

    const token = generateToken(user.id);
    console.log("Google user:", user, token);
    res.json({ user, token });
  } catch (error) {
    console.error("Error verifying Google token:", error);
    res.status(400).json({ message: "Invalid token" });
  }
});

export default router;
