export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  characterId?: string;
}

export interface ChatRequest {
  message: string;
  characterId: string;
}

export interface ChatResponse {
  response: string;
  error?: string;
}