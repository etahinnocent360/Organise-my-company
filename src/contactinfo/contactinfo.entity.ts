import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EmployeeEntity } from '../employees/employee.entity';

@Entity({ name: 'contacts' })
export class ContactinfoEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: true, unique: true })
  phone: number;
  @Column({ name: 'employeeId' })
  employeeId: number;
  @Column({ nullable: true })
  profile: string;
  @OneToOne(() => EmployeeEntity, (employee) => employee.contactInfor, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'employeeId' })
  employee: EmployeeEntity;
}
