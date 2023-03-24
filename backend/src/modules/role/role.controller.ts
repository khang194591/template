import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PermissionAction, PermissionResource } from '@prisma/client';
import { JWT_AUTH } from 'src/common/constants';
import {
  AuthorizationGuard,
  PermissionsData,
} from 'src/common/guards/authorization.guard';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import {
  ErrorResponse,
  SuccessResponse,
} from 'src/common/helpers/api.response';
import { IBaseQueryString } from 'src/common/interfaces';
import { JoiValidationPipe } from 'src/common/pipes/joi.validation.pipe';
import { DatabaseService } from 'src/common/services/database.service';
import { CreateRoleDto, CreateRoleSchema } from './dto/create-role.dto';
import { UpdateRoleDto, UpdateRoleSchema } from './dto/update-role.dto';
import { RoleService } from './role.service';

@Controller('role')
@ApiTags('roles')
@ApiBearerAuth(JWT_AUTH)
export class RoleController {
  constructor(
    private readonly roleService: RoleService,
    private readonly db: DatabaseService,
  ) {}

  @Get()
  @UseGuards(JwtGuard, AuthorizationGuard)
  @PermissionsData(`${PermissionResource.ROLE}-${PermissionAction.READ}`)
  async getAll(@Query() query: IBaseQueryString) {
    try {
      const profiles = await this.roleService.getAll(query);
      return new SuccessResponse({
        items: profiles,
        totalItems: profiles.length,
      });
    } catch (error) {
      return new ErrorResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message,
        [],
      );
    }
  }

  @Post()
  @PermissionsData(`${PermissionResource.ROLE}-${PermissionAction.CREATE}`)
  @UsePipes(new JoiValidationPipe(CreateRoleSchema))
  async create(@Req() req: Request, @Body() body: CreateRoleDto) {
    try {
      const item = await this.db.role.findUnique({
        where: { name: body.name },
      });
      if (item) {
        return new ErrorResponse(HttpStatus.BAD_REQUEST, 'Used', [
          { key: 'name', errorCode: HttpStatus.BAD_REQUEST, message: 'Used' },
        ]);
      }

      const newItem = await this.roleService.create(body);
      return new SuccessResponse(newItem);
    } catch (error: any) {
      return new ErrorResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message,
        [],
      );
    }
  }

  @Patch(':id')
  @PermissionsData(`${PermissionResource.ROLE}-${PermissionAction.UPDATE}`)
  async update(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body(new JoiValidationPipe(UpdateRoleSchema)) body: UpdateRoleDto,
  ) {
    try {
      const updateItem = await this.roleService.updateById(id, body);
      return new SuccessResponse(updateItem);
    } catch (error) {
      return new ErrorResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message,
        [],
      );
    }
  }

  @Delete(':id')
  @PermissionsData(`${PermissionResource.ROLE}-${PermissionAction.DELETE}`)
  async delete(@Param('id', ParseIntPipe) id: number) {
    try {
      const deleteItem = await this.roleService.deleteById(id);
      return new SuccessResponse(deleteItem);
    } catch (error) {
      return new InternalServerErrorException();
    }
  }
}
