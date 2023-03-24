import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from 'src/common/services/database.service';

@Module({
  controllers: [RoleController],
  providers: [RoleService, JwtService, DatabaseService],
})
export class RoleModule {}
