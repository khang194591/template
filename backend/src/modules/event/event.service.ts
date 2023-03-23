import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { IBaseQueryString } from 'src/common/interfaces';
import { DatabaseService } from 'src/common/services/database.service';
import { Event, EventStatus } from '@prisma/client';
import { CreateEventDto } from './dto/create-event.dto';
import moment from 'moment';

@Injectable()
export class EventService {
  constructor(private readonly db: DatabaseService) {}

  async getAll(query: IBaseQueryString): Promise<Event[]> {
    try {
      const { take = 5, skip = 0 } = query;
      const items = await this.db.event.findMany({
        take,
        skip,
      });
      return items;
    } catch (error) {
      throw error;
    }
  }

  async getById(id: number): Promise<Event> {
    try {
      const item = await this.db.event.findUnique({
        where: { id },
      });
      return item;
    } catch (error) {
      throw error;
    }
  }

  async create(item: CreateEventDto): Promise<Event> {
    try {
      const newItem = await this.db.event.create({ data: item });
      const itemId = newItem.id;
      if (itemId) {
        return await this.getById(itemId);
      }
      throw new InternalServerErrorException();
    } catch (error) {
      throw error;
    }
  }

  getEventStatus(start: Date, end: Date): EventStatus {
    if (moment(start).isAfter(Date.now())) {
      return 'INCOMING';
    } else if (moment(end).isBefore(Date.now())) {
      return 'EXPIRED';
    } else {
      return 'INPROGRESS';
    }
  }
}
