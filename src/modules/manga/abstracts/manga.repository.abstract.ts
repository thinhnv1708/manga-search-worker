import { IManga } from './manga.interface';

export abstract class AbstractMangaRepository {
  abstract findManga(page: number, limit: number): Promise<IManga[]>;
  abstract findTotalManga(): Promise<number>;
}
