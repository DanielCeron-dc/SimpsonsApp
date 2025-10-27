import {EpisodesService} from '../../src/services/episodes/EpisodesService';
import EpisodeAdapter from '../../src/services/adapters/episodes/EpisodeAdapter';
import {EpisodeDto, EpisodesPageDto} from '../../src/services/adapters/episodes/dto';

const createPageDto = (
  results: EpisodeDto[],
  overrides: Partial<EpisodesPageDto> = {},
): EpisodesPageDto => ({
  count: results.length,
  pages: 1,
  next: null,
  prev: null,
  results,
  ...overrides,
});

describe('EpisodesService', () => {
  let mockClient: {get: jest.Mock};
  let service: EpisodesService;

  beforeEach(() => {
    mockClient = {get: jest.fn()};
    service = new EpisodesService(mockClient, new EpisodeAdapter());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('maps episode DTOs when fetching a page', async () => {
    const dto: EpisodeDto = {
      id: 1,
      season: 1,
      episode_number: 1,
      title: 'Simpsons Roasting on an Open Fire',
      description: 'Pilot episode description',
      image_path: '/episode/1.webp',
    };

    mockClient.get.mockResolvedValueOnce(createPageDto([dto]));

    const result = await service.getPage(1);

    expect(result).toEqual([
      expect.objectContaining({
        id: dto.id,
        title: dto.title,
        synopsis: dto.description,
        thumbnail_path: dto.image_path,
      }),
    ]);
    expect(mockClient.get).toHaveBeenCalledWith('/episodes', {
      params: {page: 1},
    });
  });

  it('maps episode details when fetching by id', async () => {
    const dto: EpisodeDto = {
      id: 5,
      season: 1,
      episode_number: 5,
      title: 'Bart the General',
      synopsis: 'Bart defends Lisa from bullies.',
      thumbnail_path: '/episode/5.webp',
    };

    mockClient.get.mockResolvedValueOnce(dto);

    const result = await service.getById(dto.id);

    expect(result).toEqual(
      expect.objectContaining({
        id: dto.id,
        synopsis: dto.synopsis,
        thumbnail_path: dto.thumbnail_path,
      }),
    );
    expect(mockClient.get).toHaveBeenCalledWith('/episodes/5');
  });
});
