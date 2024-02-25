import { Injectable } from '@nestjs/common';
import {
  AbstractMangaJobManagerGwAdp,
  AbstractMangaRepository,
  AbstractMangaSearchRepository,
  IManga,
  IMangaSearchData,
} from './abstracts';

@Injectable()
export class MangaService {
  constructor(
    private readonly mangaRepository: AbstractMangaRepository,
    private readonly mangaSearchRepository: AbstractMangaSearchRepository,
    private readonly mangaJobManagerGwAdp: AbstractMangaJobManagerGwAdp,
  ) {}

  async handleAddSyncMangaJobs(limit: number): Promise<void> {
    const totalManga = await this.mangaRepository.findTotalMangas();

    const totalPage = Math.ceil(totalManga / limit);

    for (let page = 1; page <= totalPage; page++) {
      await this.mangaJobManagerGwAdp.addSyncMangasJob(page, limit);
    }
  }

  async syncMangasToSearchEngine(page: number, limit: number): Promise<void> {
    const mangas = await this.mangaRepository.findMangas(page, limit);

    const mangaSearchDatas: IMangaSearchData[] = mangas.map((manga) => {
      return this.mapMangaToSearchData(manga);
    });

    await this.mangaSearchRepository.saveMangas(mangaSearchDatas);
  }

  async syncMangaToSearchEngine(manga: IManga): Promise<void> {
    const magnaSearchData = this.mapMangaToSearchData(manga);

    await this.mangaSearchRepository.saveMangas([magnaSearchData]);
  }

  mapMangaToSearchData(manga: IManga): IMangaSearchData {
    const {
      id,
      title,
      subTitle,
      thumbnail,
      genres = [],
      totalChapter,
      status,
      views,
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
      views,
    };
  }
}
