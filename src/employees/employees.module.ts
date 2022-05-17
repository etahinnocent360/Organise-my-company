import { Module } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeEntity } from './employee.entity';
import { ContactinfoEntity } from '../contactinfo/contactinfo.entity';
import { MeetingEntity } from '../meeting/meeting.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: 'secret',
      signOptions:{expiresIn:'1d'}
    }),
    TypeOrmModule.forFeature([
      EmployeeEntity,
      ContactinfoEntity,
      MeetingEntity,
    ]),
  ],
  providers: [EmployeesService],
  controllers: [EmployeesController],
})
export class EmployeesModule {}
