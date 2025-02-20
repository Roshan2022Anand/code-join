import express from "express";
import {
  CreateContainer,
  RunTerminalCmd,
  StopContainer,
  TestContainer,
} from "../controllers/container.controller";
const router = express.Router();

router.post("/", CreateContainer);
router.post("/test", TestContainer);
router.delete("/", StopContainer);
router.post("/run", RunTerminalCmd);

export default router;
