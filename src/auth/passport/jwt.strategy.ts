import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { configConstant } from '../../common/constants/config.constant';
import { ConfigService } from '@nestjs/config';
import { CurrentUserResponseDto } from '../dto/authResponse.dto';
import { User, UserDocument } from '../../schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get(configConstant.jwt.jwtSecret),
    });
  }

  async validate(payload: JwtPayload): Promise<CurrentUserResponseDto> {
    const user = await this.userModel.findById(payload.id);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
