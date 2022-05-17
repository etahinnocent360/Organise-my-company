import { Body, Controller, Post } from '@nestjs/common';
import { MeetingService } from './meeting.service';

@Controller('meeting')
export class MeetingController {
  constructor(private meetingService: MeetingService) {}
  @Post()
  creatMeeting(@Body('zoomUrl') zoomUrl: string, @Body('id') id: number) {
    return this.meetingService.createMeeting(zoomUrl);
  }
}
