import { Module, forwardRef } from '@nestjs/common';
import { RestaurantController } from './restaurant.controller';
import { RestaurantService } from './restaurant.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RestaurantSchema } from './schemas/restaurant.schema';
import { AuthModule } from 'src/auth/auth.module';
import { MealModule } from 'src/meal/meal.module';


@Module({
  imports: [
    forwardRef(() => MealModule),
    AuthModule,
    MongooseModule.forFeature([{ name: 'Restaurant', schema: RestaurantSchema }])
  ],
  controllers: [RestaurantController],
  providers: [RestaurantService],
  exports: [MongooseModule],
})
export class RestaurantModule {}
