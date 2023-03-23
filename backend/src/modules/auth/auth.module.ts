import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseService } from 'src/common/services/database.service';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenMiddleware } from './auth.middleware';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtService, DatabaseService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RefreshTokenMiddleware).forRoutes({
      path: '/auth/refresh-token',
      method: RequestMethod.POST,
    });
  }
}
