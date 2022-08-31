import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { KafkaModule } from '../../kafka/kafka.module';
import { PassportModule } from '@nestjs/passport';
import { USER_CLIENT, USER_GROUP } from '../../kafka/constant';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ConfigModule,
    KafkaModule.register({
      clientId: USER_CLIENT,
      brokers: [process.env.KAFKABROKER],
      groupId: USER_GROUP,
    }),
  ],
  exports: [ConfigModule, KafkaModule, PassportModule],
})
export class SharedModule {}
