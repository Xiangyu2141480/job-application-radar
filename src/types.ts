export const STAGES = ['已投递', '笔试', '面试', '意向', 'Offer', '已拒绝', '已撤回'] as const
export type Stage = typeof STAGES[number]

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
