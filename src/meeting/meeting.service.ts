import { Injectable } from '@nestjs/common';
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
  async createMeeting(zoomUrl): Promise<any> {
    const repo = await this.employeeRepo.findOne();
    const allRepo = await this.employeeRepo.find();
    allRepo.map(async (allRip) => {
      return await this.meetingRepo.save({
        zoomUrl: zoomUrl,
        attendees: allRip,
      });
    });
    return allRepo;
  }
}
