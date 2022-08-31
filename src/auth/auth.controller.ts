import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Param,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { ApiBearerAuth, ApiOperation, ApiParam } from '@nestjs/swagger';
import {
  CreateNewUserResponseDto,
  LoginOTPResponseDto,
  LoginVerificationDto,
  LoginVerificationResponseDto,
} from './dto/authResponse.dto';
import { AuthGuard } from '@nestjs/passport';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto copy';
import { CreateNewUserDto, CurrentUserResponseDto } from '../user/dto/user.dto';
import { LoginDto } from './dto/auth.dto';
import { ResponseSuccess } from '../common/helpers/response.dto';
import { CurrentUser } from './passport/user.decorator';

@Controller('v1/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @ApiOperation({ description: 'Register new user' })
  @Post('/register')
  async createNewUser(
    @Body() createNewUser: CreateNewUserDto,
  ): Promise<CreateNewUserResponseDto> {
    return await this.userService.createNewUser(createNewUser);
  }

  @ApiOperation({ description: 'Login with email' })
  @Post('/login')
  async login(@Body() loginDto: LoginDto): Promise<LoginOTPResponseDto> {
    return await this.authService.login(loginDto);
  }

  @ApiOperation({ description: 'Get current user profile' })
  @ApiBearerAuth()
  @Get('/me')
  @UseGuards(AuthGuard())
  async currentUser(
    @CurrentUser() currentUser: CurrentUserResponseDto,
  ): Promise<CurrentUserResponseDto | any> {
    const resp = await this.userService.me(currentUser._id);
    return new ResponseSuccess('User Details', HttpStatus.ACCEPTED, resp);
  }

  // @ApiOperation({ description: 'Forget password' })
  // @Post('/forgot-password')
  // async forgetPassword(
  //   @Body() forgetPasswordDto: ForgetPasswordDto,
  // ): Promise<any> {
  //   await this.userService.forgetPassword(forgetPasswordDto.email);
  //   return RckgAppResponse.Ok(
  //     { status: true },
  //     'Check your email to reset your password',
  //   );
  // }

  // @ApiOperation({ description: 'Reset password' })
  // @Post('/reset-password')
  // async resetPassword(
  //   @Body() resetPasswordDto: ResetPasswordDto,
  // ): Promise<any> {
  //   await this.userService.resetPassword(resetPasswordDto);
  //   return RckgAppResponse.Ok({ status: true }, 'Password reset successful');
  // }
}
