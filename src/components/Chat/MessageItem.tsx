'use client';

import { memo } from 'react';
import { ChatMessage } from '@/types/chat';
import { VTuberCharacter } from '@/types/character';

interface MessageItemProps {
  message: ChatMessage;
  character: VTuberCharacter | null;
}

const MessageItem = memo(function MessageItem({ message, character }: MessageItemProps) {
  return (
    <div
      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`
          max-w-sm md:max-w-lg lg:max-w-2xl px-4 py-3 rounded-lg shadow-sm
          ${message.role === 'user' 
            ? 'bg-blue-500 text-white' 
            : character 
              ? `bg-gradient-to-r ${character.background} text-gray-800`
              : 'bg-gray-200 text-gray-800'
          }
        `}
      >
        {message.role === 'assistant' && character && (
          <div className="flex items-center mb-2">
            <span className="text-lg mr-2">{character.avatar}</span>
            <span className="font-bold text-sm">{character.name}</span>
          </div>
        )}
        
        <p className="text-base leading-relaxed whitespace-pre-wrap">
          {message.content}
        </p>
        
        <div className={`text-xs mt-2 opacity-70 ${
          message.role === 'user' ? 'text-blue-100' : 'text-gray-600'
        }`}>
          {message.timestamp.toLocaleTimeString('ja-JP', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>
    </div>
  );
});

export default MessageItem;