export interface Character {
  id: number;
  name: string;
  age?: number;
  birthdate?: string;
  gender?: string;
  occupation?: string;
  portrait_path?: string;
  phrases?: string[];
  status?: string;
}

export interface Episode {
  id: number;
  season: number;
  episode_number: number;
  title: string;
  air_date?: string;
  synopsis?: string;
  thumbnail_path?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    total_pages: number;
    total_items: number;
    per_page: number;
  };
}

export interface User {
  id: string;
  email: string;
  createdAt: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthSession {
  user: User;
  token: string;
}

export interface Note {
  id: string;
  userId: string;
  characterId: number;
  title: string;
  text: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteInput {
  characterId: number;
  title: string;
  text: string;
  rating: number;
}

export interface UpdateNoteInput {
  title?: string;
  text?: string;
  rating?: number;
}
