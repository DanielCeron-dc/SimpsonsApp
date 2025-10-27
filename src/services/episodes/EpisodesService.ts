import apiClient from '../apiClient';
import BaseService, {HttpClient} from '../BaseService';
import EpisodeAdapter from './EpisodeAdapter';
import {EpisodeDto, EpisodesPageDto} from './dto';
import {Episode} from '../../types';

export class EpisodesService extends BaseService<EpisodeDto, Episode> {
  constructor(
    client: HttpClient = apiClient,
    adapter: EpisodeAdapter = new EpisodeAdapter(),
  ) {
    super(client, adapter);
  }

  async getPage(page: number = 1): Promise<Episode[]> {
    const response = await this.fetchEpisodesPage(page);
    return this.mapMany(response.results || []);
  }

  async getById(id: number): Promise<Episode> {
    const response = await this.client.get<EpisodeDto>(`/episodes/${id}`);
    return this.map(response);
  }

  private async fetchEpisodesPage(page: number): Promise<EpisodesPageDto> {
    return this.client.get<EpisodesPageDto>('/episodes', {
      params: {page},
    });
  }
}

const episodesService = new EpisodesService();
export default episodesService;
