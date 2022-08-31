import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
// import { RckgAppResponse } from 'rckg-shared-library';
import { generateOTP } from '../common/helpers/global';
import { User } from '../schemas/user.schema';
import { EmailService } from '../user/email.service';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/auth.dto';
import {
  LoginOTPResponseDto,
  LoginVerificationDto,
  LoginVerificationResponseDto,
} from './dto/authResponse.dto';
import { TokenService } from '../user/token.service';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { configConstant } from '../common/constants/config.constant';
import { ResponseError } from '../common/helpers/response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto): Promise<LoginOTPResponseDto> {
    const findUser = await this.userService.checkByEmail(loginDto.email);
    if (!findUser) {
      throw new NotFoundException(
        new ResponseError(
          'Incorrect email or password',
          HttpStatus.BAD_REQUEST,
        ),
      );
    }

    // Throw Error if use has not verified email
    if (!findUser.isEmailVerify)
      throw new BadRequestException(
        new ResponseError(
          'Unable to Login. Verify your Email before Login',
          HttpStatus.BAD_REQUEST,
        ),
      );

    const isValidPassword = await this.tokenService.comparedPassword(
      loginDto.password,
      findUser.password,
    );
    if (!isValidPassword)
      throw new BadRequestException(
        new ResponseError(
          'Incorrect email or password',
          HttpStatus.BAD_REQUEST,
        ),
      );
    return await this.tokenService.createToken(findUser.id, findUser.email);
  }
}
