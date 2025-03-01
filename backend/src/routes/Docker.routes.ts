import express from "express";
import { GetFileCode } from "../controllers/container.controller";
const router = express.Router();

router.get("/file", GetFileCode);

export default router;
