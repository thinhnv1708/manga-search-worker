import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IManga } from '../abstracts';
import { MangaGenre, MangaGenreSchema } from './mangaGenre.schema';

export type MangaDocument = Manga & Document;
export const MangaCollectionName = 'Manga';

@Schema({
  timestamps: true,
  collection: MangaCollectionName,
  versionKey: false,
})
export class Manga extends Document implements IManga {
  @Prop({ type: Number })
  id: number;

  @Prop({ type: String })
  title: string;

  @Prop({ type: String })
  subTitle: string;

  @Prop({ type: String })
  thumbnail: string;

  @Prop({ type: [MangaGenreSchema] })
  genres: MangaGenre[];

  @Prop({ type: Number })
  totalChapter: number;

  @Prop({ type: String })
  status: string;

  @Prop({ type: Number })
  views: number;
}

const _Schema = SchemaFactory.createForClass(Manga);

export const MangaSchema = _Schema;
