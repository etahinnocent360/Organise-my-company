import { Module } from '@nestjs/common';
import { MeetingService } from './meeting.service';
import { MeetingController } from './meeting.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetingEntity } from './meeting.entity';
import { EmployeeEntity } from "../employees/employee.entity";

@Module({
  imports: [TypeOrmModule.forFeature([MeetingEntity, EmployeeEntity])],
  providers: [MeetingService],
  controllers: [MeetingController],
})
export class MeetingModule {}
