import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { MealService } from "./meal.service";
import { CreateMealDto } from "./dto/create-meal.dto";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";
import { User } from "src/auth/strategies/schemas/user.schema";
import { Query as expressQuery } from "express-serve-static-core";
import { UpdateMealDto } from "./dto/update-meal.dto";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";

@Controller({
  path: "meals",
  version: "1",
})
@UseGuards(JwtAuthGuard)
export class MealController {
  constructor(private mealService: MealService) {}

  @Post()
  async createMeal(
    @Body() createMealDto: CreateMealDto,
    @CurrentUser() user: User,
  ): Promise<object> {
    const meal = await this.mealService.create(createMealDto, user);
    return {
      status: "success",
      meal,
    };
  }

  @Get()
  async getAllMeals(
    @Query()
    query: expressQuery,
  ): Promise<object> {
    return await this.mealService.findAll(query);
  }

  @Get("restaurant/:restaurantId")
  async getAllMealsBySpecificRestaurant(
    @Param("restaurantId") restaurantId: string,
    @Query()
    query: expressQuery,
  ): Promise<object> {
    return await this.mealService.findAllMealsBySpecificRestaurant(
      restaurantId,
      query,
    );
  }

  @Get(":id")
  async getMealById(@Param("id") id: string): Promise<object> {
    const meal = await this.mealService.findOne(id);
    return {
      status: "success",
      meal,
    };
  }

  @Patch(":id")
  async updateMeal(
    @Param("id") id: string,
    @Body() updateMealDto: UpdateMealDto,
    @CurrentUser() user: User,
  ): Promise<object> {
    const meal = await this.mealService.updateOne(id, updateMealDto, user);
    return {
      status: "success",
      meal,
    };
  }

  @Delete(":id")
  async deleteMeal(
    @Param("id") id: string,
    @CurrentUser() user: User,
  ): Promise<object> {
    return await this.mealService.deleteOne(id, user);
  }
}
