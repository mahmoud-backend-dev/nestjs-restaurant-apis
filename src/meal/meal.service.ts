import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Meal } from './schemas/meal.schema';
import mongoose, { Model } from 'mongoose';
import { CreateMealDto } from './dto/create-meal.dto';
import { Restaurant } from 'src/restaurants/schemas/restaurant.schema';
import { User } from 'src/auth/schemas/user.schema';
import { Query } from 'express-serve-static-core';
import { paginate, paginateArray } from 'src/utils/pagination';
import { UpdateMealDto } from './dto/update-meal.dto';

@Injectable()
export class MealService {
  constructor(
    @InjectModel(Meal.name)
    private mealModel: Model<Meal>,
    @InjectModel(Restaurant.name)
    private restaurantModel: Model<Restaurant>,
  ) {}

  // create a meal => POST /meals
  async create(createMealDto: CreateMealDto, user: User): Promise<Meal> {
    const restaurantExist = await this.restaurantModel.findById(
      createMealDto.restaurant,
    );
    if (!restaurantExist)
      throw new NotFoundException(
        `Restaurant for this id: ${createMealDto.restaurant} not found`,
      );
    if (restaurantExist.user.toString() !== user._id.toString())
      throw new ForbiddenException(
        `You are not authorized to add meal to this restaurant`,
      );
    const data = { ...createMealDto, user: user._id };
    const meal = await this.mealModel.create(data);
    restaurantExist.menu.push(meal._id);
    await restaurantExist.save();
    return meal;
  }

  // get all meals => GET /meals
  async findAll(query: Query): Promise<object> {
    const { limit, pagination, skip } = await paginate(this.mealModel, query);
    const meals = await this.mealModel.find().limit(limit).skip(skip);
    return {
      status: "success",
      count: meals.length,
      pagination,
      meals,
    };
  }

  // get a meal by specific restaurant => GET /meals/restaurant/:restaurantId
  async findAllMealsBySpecificRestaurant(
    restaurantId: string,
    query: Query,
  ): Promise<object> {
    const isValidId = mongoose.isValidObjectId(restaurantId);
    if (!isValidId) {
      throw new BadRequestException(
        `Invalid MongoId(ObjectId): ${restaurantId}`,
      );
    }
    const restaurant = await this.restaurantModel.findById(restaurantId);
    if (!restaurant) {
      throw new NotFoundException(
        `Restaurant for this id: ${restaurantId} not found`,
      );
    }
    const meals = await this.mealModel.find({ restaurant: restaurantId });
    const { limit, pagination, skip } = await paginateArray(meals, query);
    return {
      status: "success",
      count: meals.length,
      pagination,
      meals: meals.slice(skip, skip + limit),
    };
  }

  // get a meal by id => GET /meals/:id
  async findOne(id: string): Promise<Meal> {
    const isValidId = mongoose.isValidObjectId(id);
    if (!isValidId) {
      throw new BadRequestException(`Invalid MongoId(ObjectId): ${id}`);
    }
    const meal = await this.mealModel.findById(id);
    if (!meal) {
      throw new NotFoundException(`Meal for this id: ${id} not found`);
    }
    return meal;
  }

  // update a meal by id => PATCH /meals/:id
  async updateOne(id: string, updateMealDto:UpdateMealDto,user:User): Promise<Meal> {
    const isValidId = mongoose.isValidObjectId(id);
    if (!isValidId) {
      throw new BadRequestException(`Invalid MongoId(ObjectId): ${id}`);
    }
    const meal = await this.mealModel.findById(id);
    if (!meal) {
      throw new NotFoundException(`Meal for this id: ${id} not found`);
    }
    if (meal.user.toString() !== user._id.toString())
      throw new ForbiddenException('You can not update this meal.')

    if (updateMealDto.restaurant) {
      const restaurantExist = await this.restaurantModel.findById(updateMealDto.restaurant);
      if (!restaurantExist)
        throw new NotFoundException(
          `Restaurant for this id: ${updateMealDto.restaurant} not found`,
        );
      if (restaurantExist.user.toString() !== user._id.toString())
        throw new ForbiddenException(
          `You are not authorized to add meal to this restaurant`,
        );
      const restaurant = await this.restaurantModel.findById(meal.restaurant);
      restaurant.menu = restaurant.menu.filter((id) => id.toString() !== meal._id.toString());
      await restaurant.save();
    }
    if (updateMealDto.name) meal.name = updateMealDto.name;
    if (updateMealDto.description) meal.description = updateMealDto.description;
    if (updateMealDto.price) meal.price = updateMealDto.price;
    if (updateMealDto.restaurant) meal.restaurant = updateMealDto.restaurant;
    await meal.save();
    return meal;
  }

  // delete a meal by id => DELETE /meals/:id
  async deleteOne(id: string,user:User): Promise<{}> {
    const isValidId = mongoose.isValidObjectId(id);
    if (!isValidId) {
      throw new BadRequestException(`Invalid MongoId(ObjectId): ${id}`);
    }
    const meal = await this.mealModel.findById(id);
    if (!meal) {
      throw new NotFoundException(`Meal for this id: ${id} not found`);
    }
    if (meal.user.toString() !== user._id.toString())
      throw new ForbiddenException('You can not delete this meal.')
    const restaurant = await this.restaurantModel.findById(meal.restaurant);
    restaurant.menu = restaurant.menu.filter((id) => id.toString() !== meal._id.toString());
    await restaurant.save();
    await meal.deleteOne();
    return {
      status: "success",
      message: "Meal deleted successfully",
    };
  }
}
