'use client';

import { useEffect, useRef, useState } from 'react';
import { ChatMessage } from '@/types/chat';
import { VTuberCharacter } from '@/types/character';
import { getCharacterById } from '@/data/characters';

interface MessageListProps {
  messages: ChatMessage[];
  selectedCharacter: VTuberCharacter | null;
}

export default function MessageList({ messages, selectedCharacter }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showScrollbar, setShowScrollbar] = useState(false);

  // 新しいメッセージが追加されたら自動スクロール
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // スクロールが必要かどうかをチェック
  useEffect(() => {
    const checkScrollable = () => {
      if (containerRef.current) {
        const isScrollable = containerRef.current.scrollHeight > containerRef.current.clientHeight;
        setShowScrollbar(isScrollable);
      }
    };

    checkScrollable();
    const resizeObserver = new ResizeObserver(checkScrollable);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [messages]);

  return (
    <div className="flex-1 bg-gray-50 scrollbar-overlay">
      <div className="p-4 space-y-4 min-h-full flex flex-col justify-end">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mb-8">
            <div className="text-4xl mb-4">💬</div>
            <p>チャットを開始してください</p>
            {selectedCharacter && (
              <p className="mt-2">
                <span className="font-bold">{selectedCharacter.name}</span>が待っています！
              </p>
            )}
          </div>
        )}
        
        {messages.length > 0 && (
          <div className="space-y-4">
      {messages.map((message) => {
        const character = message.characterId ? getCharacterById(message.characterId) : null;
        
        return (
          <div
            key={message.id}
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
      })}
          </div>
        )}
        
        {/* スクロール用の目印 */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}