import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity } from "typeorm";
import { User } from "./User";

@Entity()
export class Task extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number; // Auto-incrementing primary key

    @Column()
    title!: string; // Task title (required)

    @Column({ default: false })
    completed!: boolean; // Completion status with default value false

    @ManyToOne(() => User, (user) => user.tasks, { onDelete: 'CASCADE' })
    user!: User; // Task belongs to a user; deletes with user
}
