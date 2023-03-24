import {
  Body,
  Controller,
  HttpStatus,
  InternalServerErrorException,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { compareSync } from 'bcrypt';
import { Request } from 'express';
import { JWT_AUTH } from 'src/common/constants';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import {
  ErrorResponse,
  SuccessResponse,
} from 'src/common/helpers/api.response';
import { JoiValidationPipe } from 'src/common/pipes/joi.validation.pipe';
import { AuthService } from './auth.service';
import { LoginDto, LoginSchema } from './dto/login.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UsePipes(new JoiValidationPipe(LoginSchema))
  async login(@Req() req: Request, @Body() data: LoginDto) {
    try {
      const { email, password } = data;
      const account = await this.authService.getByEmail(email);
      if (!account || !compareSync(password, account.password)) {
        return new ErrorResponse(HttpStatus.BAD_REQUEST, 'Wrong Credentials');
      }
      const { profile, accessToken, refreshToken } =
        await this.authService.login(account.email);
      req.profile = profile;
      return new SuccessResponse({ profile, accessToken, refreshToken });
    } catch (error) {
      return new ErrorResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message,
        [],
      );
    }
  }

  @Post('logout')
  @UseGuards(JwtGuard)
  @ApiBearerAuth(JWT_AUTH)
  async logout(@Req() req: Request) {
    try {
      const result = await this.authService.logout(req.profile);
      return new SuccessResponse(result);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
