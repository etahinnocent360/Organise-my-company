import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
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
  async createEmployee(data): Promise<EmployeeEntity[]> {
    const allUsers = this.employeeEntity.create(data);
    try {
      return await this.employeeEntity.save(allUsers);
    } catch (error) {
      throw new BadRequestException();
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
        new UnauthorizedException('user can not perform this action');
      } else {
        return paginate<EmployeeEntity>(queryBuilder, options);
      }
    } catch (error) {
      return error;
    }
  }
  async adminUpdateUser(id, data, currentUser) {
    const user = await this.employeeEntity.findOne(currentUser);
    console.log(user);
    try {
      if (user.roles !== 'admin') {
        return {
          data: new UnauthorizedException('only admin can perform this action'),
        };
      } else {
        console.log(data, id);
        return await this.employeeEntity.update(id, {
          roles: data.roles,
        });
      }
    } catch (error) {}
  }
  async update(id, data, currentUser): Promise<any> {
    try {
      const user = await this.employeeEntity.findOne(currentUser);
      console.log(id);
      if (user.id == id) {
        return this.employeeEntity.update(id, {
          roles: user.roles,
        });
      }
      return {
        message: new UnauthorizedException(
          'you don have access to this resource',
        ),
      };
    } catch (error) {
      // internal server error
      throw new UnauthorizedException('you can only update your account');
    }
  }
}
