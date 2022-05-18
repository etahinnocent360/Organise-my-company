import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import * as bcrypt from 'bcrypt';
import { Roles } from './roles.contoller';
import { Role } from '../roles.enum';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { Pagination } from "nestjs-typeorm-paginate";
import { EmployeeEntity } from "./employee.entity";

@Controller('employees')
export class EmployeesController {
  constructor(
    private employeeService: EmployeesService,
    private jwtService: JwtService,
  ) {}
  @Post('/register')
  async createEmployee(
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('roles') roles: any,
  ) {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = this.employeeService.createEmployee({
      name,
      email,
      password: hashedPassword,
      roles,
    });
    return user;
  }
  @Roles(Role.ADMIN)
  @Delete(':id')
  deleteOne(@Param('id') id: number) {
    return this.employeeService.deleteOne(id);
  }

  @Post('login')
  async findOne(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.employeeService.findOne({ email });
    if (!user) {
      throw new BadRequestException('invalid credentials');
    }
    if (!(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException('invalid credentials');
    }
    const jwt = await this.jwtService.signAsync({ id: user.id });
    response.cookie('jwt', jwt, { httpOnly: true });
    return {
      message: 'success',
    };
  }
  @Get()
  @Roles(Role.ADMIN)
  async findAll(
    @Req() request: Request,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ): Promise<Pagination<EmployeeEntity>> {
    limit = limit > 100 ? 100 : limit;
    try {
      const cookie = request.cookies['jwt'];
      const data = await this.jwtService.verifyAsync(cookie);
      const user = await this.employeeService.findAll(
        { id: data['id'] },
        { page, limit },
      );
      console.log(user);
      return user;
    } catch (error) {}
  }
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('roles') roles: any,
    @Body('meeting') meeting: number,

    @Req() request: Request,
  ) {
    const cookie = request.cookies['jwt'];
    const data = await this.jwtService.verifyAsync(cookie);
    return await this.employeeService.update(
      id,
      {
        name,
        email,
        roles,
        meeting
      },
      { id: data['id'] },
    );
  }
  @Get('user')
  async user(@Req() request: Request) {
    try {
      const cookie = request.cookies['jwt'];
      const data = await this.jwtService.verifyAsync(cookie);
      const user = await this.employeeService.findOne({ id: data['id'] });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
  @Post('logout')
  async logOut(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');
    return {
      message: 'you have logout of your account',
    };
  }
  @Put('adminUpdate/:id')
  async adminUpdateUser(@Param('id') id: number, @Body('roles') roles: string, @Req() request: Request) {
    const cookie = request.cookies['jwt'];
    const data = await this.jwtService.verifyAsync(cookie);
  return   this.employeeService.adminUpdateUser(id, {roles}, { id: data['id'] })
  }
}
