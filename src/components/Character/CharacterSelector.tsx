'use client';

import { useState, useEffect } from 'react';
import { VTuberCharacter } from '@/types/character';
import { loadCharacters } from '@/data/characters';

interface CharacterSelectorProps {
  selectedCharacter: VTuberCharacter | null;
  onCharacterSelect: (character: VTuberCharacter) => void;
}

export default function CharacterSelector({
  selectedCharacter,
  onCharacterSelect
}: CharacterSelectorProps) {
  const [characters, setCharacters] = useState<VTuberCharacter[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const charactersData = await loadCharacters();
      setCharacters(charactersData);
      setIsLoading(false);
    };
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <div className="text-center">
          <div className="text-2xl">読み込み中...</div>
        </div>
      </div>
    );
  }
  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
        チャットするキャラクターを選択してね！
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {characters.map((character) => (
          <div
            key={character.id}
            onClick={() => onCharacterSelect(character)}
            className={`
              cursor-pointer rounded-xl p-6 transition-all duration-300 transform hover:scale-105
              ${selectedCharacter?.id === character.id 
                ? 'ring-4 ring-blue-400 shadow-xl' 
                : 'hover:shadow-lg'
              }
              bg-gradient-to-br ${character.background}
            `}
          >
            <div className="text-center">
              <div className="text-6xl mb-4">{character.avatar}</div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">
                {character.name}
              </h3>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                {character.description}
              </p>
              <div className="flex flex-wrap gap-1 justify-center">
                {character.catchphrase.slice(0, 2).map((phrase, index) => (
                  <span
                    key={index}
                    className="inline-block bg-white bg-opacity-70 text-xs px-2 py-1 rounded-full text-gray-700"
                  >
                    {phrase}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {selectedCharacter && (
        <div className="mt-8 text-center">
          <p className="text-lg text-gray-700">
            <span className="font-bold">{selectedCharacter.name}</span>を選択しました！
          </p>
        </div>
      )}
    </div>
  );
}