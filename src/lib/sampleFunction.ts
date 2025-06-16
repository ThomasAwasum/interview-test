import { VoiceEntry, ProcessedResult } from './types.js'

export function processEntries(entries: VoiceEntry[]): ProcessedResult {
  const freq: Record<string, number> = {}

  for (const e of entries) {
    // tokenize on word boundaries, include numbers
    const tokens = e.transcript
      .toLowerCase()
      .match(/\b[a-z0-9]+\b/g) ?? []

    for (const w of tokens) {
      freq[w] = (freq[w] || 0) + 1
    }
  }

  return {
    summary: `Analysed ${entries.length} entries`,
    tagFrequencies: freq,
  }
}

export default processEntries
