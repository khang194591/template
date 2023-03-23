import { ApiProperty } from '@nestjs/swagger';
import * as Joi from 'joi';
import { INPUT_TEXT_MAX_LENGTH } from '../../../common/constants';

export const LoginSchema = Joi.object({
  email: Joi.string().email().max(INPUT_TEXT_MAX_LENGTH).required(),
  password: Joi.string().min(6).max(INPUT_TEXT_MAX_LENGTH).required(),
});

export class LoginDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}
