import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  CanActivate,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Profile } from '@prisma/client';
import { AUTHORIZATION_TYPE } from 'src/modules/auth/auth.constants';
import EnvKey from '../configs/env';
import { extractToken } from '../helpers/common.function';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = extractToken(request.headers.authorization || '');
    if (!token) {
      throw new UnauthorizedException();
    }

    request.profile = await this.validateToken(
      token,
      request.authorizationType === AUTHORIZATION_TYPE,
    );
    return true;
  }

  async validateToken(token: string, isRefreshToken = false) {
    try {
      if (isRefreshToken) {
        return this.jwtService.verify<Profile>(token, {
          secret: this.configService.get(EnvKey.REFRESH_TOKEN_KEY),
          // ignoreExpiration: false,
        });
      } else {
        return this.jwtService.verify<Profile>(token, {
          secret: this.configService.get(EnvKey.ACCESS_TOKEN_KEY),
          // ignoreExpiration: false,
        });
      }
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException();
    }
  }
}
