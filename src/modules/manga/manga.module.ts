import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AbstractMangaJobManagerGwAdp,
  AbstractMangaRepository,
  AbstractMangaSearchRepository,
} from './abstracts';
import { BullMangaJobManagerGwAdp } from './bullMangaJobManager.gw.adp';
import { MangaRepository } from './manga.repository';
import { MangaService } from './manga.service';
import { MangaSearchRepository } from './mangaSearch.repository';
import { Manga, MangaSchema } from './mongooseSchemas';
import { MangaBullConsumer } from './manga.bull.consumer';
import { MangaRestController } from './manga.rest.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Manga.name, schema: MangaSchema }]),
  ],
  controllers: [MangaRestController],
  providers: [
    { provide: AbstractMangaRepository, useClass: MangaRepository },
    { provide: AbstractMangaSearchRepository, useClass: MangaSearchRepository },
    {
      provide: AbstractMangaJobManagerGwAdp,
      useClass: BullMangaJobManagerGwAdp,
    },
    MangaService,
    MangaBullConsumer,
  ],
})
export class MangaModule {}
