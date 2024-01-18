import { COMMONS } from '@constants/index';
import { Injectable } from '@nestjs/common';
import { AbstractMangaJobManagerGwAdp } from './abstracts';
import { AbstractLoggerGwAdp } from '@modules/logger';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { buildLogContext } from '@utils/buildLogContext.util';
import { buildLogMessage } from '@utils/buildLogMessage.util';
const context = 'BULL_MANGA_JOB_MANAGER_ADAPTER';

@Injectable()
export class BullMangaJobManagerGwAdp implements AbstractMangaJobManagerGwAdp {
  constructor(
    private readonly logger: AbstractLoggerGwAdp,
    @InjectQueue(COMMONS.BULL_QUEUE_NAMES.SYNC_MANGA_TO_SEARCH_ENGINE)
    private syncMangaToSearchEngineQueue: Queue,
  ) {}

  async addSyncMangaJob(page: number, limit: number): Promise<void> {
    await this.syncMangaToSearchEngineQueue.add(
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
