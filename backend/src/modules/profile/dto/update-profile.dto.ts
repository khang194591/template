import { ApiProperty } from '@nestjs/swagger';
import { Profile } from '@prisma/client';
import * as Joi from 'joi';
import { INPUT_TEXT_MAX_LENGTH } from '../../../common/constants';

export const UpdateProfileSchema = Joi.object<Profile>({
  email: Joi.string().email().max(INPUT_TEXT_MAX_LENGTH).optional(),
  fullName: Joi.string().min(3).max(INPUT_TEXT_MAX_LENGTH).optional(),
  updaterId: Joi.number().positive().required(),
});

export class UpdateProfileDto {
  @ApiProperty({ required: false })
  email: string;

  @ApiProperty({ required: false })
  fullName: string;
}
