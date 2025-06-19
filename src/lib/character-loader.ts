import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { CharacterProfile, VTuberCharacter } from '@/types/character';

export class CharacterLoader {
  private static charactersPath = join(process.cwd(), 'docs', 'characters');

  static getAllCharacters(): VTuberCharacter[] {
    try {
      const files = readdirSync(this.charactersPath);
      const mdFiles = files.filter(file => file.endsWith('.md') && !file.startsWith('_'));
      
      const characters: VTuberCharacter[] = [];
      
      for (const file of mdFiles) {
        const characterId = file.replace('.md', '');
        const character = this.loadFullCharacterData(characterId);
        if (character) {
          characters.push(character);
        }
      }
      
      return characters;
    } catch (error) {
      console.error('Failed to load characters:', error);
      return [];
    }
  }

  static loadFullCharacterData(characterId: string): VTuberCharacter | null {
    try {
      const filePath = join(this.charactersPath, `${characterId}.md`);
      const content = readFileSync(filePath, 'utf-8');
      
      const parsed = this.parseMarkdown(content);
      
      // VTuberCharacterオブジェクトに変換
      return {
        id: characterId,
        name: parsed.name || characterId,
        description: parsed.description || '',
        personality: parsed.personality.join('、'),
        speechPattern: parsed.speechFeatures.join('、'),
        catchphrase: parsed.catchphrases.slice(0, 4),
        avatar: parsed.avatar || '🎭',
        color: parsed.color || '#808080',
        background: parsed.background || 'from-gray-100 to-gray-200'
      };
    } catch (error) {
      console.error(`Failed to load character data for ${characterId}:`, error);
      return null;
    }
  }

  static loadCharacterProfile(characterId: string): CharacterProfile | null {
    try {
      const filePath = join(this.charactersPath, `${characterId}.md`);
      const content = readFileSync(filePath, 'utf-8');
      
      return this.parseMarkdown(content);
    } catch (error) {
      console.error(`Failed to load character profile for ${characterId}:`, error);
      return null;
    }
  }

  private static parseMarkdown(content: string): CharacterProfile {
    const lines = content.split('\n');
    const profile: Partial<CharacterProfile> = {
      emotionalExpressions: { happy: [], troubled: [], interested: [] },
      favorites: [],
      catchphrases: [],
      personality: [],
      firstPerson: [],
      secondPerson: [],
      speechFeatures: []
    };

    let currentSection = '';
    let currentSubSection = '';

    for (const line of lines) {
      const trimmed = line.trim();
      
      // スキップする行
      if (!trimmed || trimmed.startsWith('##') === false && trimmed.startsWith('###') === false && trimmed.startsWith('-') === false && trimmed.startsWith('**') === false) {
        // タイトル行からキャラクター名を取得
        if (trimmed.startsWith('# ') && !profile.name) {
          profile.name = trimmed.substring(2);
        }
        continue;
      }

      // セクション判定
      if (trimmed.startsWith('## ')) {
        currentSection = trimmed.substring(3);
        currentSubSection = '';
        continue;
      }

      if (trimmed.startsWith('### ')) {
        currentSubSection = trimmed.substring(4);
        continue;
      }

      // データ解析
      if (trimmed.startsWith('- **') && trimmed.includes('**:')) {
        const [key, ...valueParts] = trimmed.substring(4).split('**:');
        const value = valueParts.join('**:').trim();
        
        switch (key) {
          case '名前':
            profile.name = value;
            break;
          case 'アバター':
            profile.avatar = value;
            break;
          case '色':
            profile.color = value;
            break;
          case '背景':
            profile.background = value;
            break;
          case '説明':
            profile.description = value;
            break;
          case '一人称':
            profile.firstPerson = value.split('、').map(s => s.trim());
            break;
          case '二人称':
            profile.secondPerson = value.split('、').map(s => s.trim());
            break;
          case '性格':
            profile.personality = value.split('、').map(s => s.trim());
            break;
        }
      } else if (trimmed.startsWith('- ')) {
        const value = trimmed.substring(2);
        
        // セクションに応じてデータを振り分け
        if (currentSection === '話し方・口癖') {
          if (currentSubSection === '語尾・口癖') {
            profile.catchphrases!.push(value);
          }
        } else if (currentSection === 'キャラクター反応') {
          if (currentSubSection === '話し方の特徴') {
            profile.speechFeatures!.push(value);
          } else if (currentSubSection === '好きなもの') {
            const match = value.match(/^(.+?)（(.+)）$/) || value.match(/^(.+?)$/);
            if (match) {
              profile.favorites!.push({
                item: match[1].trim(),
                reason: match[2]?.trim()
              });
            }
          }
        }
      } else if (trimmed.startsWith('**') && trimmed.includes('**:')) {
        // 感情表現の解析
        const match = trimmed.match(/\*\*(.+?)\*\*:\s*「(.+?)」/);
        if (match && currentSection === '話し方・口癖' && currentSubSection === '感情表現') {
          const emotion = match[1];
          const expression = match[2];
          
          switch (emotion) {
            case '嬉しい時':
              profile.emotionalExpressions!.happy.push(expression);
              break;
            case '困った時':
              profile.emotionalExpressions!.troubled.push(expression);
              break;
            case '興味を示す時':
              profile.emotionalExpressions!.interested.push(expression);
              break;
          }
        }
      }

      // 会話例の解析
      if (currentSection === '会話例') {
        if (trimmed.startsWith('**ユーザー**:')) {
          profile.conversationExample = {
            user: trimmed.substring(10).trim(),
            character: ''
          };
        } else if (trimmed.startsWith(`**${profile.name}**:`)) {
          if (profile.conversationExample) {
            profile.conversationExample.character = trimmed.substring(`**${profile.name}**:`.length).trim();
          }
        }
      }
    }

    return profile as CharacterProfile;
  }

  static generatePrompt(profile: CharacterProfile, userMessage: string): string {
    const emotionExamples = [
      ...profile.emotionalExpressions.happy,
      ...profile.emotionalExpressions.troubled,
      ...profile.emotionalExpressions.interested
    ].slice(0, 3);

    return `あなたは「${profile.name}」というキャラクターです。以下の設定に従って会話してください。

【キャラクター設定】
名前: ${profile.name}
一人称: ${profile.firstPerson.join('、')}
二人称: ${profile.secondPerson.join('、')}
性格: ${profile.personality.join('、')}

【話し方の特徴】
${profile.speechFeatures.join('、')}

【よく使う口癖・語尾】
${profile.catchphrases.slice(0, 6).join('、')}

【感情表現例】
${emotionExamples.join('、')}

【重要な指示】
1. 必ず上記のキャラクター設定に従って応答してください
2. 口癖を自然に会話に織り交ぜてください
3. そのキャラクターらしい感情表現を使ってください
4. 日本語で応答してください
5. 親しみやすい口調で話してください
6. 200文字以内で応答してください

ユーザーのメッセージ: "${userMessage}"

上記のメッセージに対して、${profile.name}として応答してください。`;
  }
}