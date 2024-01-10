import { ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

export class JwtAuthGuard extends AuthGuard() {
  canActivate(context: ExecutionContext) {
    const bearerToken = context.switchToHttp().getRequest()
      .headers.authorization;
    if (!bearerToken || !bearerToken.startsWith("Bearer ")) {
      throw new UnauthorizedException("No Bearer token provided");
    }
    return super.canActivate(context);
  }

  // This method is called by passport if the token is valid and not expired
  handleRequest(err, user, info) {
    if (info["name"] === "TokenExpiredError") {
      throw new UnauthorizedException(`Token expired, please login again...`);
    }
    if (info["name"] === "JsonWebTokenError") {
      throw new UnauthorizedException(`Invalid token, please login again...`);
    }
    return user;
  }
}
