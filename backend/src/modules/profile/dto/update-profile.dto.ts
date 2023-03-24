import { ApiProperty } from '@nestjs/swagger';
import joi from 'src/plugins/joi';
import { INPUT_TEXT_MAX_LENGTH } from '../../../common/constants';

export const UpdateProfileSchema = joi.object({
  email: joi.string().email().max(INPUT_TEXT_MAX_LENGTH).optional(),
  fullName: joi.string().min(3).max(INPUT_TEXT_MAX_LENGTH).optional(),
  roles: joi.array().items(joi.string()).optional(),
});

export class UpdateProfileDto {
  @ApiProperty({ required: false })
  email: string;

  @ApiProperty({ required: false })
  fullName: string;

  updaterId: number;

  @ApiProperty({ type: [String], required: false })
  roles: string[];
}
