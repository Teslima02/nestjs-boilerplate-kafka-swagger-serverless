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

export class CurrentUserResponseDto {
  @IsUUID()
  _id: string;

  @IsString()
  @IsEmail()
  email?: string;
}

export class CreateNewUserResponseDto {
  @IsUUID()
  id: string;

  @IsEmail()
  email: string;

  @IsDate()
  emailConfirmationOtpExpiringTime: Date;

  @IsString()
  coreProcessStatus: string;
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
