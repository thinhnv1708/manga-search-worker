import {
  appConfig,
  elasticsearchConfig,
  loggerConfig,
  mongodbConfig,
  rabbitmqConfig,
  redisConfig,
} from '@configurations/index';
import { LoggerModule } from '@modules/logger';
import { MangaModule } from '@modules/manga';
import { MongooseModule } from '@modules/mongodb';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BullModule } from '@modules/bull';
import { ElasticsearchModule } from '@modules/elasticsearch';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        appConfig,
        loggerConfig,
        mongodbConfig,
        redisConfig,
        elasticsearchConfig,
      ],
      envFilePath: ['.development.env'],
    }),
    LoggerModule,
    MongooseModule,
    ElasticsearchModule,
    BullModule,
    MangaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
