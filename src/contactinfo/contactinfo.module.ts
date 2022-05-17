import { Module } from '@nestjs/common';
import { ContactinfoController } from './contactinfo.controller';
import { ContactinfoService } from './contactinfo.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactinfoEntity } from './contactinfo.entity';
import { EmployeeEntity } from '../employees/employee.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '1d' },
    }),
    TypeOrmModule.forFeature([ContactinfoEntity, EmployeeEntity]),
  ],
  controllers: [ContactinfoController],
  providers: [ContactinfoService],
})
export class ContactinfoModule {}
