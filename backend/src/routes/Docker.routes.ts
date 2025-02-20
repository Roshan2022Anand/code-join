import express from "express";
import {
  CreateContainer,
  RunContainer,
  StopContainer,
  TestContainer,
} from "../controllers/container.controller";
const router = express.Router();

router.post("/", CreateContainer);
router.post("/test", TestContainer);
router.delete("/", StopContainer);
router.post("/run", RunContainer);

export default router;
