import express from "express";
import { generateToken } from "../services/authService";
import passport from "../config/passport";
import { OAuth2Client } from "google-auth-library";
import { eq } from "drizzle-orm";
import { users } from "../models/schema";
import { db } from "../config/database";

const router = express.Router();

router.post("/register", passport.authenticate("local-signup"), (req, res) => {
  const token = generateToken(req.user!.id);
  res.status(201).json({ user: req.user, token });
});

router.post("/login", passport.authenticate("local"), (req, res) => {
  const token = generateToken(req.user!.id);
  res.json({ user: req.user, token });
});

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.post(
  "/google/callback",
  // passport.authenticate("google", { failureRedirect: "/login" }),
  async (req, res) => {
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
  }
);

export default router;
