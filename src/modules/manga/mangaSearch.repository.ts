import { IElasticsearchConfig } from '@configurations/interfaces';
import { AbstractLoggerGwAdp } from '@modules/logger';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { buildLogContext } from '@utils/buildLogContext.util';
import { buildLogMessage } from '@utils/buildLogMessage.util';
import { excutePromise } from '@utils/excutePromise.util';
import { AbstractMangaSearchRepository, IMangaSearchData } from './abstracts';
const CONTEXT_LOG = 'MangaSearchRepository';

@Injectable()
export class MangaSearchRepository implements AbstractMangaSearchRepository {
  private index: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly loggerGwAdp: AbstractLoggerGwAdp,
    private readonly elasticsearchService: ElasticsearchService,
  ) {
    const { MANGA_SEARCH_INDEX } = this.configService.get<IElasticsearchConfig>(
      'ELASTICSEARCH_CONFIG',
    );

    this.index = MANGA_SEARCH_INDEX;
  }

  onApplicationBootstrap(): void {
    this.createIndex();
  }

  async createIndex() {
    const [error] = await excutePromise(
      this.elasticsearchService.indices.create({
        index: this.index,
        settings: {
          analysis: {
            analyzer: {
              my_vi_analyzer: {
                type: 'custom',
                tokenizer: 'vi_tokenizer',
                filter: ['word_delimiter', 'lowercase', 'ascii_folding'],
              },
            },
            filter: {
              ascii_folding: {
                type: 'asciifolding',
                preserve_original: true,
              },
              word_delimiter: {
                type: 'word_delimiter',
                preserve_original: true,
              },
            },
          },
        },
        mappings: {
          properties: {
            id: {
              type: 'integer',
            },
            title: {
              type: 'text',
              analyzer: 'my_vi_analyzer',
            },
            subTitle: {
              type: 'text',
              analyzer: 'my_vi_analyzer',
            },
            thumbnail: {
              type: 'keyword',
            },
            genreTitles: {
              type: 'keyword',
            },
            totalChapter: {
              type: 'integer',
            },
            status: {
              type: 'keyword',
            },
          },
        },
      }),
    );

    if (error) {
      this.loggerGwAdp.warn(
        buildLogMessage(error.message),
        buildLogContext(CONTEXT_LOG, 'createIndex'),
      );
    }
  }

  async saveMangas(mangas: IMangaSearchData[]): Promise<void> {
    const mangaBulkData = mangas.flatMap((manga) => {
      const {
        id,
        title,
        subTitle,
        thumbnail,
        totalChapter,
        genreTitles,
        status,
        views,
      } = manga;

      return [
        {
          index: {
            _index: this.index,
            _id: id,
          },
        },
        {
          id,
          title,
          subTitle,
          thumbnail,
          totalChapter,
          genreTitles,
          status,
          views,
        },
      ];
    });

    await this.elasticsearchService.bulk({
      operations: mangaBulkData,
    });
  }
}
