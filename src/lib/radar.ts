import type { AlertFilter, ApplicationRecord, Stage } from '../types'

export const ACTIVE_STAGES: Stage[] = ['已投递', '笔试', '面试', '意向']
export const ENDED_STAGES: Stage[] = ['Offer', '已拒绝', '已撤回']

export function silentDays(record: ApplicationRecord) {
  const base = record.lastCheckedAt || record.appliedAt
  return Math.max(0, Math.floor((Date.now() - new Date(base).getTime()) / 86400000))
}

export function alertLevel(record: ApplicationRecord): '正常' | '7天+' | '14天+' | '已结束' {
  if (ENDED_STAGES.includes(record.stage)) return '已结束'
  const days = silentDays(record)
  return days >= 14 ? '14天+' : days >= 7 ? '7天+' : '正常'
}

export function matchesAlert(record: ApplicationRecord, filter: AlertFilter) {
  if (filter === '全部') return true
  return alertLevel(record) === filter
}

export function inspectionPriority(record: ApplicationRecord) {
  const stageBoost: Record<Stage, number> = { '已投递': 4, '笔试': 8, '面试': 12, '意向': 14, 'Offer': 0, '已拒绝': 0, '已撤回': 0 }
  return silentDays(record) * 3 + stageBoost[record.stage]
}

export function formatDate(value?: string, includeTime = false) {
  if (!value) return '尚未检查'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('zh-CN', includeTime ? { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' } : { year: 'numeric', month: '2-digit', day: '2-digit' }).format(date)
}
