'use client';

import { useState } from 'react';
import { VTuberCharacter } from '@/types/character';
import CharacterSelector from '@/components/Character/CharacterSelector';
import ChatInterface from '@/components/Chat/ChatInterface';

export default function Home() {
  const [selectedCharacter, setSelectedCharacter] = useState<VTuberCharacter | null>(null);
  const [showChat, setShowChat] = useState(false);

  const handleCharacterSelect = (character: VTuberCharacter) => {
    setSelectedCharacter(character);
  };

  const handleStartChat = () => {
    if (selectedCharacter) {
      setShowChat(true);
    }
  };

  const handleBackToSelection = () => {
    setShowChat(false);
    setSelectedCharacter(null);
  };

  if (showChat && selectedCharacter) {
    return (
      <div className="w-full h-full">
        <ChatInterface
          selectedCharacter={selectedCharacter}
          onBackToSelection={handleBackToSelection}
        />
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-y-auto scrollbar-thin">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold gradient-text mb-4">
            AI Character Chat へようこそ！
          </h2>
          <p className="text-gray-600 text-lg">
            お気に入りのキャラクターを選んで、楽しくおしゃべりしましょう！
          </p>
        </div>

      <CharacterSelector
        selectedCharacter={selectedCharacter}
        onCharacterSelect={handleCharacterSelect}
      />

      {selectedCharacter && (
        <div className="mt-8 text-center">
          <button
            onClick={handleStartChat}
            className="btn-primary text-lg px-8 py-3"
          >
            {selectedCharacter.name}とチャットを始める
          </button>
        </div>
      )}

      <div className="mt-12 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4 text-center">使い方</h3>
        <div className="grid md:grid-cols-3 gap-4 text-center">
          <div className="p-4">
            <div className="text-3xl mb-2">1️⃣</div>
            <h4 className="font-semibold mb-2">キャラクター選択</h4>
            <p className="text-sm text-gray-600">
              個性豊かなキャラクターから選択
            </p>
          </div>
          <div className="p-4">
            <div className="text-3xl mb-2">2️⃣</div>
            <h4 className="font-semibold mb-2">チャット開始</h4>
            <p className="text-sm text-gray-600">
              「チャットを始める」ボタンでスタート
            </p>
          </div>
          <div className="p-4">
            <div className="text-3xl mb-2">3️⃣</div>
            <h4 className="font-semibold mb-2">楽しく会話</h4>
            <p className="text-sm text-gray-600">
              キャラクターと自由におしゃべりしよう
            </p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}