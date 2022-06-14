import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export enum Status {
  PENDING = 'pending',
  IN_PROGRESS = 'in-progress',
  SUCCESS = 'success',
  FAIL = 'failure',
}

@Schema()
export class User {
  @Prop()
  email: string;

  @Prop()
  firstName: string;

  @Prop()
  middleName?: string;

  @Prop()
  lastName: string;

  @Prop()
  password: string;

  @Prop()
  username: string;

  @Prop({ default: 'pending' })
  status: Status;

  @Prop()
  emailConfirmationOtp: string;

  @Prop()
  emailConfirmationOtpExpiringTime: string;

  @Prop({ default: false })
  isEmailVerify: boolean;

  @Prop({ default: true })
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
