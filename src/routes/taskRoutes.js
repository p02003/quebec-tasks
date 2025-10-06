import { Router } from "express";
import { listTasks, getTask, createTask, updateTask, deleteTask } from "../controllers/taskController.js";

const router = Router();

router.get("/", listTasks);        // GET /api/tasks
router.get("/:id", getTask);       // GET /api/tasks/:id
router.post("/", createTask);      // POST /api/tasks
router.put("/:id", updateTask);    // PUT /api/tasks/:id
router.delete("/:id", deleteTask); // DELETE /api/tasks/:id

export default router;
