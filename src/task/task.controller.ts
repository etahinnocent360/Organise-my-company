import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query, Req } from "@nestjs/common";
import { TaskService } from "./task.service";
import { Role } from "../roles.enum";
import { Roles } from "src/employees/roles.contoller";
import { Request } from "express";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";
import { Pagination } from "nestjs-typeorm-paginate";
import { TaskEntity } from "./task.entity";

@Controller('task')
export class TaskController {
  constructor(private taskService: TaskService,private jwtService: JwtService) {}
  @Post()
  @Roles(Role.ADMIN)
 async createTask(@Body('taskName') taskName: string, @Req() request: Request) {
    try {
      const cookie = request.cookies['jwt'];
      if(!cookie){
        return {
          message: "please login to perform this task"
        }
      }
      const data = await this.jwtService.verifyAsync(cookie);
      return this.taskService.createTask(taskName,{id: data['id']});
    }catch (error){

    }

  }
  @Get()
  index(  @Query('page') page: number = 1,
          @Query('limit') limit: number = 20,): Observable<Pagination<TaskEntity>> {
    limit = limit > 100 ? 100 : limit;
   return  this.taskService.paginate({page, limit, route: 'http://localhost:3000/task'})
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  async updateTask(
    @Param('id') id: number,
    @Body('taskName') taskName: string,
    @Body('employee') employee: number,
    @Req() request: Request
  ) {
      const cookie = request.cookies['jwt'];
    if(!cookie){
      return {
        message: "please login to perform this task"
      }
    }
      const data = await this.jwtService.verifyAsync(cookie);
      return await this.taskService.updateTask( id, {
        taskName,
        employee,
      },{id: data['id']});
  }
  @Delete(':id')
  async deleteTask(@Param('id') id, @Req() request: Request) {
    const cookie = request.cookies['jwt'];
    if(!cookie){
      return {
        message: "please login to perform this task"
      }
    }
    const data = await this.jwtService.verifyAsync(cookie);
    return this.taskService.deleteTask(id, {id: data['id']});
  }
  @Get(':id')
  singleTask(@Param('id') id: number){
    return this.taskService.findSingle(id)
  }
  @Get()
  async searchTask(@Req() request: Request){
    return this.taskService.findAllTask()
  }


}
