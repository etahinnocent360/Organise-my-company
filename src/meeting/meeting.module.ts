import { Module } from '@nestjs/common';
import { MeetingService } from './meeting.service';
import { MeetingController } from './meeting.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetingEntity } from './meeting.entity';
import { EmployeeEntity } from '../employees/employee.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([MeetingEntity, EmployeeEntity]),
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [MeetingService],
  controllers: [MeetingController],
})
export class MeetingModule {}
