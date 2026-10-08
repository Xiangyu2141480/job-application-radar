import type { ApplicationRecord } from '../types'

const STORAGE_KEY = 'job-application-radar:v1'

export function loadRecords(): ApplicationRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed.records) ? parsed.records : []
  } catch { return [] }
}

export function saveRecords(records: ApplicationRecord[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, records, savedAt: new Date().toISOString() }))
}

export function createBackup(records: ApplicationRecord[]) {
  return JSON.stringify({ app: '秋招雷达', schemaVersion: '1.0', exportedAt: new Date().toISOString(), records }, null, 2)
}

export function parseBackup(text: string): ApplicationRecord[] {
  const value = JSON.parse(text)
  if (value?.schemaVersion !== '1.0' || !Array.isArray(value.records)) throw new Error('不是有效的秋招雷达 1.0 备份文件')
  return value.records
}

export function downloadText(name: string, content: string, type = 'application/json;charset=utf-8') {
  const blob = new Blob(['\ufeff', content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href = url; a.download = name; a.click()
  URL.revokeObjectURL(url)
}
