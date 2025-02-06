import express from "express";
import {
  CreateContainer,
  RunPrgContainer,
  StopContainer,
} from "../controllers/DockerControler";
const router = express.Router();

router.post("/", CreateContainer);
router.delete("/", StopContainer);
router.post("/run", RunPrgContainer);

export default router;
