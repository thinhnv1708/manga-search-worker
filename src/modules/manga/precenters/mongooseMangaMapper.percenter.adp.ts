import { Injectable } from '@nestjs/common';
import { IManga } from '../abstracts';
import { MangaDocument } from '../mongooseSchemas';

@Injectable()
export class MongooseMangaMapperPrecenterAdp {
  toEntity(mangaDocument: MangaDocument): IManga {
    if (!mangaDocument) {
      return null;
    }

    const { id, title, subTitle, thumbnail, genres, totalChapter, status } =
      mangaDocument;

    return {
      id,
      title,
      subTitle,
      thumbnail,
      genres,
      totalChapter,
      status,
    };
  }
}
