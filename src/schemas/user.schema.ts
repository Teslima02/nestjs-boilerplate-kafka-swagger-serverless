import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export enum Status {
  PENDING = 'pending',
  IN_PROGRESS = 'in-progress',
  SUCCESS = 'success',
  FAIL = 'failure',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop()
  firstName: string;

  @Prop()
  middleName?: string;

  @Prop()
  lastName: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, required: true })
  username: string;

  @Prop({ default: 'pending' })
  status: Status;

  @Prop()
  emailConfirmationOtp: string;

  @Prop()
  emailConfirmationOtpExpiringTime: Date;

  @Prop({ default: true })
  emailOtpStatus: boolean;

  @Prop({ default: false })
  isEmailVerify: boolean;

  @Prop({ default: true })
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
