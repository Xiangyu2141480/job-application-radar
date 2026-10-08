import type { AppMode } from '../config'
import { SAMPLE_RECORDS } from '../data/sample'
import { normalizeStage, type ApplicationRecord, type HistoryEvent } from '../types'

const PERSONAL_KEY = 'job-application-radar:v1'
const DEMO_KEY = 'job-application-radar:demo:v1'
const keyFor = (mode: AppMode) => mode === 'personal' ? PERSONAL_KEY : DEMO_KEY

function migrateRecord(value: ApplicationRecord): ApplicationRecord {
  const stage = normalizeStage(value.stage)
  if (!stage) throw new Error(`不支持的阶段：${String(value.stage)}`)
  const history = Array.isArray(value.history) ? value.history.map(event => ({ ...event, oldStage: event.oldStage ? normalizeStage(event.oldStage) : undefined, newStage: event.newStage ? normalizeStage(event.newStage) : undefined } as HistoryEvent)) : []
  return { ...value, deadline: value.deadline || '', stage, history }
}

export function migrateRecords(values: ApplicationRecord[]) {
  let migrated = 0
  const records = values.map(value => {
    const legacy = value.stage === ('已拒绝' as typeof value.stage) || value.history?.some(event => event.oldStage === ('已拒绝' as typeof event.oldStage) || event.newStage === ('已拒绝' as typeof event.newStage))
    if (legacy) migrated++
    return migrateRecord(value)
  })
  return { records, migrated }
}

export function loadRecords(mode: AppMode): ApplicationRecord[] {
  try {
    const raw = localStorage.getItem(keyFor(mode))
    if (!raw) return mode === 'demo' ? SAMPLE_RECORDS : []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed.records)) return mode === 'demo' ? SAMPLE_RECORDS : []
    const result = migrateRecords(parsed.records)
    if (result.migrated) saveRecords(mode, result.records)
    return result.records
  } catch { return mode === 'demo' ? SAMPLE_RECORDS : [] }
}

export function saveRecords(mode: AppMode, records: ApplicationRecord[]) {
  localStorage.setItem(keyFor(mode), JSON.stringify({ version: 1, mode, records, savedAt: new Date().toISOString() }))
}

export function createBackup(records: ApplicationRecord[]) { return JSON.stringify({ app: '秋招雷达', schemaVersion: '1.0', exportedAt: new Date().toISOString(), records }, null, 2) }
export function parseBackup(text: string) {
  const value = JSON.parse(text)
  if (value?.schemaVersion !== '1.0' || !Array.isArray(value.records)) throw new Error('不是有效的秋招雷达 1.0 备份文件')
  return migrateRecords(value.records)
}
export function downloadText(name: string, content: string, type = 'application/json;charset=utf-8') {
  const blob = new Blob(['\ufeff', content], { type }); const url = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href = url; a.download = name; a.click(); URL.revokeObjectURL(url)
}
