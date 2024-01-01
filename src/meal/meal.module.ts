import { Module, Res, forwardRef } from '@nestjs/common';
import { MealService } from './meal.service';
import { MealController } from './meal.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MealSchema } from './schemas/meal.schema';
import { AuthModule } from 'src/auth/auth.module';
import { RestaurantModule } from 'src/restaurants/restaurant.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: 'Meal', schema: MealSchema }]),
    forwardRef(() => RestaurantModule),
  ],
  providers: [MealService],
  controllers: [MealController],
  exports: [MongooseModule],
})
export class MealModule {}
