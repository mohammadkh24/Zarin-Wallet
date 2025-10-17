import {
    CanActivate,
    ExecutionContext,
    Injectable,
    ForbiddenException,
  } from '@nestjs/common';
  
  @Injectable()
  export class IsAdminGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest();
      const user = request.user;
  
      if (!user) {
        throw new ForbiddenException('دسترسی غیرمجاز');
      }
  
      // چک کردن نقش یوزر
      if (user.role === 'admin') {
        return true;
      }
  
      throw new ForbiddenException('فقط مدیران مجاز هستند');
    }
  }
  