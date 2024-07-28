import express from "express";
const router = express.Router();
import * as taskController from "../controllers/taskController";
import { veryfyUser } from "../middlewares/authMiddleware";



router.post("/", taskController.handleAddTask);
router.delete("/", taskController.handleRemoveTask);
router.post("/dropSameRow", taskController.handleDropSameRow);
router.post("/dropDifferenceRow", taskController.handleDropdifferenceRow);
router.get("/user/:id", taskController.handleGetTaskByUserId);
router.get("/:id", taskController.handleGetTaskbyId);
router.put("/", taskController.handeUpdateDesc);
router.put("/", taskController.handeUpdatePosition);
router.put("/nameTask", taskController.handeUpdateNameTask);
// router.get("/profile",veryfyUser, authController.handeleGetProfile);
// router.post("/refresh_token", authController.handle_refresh_token);
// router.post("/logout", authController.handleLogout);
export default router;
