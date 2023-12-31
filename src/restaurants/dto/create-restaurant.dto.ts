import { IsEmail, IsEnum, IsPhoneNumber, IsString, Length, MinLength } from "class-validator";
import { Category } from "../schemas/restaurant.schema";


export class CreateRestaurantDto {
  @IsString({ message: "name must be a string" })
  @Length(3, 100, { message: "name must be between 3 and 100 characters" })
  readonly name: string;

  @IsEmail({},{ message: "email must be a valid" })
  readonly email: string;

  @IsString({ message: "description must be a string" })
  @MinLength(20, {
    message: "description must be between 20 and 200 characters",
  })
  readonly description: string;

  @IsPhoneNumber("EG", {
    message: "phoneNo must be a valid Egyptian phone number",
  })
  readonly phoneNo: number;

  @IsString({ message: "address must be a string" })
  readonly address: string;

  @IsString({ message: "category must be a string" })
  @IsEnum(Category, {
    message:
      "category must be one of the following: Fast Food, Cafe, Fine Dinning",
  })
  readonly category: Category;
}