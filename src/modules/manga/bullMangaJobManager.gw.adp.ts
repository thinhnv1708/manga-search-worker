import { COMMONS } from '@constants/index';
import { AbstractLoggerGwAdp } from '@modules/logger';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { buildLogContext } from '@utils/buildLogContext.util';
import { buildLogMessage } from '@utils/buildLogMessage.util';
import { Queue } from 'bull';
import { AbstractMangaJobManagerGwAdp } from './abstracts';
const context = 'BULL_MANGA_JOB_MANAGER_ADAPTER';
const { BULL_QUEUE_NAMES, BULL_SYNC_MANGA_TO_SEARCH_ENGINE_PROCESS_NAMES } =
  COMMONS;

@Injectable()
export class BullMangaJobManagerGwAdp implements AbstractMangaJobManagerGwAdp {
  constructor(
    private readonly logger: AbstractLoggerGwAdp,
    @InjectQueue(BULL_QUEUE_NAMES.SYNC_MANGA_TO_SEARCH_ENGINE)
    private syncMangaToSearchEngineQueue: Queue,
  ) {}

  async addSyncMangasJob(page: number, limit: number): Promise<void> {
    await this.syncMangaToSearchEngineQueue.add(
      BULL_SYNC_MANGA_TO_SEARCH_ENGINE_PROCESS_NAMES.SYNC_MANGAS,
      { page, limit },
      {
        removeOnComplete: true,
      },
    );

    this.logger.log(
      buildLogMessage('', JSON.stringify({ page, limit })),
      buildLogContext(context, 'addSyncMangaJob'),
    );
  }
}
