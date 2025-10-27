jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

import {CharactersService} from '../../src/services/characters/CharactersService';
import CharacterAdapter from '../../src/services/adapters/characters/CharacterAdapter';
import {CharacterDto, CharactersPageDto} from '../../src/services/adapters/characters/dto';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_KEY = '@simpsons_app:characters_cache';

const createPageDto = (
  results: CharacterDto[],
  overrides: Partial<CharactersPageDto> = {},
): CharactersPageDto => ({
  count: results.length,
  pages: 1,
  next: null,
  prev: null,
  results,
  ...overrides,
});

describe('CharactersService', () => {
  const adapter = new CharacterAdapter();
  let mockClient: {get: jest.Mock};
  let service: CharactersService;

  beforeEach(async () => {
    mockClient = {get: jest.fn()};
    service = new CharactersService(mockClient, adapter);
    await AsyncStorage.clear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('maps a page of characters using the adapter', async () => {
    const dto: CharacterDto = {
      id: 1,
      name: 'Homer Simpson',
      occupation: 'Safety Inspector',
      portrait_path: '/character/1.webp',
    };

    mockClient.get.mockResolvedValueOnce(createPageDto([dto]));

    const result = await service.getPage(1);

    expect(result).toEqual([
      expect.objectContaining({
        id: dto.id,
        name: dto.name,
        occupation: dto.occupation,
        portrait_path: dto.portrait_path,
      }),
    ]);
    expect(mockClient.get).toHaveBeenCalledWith('/characters', {
      params: {page: 1},
    });
  });

  it('searches characters using cached pages', async () => {
    const pageOne: CharacterDto = {id: 1, name: 'Homer Simpson'};
    const pageTwo: CharacterDto = {id: 2, name: 'Lisa Simpson'};

    mockClient.get
      .mockResolvedValueOnce(
        createPageDto([pageOne], {pages: 2, next: '/characters?page=2'}),
      )
      .mockResolvedValueOnce(
        createPageDto([pageTwo], {pages: 2, prev: '/characters?page=1'}),
      );

    const firstSearch = await service.search('lisa');
    expect(firstSearch).toEqual([
      expect.objectContaining({id: 2, name: 'Lisa Simpson'}),
    ]);
    expect(mockClient.get).toHaveBeenCalledTimes(2);
    expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1);

    const secondSearch = await service.search('Homer');
    expect(secondSearch).toEqual([
      expect.objectContaining({id: 1, name: 'Homer Simpson'}),
    ]);
    expect(mockClient.get).toHaveBeenCalledTimes(2);
  });

  it('builds image urls correctly', () => {
    expect(service.getImageUrl(undefined)).toBeNull();
    expect(service.getImageUrl('https://example.com/img.webp')).toBe(
      'https://example.com/img.webp',
    );
    expect(service.getImageUrl('/character/1.webp', '200')).toBe(
      'https://cdn.thesimpsonsapi.com/200/character/1.webp',
    );
    expect(service.getImageUrl('character/2.webp', '500')).toBe(
      'https://cdn.thesimpsonsapi.com/500/character/2.webp',
    );
  });

  it('loads persisted characters from storage before refetching', async () => {
    const storedCharacter = {
      id: 10,
      name: 'Moe Szyslak',
    } as CharacterDto;

    await AsyncStorage.setItem(
      CACHE_KEY,
      JSON.stringify([
        {
          id: storedCharacter.id,
          name: storedCharacter.name,
        },
      ]),
    );

    const freshService = new CharactersService(mockClient, adapter);
    const results = await freshService.search('moe');

    expect(results).toEqual([
      expect.objectContaining({id: storedCharacter.id, name: storedCharacter.name}),
    ]);
    expect(mockClient.get).not.toHaveBeenCalled();
  });

  it('clears cache so subsequent searches refetch', async () => {
    const pageOne: CharacterDto = {id: 3, name: 'Bart Simpson'};
    const pageTwo: CharacterDto = {id: 4, name: 'Marge Simpson'};

    mockClient.get
      .mockResolvedValueOnce(
        createPageDto([pageOne], {pages: 2, next: '/characters?page=2'}),
      )
      .mockResolvedValueOnce(
        createPageDto([pageTwo], {pages: 2, prev: '/characters?page=1'}),
      );

    await service.search('bart');
    expect(mockClient.get).toHaveBeenCalledTimes(2);

    await service.clearCache();
    mockClient.get.mockReset();
    mockClient.get
      .mockResolvedValueOnce(
        createPageDto([pageOne], {pages: 1, next: null}),
      );

    await service.search('bart');
    expect(mockClient.get).toHaveBeenCalledTimes(1);
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith(CACHE_KEY);
  });
});
