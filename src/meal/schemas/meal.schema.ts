import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from 'src/auth/schemas/user.schema';
import { Restaurant } from 'src/restaurants/schemas/restaurant.schema';

export enum Category {
  SOUPS = 'Soups',
  SALADS = 'Salads',
  SANDWICHES = 'Sandwiches',
  PASTA = 'Pasta',
}

@Schema({
  versionKey: false,
  timestamps: true,
})
export class Meal extends Document {
  @Prop({ required: true, length: { min: 3, max: 100 } })
  name: string;

  @Prop({ required: true, min: 20 })
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  category: Category;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" })
  restaurant: Restaurant;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
  user: User;
}

export const MealSchema = SchemaFactory.createForClass(Meal)