import { IManga } from './manga.interface';

export abstract class AbstractMangaRepository {
  abstract findMangas(page: number, limit: number): Promise<IManga[]>;
  abstract findTotalMangas(): Promise<number>;
}
