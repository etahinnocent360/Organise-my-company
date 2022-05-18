import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MeetingEntity } from './meeting.entity';
import { Repository } from 'typeorm';
import { EmployeeEntity } from '../employees/employee.entity';

@Injectable()
export class MeetingService {
  constructor(
    @InjectRepository(MeetingEntity)
    private meetingRepo: Repository<MeetingEntity>,
    @InjectRepository(EmployeeEntity)
    private employeeRepo: Repository<EmployeeEntity>,
  ) {}
  async createMeeting(zoomUrl, currentUser): Promise<any> {
    const repo = await this.employeeRepo.findOne(currentUser);
    try {
      if (repo.roles !== 'admin') {
        return {
          data: new UnauthorizedException('only admin can create meeting'),
        };
      } else {
        return this.meetingRepo.save({
          zoomUrl: zoomUrl,
        });
      }
    } catch (error) {
      throw new Error();
    }
  }
  async getMeetings(): Promise<MeetingEntity[]> {
    return await this.meetingRepo.find();
  }
}
