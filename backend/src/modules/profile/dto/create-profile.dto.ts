import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';
import { INPUT_TEXT_MAX_LENGTH } from '../../../common/constants';

export const CreateProfileSchema = Joi.object({
  email: Joi.string().email().max(INPUT_TEXT_MAX_LENGTH).required(),
  fullName: Joi.string().min(3).max(INPUT_TEXT_MAX_LENGTH).optional(),
  // creatorId: Joi.number().positive().required(),
  accountId: Joi.number().positive().optional(),
});

export class CreateProfileDto {
  @ApiProperty()
  email: string;

  @ApiProperty({ required: false })
  fullName: string;

  // @ApiProperty()
  creatorId: number;

  @ApiProperty({ required: false })
  accountId: number;
}
