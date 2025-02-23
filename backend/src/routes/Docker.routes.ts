import express from "express";
import {
  CreateContainer,
  GetContainer,
  RunTerminalCmd,
} from "../controllers/container.controller";
const router = express.Router();

router.post("/", CreateContainer);
router.get("/", GetContainer);
router.post("/run", RunTerminalCmd);

export default router;
