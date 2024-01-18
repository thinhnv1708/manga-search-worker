import { COMMONS } from '@constants/index';
import { AbstractLoggerGwAdp } from '@modules/logger';
import { Process, Processor } from '@nestjs/bull';
import { buildLogContext } from '@utils/buildLogContext.util';
import { buildLogMessage } from '@utils/buildLogMessage.util';
import { excutePromise } from '@utils/excutePromise.util';
import { DoneCallback, Job } from 'bull';
import { MangaService } from './manga.service';
const context = 'MangaBullController';

@Processor(COMMONS.BULL_QUEUE_NAMES.SYNC_MANGA_TO_SEARCH_ENGINE)
export class MangaBullConsumer {
  constructor(
    private readonly loggerGwAdp: AbstractLoggerGwAdp,
    private readonly mangaService: MangaService,
  ) {}

  @Process()
  async syncMangaToSearchEngine(
    job: Job<{ page: number; limit: number }>,
    done: DoneCallback,
  ): Promise<void> {
    this.loggerGwAdp.log(
      buildLogMessage('', JSON.stringify(job.data)),
      buildLogContext(context, 'handleAddSyncMangaJob'),
    );

    const { page, limit } = job.data;

    const [error] = await excutePromise(
      this.mangaService.syncMangaToSearchEngine(page, limit),
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
