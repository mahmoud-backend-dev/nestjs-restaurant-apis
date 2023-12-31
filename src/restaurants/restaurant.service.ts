import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Restaurant } from './schemas/restaurant.schema';
import * as mongoose from 'mongoose';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { Query } from 'express-serve-static-core';
import { paginate } from 'src/utils/pagination';
import { ApiFeatures } from 'src/utils/apiFeatures';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { User } from 'src/auth/schemas/user.schema';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectModel(Restaurant.name)
    private restaurantModel: mongoose.Model<Restaurant>,
  ) {}

  // Get all restaurants => GET /restaurants
  async findAll(query: Query): Promise<object> {
    const keyword: object = query.keyword
      ? {
          name: {
            $regex: query.keyword,
            $options: "i",
          },
        }
      : {};
    const { limit, pagination, skip } = await paginate(
      this.restaurantModel,
      query,
    );
    const allRestaurant = await this.restaurantModel
      .find(keyword)
      .limit(limit)
      .skip(skip);
    return {
      status: "success",
      count: allRestaurant.length,
      pagination,
      data: allRestaurant,
    };
  }

  // Add a restaurant => POST /restaurants
  async create(restaurant: CreateRestaurantDto, user: User): Promise<Restaurant> {
    if (await this.restaurantModel.findOne({ email: restaurant.email }))
      throw new BadRequestException('Email Duplicated choose anther email')
    return await this.restaurantModel.create({ ...restaurant, user: user._id }); 
  }

  // Get a restaurant by id => GET /restaurants/:id
  async findOne(id: string): Promise<Restaurant> {
    const isValidId = mongoose.isValidObjectId(id);
    if (!isValidId) {
      throw new BadRequestException(`Invalid MongoId(ObjectId): ${id}`);
    }
    const restaurant = await this.restaurantModel.findById(id);
    if (!restaurant) {
      throw new NotFoundException(`Restaurant for this id: ${id} not found`);
    }
    return restaurant;
  }

  // Update a restaurant by id => PATCH /restaurants/:id
  async updateOne(
    id: string,
    updateRestaurant: UpdateRestaurantDto,
  ): Promise<Restaurant> {
    const updatedRestaurant = await this.restaurantModel.findByIdAndUpdate(
      id,
      {
        name: updateRestaurant.name,
        description: updateRestaurant.description,
        phoneNo: updateRestaurant.phoneNo,
        address: updateRestaurant.address,
        category: updateRestaurant.category,
        email: updateRestaurant.email,
      },
      { new: true },
    );
    return updatedRestaurant;
  }

  // Delete a restaurant by id => DELETE /restaurants/:id
  async deleteOne(id: string): Promise<void> {
    await this.restaurantModel.findByIdAndDelete(id);
  }

  // upload images to AWS S3
  async uploadImages(
    id: string,
    files: Express.Multer.File[],
  ): Promise<Restaurant> {
    const restaurantExist = await this.restaurantModel.findById(id);
    const isDeleted = await this.deleteImages(restaurantExist.images);
    if (!isDeleted) {
      throw new BadRequestException("Failed to delete images");
    }
    const images = await ApiFeatures.uploadFiles(files);
    const restaurant = await this.restaurantModel.findByIdAndUpdate(
      id,
      {
        images,
      },
      { new: true },
    );
    return restaurant;
  }

  // delete images from AWS S3
  async deleteImages(images: object[]): Promise<boolean> {
    if (images.length === 0) return true;
    const isDeleted = await ApiFeatures.deleteFiles(images);
    return isDeleted;
  }
}
