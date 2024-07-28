import express from "express";
const router = express.Router();
import * as commentController from "../controllers/commentController";

router.post("/", commentController.handleAddComment);


export default router;