import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import {Document} from "mongoose";

export enum UserRoles{
  USER = "user",
  ADMIN = "admin"
}

@Schema()
export class User extends Document {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({
    type: String,
    unique: [true, "Email already exists"],
  })
  email: string;

  @Prop({
    type: String,
    required: true,
    minlength: [8, "Too short password"],
    select: false,
  })
  password: string;

  @Prop({ enum: UserRoles, default: UserRoles.USER })
  role: UserRoles;
}

export const UserSchema = SchemaFactory.createForClass(User);