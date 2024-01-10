import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from "@nestjs/common";
import { Response } from "express";

@Catch(Error)
export class ErrorHandlerExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    console.log()
    const customError: object = {
      message: exception.message || "Something went wrong try again later",
      statusCode: exception['status'] || HttpStatus.INTERNAL_SERVER_ERROR
    };
    const response: Response = host.switchToHttp().getResponse<Response>();
    if (exception.name === "ValidationError") {
      customError["message"] = Object.values(exception["errors"]).map(
        (value: any) => value.message,
      );
      customError["statusCode"] = HttpStatus.BAD_REQUEST;
    }
    if (exception["code"] && exception["code"] === 11000) {
      customError["message"] = `Duplicate value entered for ${Object.keys(
        exception["keyValue"],
      )}, please choose another value`;
      customError["statusCode"] = HttpStatus.BAD_REQUEST;
    }
    if (exception["name"] === "CastError") {
      customError["message"] = `No item found with id ${exception["value"]}`;
      customError["statusCode"] = HttpStatus.BAD_REQUEST;
    }
    if (process.env.NODE_ENV === "development")
      customError["stack"] = exception.stack;
    response.status(customError["statusCode"]).json(customError);
  }
}
