import "reflect-metadata";
import express from "express";
import cors from "cors";
import { AppDataSource } from "./database";
import userRoutes from "./routes/users";
import { Request, Response, NextFunction } from "express";

const app = express();

// Enable CORS for frontend origin
app.use(cors({
    origin: 'http://localhost:3001',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));

app.use(express.json()); // Parse JSON request bodies

app.use("/users", userRoutes); // Mount user-related routes

app.get("/", (req: Request, res: Response) => {
    res.send("User Task API is running!");
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something broke! Check server logs.');
});

const PORT = process.env.PORT || 3000;

// Initialize database and start server
AppDataSource.initialize()
    .then(() => {
        console.log("Database connected successfully!");
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => console.error("Database connection failed:", error));
