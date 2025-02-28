import express from "express";
import {
  CreateContainer,
  GetContainer,
  GetFileCode,
} from "../controllers/container.controller";
const router = express.Router();

router.post("/", CreateContainer);
router.get("/", GetContainer);
router.get("/file", GetFileCode);

export default router;
