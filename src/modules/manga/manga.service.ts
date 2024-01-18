import { Injectable } from '@nestjs/common';
import {
  AbstractMangaJobManagerGwAdp,
  AbstractMangaRepository,
  AbstractMangaSearchRepository,
  IMangaSearchData,
} from './abstracts';

@Injectable()
export class MangaService {
  constructor(
    private readonly mangaRepository: AbstractMangaRepository,
    private readonly mangaSearchRepository: AbstractMangaSearchRepository,
    private readonly mangaJobManagerGwAdp: AbstractMangaJobManagerGwAdp,
  ) {}

  async handleAddSyncMangaJob(limit: number): Promise<void> {
    const totalManga = await this.mangaRepository.findTotalManga();

    const totalPage = Math.ceil(totalManga / limit);

    for (let page = 1; page <= totalPage; page++) {
      await this.mangaJobManagerGwAdp.addSyncMangaJob(page, limit);
    }
  }

  async syncMangaToSearchEngine(page: number, limit: number): Promise<void> {
    const mangas = await this.mangaRepository.findManga(page, limit);

    const mangaSearchDatas: IMangaSearchData[] = mangas.map((manga) => {
      const {
        id,
        title,
        subTitle,
        thumbnail,
        genres = [],
        totalChapter,
        status,
      } = manga;

      const genreTitles: string[] = genres.map((genre) => genre.title);

      return {
        id,
        title,
        subTitle,
        thumbnail,
        totalChapter,
        genreTitles,
        status,
      };
    });

    await this.mangaSearchRepository.saveMangas(mangaSearchDatas);
  }
}
