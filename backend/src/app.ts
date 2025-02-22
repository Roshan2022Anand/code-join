import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import ContainerRoute from "./routes/Docker.routes";
import { Server } from "socket.io";
import { createServer } from "http";
import session from "express-session";
import GitHubStrategy from "passport-github";
import passport from "passport";

const app = express();
const server = createServer(app);
dotenv.config();
app.use(express.json());
//CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
//session middleware configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: true,
  })
);

//passport initialization
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser((user: any, done) => {
  done(null, user);
});
passport.deserializeUser((obj: any, done) => {
  done(null, obj);
});
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: "http://localhost:5000/auth/callback/github",
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);

//Github authentication routes
app.get("/auth/github", passport.authenticate("github"));
app.get(
  "/auth/callback/github",
  passport.authenticate("github", { failureRedirect: "/" }),
  (req, res) => {
    // send authenticated user data to the frontend
    res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
  }
);
app.get("/auth/user", (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json({ user: req.user });
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});

//Socket.io cors configuration
export const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});

//home route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

//container routes
app.use("/container", ContainerRoute);

//listening to the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
