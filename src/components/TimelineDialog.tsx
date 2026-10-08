import { Calendar, Clock3 } from 'lucide-react'
import type { ApplicationRecord } from '../types'
import { formatDate } from '../lib/radar'
import { Badge } from './ui/Button'
import { Dialog } from './ui/Dialog'

export function TimelineDialog({ record, onClose }: { record?: ApplicationRecord; onClose: () => void }) {
  const events = record ? [...record.history].sort((a, b) => b.time.localeCompare(a.time)) : []
  return <Dialog open={!!record} onClose={onClose} title="状态时间线" description={record ? `${record.company} · ${record.role}` : ''}>
    <div className="relative ml-2 border-l border-stone-200 pl-6">
      {events.length ? events.map((event, i) => <article key={event.id} className="relative pb-6 last:pb-0"><span className={`absolute -left-[31px] top-1 grid size-3 rounded-full ring-4 ring-paper ${i === 0 ? 'bg-amber' : 'bg-stone-300'}`} /><div className="flex flex-wrap items-center gap-2"><Badge tone={event.type === 'status' ? 'amber' : event.type === 'check' ? 'teal' : 'neutral'}>{event.type === 'status' ? '状态变化' : event.type === 'check' ? '巡检' : event.type === 'import' ? '导入' : '创建'}</Badge><span className="text-xs text-stone-500">{formatDate(event.time, true)}</span></div>{event.oldStage && event.newStage ? <p className="mt-2 font-bold text-ink">{event.oldStage} <span className="px-1 text-stone-400">→</span> {event.newStage}</p> : <p className="mt-2 font-bold text-ink">{event.newStage || '确认无变化'}</p>}{event.note && <p className="mt-1 text-sm leading-6 text-stone-600">{event.note}</p>}</article>) : <div className="py-8 text-center text-sm text-stone-500"><Clock3 className="mx-auto mb-2"/>暂无历史记录</div>}
      {record?.lastCheckedAt && <div className="mt-6 flex items-center gap-2 border-t border-stone-200 pt-4 text-xs text-stone-500"><Calendar size={14}/>最后检查：{formatDate(record.lastCheckedAt, true)}</div>}
    </div>
  </Dialog>
}
