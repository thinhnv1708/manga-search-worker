export abstract class AbstractMangaJobManagerGwAdp {
  abstract addSyncMangasJob(page: number, limit: number): Promise<void>;
}
