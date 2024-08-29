import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../config/database";
import { users } from "../models/schema";
import { eq } from "drizzle-orm";
import { AppError } from "../utils/errors";

export const registerUser = async (email: string, password: string) => {
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email));
  if (existingUser.length > 0) {
    throw new AppError("Email already in use", 400);
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const [user] = await db
    .insert(users)
    .values({ email, password: hashedPassword })
    .returning();
  return user;
};

export const loginUser = async (email: string, password: string) => {
  const [user] = await db.select().from(users).where(eq(users.email, email));

  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  if (!user.password) {
    throw new AppError(
      "User does not have a password. Try logging in with Google",
      400
    );
  }

  if (!(await bcrypt.compare(password, user.password))) {
    throw new AppError("Invalid credentials", 401);
  }

  const token = generateToken(user.id);

  return { user, token };
};

export const generateToken = (userId: number) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};
