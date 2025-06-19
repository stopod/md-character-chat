import { GoogleGenerativeAI } from '@google/generative-ai';
import { VTuberCharacter } from '@/types/character';
import { CharacterLoader } from './character-loader';
import { ErrorFactory, logError, RetryUtils } from './error-utils';
import { ERROR_CODES } from '@/types/error';

export class GeminiClient {
  private genAI: GoogleGenerativeAI;
  
  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      const error = ErrorFactory.createAppError(
        ERROR_CODES.API_KEY_MISSING,
        'GEMINI_API_KEY環境変数が設定されていません',
        'critical'
      );
      logError(error, 'GeminiClient.constructor');
      throw error;
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async generateResponse(
    message: string, 
    character: VTuberCharacter
  ): Promise<string> {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const prompt = this.createCharacterPrompt(character, message);
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return text;
    } catch (error) {
      console.error('Gemini API error:', error);
      throw new Error('AI response generation failed');
    }
  }

  async generateResponseWithPrompt(prompt: string): Promise<string> {
    return RetryUtils.withRetry(
      async () => {
        try {
          const model = this.genAI.getGenerativeModel({ 
            model: 'gemini-1.5-flash',
            generationConfig: {
              maxOutputTokens: 1000,
              temperature: 0.7,
            },
          });
          
          // タイムアウト付きでリクエスト実行
          const result = await Promise.race([
            model.generateContent(prompt),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Request timeout')), 30000)
            )
          ]) as any;

          const response = await result.response;
          const text = response.text();
          
          // レスポンス検証
          if (!text || text.trim().length === 0) {
            throw ErrorFactory.createApiError(
              ERROR_CODES.API_INTERNAL_ERROR,
              500,
              '/api/chat',
              'AIから空の応答が返されました'
            );
          }
          
          return text;
        } catch (error: any) {
          const geminiError = ErrorFactory.fromGeminiError(error, { prompt: prompt.substring(0, 100) });
          logError(geminiError, 'GeminiClient.generateResponseWithPrompt');
          throw geminiError;
        }
      },
      3, // 最大3回試行
      1000, // 1秒から開始
      (attempt, error) => {
        logError(error, `GeminiClient retry attempt ${attempt}`);
      }
    );
  }

  private createCharacterPrompt(character: VTuberCharacter, userMessage: string): string {
    // MDファイルからプロフィールを読み込み
    const profile = CharacterLoader.loadCharacterProfile(character.id);
    
    if (profile) {
      // MDファイルベースのプロンプト生成
      return CharacterLoader.generatePrompt(profile, userMessage);
    }
    
    // フォールバック: 既存のキャラクターデータを使用
    return `あなたは「${character.name}」というキャラクターです。以下の設定に従って会話してください。

【キャラクター設定】
名前: ${character.name}
性格: ${character.personality}
話し方: ${character.speechPattern}
口癖: ${character.catchphrase.join('、')}

【重要な指示】
1. 必ず上記のキャラクター設定に従って応答してください
2. 口癖を自然に会話に織り交ぜてください
3. そのキャラクターらしい感情表現を使ってください
4. 日本語で応答してください
5. 親しみやすい口調で話してください
6. 200文字以内で応答してください

ユーザーのメッセージ: "${userMessage}"

上記のメッセージに対して、${character.name}として応答してください。`;
  }
}