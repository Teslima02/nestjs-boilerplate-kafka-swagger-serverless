import { LoggingInterceptor } from './global/logger.interceptor';
import { CacheModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_INTERCEPTOR } from '@nestjs/core';
import * as redisStore from 'cache-manager-redis-store';
import { WALLET_CLIENT, WALLET_GROUP } from './kafka/constant';
import { KafkaModule } from './kafka/kafka.module';
import { configConstant } from './common/constants/config.constant';
import { AuthModule } from './auth/auth.module';

const CACHE_TTL = 3600 * 2;
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    KafkaModule.register({
      clientId: WALLET_CLIENT,
      brokers: [process.env.KAFKABROKER],
      groupId: WALLET_GROUP,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>(configConstant.database.dev),
      }),
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      isGlobal: true,
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        url: configService.get<string>(configConstant.redis.redisUrl),
        ttl: CACHE_TTL,
      }),
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
