import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../apiClient';
import BaseService, {HttpClient} from '../BaseService';
import CharacterAdapter from './CharacterAdapter';
import {CharacterDto, CharactersPageDto} from './dto';
import {Character} from '../../types';

const DEFAULT_IMAGE_HOST = 'https://cdn.thesimpsonsapi.com';
const CHARACTERS_CACHE_KEY = '@simpsons_app:characters_cache';

export class CharactersService extends BaseService<CharacterDto, Character> {
  private allCharactersCache: Character[] | null = null;
  private allCharactersPromise: Promise<Character[]> | null = null;

  constructor(
    client: HttpClient = apiClient,
    adapter: CharacterAdapter = new CharacterAdapter(),
  ) {
    super(client, adapter);
  }

  async getPage(page: number = 1): Promise<Character[]> {
    const response = await this.fetchCharactersPage(page);
    return this.mapMany(response.results || []);
  }

  async getAll(forceRefresh: boolean = false): Promise<Character[]> {
    if (!forceRefresh) {
      if (this.allCharactersCache) {
        return this.allCharactersCache;
      }
      if (this.allCharactersPromise) {
        return this.allCharactersPromise;
      }

      const persisted = await this.loadPersistedCharacters();
      if (persisted) {
        this.allCharactersCache = persisted;
        return persisted;
      }
    }

    this.allCharactersPromise = this.loadAllCharacters();

    try {
      const characters = await this.allCharactersPromise;
      this.allCharactersCache = characters;
      await this.persistCharacters(characters);
      return characters;
    } finally {
      this.allCharactersPromise = null;
    }
  }

  async search(query: string): Promise<Character[]> {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      return this.getPage(1);
    }

    const allCharacters = await this.getAll();
    const lowerQuery = trimmedQuery.toLowerCase();

    return allCharacters
      .filter(character => character.name.toLowerCase().includes(lowerQuery))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  async getById(id: number): Promise<Character> {
    const response = await this.client.get<CharacterDto>(`/characters/${id}`);
    return this.map(response);
  }

  async clearCache(): Promise<void> {
    this.allCharactersCache = null;
    this.allCharactersPromise = null;
    try {
      await AsyncStorage.removeItem(CHARACTERS_CACHE_KEY);
    } catch (error) {
      if (__DEV__) {
        console.error('Error clearing persisted characters cache:', error);
      }
    }
  }

  getImageUrl(
    path?: string,
    size: '200' | '500' | '1280' = '500',
  ): string | null {
    if (!path) {
      return null;
    }
    if (/^https?:\/\//i.test(path)) {
      return path;
    }
    if (path.startsWith('//')) {
      return `https:${path}`;
    }
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${DEFAULT_IMAGE_HOST}/${size}${normalizedPath}`;
  }

  private async fetchCharactersPage(page: number): Promise<CharactersPageDto> {
    return this.client.get<CharactersPageDto>('/characters', {
      params: {page},
    });
  }

  private async loadAllCharacters(): Promise<Character[]> {
    const aggregated: Character[] = [];
    let currentPage = 1;

    while (true) {
      const response = await this.fetchCharactersPage(currentPage);
      const pageResults = response.results || [];

      aggregated.push(...this.mapMany(pageResults));

      const reachedLastPage =
        !response.next || currentPage >= (response.pages || currentPage);

      if (reachedLastPage) {
        break;
      }

      currentPage += 1;
    }

    return aggregated;
  }

  private async loadPersistedCharacters(): Promise<Character[] | null> {
    try {
      const persisted = await AsyncStorage.getItem(CHARACTERS_CACHE_KEY);
      if (!persisted) {
        return null;
      }
      const parsed: Character[] = JSON.parse(persisted);
      return Array.isArray(parsed) ? parsed : null;
    } catch (error) {
      if (__DEV__) {
        console.error('Error loading persisted characters:', error);
      }
      return null;
    }
  }

  private async persistCharacters(characters: Character[]): Promise<void> {
    try {
      await AsyncStorage.setItem(
        CHARACTERS_CACHE_KEY,
        JSON.stringify(characters),
      );
    } catch (error) {
      if (__DEV__) {
        console.error('Error persisting characters cache:', error);
      }
    }
  }
}

const charactersService = new CharactersService();
export default charactersService;
