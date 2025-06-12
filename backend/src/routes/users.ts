import { Router } from "express";
import {
    getUsers,
    createUser,
    deleteUser,
    updateUser,
    getUserTasks,
    createTask,
    deleteTask,
    updateTask,
} from "../controllers/userController";

const router: Router = Router();

// User routes
router.get("/", getUsers);               // Get all users
router.post("/", createUser);            // Create a new user
router.delete("/:id", deleteUser);       // Delete user by ID
router.put("/:id", updateUser);          // Update user by ID

// Task routes (per user)
router.get("/:id/tasks", getUserTasks);                      // Get tasks for a user
router.post("/:id/tasks", createTask);                       // Create task for a user
router.delete("/:id/tasks/:taskId", deleteTask);             // Delete a user's task
router.put("/:id/tasks/:taskId", updateTask);                // Update a user's task

export default router;
