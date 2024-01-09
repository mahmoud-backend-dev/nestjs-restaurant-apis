import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class CustomMiddleware implements NestMiddleware{
  use(req: Request, res: Response, next: NextFunction):any {
    console.log('CustomMiddleware');
    next();
  }
}