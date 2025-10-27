import {Character} from '../types';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainStackParamList = {
  Characters: undefined;
  CharacterDetail: {
    character: Character;
  };
  Episodes: undefined;
};
