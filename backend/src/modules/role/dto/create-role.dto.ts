import { ApiProperty } from '@nestjs/swagger';
import joi from 'src/plugins/joi';
import { INPUT_TEXT_MAX_LENGTH } from '../../../common/constants';

export const CreateRoleSchema = joi.object({
  name: joi.string().max(INPUT_TEXT_MAX_LENGTH).required(),
  description: joi.string().max(INPUT_TEXT_MAX_LENGTH).optional(),
  permissions: joi.array().items(joi.number()).optional(),
});

export class CreateRoleDto {
  @ApiProperty({ example: 'admin', required: true })
  name: string;

  @ApiProperty({ example: 'Quản trị viên', required: false })
  description: string;

  @ApiProperty({ example: [], type: [Number], required: false })
  permissions: number[];
}
