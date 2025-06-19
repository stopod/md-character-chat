import { GoogleGenerativeAI } from '@google/generative-ai';
import { VTuberCharacter } from '@/types/character';
import { CharacterLoader } from './character-loader';

export class GeminiClient {
  private genAI: GoogleGenerativeAI;
  
  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set');
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
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return text;
    } catch (error) {
      console.error('Gemini API error:', error);
      throw new Error('AI response generation failed');
    }
  }

  private createCharacterPrompt(character: VTuberCharacter, userMessage: string): string {
    // MDファイルからプロフィールを読み込み
    const profile = CharacterLoader.loadCharacterProfile(character.id);
    
    if (profile) {
      // MDファイルベースのプロンプト生成
      return CharacterLoader.generatePrompt(profile, userMessage);
    }
    
    // フォールバック: 既存のキャラクターデータを使用
    return `あなたは「${character.name}」というVTuberキャラクターです。以下の設定に従って会話してください。

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
5. VTuberとして配信者のような親しみやすい口調で話してください
6. 200文字以内で応答してください

ユーザーのメッセージ: "${userMessage}"

上記のメッセージに対して、${character.name}として応答してください。`;
  }
}