import express from "express";
import {
  CreateContainer,
  GetContainer,
  GetFileCode,
  RunTerminalCmd,
} from "../controllers/container.controller";
const router = express.Router();

router.post("/", CreateContainer);
router.get("/", GetContainer);
router.get("/file", GetFileCode);
router.post("/run", RunTerminalCmd);

export default router;
