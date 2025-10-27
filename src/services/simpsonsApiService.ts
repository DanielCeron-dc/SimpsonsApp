import {Character, Episode} from '../types';
import charactersService from './characters/CharactersService';
import episodesService from './episodes/EpisodesService';

class SimpsonsApiService {
  async getCharacters(page: number = 1): Promise<Character[]> {
    try {
      return charactersService.getPage(page);
    } catch (error) {
      console.error('Error fetching characters:', error);
      throw error;
    }
  }

  async getAllCharacters(forceRefresh: boolean = false): Promise<Character[]> {
    try {
      return charactersService.getAll(forceRefresh);
    } catch (error) {
      console.error('Error fetching all characters:', error);
      throw error;
    }
  }

  async searchCharacters(query: string): Promise<Character[]> {
    try {
      return charactersService.search(query);
    } catch (error) {
      console.error('Error searching characters:', error);
      throw error;
    }
  }

  clearCachedCharacters(): void {
    void charactersService.clearCache();
  }

  async getCharacterById(id: number): Promise<Character> {
    try {
      return charactersService.getById(id);
    } catch (error) {
      console.error(`Error fetching character ${id}:`, error);
      throw error;
    }
  }

  async getEpisodes(page: number = 1): Promise<Episode[]> {
    try {
      return episodesService.getPage(page);
    } catch (error) {
      console.error('Error fetching episodes:', error);
      throw error;
    }
  }

  async getEpisodeById(id: number): Promise<Episode> {
    try {
      return episodesService.getById(id);
    } catch (error) {
      console.error(`Error fetching episode ${id}:`, error);
      throw error;
    }
  }

  getImageUrl(
    path?: string,
    size: '200' | '500' | '1280' = '500',
  ): string | null {
    return charactersService.getImageUrl(path, size);
  }
}

export default new SimpsonsApiService();
