import { normalizeStage, type ApplicationRecord, type HistoryEvent } from '../types'

const STORAGE_KEY = 'job-application-radar:v1'

function migrateRecord(value: ApplicationRecord): ApplicationRecord {
  const stage = normalizeStage(value.stage)
  if (!stage) throw new Error(`不支持的阶段：${String(value.stage)}`)
  const history = Array.isArray(value.history) ? value.history.map(event => ({
    ...event,
    oldStage: event.oldStage ? normalizeStage(event.oldStage) : undefined,
    newStage: event.newStage ? normalizeStage(event.newStage) : undefined,
  } as HistoryEvent)) : []
  return { ...value, stage, history }
}

export function migrateRecords(values: ApplicationRecord[]): { records: ApplicationRecord[]; migrated: number } {
  let migrated = 0
  const records = values.map(value => {
    const legacy = value.stage === ('已拒绝' as typeof value.stage)
      || value.history?.some(event => event.oldStage === ('已拒绝' as typeof event.oldStage) || event.newStage === ('已拒绝' as typeof event.newStage))
    if (legacy) migrated++
    return migrateRecord(value)
  })
  return { records, migrated }
}

export function loadRecords(): ApplicationRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed.records)) return []
    const result = migrateRecords(parsed.records)
    if (result.migrated) saveRecords(result.records)
    return result.records
  } catch { return [] }
}

export function saveRecords(records: ApplicationRecord[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, records, savedAt: new Date().toISOString() }))
}

export function createBackup(records: ApplicationRecord[]) {
  return JSON.stringify({ app: '秋招雷达', schemaVersion: '1.0', exportedAt: new Date().toISOString(), records }, null, 2)
}

export function parseBackup(text: string): { records: ApplicationRecord[]; migrated: number } {
  const value = JSON.parse(text)
  if (value?.schemaVersion !== '1.0' || !Array.isArray(value.records)) throw new Error('不是有效的秋招雷达 1.0 备份文件')
  return migrateRecords(value.records)
}

export function downloadText(name: string, content: string, type = 'application/json;charset=utf-8') {
  const blob = new Blob(['\ufeff', content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href = url; a.download = name; a.click()
  URL.revokeObjectURL(url)
}
