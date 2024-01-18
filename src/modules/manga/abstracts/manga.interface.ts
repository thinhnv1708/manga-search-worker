export interface IMangaGenre {
  id: number;
  title: string;
}

export interface IManga {
  id: number;
  title: string;
  subTitle: string;
  thumbnail: string;
  genres: IMangaGenre[];
  totalChapter: number;
  status: string;
}
