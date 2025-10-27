import {BaseAdapter} from '../BaseAdapter';
import {CharacterDto} from './dto';
import {Character} from '../../../types';

export class CharacterAdapter extends BaseAdapter<CharacterDto, Character> {
  adapt(data: CharacterDto): Character {
    return {
      id: data.id,
      name: data.name,
      age: data.age,
      birthdate: data.birthdate,
      gender: data.gender,
      occupation: data.occupation,
      portrait_path: data.portrait_path,
      phrases: data.phrases,
      status: data.status,
    };
  }
}

export default CharacterAdapter;
