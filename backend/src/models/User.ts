import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BaseEntity } from "typeorm";
import { Task } from "./Task";

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number; // Auto-incrementing primary key

    @Column({ unique: true })
    name!: string; // Unique user name

    @OneToMany(() => Task, (task) => task.user, { cascade: true })
    tasks!: Task[]; // User has many tasks; cascades persist/update
}
