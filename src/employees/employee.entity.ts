import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ContactinfoEntity } from '../contactinfo/contactinfo.entity';
import { TaskEntity } from '../task/task.entity';
import { MeetingEntity } from '../meeting/meeting.entity';
import { Role } from '../roles.enum';

@Entity({ name: 'employee' })
export class EmployeeEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true })
  name: string;
  @Column({ unique: true })
  email: string;
  @Column()
  password: string;
  @Column({ type: 'enum', enum: Role, default: Role.USER })
  roles: Role;
  @OneToOne(() => ContactinfoEntity, (contactInfo) => contactInfo.employee)
  contactInfor: ContactinfoEntity;
  @OneToMany(() => TaskEntity, (task) => task.employee)
  task: TaskEntity;
  @ManyToMany(() => MeetingEntity, (meeting) => meeting.attendees)
  @JoinTable()
  meeting: MeetingEntity[];
}
