import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DatabaseService } from 'src/common/services/database.service';
import moment from 'moment';

@Injectable()
export class UpdateEventStatusService {
  private readonly logger = new Logger(UpdateEventStatusService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly db: DatabaseService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    const today = moment().startOf('day').toDate();
    await this.db.event.updateMany({
      where: {
        endDate: {
          lte: today,
        },
      },
      data: {
        status: 'EXPIRED',
      },
    });
    await this.db.event.updateMany({
      where: {
        startDate: {
          gte: today,
        },
      },
      data: {
        status: 'INPROGRESS',
      },
    });
    this.logger.debug(`${moment(Date.now()).toDate()}: Update event status`);
  }
}
