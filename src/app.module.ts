import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmployeesModule } from './employees/employees.module';
import { ContactinfoModule } from './contactinfo/contactinfo.module';
import { TaskModule } from './task/task.module';
import { MeetingModule } from './meeting/meeting.module';
import { PagerMiddleware } from "./paginate.middleware";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Inksa360@',
      database: 'meeting',
      autoLoadEntities: true,
      synchronize: true,
    }),
    EmployeesModule,
    ContactinfoModule,
    TaskModule,
    MeetingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PagerMiddleware)
      .forRoutes({ path: '', method: RequestMethod.GET })
  }
}
