import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from 'src/common/services/database.service';
import { UpdateEventStatusService } from './cron-job';
import { EventController } from './event.controller';
import { EventService } from './event.service';

@Module({
  imports: [],
  controllers: [EventController],
  providers: [
    EventService,
    UpdateEventStatusService,
    DatabaseService,
    JwtService,
  ],
})
export class EventModule {}
