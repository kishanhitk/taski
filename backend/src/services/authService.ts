import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../config/database";
import { users } from "../models/schema";
import { eq } from "drizzle-orm";

export const registerUser = async (email: string, password: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const [user] = await db
    .insert(users)
    .values({ email, password: hashedPassword })
    .returning();
  return user;
};

export const loginUser = async (email: string, password: string) => {
  const [user] = await db.select().from(users).where(eq(users.email, email));

  if (!user.password) {
    throw new Error(
      "User does not have a password. Try logging in with Google"
    );
  }

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "1d",
  });

  return { user, token };
};

export const generateToken = (userId: number) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: "1d",
  });
};
