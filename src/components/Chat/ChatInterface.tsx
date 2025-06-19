'use client';

import { VTuberCharacter } from '@/types/character';
import { useChat } from '@/hooks/useChat';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

interface ChatInterfaceProps {
  selectedCharacter: VTuberCharacter;
  onBackToSelection: () => void;
}

export default function ChatInterface({ 
  selectedCharacter, 
  onBackToSelection 
}: ChatInterfaceProps) {
  const { messages, isLoading, sendMessage, clearMessages } = useChat();

  const handleSendMessage = async (content: string) => {
    await sendMessage(content, selectedCharacter);
  };

  return (
    <div className="w-full h-full flex flex-col bg-white">
      {/* Header */}
      <div className={`
        bg-gradient-to-r ${selectedCharacter.background} 
        border-b p-4 flex items-center justify-between
      `}>
        <div className="flex items-center space-x-3">
          <span className="text-3xl">{selectedCharacter.avatar}</span>
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {selectedCharacter.name}
            </h2>
            <p className="text-sm text-gray-600">
              {selectedCharacter.description}
            </p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={clearMessages}
            className="px-3 py-1 text-sm bg-white bg-opacity-70 text-gray-700 rounded-md hover:bg-opacity-90 transition-colors"
          >
            クリア
          </button>
          <button
            onClick={onBackToSelection}
            className="px-3 py-1 text-sm bg-white bg-opacity-70 text-gray-700 rounded-md hover:bg-opacity-90 transition-colors"
          >
            戻る
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <MessageList 
        messages={messages} 
        selectedCharacter={selectedCharacter} 
      />

      {/* Loading Indicator */}
      {isLoading && (
        <div className="px-4 py-2 bg-gray-50 border-t">
          <div className="flex items-center space-x-2 text-gray-600">
            <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
            <span className="text-sm">{selectedCharacter.name}が返信中...</span>
          </div>
        </div>
      )}

      {/* Input Area - Fixed at bottom */}
      <MessageInput
        onSendMessage={handleSendMessage}
        disabled={isLoading}
        placeholder={`${selectedCharacter.name}にメッセージを送信...`}
      />
    </div>
  );
}