import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';
import { INPUT_TEXT_MAX_LENGTH } from '../../../common/constants';

export const LoginSchema = Joi.object({
  email: Joi.string().email().max(INPUT_TEXT_MAX_LENGTH).required(),
  password: Joi.string().min(6).max(INPUT_TEXT_MAX_LENGTH).required(),
});

export class LoginDto {
  @ApiProperty({ example: 'khang.td194591@sis.hust.edu.vn' })
  email: string;

  @ApiProperty({ example: '123456' })
  password: string;
}
