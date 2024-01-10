import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { User } from "../strategies/schemas/user.schema";

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): User => {
    const req = context.switchToHttp().getRequest();
    return req.user;
  },
);
