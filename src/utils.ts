/**
 * Count words in mixed Chinese/English markdown content.
 * Chinese characters each count as one word; English words are space-separated.
 */
export function countWords(markdown: string): number {
  // Strip markdown syntax: links, images, code blocks, inline code, headers, etc.
  const text = markdown
    .replace(/```[\s\S]*?```/g, '')   // code blocks
    .replace(/`[^`]*`/g, '')          // inline code
    .replace(/!\[.*?\]\(.*?\)/g, '')  // images
    .replace(/\[.*?\]\(.*?\)/g, '')   // links
    .replace(/#{1,6}\s/g, '')         // headers
    .replace(/[*_~]+/g, '')           // bold/italic/strikethrough
    .replace(/<[^>]*>/g, '')          // HTML tags
    .replace(/[-*+]\s/g, '')          // list markers
    .replace(/\d+\.\s/g, '')         // ordered list markers
    .replace(/[>|\-]/g, '')          // blockquotes, horizontal rules
    .trim()

  // Count Chinese characters
  const chineseChars = (text.match(/[一-鿿㐀-䶿]/g) || []).length

  // Count English words (non-Chinese, non-whitespace sequences)
  const englishWords = text
    .replace(/[一-鿿㐀-䶿]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 0).length

  return chineseChars + englishWords
}

/**
 * Estimate reading time in minutes for mixed Chinese/English content.
 * ~350 Chinese chars/min, ~200 English words/min.
 */
export function readingTime(wordCount: number): number {
  const minutes = wordCount / 350  // ~350 chars/min for Chinese reading speed
  return Math.max(1, Math.ceil(minutes))
}
