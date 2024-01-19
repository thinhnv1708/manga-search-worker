import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AbstractMangaJobManagerGwAdp,
  AbstractMangaRepository,
  AbstractMangaSearchRepository,
} from './abstracts';
import { BullMangaJobManagerGwAdp } from './bullMangaJobManager.gw.adp';
import { MangaBullConsumerAdp } from './manga.bull.consumer.adp';
import { MangaRepository } from './manga.repository';
import { MangaRestControllerAdp } from './manga.rest.controller.adp';
import { MangaService } from './manga.service';
import { MangaSearchRepository } from './mangaSearch.repository';
import { Manga, MangaSchema } from './mongooseSchemas';
import { MangaRabbitmqConsumerAdp } from './manga.rabbitmq.consumer.adp';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Manga.name, schema: MangaSchema }]),
  ],
  controllers: [MangaRestControllerAdp, MangaRabbitmqConsumerAdp],
  providers: [
    { provide: AbstractMangaRepository, useClass: MangaRepository },
    { provide: AbstractMangaSearchRepository, useClass: MangaSearchRepository },
    {
      provide: AbstractMangaJobManagerGwAdp,
      useClass: BullMangaJobManagerGwAdp,
    },
    MangaService,
    MangaBullConsumerAdp,
  ],
})
export class MangaModule {}
