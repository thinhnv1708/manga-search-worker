export abstract class AbstractMangaJobManagerGwAdp {
  abstract addSyncMangaJob(page: number, limit: number): Promise<void>;
}
