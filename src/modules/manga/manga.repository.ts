import { COMMONS } from '@constants/index';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { getPageLimit } from '@utils/index';
import { Model } from 'mongoose';
import { AbstractMangaRepository, IManga } from './abstracts';
import { Manga, MangaDocument } from './mongooseSchemas';

@Injectable()
export class MangaRepository implements AbstractMangaRepository {
  constructor(
    @InjectModel(Manga.name)
    private readonly model: Model<MangaDocument>,
  ) {}

  async findTotalMangas(): Promise<number> {
    const totalDocuments = await this.model
      .countDocuments({
        status: { $ne: COMMONS.HIDDEN_STATUS },
      })
      .lean();

    return totalDocuments;
  }

  async findMangas(page: number, limit: number): Promise<IManga[]> {
    const [newPage, newLimit] = getPageLimit(page, limit);
    const skip = (newPage - 1) * limit;

    const mangaDocuments = await this.model
      .find({ status: { $ne: COMMONS.HIDDEN_STATUS } })
      .skip(skip)
      .limit(newLimit)
      .select({
        _id: 0,
        id: 1,
        title: 1,
        subTitle: 1,
        thumbnail: 1,
        genres: 1,
        totalChapter: 1,
        status: 1,
        views: 1,
      })
      .lean();

    return mangaDocuments;
  }
}
