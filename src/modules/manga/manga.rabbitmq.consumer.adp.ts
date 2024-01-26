import { ISyncMangaInput } from './dtos/syncMangaInput.interface';
import { AbstractLoggerGwAdp } from '@modules/logger';
import { Controller } from '@nestjs/common';
import { MangaService } from './manga.service';
import { MessagePattern } from '@nestjs/microservices';
import { RABBITMQ_PATTERN } from '@constants/commons.constant';
import { IManga } from './abstracts';
import { excutePromise } from '@utils/excutePromise.util';
import { buildLogMessage } from '@utils/buildLogMessage.util';
import { buildLogContext } from '@utils/buildLogContext.util';
import { syncMangaInputJoiSchema } from './dtos/joiSchemas';
const context = 'MangaRabbitmqControllerAdp';

@Controller()
export class MangaRabbitmqConsumerAdp {
  constructor(
    private readonly loggerGwAdp: AbstractLoggerGwAdp,
    private readonly mangaService: MangaService,
  ) {}

  @MessagePattern(RABBITMQ_PATTERN.SYNC_MANGA_TO_SEARCH_ENGINE)
  async syncMangaToSearchEngine(data: ISyncMangaInput): Promise<void> {
    this.loggerGwAdp.log(
      buildLogMessage('', JSON.stringify(data)),
      buildLogContext(context, 'syncMangaToSearchEngine'),
    );

    const { error, value } = syncMangaInputJoiSchema.validate(data);

    if (error) {
      this.loggerGwAdp.error(
        buildLogMessage(
          `Pattern ${RABBITMQ_PATTERN.SYNC_MANGA_TO_SEARCH_ENGINE}`,
          JSON.stringify(data),
          error.message,
        ),
        buildLogContext(context, 'syncMangaToSearchEngine'),
      );
      return;
    }

    const {
      id,
      title,
      subTitle,
      thumbnail,
      genres,
      totalChapter,
      status,
      views,
    } = <ISyncMangaInput>value;

    const manga: IManga = {
      id,
      title,
      subTitle,
      thumbnail,
      genres,
      totalChapter,
      status,
      views,
    };

    const [handleSyncError] = await excutePromise(
      this.mangaService.syncMangasToSearchEngine([manga]),
    );

    if (handleSyncError) {
      this.loggerGwAdp.error(
        buildLogMessage(handleSyncError.message, JSON.stringify(data)),
        buildLogContext(context, 'syncMangaToSearchEngine'),
      );
    }
  }
}
