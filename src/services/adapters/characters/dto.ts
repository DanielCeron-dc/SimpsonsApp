export interface CharacterDto {
  id: number;
  name: string;
  age?: number;
  birthdate?: string;
  gender?: string;
  occupation?: string;
  portrait_path?: string;
  phrases?: string[];
  status?: string;
  description?: string;
  first_appearance_ep_id?: number;
  first_appearance_sh_id?: number;
}

export interface CharactersPageDto {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
  results: CharacterDto[];
}
