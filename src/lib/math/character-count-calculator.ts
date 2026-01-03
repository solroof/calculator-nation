import type { CharacterCountResult } from '../types/character-count';

export class CharacterCountCalculator {
  calculate(text: string): CharacterCountResult {
    // 총 글자 수 (공백 포함)
    const totalChars = text.length;

    // 공백 수
    const spaces = (text.match(/\s/g) || []).length;

    // 글자 수 (공백 제외)
    const charsNoSpaces = totalChars - spaces;

    // 단어 수
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;

    // 문장 수 (마침표, 느낌표, 물음표 기준)
    const sentences = (text.match(/[.!?]+/g) || []).length || (text.trim() ? 1 : 0);

    // 문단 수 (빈 줄 기준)
    const paragraphs = text.trim() ? text.split(/\n\s*\n/).filter(p => p.trim()).length : 0;

    // 줄 수
    const lines = text ? text.split('\n').length : 0;

    // 바이트 수 (UTF-8)
    const bytes = new TextEncoder().encode(text).length;

    // 한글 글자 수
    const koreanChars = (text.match(/[가-힣ㄱ-ㅎㅏ-ㅣ]/g) || []).length;

    // 영문 글자 수
    const englishChars = (text.match(/[a-zA-Z]/g) || []).length;

    // 숫자 개수
    const numbers = (text.match(/[0-9]/g) || []).length;

    // 특수문자 수
    const specialChars = totalChars - koreanChars - englishChars - numbers - spaces;

    return {
      totalChars,
      charsNoSpaces,
      words,
      sentences,
      paragraphs,
      lines,
      bytes,
      koreanChars,
      englishChars,
      numbers,
      spaces,
      specialChars: Math.max(0, specialChars),
    };
  }
}

export const characterCountCalculator = new CharacterCountCalculator();
