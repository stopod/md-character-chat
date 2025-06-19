export interface VTuberCharacter {
  id: string;
  name: string;
  description: string;
  personality: string;
  speechPattern: string;
  catchphrase: string[];
  avatar: string;
  color: string;
  background: string;
}

export interface CharacterProfile {
  name: string;
  description?: string;
  avatar?: string;
  color?: string;
  background?: string;
  firstPerson: string[];
  secondPerson: string[];
  personality: string[];
  catchphrases: string[];
  emotionalExpressions: {
    happy: string[];
    troubled: string[];
    interested: string[];
  };
  favorites: Array<{
    item: string;
    reason?: string;
  }>;
  speechFeatures: string[];
  conversationExample?: {
    user: string;
    character: string;
  };
}