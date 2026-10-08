import type { AppMode } from '../config'

export function initialRecords<T>(mode: AppMode, demoRecords: T[]): T[] {
  return mode === 'demo' ? demoRecords : []
}
