'use client';

import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { ChatMessage } from '@/types/chat';
import { VTuberCharacter } from '@/types/character';
import { getCharacterById } from '@/data/characters';
import MessageItem from './MessageItem';

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

  // キャラクターデータのメモ化
  const characterCache = useMemo(() => {
    const cache = new Map<string, VTuberCharacter | null>();
    messages.forEach(message => {
      if (message.characterId && !cache.has(message.characterId)) {
        cache.set(message.characterId, getCharacterById(message.characterId) || null);
      }
    });
    return cache;
  }, [messages]);

  // メッセージアイテムのメモ化
  const messageItems = useMemo(() => 
    messages.map((message) => {
      const character = message.characterId ? characterCache.get(message.characterId) || null : null;
      return (
        <MessageItem
          key={message.id}
          message={message}
          character={character}
        />
      );
    }),
    [messages, characterCache]
  );

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
            {messageItems}
          </div>
        )}
        
        {/* スクロール用の目印 */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}