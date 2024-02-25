import * as Joi from 'joi';
import { ISyncMangaInput } from '../syncMangaInput.interface';
import { IMangaGenre } from '@modules/manga/abstracts';

const mangaGenreJoiSchema = Joi.object<IMangaGenre>({
  id: Joi.number().required(),
  title: Joi.string().required(),
});

export const syncMangaInputJoiSchema = Joi.object<ISyncMangaInput>({
  id: Joi.number().required(),
  title: Joi.string().required(),
  subTitle: Joi.string().required(),
  thumbnail: Joi.string().required(),
  genres: Joi.array().items(mangaGenreJoiSchema).allow(null),
  totalChapter: Joi.number().required(),
  status: Joi.string().required().allow(null, ''),
});
