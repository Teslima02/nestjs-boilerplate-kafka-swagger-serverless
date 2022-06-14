import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PassportModule } from '@nestjs/passport';
import { EmailService } from './email.service';
import { SMSService } from './sms.service';
import { TokenService } from './token.service';
import { JWTService } from '../auth/passport/jwt.service';
import { User, UserSchema } from '../schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UserService, EmailService, SMSService, TokenService, JWTService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
