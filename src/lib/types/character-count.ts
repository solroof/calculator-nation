// 글자수 계산기 타입 정의

export interface CharacterCountResult {
  totalChars: number; // 총 글자 수 (공백 포함)
  charsNoSpaces: number; // 글자 수 (공백 제외)
  words: number; // 단어 수
  sentences: number; // 문장 수
  paragraphs: number; // 문단 수
  lines: number; // 줄 수
  bytes: number; // 바이트 수 (UTF-8)
  koreanChars: number; // 한글 글자 수
  englishChars: number; // 영문 글자 수
  numbers: number; // 숫자 개수
  spaces: number; // 공백 수
  specialChars: number; // 특수문자 수
}
