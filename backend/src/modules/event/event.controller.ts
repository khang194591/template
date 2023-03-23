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
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthorizationGuard } from 'src/common/guards/authorization.guard';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import {
  ErrorResponse,
  SuccessResponse,
} from 'src/common/helpers/api.response';
import { IBaseQueryString } from 'src/common/interfaces';
import { JoiValidationPipe } from 'src/common/pipes/joi.validation.pipe';
import { DatabaseService } from 'src/common/services/database.service';
import { CreateEventDto, CreateEventSchema } from './dto/create-event.dto';
import { EventService } from './event.service';

@Controller('event')
@UseGuards(JwtGuard, AuthorizationGuard)
@ApiTags('events')
@ApiBearerAuth('JWT-auth')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  async getAll(@Query() query: IBaseQueryString) {
    try {
      const items = await this.eventService.getAll(query);
      return new SuccessResponse({
        items: items,
        totalItems: items.length,
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
      const item = await this.eventService.getById(id);
      if (!item) {
        const message = 'Not found';
        return new ErrorResponse(HttpStatus.NOT_FOUND, message, []);
      }
      return new SuccessResponse(item);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Post()
  @UsePipes(new JoiValidationPipe(CreateEventSchema))
  async create(@Req() req: Request, @Body() body: CreateEventDto) {
    try {
      const newItem = await this.eventService.create({
        ...body,
        status: this.eventService.getEventStatus(body.startDate, body.endDate),
      });
      return new SuccessResponse(newItem);
    } catch (error: any) {
      return new ErrorResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message,
        [],
      );
    }
  }
}
