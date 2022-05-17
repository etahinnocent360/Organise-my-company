import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { ContactinfoService } from './contactinfo.service';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Controller('contactinfo')
export class ContactinfoController {
  constructor(
    private contactInfoService: ContactinfoService,
    private jwtService: JwtService,
  ) {}
  @Post()
  async createContact(
    @Body('profile') profile: string,
    @Body('phone') phone: number,
    @Req() request: Request,
  ) {
    const cookie = request.cookies['jwt'];
    const data = await this.jwtService.verifyAsync(cookie);
    return this.contactInfoService.createContact(profile, phone, {
      id: data['id'],
    });
  }
  @Get()
  findAll() {
    return this.contactInfoService.findContacts();
  }

  @Put(':id')
  async updateOne(
    @Param('id') id: number,
    @Body('profile') profile: string,
    @Body('phone') phone: number,
    @Req() request: Request,
  ) {
    const cookie = request.cookies['jwt'];
    const data = await this.jwtService.verifyAsync(cookie);
    return this.contactInfoService.updateOne(
      id,
      {
        profile,
        phone,
      },
      {
        id: data['id'],
      },
    );
  }
  @Delete(':id')
  deleteOne(@Param('id') id: number) {
    return this.contactInfoService.deleteOne(id);
  }
}
