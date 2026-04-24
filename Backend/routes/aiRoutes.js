import express from "express";
import { getAIChatResponse } from "../controllers/aiController.js";

const router = express.Router();

router.post("/chat", getAIChatResponse);

export default router;
