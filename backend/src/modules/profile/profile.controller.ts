import {
  ErrorResponse,
  SuccessResponse,
} from '../../common/helpers/api.response';
import { JoiValidationPipe } from '../../common/pipes/joi.validation.pipe';
import { DatabaseService } from '../../common/services/database.service';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Patch,
  Req,
  UsePipes,
} from '@nestjs/common';
import { Request } from 'express';
import {
  CreateProfileDto,
  CreateProfileSchema,
} from './dto/create-profile.dto';
import { ProfileService } from './profile.service';
import { IBaseQueryString } from 'src/common/interfaces';
import {
  UpdateProfileDto,
  UpdateProfileSchema,
} from './dto/update-profile.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('profile')
@ApiTags('profiles')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly db: DatabaseService,
  ) {}

  @Get()
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
  @UsePipes(new JoiValidationPipe(UpdateProfileSchema))
  async update(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateProfileDto,
  ) {
    try {
      const profile = await this.db.profile.findUnique({ where: { id } });
      if (!profile) {
        return new ErrorResponse(HttpStatus.NOT_FOUND);
      }
      const updatedProfile = await this.db.profile.update({
        where: { id },
        data: { ...body, updaterId: req.profile?.id },
      });
      return new SuccessResponse(updatedProfile);
    } catch (error) {
      return new ErrorResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message,
        [],
      );
    }
  }
}
