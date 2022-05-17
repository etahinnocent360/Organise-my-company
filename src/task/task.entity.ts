import { Column, Entity, ManyToOne,  PrimaryGeneratedColumn } from "typeorm";
import { EmployeeEntity } from '../employees/employee.entity';

@Entity({ name: 'tasks' })
export class TaskEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true })
  taskName: string;
  @ManyToOne(() => EmployeeEntity, (employee) => employee.task, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  employee: EmployeeEntity;
}
