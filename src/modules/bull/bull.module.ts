import { IRedisConfig } from '@configurations/interfaces';
import { COMMONS } from '@constants/index';
import { makeRedisConfig } from '@helpers/makeRedisConfig.helper';
import { BullModule as BullLibModule } from '@nestjs/bull';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    BullLibModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const redisConfig = configService.get<IRedisConfig>('REDIS_CONFIG');

        return {
          redis: makeRedisConfig({
            ...redisConfig,
            KEY_PREFIX: COMMONS.BULL_KEY_PREFIX,
          }),
        };
      },
      inject: [ConfigService],
    }),
    BullLibModule.registerQueue(
      ...Object.values(COMMONS.BULL_QUEUE_NAMES).map((queueName) => ({
        name: queueName,
      })),
    ),
  ],
  exports: [BullLibModule],
})
export class BullModule {}
