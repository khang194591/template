import { ApiProperty } from '@nestjs/swagger';
import joi from 'src/plugins/joi';
import { INPUT_TEXT_MAX_LENGTH } from '../../../common/constants';

export const CreateProfileSchema = joi.object({
  email: joi.string().email().max(INPUT_TEXT_MAX_LENGTH).required(),
  fullName: joi.string().min(3).max(INPUT_TEXT_MAX_LENGTH).optional(),
  roles: joi.array().items(joi.string()).optional(),
  accountId: joi.number().positive().optional(),
});

export class CreateProfileDto {
  @ApiProperty({ example: 'khang194591@gmail.com', required: true })
  email: string;

  @ApiProperty({ example: 'Trịnh Đức Khang', required: false })
  fullName: string;

  // @ApiProperty()
  creatorId: number;

  @ApiProperty({ required: false })
  accountId: number;

  @ApiProperty({ type: [String], required: false })
  roles: string[];
}
