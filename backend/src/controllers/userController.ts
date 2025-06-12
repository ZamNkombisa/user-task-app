import { Request, Response } from "express";
import { AppDataSource } from "../database";
import { User } from "../models/User";
import { Task } from "../models/Task";

// List all users
export const getUsers = async (_: Request, res: Response): Promise<Response> => {
    const users = await AppDataSource.getRepository(User).find({
        relations: ["tasks"],
    });
    return res.json(users);
};

// Create a new user
export const createUser = async (req: Request, res: Response): Promise<Response> => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ message: "Name is required" });
    }

    const userRepository = AppDataSource.getRepository(User);
    const existingUser = await userRepository.findOneBy({ name });
    if (existingUser) {
        return res.status(409).json({ message: "User with this name already exists." });
    }

    const user = new User();
    user.name = name;

    await userRepository.save(user);
    return res.status(201).json(user);
};

// Get tasks for a specific user
export const getUserTasks = async (req: Request, res: Response): Promise<Response> => {
    const user = await AppDataSource.getRepository(User).findOne({
        where: { id: parseInt(req.params.id) },
        relations: ["tasks"],
    });

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    return res.json(user.tasks);
};

// Delete a user
export const deleteUser = async (req: Request, res: Response): Promise<Response> => {
    const userId = parseInt(req.params.id);

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
        where: { id: userId },
        relations: ["tasks"]
    });

    if (!user) {
        return res.status(404).json({ message: "User not found." });
    }

    await userRepository.remove(user);
    return res.status(204).send();
};

// Update a user's name
export const updateUser = async (req: Request, res: Response): Promise<Response> => {
    const userId = parseInt(req.params.id);
    const { name } = req.body; // Expecting 'name'

    if (!name || name.trim() === '') {
        return res.status(400).json({ message: "Name is required for update." });
    }

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ id: userId });

    if (!user) {
        return res.status(404).json({ message: "User not found." });
    }

    // Check for duplicate name if the name is changing
    if (user.name !== name) {
        const existingUser = await userRepository.findOneBy({ name });
        if (existingUser && existingUser.id !== user.id) {
            return res.status(409).json({ message: "User with this name already exists." });
        }
    }

    user.name = name;
    await userRepository.save(user);
    return res.json(user); // Return the updated user
};

// Create task for a user
export const createTask = async (req: Request, res: Response): Promise<Response> => {
    const user = await AppDataSource.getRepository(User).findOne({
        where: { id: parseInt(req.params.id) },
    });

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const { title } = req.body;
    if (!title) {
        return res.status(400).json({ message: "Title is required" });
    }

    const task = new Task();
    task.title = title;
    task.user = user;

    await AppDataSource.getRepository(Task).save(task);
    return res.status(201).json(task);
};

// Delete a task
export const deleteTask = async (req: Request, res: Response): Promise<Response> => {
    const userId = parseInt(req.params.id);
    const taskId = parseInt(req.params.taskId);

    const taskRepository = AppDataSource.getRepository(Task);
    const task = await taskRepository.findOne({
        where: { id: taskId, user: { id: userId } }, // Find task by its ID and ensure it belongs to the user
        relations: ["user"] // Load user relation to verify ownership
    });

    if (!task) {
        return res.status(404).json({ message: "Task not found for this user." });
    }

    await taskRepository.remove(task);
    return res.status(204).send();
};

// Update a task (edit title or mark as complete)
export const updateTask = async (req: Request, res: Response): Promise<Response> => {
    const userId = parseInt(req.params.id);
    const taskId = parseInt(req.params.taskId);
    const { title, completed } = req.body;

    if (title === undefined && completed === undefined) {
         return res.status(400).json({ message: "No update data provided (title or completed)." });
    }


    const taskRepository = AppDataSource.getRepository(Task);
    const task = await taskRepository.findOne({
        where: { id: taskId, user: { id: userId } },
        relations: ["user"]
    });

    if (!task) {
        return res.status(404).json({ message: "Task not found for this user." });
    }

    if (title !== undefined) {
        task.title = title;
    }
    if (completed !== undefined) {
        task.completed = completed;
    }

    await taskRepository.save(task);
    return res.json(task); // Return the updated task
};