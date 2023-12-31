import { IsEmail, IsString, MinLength } from "class-validator";


export class SignUpDto{
  @IsString({ message: "name is required and must be a string" })
  readonly name: string;

  @IsEmail({}, { message: "email is required and must be a valid email" })
  readonly email: string;

  @IsString({ message: "password is required and must be a string" })
  @MinLength(8, { message: "password must be at least 8 characters" })
  readonly password: string;
}