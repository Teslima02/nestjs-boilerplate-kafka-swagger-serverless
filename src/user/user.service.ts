import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateNewUserResponseDto } from '../auth/dto/authResponse.dto';
import { generateOTP, OTPExpireTime } from '../common/helpers/global';
import { UserDocument, User, Status } from '../schemas/user.schema';
import { CREATE_NEW_USER } from '../kafka/constant';
import { KafkaPayload } from '../kafka/kafka.message';
import { KafkaService } from '../kafka/kafka.service';
import {
  CreateNewUserDto,
  CurrentUserResponseDto,
  OtpResponseDto,
  OtpVerificationDto,
  ResetPasswordDto,
  UpdateUserProfileDto,
  UserBasicDetailsDto,
  UserResponseDto,
} from './dto/user.dto';
import { OtpDto } from './dto/user.dto';
import { EmailService } from './email.service';
import { TokenService } from './token.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ResponseError, ResponseSuccess } from '../common/helpers/response.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly emailService: EmailService,
    private readonly tokenService: TokenService,
    private readonly kafkaService: KafkaService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async createNewUser(
    createNewUser: CreateNewUserDto,
  ): Promise<CreateNewUserResponseDto> {
    const { email, password } = createNewUser;
    const existingUser = await this.checkByEmail(createNewUser.email);
    console.log(existingUser, 'existingUser');

    if (!existingUser) {
      throw new ResponseError('User already exist', HttpStatus.BAD_REQUEST);
    }
    const { otp, exp } = this.generateOTPValue();
    const user = await this.userModel.create({
      email: email,
      password: await this.tokenService.hashPassword(password),
      emailConfirmationOtp: otp,
      emailConfirmationOtpExpiringTime: exp,
      status: Status.PENDING,
    });
    const userResult = await user.save();

    if (userResult) {
      userResult.status = Status.SUCCESS;
      userResult.save();

      return new ResponseSuccess(
        'User account created successfully',
        HttpStatus.CREATED,
        userResult,
      );
    }
  }

  private generateOTPValue(): OtpDto {
    return { otp: generateOTP().otp, exp: generateOTP().exp };
  }

  // async findUserByEmailWithCredentials(email: string): Promise<User> {
  //   return await this.userRepository.findUserByEmailWithCredentials(email);
  // }

  async checkByEmail(email: string): Promise<UserDocument | any> {
    const user = await this.userModel.findOne({ email: email });
    if (user) {
      return user;
    }
    return false;
  }

  async resendOtp(email: string): Promise<OtpResponseDto> {
    const findUser = await this.userModel.findOne({ email: email });

    if (!findUser) {
      throw new NotFoundException(
        new ResponseError('User is not found', HttpStatus.NOT_FOUND),
      );
    }

    if (findUser.isEmailVerify) {
      throw new BadRequestException(
        new ResponseError('Account already verified', HttpStatus.BAD_REQUEST),
      );
    }

    const { otp, exp } = this.generateOTPValue();

    if (email == findUser.email) {
      findUser.emailConfirmationOtp = otp;
      findUser.emailConfirmationOtpExpiringTime = exp;
      findUser.emailOtpStatus = true;
    }
    await this.userModel.create(findUser);
    // await this.emailService.emailServiceToSendOTP(
    //   findUser.email,
    //   findUser.emailConfirmationOtp,
    // );
    return {
      _id: findUser._id,
      email: findUser.email,
      emailConfirmationOtpExpiringTime: exp,
      emailOtpStatus: true,
    };
  }

  async otpVerification(
    otpVerification: OtpVerificationDto,
  ): Promise<UserResponseDto> {
    const findUser = await this.userModel.findOne({
      email: otpVerification.email,
    });
    const findOtp = await this.findOtp(otpVerification);

    if (findUser.emailOtpStatus == false) {
      throw new BadRequestException(
        new ResponseError('Account already verified', HttpStatus.BAD_REQUEST),
      );
    }
    if (
      findUser &&
      otpVerification.email &&
      findOtp &&
      findUser.email == otpVerification.email
    ) {
      const verifiedUser = await this.otpVerificationForEmail(
        otpVerification,
        findOtp,
      );

      const getUser = await this.userModel.findById(findUser._id);
      await this.createNewUserEvent(getUser);
      return verifiedUser;
    }
  }

  private async otpVerificationForEmail(
    otpVerification: OtpVerificationDto,
    findOtp: UserDocument,
  ): Promise<OtpResponseDto> {
    if (
      otpVerification.email == findOtp.email &&
      otpVerification.otp == findOtp.emailConfirmationOtp
    ) {
      findOtp.isEmailVerify = true;
      findOtp.emailOtpStatus = false;

      const userUpdatedDetails = await this.userModel.create(findOtp);

      // await this.emailService.emailServiceToSendWelcomeEmail(
      //   userUpdatedDetails.email,
      // );
      if (userUpdatedDetails) {
        return {
          _id: findOtp._id,
          email: findOtp.email,
          emailConfirmationOtpExpiringTime:
            findOtp.emailConfirmationOtpExpiringTime,
          emailOtpStatus: findOtp.emailOtpStatus,
        };
      }
    }
    throw new BadRequestException(
      new ResponseError('Otp verification expire', HttpStatus.BAD_REQUEST),
    );
  }

  private async findOtp(
    otpVerification: OtpVerificationDto,
  ): Promise<UserDocument> {
    const getUser = await this.userModel.findOne({
      email: otpVerification.email,
    });
    if (new Date() < new Date(getUser.emailConfirmationOtpExpiringTime)) {
      return getUser;
    }
    throw new NotFoundException(
      new ResponseError('OTP expired', HttpStatus.NOT_FOUND),
    );
  }

  async me(userId: string): Promise<CurrentUserResponseDto> {
    const findUser = await this.userModel.findById(userId);
    if (!findUser) {
      throw new NotFoundException(
        new ResponseError(
          `User with this ${userId} not found`,
          HttpStatus.NOT_FOUND,
        ),
      );
    }
    return findUser;
  }

  // async updateUserProfile(
  //   userId: string,
  //   updateUserProfile: UpdateUserProfileDto,
  // ): Promise<UserResponseDto> {
  //   const user = await this.userRepository.findUserById(userId);
  //   if (!user) {
  //     throw new NotFoundException(
  //       RckgAppResponse.NotFoundRequest('User is not found'),
  //     );
  //   }
  //   const findUser = await this.userRepository.update(
  //     userId,
  //     updateUserProfile,
  //   );
  //   if (!findUser) {
  //     throw new BadRequestException(
  //       RckgAppResponse.BadRequest('User failed to update'),
  //     );
  //   }
  //   return user;
  // }

  // private async generateForgetPasswordToken(user: User): Promise<User> {
  //   user.resetPasswordToken = nanoid();
  //   user.resetPasswordTokenExpire = OTPExpireTime();
  //   return await this.userRepository.save(user);
  // }

  // async forgetPassword(email: string): Promise<any> {
  //   const user = await this.userRepository.findUserByEmail(email);
  //   if (!user) {
  //     throw new NotFoundException(
  //       RckgAppResponse.NotFoundRequest('User does not exist'),
  //     );
  //   }
  //   const token = await this.generateForgetPasswordToken(user);
  //   await this.emailService.emailServiceToSendForgetPassword(
  //     user.email,
  //     token.resetPasswordToken,
  //   );
  //   return true;
  // }

  // async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<any> {
  //   const { resetPasswordToken, newPassword } = resetPasswordDto;
  //   if (!resetPasswordToken && !newPassword)
  //     throw new BadRequestException(
  //       RckgAppResponse.BadRequest('Token and new password is not provided'),
  //     );

  //   const userNewPasswordToken = await this.userRepository.findOne({
  //     resetPasswordToken: resetPasswordDto.resetPasswordToken,
  //   });
  //   if (
  //     !userNewPasswordToken ||
  //     new Date() > userNewPasswordToken.resetPasswordTokenExpire
  //   ) {
  //     throw new NotFoundException(
  //       RckgAppResponse.NotFoundRequest('Password reset token expire'),
  //     );
  //   }

  //   // update user password
  //   const passwordHash = await this.tokenService.hashPassword(newPassword);
  //   userNewPasswordToken.password = passwordHash;
  //   userNewPasswordToken.resetPasswordToken = null;
  //   await this.userRepository.save(userNewPasswordToken);
  //   await this.emailService.emailServiceToSendResetPassword(
  //     userNewPasswordToken.email,
  //   );
  //   return true;
  // }

  async createNewUserEvent(userBasicDetails: UserBasicDetailsDto) {
    const message = {
      _id: userBasicDetails._id,
      email: userBasicDetails.email,
      isPhoneVerify: userBasicDetails.firstName,
      middleName: userBasicDetails.middleName,
      lastName: userBasicDetails.lastName,
      isEmailVerify: userBasicDetails.isEmailVerify,
      status: userBasicDetails.status,
    };

    const payload: KafkaPayload = {
      messageId: uuidv4() + new Date().valueOf(),
      body: message,
      messageType: CREATE_NEW_USER,
      topicName: CREATE_NEW_USER,
    };

    const value = await this.kafkaService.sendMessage(CREATE_NEW_USER, payload);
    console.log(`kafka status ${CREATE_NEW_USER}:`, value);
    return message;
  }
}
