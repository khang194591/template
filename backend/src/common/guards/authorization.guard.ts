import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    try {
      const profile = request.profile;
      if (profile) {
        return true;
      }
    } catch (error) {
      throw new ForbiddenException();
    }
  }
}
