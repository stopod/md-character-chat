import { NextRequest, NextResponse } from 'next/server';
import { GeminiClient } from '@/lib/gemini';
import { CharacterLoader } from '@/lib/character-loader';
import { ChatRequest, ChatResponse } from '@/types/chat';

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { message, characterId } = body;

    if (!message || !characterId) {
      return NextResponse.json(
        { error: 'メッセージとキャラクターIDが必要です' } as ChatResponse,
        { status: 400 }
      );
    }

    const characterProfile = CharacterLoader.loadCharacterProfile(characterId);
    if (!characterProfile) {
      return NextResponse.json(
        { error: '指定されたキャラクターが見つかりません' } as ChatResponse,
        { status: 404 }
      );
    }

    const geminiClient = new GeminiClient();
    const prompt = CharacterLoader.generatePrompt(characterProfile, message);
    const response = await geminiClient.generateResponseWithPrompt(prompt);

    return NextResponse.json({
      response
    } as ChatResponse);

  } catch (error) {
    console.error('Chat API error:', error);
    
    if (error instanceof Error && error.message.includes('GEMINI_API_KEY')) {
      return NextResponse.json(
        { error: 'APIキーが設定されていません' } as ChatResponse,
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'AIからの応答生成に失敗しました' } as ChatResponse,
      { status: 500 }
    );
  }
}