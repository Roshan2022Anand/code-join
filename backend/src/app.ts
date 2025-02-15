import express from "express";
import dotenv from "dotenv";
import Docker from "dockerode";
import cors from "cors";
import ContainerRoute from "./routes/Docker.routes";
import { Server } from "socket.io";
import { createServer } from "http";

const app = express();
const server = createServer(app);
const docker = new Docker();
dotenv.config();
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
//Socket.io cors configuration
export const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});
app.post("/", (req, res) => {
  const {id} = req.body;
  console.log(id);
  res.status(200).json({ message: "Server is running" });
});

app.use("/container", ContainerRoute);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
