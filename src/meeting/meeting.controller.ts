import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { MeetingService } from './meeting.service';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Controller('meeting')
export class MeetingController {
  constructor(
    private meetingService: MeetingService,
    private jwtService: JwtService,
  ) {}
  @Post()
  async creatMeeting(
    @Body('zoomUrl') zoomUrl: string,
    @Body('id') id: number,
    @Req() request: Request,
  ) {
    const cookie = request.cookies['jwt'];
    const data = await this.jwtService.verifyAsync(cookie);
    return this.meetingService.createMeeting(zoomUrl, { id: data['id'] });
  }
  @Get()
  async findMeetings() {
    return this.meetingService.getMeetings();
  }
}
