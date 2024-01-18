import { IMangaSearchData } from './mangaSearchData.interface';

export abstract class AbstractMangaSearchRepository {
  abstract saveMangas(mangas: IMangaSearchData[]): Promise<void>;
}
