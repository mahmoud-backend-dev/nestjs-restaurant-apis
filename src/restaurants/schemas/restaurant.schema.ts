import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose  from "mongoose";
import { Document } from "mongoose";
import { User } from "src/auth/schemas/user.schema";
import { Meal } from "src/meal/schemas/meal.schema";

export enum Category {
  FAST_FOOD = 'Fast Food',
  CAFE = 'Cafe',
  FINE_DINNING = 'Fine Dinning',
}

@Schema({
  versionKey: false,
  timestamps: true,
})
export class Restaurant extends Document {
  @Prop({ required: true, length: { min: 3, max: 100 } })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, min: 20 })
  description: string;

  @Prop({ required: true })
  phoneNo: number;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  category: Category;

  @Prop({ required: false })
  images: object[];

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: "Meal" }])
  menu?: Meal[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
  user: User;
};

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);