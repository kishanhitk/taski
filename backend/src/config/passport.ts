import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import bcrypt from "bcrypt";
import { db } from "./database";
import { users } from "../models/schema";
import { eq } from "drizzle-orm";

passport.use(
  "local-signup",
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email, password, done) => {
      try {
        const [existingUser] = await db
          .select()
          .from(users)
          .where(eq(users.email, email));
        if (existingUser) {
          return done(null, false, { message: "Email already in use" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const [newUser] = await db
          .insert(users)
          .values({ email, password: hashedPassword })
          .returning();
        return done(null, newUser);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  "local",
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email, password, done) => {
      try {
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, email));

        if (!user.password) {
          return done(null, false, {
            message:
              "User does not have a password. Try logging in with Google",
          });
        }

        if (!user || !(await bcrypt.compare(password, user.password))) {
          return done(null, false, { message: "Invalid credentials" });
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log(profile);
      try {
        const [existingUser] = await db
          .select()
          .from(users)
          .where(eq(users.googleId, profile.id));
        if (existingUser) {
          return done(null, existingUser);
        }
        const [newUser] = await db
          .insert(users)
          .values({
            email: profile.emails![0].value,
            googleId: profile.id,
            password: "", // We don't need a password for Google-authenticated users
          })
          .returning();
        return done(null, newUser);
      } catch (error) {
        console.log(error);
        return done(error);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;
