import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { isJWT } from 'class-validator';
  import { Request } from 'express';
  import { Observable } from 'rxjs';
  import { AuthService } from '../../modules/auth/auth.service';
  
  @Injectable()
  export class authGuard implements CanActivate {
    constructor(private authService: AuthService) {}
    async canActivate(context: ExecutionContext) {
      const httpContext = context.switchToHttp();
      const request = httpContext.getRequest<Request>();
      const token = this.extractToken(request);
    
      const user = await this.authService.validateAccessToken(token);
      if (!user) {
        throw new UnauthorizedException('توکن نامعتبر یا کاربر پیدا نشد');
      }
      request.user = user;
    
      return true;
    }
    
  
    protected extractToken(request: Request) {
      const { authorization } = request.headers;
  
      if (!authorization || authorization.trim() === '') {
          throw new UnauthorizedException('Authorization header is missing');
        }
  
      const [bearer, token] = authorization.split(' ');
  
  if (bearer.toLowerCase() !== 'bearer') {
    throw new UnauthorizedException('Authorization must start with Bearer');
  }
  
      return token;
    }
  }
  