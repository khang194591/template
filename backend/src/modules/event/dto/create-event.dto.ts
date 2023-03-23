import { ApiProperty } from '@nestjs/swagger';
import { EventStatus } from '@prisma/client';
import Joi from 'joi';
import moment from 'moment';
import { INPUT_TEXT_MAX_LENGTH } from '../../../common/constants';

export const CreateEventSchema = Joi.object({
  title: Joi.string().max(INPUT_TEXT_MAX_LENGTH).required(),
  description: Joi.string().max(INPUT_TEXT_MAX_LENGTH).optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().greater(Joi.ref('startDate')).required(),
  status: Joi.valid(...Object.values(EventStatus)).optional(),
  participants: Joi.number().positive().optional(),
  budget: Joi.number().positive().optional(),
});

export class CreateEventDto {
  @ApiProperty({ default: `Event ${moment().toDate()}` })
  title: string;

  @ApiProperty({ required: false })
  description: string;

  @ApiProperty({ required: false })
  startDate: Date;

  @ApiProperty({ required: false })
  endDate: Date;

  @ApiProperty({ required: false })
  status: EventStatus;

  @ApiProperty({ required: false })
  participants: number;

  @ApiProperty({ required: false })
  budget: number;
}
