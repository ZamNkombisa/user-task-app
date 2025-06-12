import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./models/User";
import { Task } from "./models/Task";

// SQLite data source configuration
export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "database.sqlite",
    entities: [User, Task],      // Register entities
    synchronize: true,           // Auto-sync schema
    logging: false,              // Disable query logging
});
