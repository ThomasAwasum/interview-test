import { describe, it, expect } from 'vitest'
import processEntries from '../src/lib/sampleFunction.js'
import type { VoiceEntry } from '../src/lib/types.js'

describe('processEntries – edge cases', () => {
  it('empty input yields empty frequencies', () => {
    const result = processEntries([])
    expect(result.summary).toBe('Analysed 0 entries')
    expect(Object.keys(result.tagFrequencies)).toHaveLength(0)
  })

  it('single empty transcript yields no tokens', () => {
    const entries: VoiceEntry[] = [
      { id: 1, transcript: '', tags_user: [], created_at: '' },
    ]
    const result = processEntries(entries)
    expect(result.summary).toBe('Analysed 1 entries')
    expect(Object.keys(result.tagFrequencies)).toHaveLength(0)
  })
})

describe('processEntries – tokenization & counting', () => {
  // minimal VoiceEntry shape
  const base: Partial<VoiceEntry> = { tags_user: [], created_at: '' }

  it('counts a single word once', () => {
    const entries = [{ ...base, transcript: 'Hello' }] as VoiceEntry[]
    const freq = processEntries(entries).tagFrequencies
    expect(freq).toEqual({ hello: 1 })
  })

  it('handles punctuation and case-insensitivity', () => {
    const entries = [
      { ...base, transcript: 'Hello, HELLO?!' },
    ] as VoiceEntry[]
    const freq = processEntries(entries).tagFrequencies
    expect(freq).toEqual({ hello: 2 })
  })

  it('counts multiple words across multiple entries', () => {
    const entries = [
      { ...base, transcript: 'Cat and dog.' },
      { ...base, transcript: 'Dog chasing cat!' },
    ] as VoiceEntry[]
    const freq = processEntries(entries).tagFrequencies
    expect(freq['cat']).toBe(2)
    expect(freq['dog']).toBe(2)
    expect(freq['and']).toBe(1)
    expect(freq['chasing']).toBe(1)
  })

  it('includes numeric tokens', () => {
    const entries = [
      { ...base, transcript: 'Version 2.0 is out.' },
    ] as VoiceEntry[]
    const freq = processEntries(entries).tagFrequencies
    expect(freq['version']).toBe(1)
    expect(freq['2']).toBe(1)
    expect(freq['0']).toBe(1)
    expect(freq['is']).toBe(1)
    expect(freq['out']).toBe(1)
  })
})
