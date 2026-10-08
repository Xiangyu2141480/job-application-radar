export const STAGES = ['待投递', '已投递', '笔试', '面试', '意向', 'Offer', '简历挂', '测评挂', '一面挂', '二面挂', '三面挂', '终面挂', '其他挂', '已撤回'] as const
export type Stage = typeof STAGES[number]
export type LegacyStage = Stage | '已拒绝'

export function normalizeStage(stage: unknown): Stage | undefined {
  if (stage === '已拒绝') return '其他挂'
  return STAGES.includes(stage as Stage) ? stage as Stage : undefined
}

export interface HistoryEvent {
  id: string
  type: 'status' | 'check' | 'created' | 'import'
  oldStage?: Stage
  newStage?: Stage
  time: string
  note?: string
}

export interface ApplicationRecord {
  id: string
  company: string
  role: string
  platform: string
  url: string
  appliedAt: string
  deadline?: string
  stage: Stage
  lastCheckedAt?: string
  updatedAt: string
  notes: string
  isSample?: boolean
  history: HistoryEvent[]
}

export interface CheckResult {
  schemaVersion: '1.0'
  connectorId: string
  checkedAt: string
  applicationId?: string
  match?: { company: string; role: string; platform?: string }
  stage?: Stage
  status: 'changed' | 'unchanged' | 'needs_review' | 'error'
  message?: string
}

export interface ConnectorAdapter {
  id: string
  name: string
  platform: string
  version: string
  importResult(result: CheckResult, records: ApplicationRecord[]): ApplicationRecord[]
}

export type AlertFilter = '全部' | '正常' | '7天+' | '14天+'
