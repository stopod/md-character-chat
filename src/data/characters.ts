import { VTuberCharacter } from '@/types/character';

// キャラクターデータ（APIから取得）
export let characters: VTuberCharacter[] = [];

// キャラクターデータを取得する関数
export const loadCharacters = async (): Promise<VTuberCharacter[]> => {
  try {
    const response = await fetch('/api/characters');
    if (!response.ok) {
      throw new Error('Failed to fetch characters');
    }
    characters = await response.json();
    return characters;
  } catch (error) {
    console.error('Failed to load characters:', error);
    return [];
  }
};

export const getCharacterById = (id: string): VTuberCharacter | undefined => {
  return characters.find(character => character.id === id);
};

export const getCharacterNames = (): string[] => {
  return characters.map(character => character.name);
};