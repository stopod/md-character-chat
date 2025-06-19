'use client';

import { useState } from 'react';
import { VTuberCharacter } from '@/types/character';
import { useChat } from '@/hooks/useChat';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import ErrorToast from '@/components/Error/ErrorToast';
import { RetryUtils } from '@/lib/error-utils';

interface ChatInterfaceProps {
  selectedCharacter: VTuberCharacter;
  onBackToSelection: () => void;
}

export default function ChatInterface({ 
  selectedCharacter, 
  onBackToSelection 
}: ChatInterfaceProps) {
  const { 
    messages, 
    isLoading, 
    error, 
    retryCount,
    sendMessage, 
    clearMessages,
    retryLastMessage,
    clearError 
  } = useChat();
  
  const [showRetryOption, setShowRetryOption] = useState(false);

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
            <span className="text-sm">
              {selectedCharacter.name}が返信中...
              {retryCount > 0 && ` (再試行 ${retryCount}/3)`}
            </span>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {error && error.severity !== 'low' && (
        <div className="px-4 py-3 bg-red-50 border-t border-red-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-red-600">⚠️</span>
              <span className="text-sm text-red-700">{error.message}</span>
            </div>
            <div className="flex space-x-2">
              {RetryUtils.isRetryable(error) && (
                <button
                  onClick={() => {
                    clearError();
                    retryLastMessage();
                  }}
                  className="text-xs bg-red-100 hover:bg-red-200 text-red-700 px-2 py-1 rounded transition-colors"
                >
                  再試行
                </button>
              )}
              <button
                onClick={clearError}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-2 py-1 rounded transition-colors"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Input Area - Fixed at bottom */}
      <MessageInput
        onSendMessage={handleSendMessage}
        disabled={isLoading}
        placeholder={`${selectedCharacter.name}にメッセージを送信...`}
      />

      {/* Error Toast for low severity errors */}
      <ErrorToast
        error={error && error.severity === 'low' ? error : null}
        onClose={clearError}
        autoClose={true}
        autoCloseDelay={3000}
      />
    </div>
  );
}