'use client';

import { useState, useCallback } from 'react';
import { ChatMessage, ChatRequest, ChatResponse } from '@/types/chat';
import { VTuberCharacter } from '@/types/character';
import { AppError, ERROR_CODES } from '@/types/error';
import { ErrorFactory, logError, fetchWithTimeout, RetryUtils } from '@/lib/error-utils';

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AppError | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const sendMessage = useCallback(async (
    content: string, 
    character: VTuberCharacter
  ): Promise<void> => {
    if (!content.trim()) {
      const validationError = ErrorFactory.createAppError(
        ERROR_CODES.INVALID_INPUT,
        'メッセージを入力してください',
        'low'
      );
      setError(validationError);
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: content.trim(),
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      await RetryUtils.withRetry(
        async () => {
          const requestBody: ChatRequest = {
            message: content.trim(),
            characterId: character.id,
          };

          const response = await fetchWithTimeout('/api/chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          }, 45000); // 45秒タイムアウト

          const data: ChatResponse = await response.json();

          if (!response.ok) {
            const apiError = ErrorFactory.createApiError(
              response.status === 429 ? ERROR_CODES.API_RATE_LIMIT :
              response.status === 401 ? ERROR_CODES.API_KEY_INVALID :
              ERROR_CODES.API_INTERNAL_ERROR,
              response.status,
              '/api/chat',
              data.error || `APIエラー (${response.status})`
            );
            throw apiError;
          }

          // レスポンス検証
          if (!data.response || data.response.trim().length === 0) {
            throw ErrorFactory.createApiError(
              ERROR_CODES.API_INTERNAL_ERROR,
              200,
              '/api/chat',
              'AIから空の応答が返されました'
            );
          }

          const assistantMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            content: data.response,
            role: 'assistant',
            timestamp: new Date(),
            characterId: character.id,
          };

          setMessages(prev => [...prev, assistantMessage]);
          setRetryCount(0); // 成功時にリセット
        },
        3, // 最大3回試行
        2000, // 2秒から開始
        (attempt, error) => {
          setRetryCount(attempt);
          logError(error, `useChat retry attempt ${attempt}`);
        }
      );
    } catch (err) {
      const appError = err instanceof Error 
        ? ErrorFactory.fromFetchError(err, '/api/chat')
        : err as AppError;
      
      setError(appError);
      logError(appError, 'useChat.sendMessage');
      
      // エラーメッセージをチャットに表示（重要度が高い場合のみ）
      if (appError.severity === 'high' || appError.severity === 'critical') {
        const errorChatMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: `申し訳ありません。${appError.message}`,
          role: 'assistant',
          timestamp: new Date(),
          characterId: character.id,
        };
        
        setMessages(prev => [...prev, errorChatMessage]);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  const removeMessage = useCallback((messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
  }, []);

  const retryLastMessage = useCallback(() => {
    const lastUserMessage = [...messages].reverse().find(msg => msg.role === 'user');
    if (lastUserMessage && error) {
      // 最後のユーザーメッセージを再送信
      const character = { id: 'unknown' } as VTuberCharacter; // これは改善が必要
      sendMessage(lastUserMessage.content, character);
    }
  }, [messages, error, sendMessage]);

  return {
    messages,
    isLoading,
    error,
    retryCount,
    sendMessage,
    clearMessages,
    removeMessage,
    retryLastMessage,
    clearError: () => setError(null),
  };
}