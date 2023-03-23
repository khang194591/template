import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { DatabaseService } from './common/services/database.service';
import { AuthModule } from './modules/auth/auth.module';
import { EventModule } from './modules/event/event.module';
import { ProfileModule } from './modules/profile/profile.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    ProfileModule,
    AuthModule,
    EventModule,
  ],
  controllers: [AppController],
  providers: [DatabaseService],
})
export class AppModule {}
