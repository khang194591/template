import { ApiProperty } from '@nestjs/swagger';
import joi from 'src/plugins/joi';
import { INPUT_TEXT_MAX_LENGTH } from '../../../common/constants';

export const UpdateRoleSchema = joi.object({
  name: joi.string().max(INPUT_TEXT_MAX_LENGTH).optional(),
  description: joi.string().max(INPUT_TEXT_MAX_LENGTH).optional(),
  permissions: joi.array().items(joi.number()).optional(),
});

export class UpdateRoleDto {
  @ApiProperty({ example: 'admin', required: false })
  name: string;

  @ApiProperty({ example: 'Quản trị viên', required: false })
  description: string;

  @ApiProperty({ example: [], type: [Number], required: false })
  permissions: number[];
}
