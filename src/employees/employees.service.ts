import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployeeEntity } from './employee.entity';
import { Repository } from 'typeorm';
import { ContactinfoEntity } from '../contactinfo/contactinfo.entity';
import { JwtService } from '@nestjs/jwt';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class EmployeesService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(EmployeeEntity)
    private employeeEntity: Repository<EmployeeEntity>,
    @InjectRepository(ContactinfoEntity)
    private contactEntity: Repository<ContactinfoEntity>,
  ) {}
  async createEmployee(data): Promise<any> {
    const employees = this.employeeEntity.create(data);
    const users = await this.employeeEntity.find(data);
    try {
      users.map((allUsers) => {
        if (data.email == allUsers.email) {
          console.log(allUsers);
          return {
            error: 'this email is already taken',
          };
        }
      });
      return this.employeeEntity.save(employees);
    } catch (error) {
      throw new BadRequestException('email is already taken');
    }
  }

  async findOne(data): Promise<EmployeeEntity> {
    return this.employeeEntity.findOne(data);
  }

  async deleteOne(id: number): Promise<any> {
    return await this.employeeEntity.delete(id);
  }
  async findAll(
    data,
    options: IPaginationOptions,
  ): Promise<Pagination<EmployeeEntity>> {
    const queryBuilder = this.employeeEntity.createQueryBuilder('c');
    const user = await this.employeeEntity.findOne(data);
    console.log(user);
    try {
      if (user.roles !== 'admin') {
        throw new BadRequestException('user can not perform this action')
        // return {
        //   error: 'only admin is allowed to perform this action',
        // };
      } else if (!user) {
        // return {
        //   message: 'please login to access this resource',
        // };
      } else {
        // return await this.employeeEntity.find();
        return paginate<EmployeeEntity>(queryBuilder, options);
      }
    } catch (error) {
      return error;
    }
  }

  async update(id, data, currentUser): Promise<any> {
    const user = await this.employeeEntity.findOne(currentUser);
    try {
      console.log(id, user);
      if (user.id == id) {
        return this.employeeEntity.update(id, data);
      } else if (user.id !== id) {
        return {
          message: 'you can only update your account',
        };
      } else {
        return {
          message: 'already applied updates',
        };
      }
    } catch (error) {
      throw new BadRequestException('you can only update your account');
    }
  }
}
