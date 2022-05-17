import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from './task.entity';
import { Repository } from 'typeorm';
import { EmployeeEntity } from '../employees/employee.entity';
import { JwtService } from '@nestjs/jwt';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { from, map, Observable } from 'rxjs';
import { options } from 'tsconfig-paths/lib/options';

@Injectable()
export class TaskService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(TaskEntity) private taskEntity: Repository<TaskEntity>,
    @InjectRepository(EmployeeEntity)
    private employeeEntity: Repository<EmployeeEntity>,
  ) {}
  async createTask(taskName, data): Promise<any> {
    try {
      const newId = await this.employeeEntity.findOne(data);
      if (!newId) {
        return 'please login to perform this task';
      }
      console.log(newId);
      const user = this.taskEntity.create({
        taskName: taskName,
      });
      if (newId.roles == 'admin') {
        console.log(user);
        return await this.taskEntity.save(user);
      } else if (newId.roles == 'manager') {
        return await this.taskEntity.save(user);
      } else {
        return {
          error: 'only users with admin or manager role can create task',
        };
      }
    } catch (error) {
      throw new BadRequestException('task already exist');
    }
  }
  findAllTask(): Observable<TaskEntity[]> {
    return from(this.taskEntity.find()).pipe(
      map((task: TaskEntity[]) => {
        return task;
      }),
    );
  }
  paginate(options: IPaginationOptions): Observable<Pagination<TaskEntity>> {
    return from(paginate<TaskEntity>(this.taskEntity, options)).pipe(
      map((usersPageable: Pagination<TaskEntity>) => {
        const user = this.employeeEntity.findOne();
        return usersPageable;
      }),
    );
  }
  async updateTask(id: number, data, currentUser): Promise<any> {
    const user = await this.employeeEntity.findOne(currentUser);
    try {
      if (user.roles == 'admin') {
        console.log(user);
        return await this.taskEntity.update(id, data);
      } else {
        return {
          message: 'only user with admin rights can update this task',
        };
      }
    } catch (error) {
      throw new BadRequestException(
        `A task already exist with the name ${data.taskName}`,
      );
    }
  }
  async deleteTask(id, data): Promise<any> {
    const user = await this.employeeEntity.findOne(data);
    try {
      console.log(user);
      if (user.roles == 'admin') {
        return this.taskEntity.delete(id);
      } else {
        return {
          message: 'only system admin can delete this task',
        };
      }
    } catch (error) {
      throw new BadRequestException('only system admin can delete this task');
    }
  }
  findSingle(id): Promise<any> {
    return this.taskEntity.findOne(id);
  }

  async queryBuilder(alias: string): Promise<any> {
    try {
      console.log(alias);
      return this.taskEntity.createQueryBuilder(alias);
    } catch (error) {
      error.message;
    }
  }
}
