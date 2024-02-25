import { COMMONS } from '@constants/index';
import { AbstractLoggerGwAdp } from '@modules/logger';
import { Process, Processor } from '@nestjs/bull';
import { buildLogContext } from '@utils/buildLogContext.util';
import { buildLogMessage } from '@utils/buildLogMessage.util';
import { excutePromise } from '@utils/excutePromise.util';
import { DoneCallback, Job } from 'bull';
import { IManga } from './abstracts';
import { MangaService } from './manga.service';
const context = 'MangaBullController';
const { BULL_QUEUE_NAMES, BULL_SYNC_MANGA_TO_SEARCH_ENGINE_PROCESS_NAMES } =
  COMMONS;

@Processor(BULL_QUEUE_NAMES.SYNC_MANGA_TO_SEARCH_ENGINE)
export class MangaBullConsumer {
  constructor(
    private readonly loggerGwAdp: AbstractLoggerGwAdp,
    private readonly mangaService: MangaService,
  ) {}

  @Process(BULL_SYNC_MANGA_TO_SEARCH_ENGINE_PROCESS_NAMES.SYNC_MANGAS)
  async syncMangasToSearchEngine(
    job: Job<{ page: number; limit: number }>,
    done: DoneCallback,
  ): Promise<void> {
    this.loggerGwAdp.log(
      buildLogMessage('', JSON.stringify(job.data)),
      buildLogContext(context, 'handleAddSyncMangasJob'),
    );

    const { page, limit } = job.data;

    const [error] = await excutePromise(
      this.mangaService.syncMangasToSearchEngine(page, limit),
    );

    if (error) {
      this.loggerGwAdp.error(
        buildLogMessage(error.message, JSON.stringify(job.data)),
        buildLogContext(context, 'handleAddSyncMangaJob'),
      );
    }

    return done();
  }

  @Process(BULL_SYNC_MANGA_TO_SEARCH_ENGINE_PROCESS_NAMES.SYNC_MANGA)
  async syncMangaToSearchEngine(
    job: Job<IManga>,
    done: DoneCallback,
  ): Promise<void> {
    this.loggerGwAdp.log(
      buildLogMessage('', JSON.stringify(job.data)),
      buildLogContext(context, 'handleAddSyncMangaJob'),
    );

    const {
      id,
      title,
      subTitle,
      thumbnail,
      genres,
      totalChapter,
      status,
      views,
    } = job.data;

    const [error] = await excutePromise(
      this.mangaService.syncMangaToSearchEngine({
        id,
        title,
        subTitle,
        thumbnail,
        genres,
        totalChapter,
        status,
        views,
      }),
    );

    if (error) {
      this.loggerGwAdp.error(
        buildLogMessage(error.message, JSON.stringify(job.data)),
        buildLogContext(context, 'handleAddSyncMangaJob'),
      );
    }

    return done();
  }
}
