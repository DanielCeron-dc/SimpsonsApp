import {BaseAdapter} from '../BaseAdapter';
import {EpisodeDto} from './dto';
import {Episode} from '../../types';

export class EpisodeAdapter extends BaseAdapter<EpisodeDto, Episode> {
  adapt(data: EpisodeDto): Episode {
    return {
      id: data.id,
      season: data.season,
      episode_number: data.episode_number,
      title: data.name,
      air_date: data.air_date,
      synopsis: data.synopsis ?? data.description,
      thumbnail_path: data.thumbnail_path ?? data.image_path,
    };
  }
}

export default EpisodeAdapter;
