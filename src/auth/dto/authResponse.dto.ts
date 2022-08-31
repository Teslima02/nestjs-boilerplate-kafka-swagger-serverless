import { Transform } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUUID,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateNewUserResponseDto {
  _id?: string;

  @IsEmail()
  email?: string;

  @IsDate()
  emailConfirmationOtpExpiringTime?: Date;

  @IsString()
  status: string;
}

export class LoginOTPResponseDto {
  @IsString()
  message: string;

  @IsString()
  otpExpiration: Date;
}

export class LoginVerificationDto {
  @IsString()
  otp: string;

  @IsString()
  email: string;
}

export class LoginVerificationResponseDto {
  @IsUUID()
  @IsString()
  id: string;

  @IsString()
  expires_in: Date;

  @IsString()
  access_token: string;
}
