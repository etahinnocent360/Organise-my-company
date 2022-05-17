import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EmployeeEntity } from '../employees/employee.entity';

@Entity({ name: 'meetings'})
export class MeetingEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  zoomUrl: string;
  @ManyToMany(() => EmployeeEntity, (employee) => employee.meeting)
  attendees: EmployeeEntity;
}
