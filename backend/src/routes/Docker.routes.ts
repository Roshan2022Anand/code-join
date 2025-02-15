import express from "express";
import {
  CreateContainer,
  RunContainer,
  StopContainer,
} from "../controllers/container.controller";
const router = express.Router();

router.post("/", CreateContainer);
router.delete("/", StopContainer);
router.post("/run", RunContainer);

export default router;
