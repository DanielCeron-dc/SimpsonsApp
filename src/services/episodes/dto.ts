export interface EpisodeDto {
  id: number;
  season: number;
  episode_number: number;
  name: string;
  air_date?: string;
  synopsis?: string;
  description?: string;
  thumbnail_path?: string;
  image_path?: string;
}

export interface EpisodesPageDto {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
  results: EpisodeDto[];
}
