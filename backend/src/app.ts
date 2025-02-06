import express from "express";
import dotenv from "dotenv";
import Docker from "dockerode";
import cors from "cors";
import ContainerRoute from "./routes/Docker.routes";

const app = express();
const docker = new Docker();
dotenv.config();

app.use(express.json());

//CORS
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  })
);

app.get("/", (req, res) => {
  res.json({ message: "Server is running" }).status(200);
});

app.use("/container", ContainerRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
