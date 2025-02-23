import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import session from "express-session";
import passport from "./configs/passport";
import { initSocket } from "./configs/Socket";
import ContainerRoute from "./routes/Docker.routes";
import AuthRoute from "./routes/Auth.routes";

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
    saveUninitialized: false,
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  })
);

//passport initialization
app.use(passport.initialize());
app.use(passport.session());

//initialize socket
initSocket(server);

//home route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

//container routes
app.use("/container", ContainerRoute);
app.use("/auth", AuthRoute);

//listening to the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
