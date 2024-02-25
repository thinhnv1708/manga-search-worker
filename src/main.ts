import { IAppConfig, IRabbitmqConfig } from '@configurations/interfaces';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { LOGGER } from '@constants/index';
import { makeRabbitmqConfig } from '@helpers/index';
import { AbstractLoggerGwAdp } from '@modules/logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = app.get(AbstractLoggerGwAdp);
  const appConfig = configService.get<IAppConfig>('APP_CONFIG');
  const { PORT } = appConfig;
  app.enableCors();
  await app.startAllMicroservices();
  await app.listen(PORT, () => {
    logger.log(
      `Server running on port ${PORT}`,
      'Bootstrap',
      LOGGER.DEBUG_LEVEL.FORCE,
    );
  });
}
bootstrap();
