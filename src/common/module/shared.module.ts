import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { KafkaModule } from '../../kafka/kafka.module';
import { PassportModule } from '@nestjs/passport';
import { WALLET_CLIENT, WALLET_GROUP } from '../../kafka/constant';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ConfigModule,
    KafkaModule.register({
      clientId: WALLET_CLIENT,
      brokers: [process.env.KAFKABROKER],
      groupId: WALLET_GROUP,
    }),
  ],
  exports: [ConfigModule, KafkaModule, PassportModule],
})
export class SharedModule {}
