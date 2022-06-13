import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { nanoid } from 'nanoid';
import { CreateNewUserResponseDto } from '../auth/dto/authResponse.dto';
import { generateOTP, OTPExpireTime } from '../common/helpers/global';
import { UserDocument, User } from '../schemas/user.schema';
import { CREATE_USER_WALLET } from '../kafka/constant';
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

@Injectable()
export class UserService {
  constructor(
    private readonly emailService: EmailService,
    private readonly tokenService: TokenService,
    private readonly kafkaService: KafkaService,
  ) {}

  async createNewUser(createNewUser: CreateNewUserDto): Promise<any> {
    const { email, password } = createNewUser;
    // const existingUser = await this.checkByEmail(createNewUser.email);
    // if (!existingUser) {
    // throw new BadRequestException(
    //   RckgAppResponse.BadRequest([], 'Invalid email or password'),
    // );
    // }
    // const { otp, exp } = this.generateOTPValue();
    const user = new User();
    // user.email = email;
    // user.password = await this.tokenService.hashPassword(password);
    // user.emailConfirmationOtp = otp;
    // user.emailConfirmationOtpExpiringTime = exp;
    // user.coreProcessStatus = CoreProcessStatus.PENDING;
    // const createdUser = await this.userRepository.save(user);

    // if (createdUser) {
    //   await this.emailService.emailServiceToSendOTP(
    //     createdUser.email,
    //     createdUser.emailConfirmationOtp,
    //   );
    //   // core service status is success
    //   createdUser.coreProcessStatus = CoreProcessStatus.SUCCESS;
    //   await this.userRepository.save(createdUser);
    //   const getUser = await this.userRepository.registrationResponse(
    //     createdUser.id,
    //   );
    //   // this.coreClient.emit(CORE_SERVICE_CREATE_WALLET, createNewUser);
    //   return RckgAppResponse.Ok(getUser, 'User account created successfully');
    // }
  }

  // private generateOTPValue(): OtpDto {
  //   return { otp: generateOTP().otp, exp: generateOTP().exp };
  // }

  // async findUserByEmailWithCredentials(email: string): Promise<User> {
  //   return await this.userRepository.findUserByEmailWithCredentials(email);
  // }

  // async checkByEmail(email: string): Promise<boolean> {
  //   const user = await this.userRepository.findUserByEmail(email);
  //   if (!user) {
  //     return true;
  //   }
  //   return false;
  // }

  // async resendOtp(email: string): Promise<OtpResponseDto> {
  //   const findUser = await this.userRepository.findUserByEmail(email);

  //   if (!findUser) {
  //     throw new NotFoundException(
  //       RckgAppResponse.NotFoundRequest('User is not found'),
  //     );
  //   }

  //   if (findUser.emailAuthentication) {
  //     throw new BadRequestException(
  //       RckgAppResponse.BadRequest('Account already verified'),
  //     );
  //   }

  //   const { otp, exp } = this.generateOTPValue();

  //   if (email == findUser.email) {
  //     findUser.emailConfirmationOtp = otp;
  //     findUser.emailConfirmationOtpExpiringTime = exp;
  //     findUser.emailOtpStatus = true;
  //   }
  //   await this.userRepository.save(findUser);
  //   await this.emailService.emailServiceToSendOTP(
  //     findUser.email,
  //     findUser.emailConfirmationOtp,
  //   );
  //   return {
  //     id: findUser.id,
  //     email: findUser.email,
  //     emailConfirmationOtpExpiringTime: exp,
  //     emailOtpStatus: true,
  //   };
  // }

  // async otpVerification(
  //   otpVerification: OtpVerificationDto,
  // ): Promise<UserResponseDto> {
  //   const findUser = await this.userRepository.findUserByEmail(
  //     otpVerification.email,
  //   );
  //   const findOtp = await this.findOtp(otpVerification);

  //   if (findUser.emailOtpStatus == false) {
  //     throw new BadRequestException(
  //       RckgAppResponse.BadRequest('Account already verified'),
  //     );
  //   }
  //   if (
  //     findUser &&
  //     otpVerification.email &&
  //     findOtp &&
  //     findUser.email == otpVerification.email
  //   ) {
  //     const verifiedUser = await this.otpVerificationForEmail(
  //       otpVerification,
  //       findOtp,
  //     );

  //     const getUser = await this.userRepository.getUserBasicDetails(
  //       findUser.id,
  //     );
  //     await this.createNewUserEvent(getUser);
  //     return verifiedUser;
  //   }
  // }

  // private async otpVerificationForEmail(
  //   otpVerification: OtpVerificationDto,
  //   findOtp: User,
  // ): Promise<OtpResponseDto> {
  //   if (
  //     otpVerification.email == findOtp.email &&
  //     otpVerification.otp == findOtp.emailConfirmationOtp
  //   ) {
  //     findOtp.isEmailVerify = true;
  //     findOtp.emailAuthentication = true;
  //     findOtp.emailOtpStatus = false;

  //     const userUpdatedDetails = await this.userRepository.save(findOtp);

  //     await this.emailService.emailServiceToSendWelcomeEmail(
  //       userUpdatedDetails.email,
  //     );
  //     if (userUpdatedDetails) {
  //       return {
  //         id: findOtp.id,
  //         email: findOtp.email,
  //         emailConfirmationOtpExpiringTime:
  //           findOtp.emailConfirmationOtpExpiringTime,
  //         emailOtpStatus: findOtp.emailOtpStatus,
  //       };
  //     }
  //   }
  //   throw new BadRequestException(
  //     RckgAppResponse.BadRequest('Otp verification expire'),
  //   );
  // }

  // private async findOtp(otpVerification: OtpVerificationDto): Promise<User> {
  //   const getUser = await this.userRepository.findUserAndGetVerificationDetails(
  //     otpVerification.email,
  //   );
  //   if (new Date() < getUser.emailConfirmationOtpExpiringTime) {
  //     return getUser;
  //   }
  //   throw new NotFoundException(RckgAppResponse.NotFoundRequest('OTP expired'));
  // }

  // async me(userId: string): Promise<CurrentUserResponseDto> {
  //   const findUser = await this.userRepository.currentUserResponse(userId);
  //   if (!findUser) {
  //     throw new NotFoundException(
  //       RckgAppResponse.NotFoundRequest(`User with this ${userId} not found`),
  //     );
  //   }
  //   return findUser;
  // }

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

  // async createNewUserEvent(userBasicDetails: UserBasicDetailsDto) {
  //   const message = {
  //     id: userBasicDetails.id,
  //     email: userBasicDetails.email,
  //     phone: userBasicDetails.phone,
  //     emailAuthentication: userBasicDetails.emailAuthentication,
  //     phoneAuthentication: userBasicDetails.phoneAuthentication,
  //     isEmailVerify: userBasicDetails.isEmailVerify,
  //     isPhoneVerify: userBasicDetails.isPhoneVerify,
  //   };
  //   const payload: KafkaPayload = {
  //     messageId: nanoid() + new Date().valueOf(),
  //     body: message,
  //     messageType: CREATE_USER_WALLET,
  //     topicName: CREATE_USER_WALLET,
  //   };

  //   const value = await this.kafkaService.sendMessage(
  //     CREATE_USER_WALLET,
  //     payload,
  //   );
  //   console.log(`kafka status ${CREATE_USER_WALLET}:`, value);
  //   return message;
  // }
}