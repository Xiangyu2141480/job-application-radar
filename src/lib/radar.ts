import type { AlertFilter, ApplicationRecord, Stage } from '../types'

export const PENDING_STAGE: Stage = '待投递'
export const ACTIVE_STAGES: Stage[] = ['已投递', '笔试', '面试', '意向']
export const QUEUE_STAGES: Stage[] = [PENDING_STAGE, ...ACTIVE_STAGES]
export const REJECTED_STAGES: Stage[] = ['简历挂', '测评挂', '一面挂', '二面挂', '三面挂', '终面挂', '其他挂']
export const ENDED_STAGES: Stage[] = ['Offer', ...REJECTED_STAGES, '已撤回']

function validTime(value?: string) {
  if (!value) return undefined
  const time = new Date(value).getTime()
  return Number.isNaN(time) ? undefined : time
}

export function silentDays(record: ApplicationRecord) {
  const base = validTime(record.lastCheckedAt) ?? validTime(record.appliedAt)
  if (base === undefined) return 0
  return Math.max(0, Math.floor((Date.now() - base) / 86400000))
}

export function alertLevel(record: ApplicationRecord): '正常' | '7天+' | '14天+' | '待投递' | '已结束' {
  if (record.stage === PENDING_STAGE) return '待投递'
  if (ENDED_STAGES.includes(record.stage)) return '已结束'
  const days = silentDays(record)
  return days >= 14 ? '14天+' : days >= 7 ? '7天+' : '正常'
}

export function matchesAlert(record: ApplicationRecord, filter: AlertFilter) {
  if (filter === '全部') return true
  return alertLevel(record) === filter
}

export function inspectionPriority(record: ApplicationRecord) {
  const stageBoost: Record<Stage, number> = { '待投递': 20, '已投递': 4, '笔试': 8, '面试': 12, '意向': 14, 'Offer': 0, '简历挂': 0, '测评挂': 0, '一面挂': 0, '二面挂': 0, '三面挂': 0, '终面挂': 0, '其他挂': 0, '已撤回': 0 }
  return silentDays(record) * 3 + stageBoost[record.stage]
}

export function formatDate(value?: string, includeTime = false, emptyLabel = '尚未检查') {
  if (!value) return emptyLabel
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return emptyLabel
  return new Intl.DateTimeFormat('zh-CN', includeTime ? { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' } : { year: 'numeric', month: '2-digit', day: '2-digit' }).format(date)
}
