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
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PermissionAction, PermissionResource } from '@prisma/client';
import { Request } from 'express';
import { JWT_AUTH } from 'src/common/constants';
import {
  AuthorizationGuard,
  PermissionsData,
} from 'src/common/guards/authorization.guard';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { IBaseQueryString } from 'src/common/interfaces';
import {
  ErrorResponse,
  SuccessResponse,
} from '../../common/helpers/api.response';
import { JoiValidationPipe } from '../../common/pipes/joi.validation.pipe';
import { DatabaseService } from '../../common/services/database.service';
import {
  CreateProfileDto,
  CreateProfileSchema,
} from './dto/create-profile.dto';
import {
  UpdateProfileDto,
  UpdateProfileSchema,
} from './dto/update-profile.dto';
import { ProfileService } from './profile.service';

@Controller('profile')
@UseGuards(JwtGuard, AuthorizationGuard)
@ApiTags('profiles')
@ApiBearerAuth(JWT_AUTH)
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly db: DatabaseService,
  ) {}

  @Get()
  @PermissionsData(`${PermissionResource.PROFILE}-${PermissionAction.READ}`)
  @ApiQuery({})
  async getAll(@Query() query: IBaseQueryString) {
    try {
      const profiles = await this.profileService.getAll(query);
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

  @Get(':id')
  @PermissionsData(`${PermissionResource.PROFILE}-${PermissionAction.READ}`)
  async getOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const profile = await this.profileService.getById(id);
      if (!profile) {
        const message = 'Not found';
        return new ErrorResponse(HttpStatus.NOT_FOUND, message, []);
      }
      return new SuccessResponse(profile);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Post()
  @PermissionsData(`${PermissionResource.PROFILE}-${PermissionAction.CREATE}`)
  @UsePipes(new JoiValidationPipe(CreateProfileSchema))
  async create(@Req() req: Request, @Body() body: CreateProfileDto) {
    try {
      const profile = await this.db.profile.findUnique({
        where: { email: body.email },
      });
      if (profile) {
        return new ErrorResponse(HttpStatus.BAD_REQUEST, 'Used', [
          { key: 'email', errorCode: HttpStatus.BAD_REQUEST, message: 'Used' },
        ]);
      }

      const newProfile = await this.profileService.create({
        ...body,
        creatorId: req.profile?.id || 0,
      });
      return new SuccessResponse(newProfile);
    } catch (error: any) {
      return new ErrorResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message,
        [],
      );
    }
  }

  @Patch(':id')
  @PermissionsData(`${PermissionResource.PROFILE}-${PermissionAction.UPDATE}`)
  async update(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body(new JoiValidationPipe(UpdateProfileSchema)) body: UpdateProfileDto,
  ) {
    try {
      const updatedProfile = await this.profileService.updateById(id, body);
      return new SuccessResponse(updatedProfile);
    } catch (error) {
      return new ErrorResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message,
        [],
      );
    }
  }

  @Delete(':id')
  @PermissionsData(
    `${PermissionResource.PERMISSION}-${PermissionAction.DELETE}`,
  )
  async delete(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    try {
      const deleteItem = await this.profileService.deleteById(id);
      return new SuccessResponse(deleteItem);
    } catch (error) {
      return new InternalServerErrorException();
    }
  }
}
