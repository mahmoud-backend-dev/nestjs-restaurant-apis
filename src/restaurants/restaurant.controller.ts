import { Body, Controller, Delete, ForbiddenException, Get, Param, ParseUUIDPipe, Patch, Post, Query, UploadedFiles, UseGuards, UseInterceptors, ValidationPipe, Version } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { Restaurant } from './schemas/restaurant.schema';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { Query as expressQuery } from 'express-serve-static-core';

import { FilesInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/auth/schemas/user.schema';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller({
  path: "restaurants",
  version: "1",
})
@UseGuards(JwtAuthGuard,RolesGuard)
export class RestaurantController {
  constructor(private restaurantService: RestaurantService) {}

  @Get()
  @Roles('user')
  async getAllRestaurants(
    @Query()
    query: expressQuery,
  ): Promise<object> {
    return await this.restaurantService.findAll(query);
  }

  @Post()
  @Roles('admin')
  async createRestaurant(
    @Body()
    createRestaurantDto: CreateRestaurantDto,
    @CurrentUser()
    user:User
  ): Promise<Restaurant> {
    return await this.restaurantService.create(createRestaurantDto,user);
  }

  @Get(":id")
  async getRestaurantById(
    @Param("id")
    id: string,
  ): Promise<Restaurant> {
    return await this.restaurantService.findOne(id);
  }

  @Patch(":id")
  async updateRestaurant(
    @Param("id")
    id: string,
    @Body()
    updateRestaurantDto: UpdateRestaurantDto,
    @CurrentUser() user:User
  ): Promise<Restaurant> {
    const restaurant = await this.restaurantService.findOne(id);
    if (restaurant.user.toString() !== user._id.toString())
      throw new ForbiddenException('You can not update this restaurant.')
    return await this.restaurantService.updateOne(id, updateRestaurantDto);
  }

  @Delete(":id")
  async deleteRestaurant(
    @Param("id")
    id: string,
    @CurrentUser() user:User
  ): Promise<{}> {
    const restaurant = await this.restaurantService.findOne(id);
    if (restaurant.user.toString() !== user._id.toString())
      throw new ForbiddenException("You can not delete this restaurant.");
    const isDeleted = await this.restaurantService.deleteImages(
      restaurant.images,
    );
    if(!isDeleted){
      return {
        status: "Failed",
        message: "Failed to delete images",
      };
    }
    await this.restaurantService.deleteOne(id);
    return {
      status: "Success",
      message: "Restaurant deleted successfully",
    };
  }

  @Patch('upload-files/:id')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFiles(
    @Param('id') id: string,
    @UploadedFiles() files:Array<Express.Multer.File>
  ) {
    await this.restaurantService.findOne(id);
    const restaurant = await this.restaurantService.uploadImages(id, files);
    return {
      status: 'success',
      message: 'Images uploaded successfully',
      restaurant
    }
  }
}