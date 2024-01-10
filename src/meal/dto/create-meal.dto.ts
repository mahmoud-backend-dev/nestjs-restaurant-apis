import { IsEmpty, IsEnum, IsNumber, IsString } from "class-validator";
import { Category } from "../schemas/meal.schema";
import { User } from "src/auth/strategies/schemas/user.schema";
import { Restaurant } from "src/restaurants/schemas/restaurant.schema";

export class CreateMealDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly description: string;

  @IsNumber()
  readonly price: number;

  @IsEnum(Category, {
    message: `category must be a valid enum value like as Soups, Salads, Sandwiches, Pasta`,
  })
  readonly category: Category;

  @IsString()
  readonly restaurant: Restaurant;

  @IsEmpty({ message: `You cannot provide a user ID.` })
  readonly user: User;
}
