import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Reflector } from '@nestjs/core'
import { Observable } from "rxjs";

@Injectable()
export class RolesGuard implements CanActivate{
  constructor(private reflector: Reflector) { }
  
  canActivate(context: ExecutionContext): boolean  {
    const roles = this.reflector.get<string[]>('roles', context.getHandler())
    if (!roles) return true
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    if (!matchRoles(roles, user.role))
      throw new UnauthorizedException('You are not access to this recourse.')
    return true //matchRoles(roles, user.role);
  }
}

function matchRoles(roles: string[], userRole: string): boolean{
  if (!roles.includes(userRole)) return false;
  return true
}