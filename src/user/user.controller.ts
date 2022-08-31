import { UserService } from './user.service';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CreateNewUserDto,
  CurrentUserResponseDto,
  OtpResponseDto,
  OtpVerificationDto,
  UpdateUserProfileDto,
  UserResponseDto,
} from './dto/user.dto';
import { AuthGuard } from '@nestjs/passport';
/**
 * endpoints to manage users
 */

@ApiTags('users')
@Controller('v1/users')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({ description: 'Register new user with email' })
  @Post()
  async createNewUser(@Body() createNewUser: CreateNewUserDto) {
    return await this.userService.createNewUser(createNewUser);
  }

  // @ApiOperation({ description: 'Resend Otp verification' })
  // @Get('/:email/otp/resend')
  // async resendOtp(@Param('email') email: string): Promise<any> {
  //   const resp = await this.userService.resendOtp(email);
  // }

  // @ApiOperation({ description: 'send Otp verification' })
  // @Post('/otp/verification')
  // async otpVerification(
  //   @Body() otpVerification: OtpVerificationDto,
  // ): Promise<any> {
  //   const resp = await this.userService.otpVerification(otpVerification);
  // }

  // @ApiOperation({ description: 'Otp verification' })
  // @Patch('/update/:userId')
  // @ApiBearerAuth()
  // @UseGuards(AuthGuard())
  // async updateUserDetails(
  //   @Param('userId') userId: string,
  //   @Body() updateUserProfileDto: UpdateUserProfileDto,
  // ): Promise<any> {
  //   const resp = await this.userService.updateUserProfile(
  //     userId,
  //     updateUserProfileDto,
  //   );
  // }
}
