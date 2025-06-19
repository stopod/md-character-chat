import { NextResponse } from 'next/server';
import { CharacterLoader } from '@/lib/character-loader';

export async function GET() {
  try {
    const characters = CharacterLoader.getAllCharacters();
    return NextResponse.json(characters);
  } catch (error) {
    console.error('Failed to load characters:', error);
    return NextResponse.json([], { status: 500 });
  }
}