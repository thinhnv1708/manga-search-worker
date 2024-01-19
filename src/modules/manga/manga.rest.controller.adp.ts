import { IAppConfig } from '@configurations/interfaces';
import { AbstractLoggerGwAdp } from '@modules/logger';
import { Controller, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { buildLogContext } from '@utils/buildLogContext.util';
import { buildLogMessage } from '@utils/buildLogMessage.util';
import { excutePromise } from '@utils/excutePromise.util';
import { MangaService } from './manga.service';
const context = 'MangaRestController';

@Controller('/api/v1')
export class MangaRestControllerAdp {
  constructor(
    private readonly loggerGwAdp: AbstractLoggerGwAdp,
    private readonly configService: ConfigService,
    private readonly mangaService: MangaService,
  ) {}

  @Post('/trigger-sync-manga-to-search-engine')
  async triggerSyncMangaToSearchEngine(): Promise<void> {
    const { MANGA_SYNC_CHUNK_SIZE } =
      this.configService.get<IAppConfig>('APP_CONFIG');

    this.loggerGwAdp.log(
      buildLogMessage('', `MANGA_SYNC_CHUNK_SIZE: ${MANGA_SYNC_CHUNK_SIZE}`),
      buildLogContext(context, 'triggerSyncMangaToSearchEngine'),
    );

    const [error] = await excutePromise(
      this.mangaService.handleAddSyncMangaJobs(MANGA_SYNC_CHUNK_SIZE),
    );

    if (error) {
      this.loggerGwAdp.error(
        buildLogMessage(
          error.message,
          `MANGA_SYNC_CHUNK_SIZE: ${MANGA_SYNC_CHUNK_SIZE}`,
        ),
        buildLogContext(context, 'triggerSyncMangaToSearchEngine'),
      );
    }
  }
}
