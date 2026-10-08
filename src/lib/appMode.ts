import type { AppMode } from '../config'

export function resolveAppMode(value: unknown): AppMode {
  return value === 'demo' ? 'demo' : 'personal'
}
