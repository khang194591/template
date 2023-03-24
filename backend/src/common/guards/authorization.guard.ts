import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { intersection } from 'lodash';
import EnvKey from '../configs/env';

export const PermissionsData = (...permissions: string[]) =>
  SetMetadata('permissions', permissions);

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly configService: ConfigService,
  ) {}
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const requiredPermissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );
    try {
      const profile = request.profile;
      if (
        profile.email === this.configService.get(EnvKey.SUPER_ADMIN_ACCOUNT) ||
        !requiredPermissions ||
        requiredPermissions.length === 0
      ) {
        return true;
      }
      const profilePermissions: string[] = [];
      profile.roles.map((role) => {
        role.permissions.map((permission) => {
          profilePermissions.push(
            `${permission.resource}-${permission.action}`,
          );
        });
      });
      return intersection(profilePermissions, requiredPermissions).length > 0;
    } catch (error) {
      throw new ForbiddenException();
    }
  }
}
