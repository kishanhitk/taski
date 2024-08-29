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
import { AppError } from "../utils/errors";
import { validateEmail, validatePassword } from "../utils/validation";

const router = express.Router();

router.post("/register", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new AppError("Email and password are required", 400);
    }
    if (!validateEmail(email)) {
      throw new AppError("Invalid email format", 400);
    }
    if (!validatePassword(password)) {
      throw new AppError(
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number",
        400
      );
    }
    const user = await registerUser(email, password);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new AppError("Email and password are required", 400);
    }
    const { user, token } = await loginUser(email, password);
    res.json({ user, token });
  } catch (error) {
    next(error);
  }
});

router.post("/google/callback", async (req, res, next) => {
  const { id_token } = req.body;
  if (!id_token) {
    return next(new AppError("Google ID token is required", 400));
  }
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  try {
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const googleId = payload?.sub;

    if (!googleId || !payload?.email) {
      throw new AppError("Invalid Google token", 400);
    }

    let [user] = await db
      .select()
      .from(users)
      .where(eq(users.googleId, googleId));
    if (!user) {
      [user] = await db
        .insert(users)
        .values({
          email: payload.email,
          googleId: googleId,
        })
        .returning();
    }

    const token = generateToken(user.id);
    res.json({ user, token });
  } catch (error) {
    next(error);
  }
});

export default router;
