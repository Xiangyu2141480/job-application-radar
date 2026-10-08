import { useEffect, useMemo, useState } from 'react'
import type { ApplicationRecord, CheckResult, Stage } from './types'
import { loadRecords, saveRecords } from './lib/storage'
import { QUEUE_STAGES, alertLevel } from './lib/radar'
import { SAMPLE_RECORDS } from './data/sample'
import { AppShell, type Page } from './components/AppShell'
import { Dashboard } from './components/Dashboard'
import { ApplicationList } from './components/ApplicationList'
import { ApplicationForm } from './components/ApplicationForm'
import { TimelineDialog } from './components/TimelineDialog'
import { InspectionQueue } from './components/InspectionQueue'
import { DataSettings } from './components/DataSettings'
import { Dialog } from './components/ui/Dialog'
import { Button } from './components/ui/Button'

export default function App() {
  const [records, setRecords] = useState<ApplicationRecord[]>(loadRecords)
  const [page, setPage] = useState<Page>('overview')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<ApplicationRecord>()
  const [timeline, setTimeline] = useState<ApplicationRecord>()
  const [deleting, setDeleting] = useState<ApplicationRecord>()
  const [toast, setToast] = useState('')
  useEffect(() => saveRecords(records), [records])
  useEffect(() => { if (!toast) return; const id = window.setTimeout(() => setToast(''), 2600); return () => clearTimeout(id) }, [toast])
  const queueCount = useMemo(() => records.filter(r => QUEUE_STAGES.includes(r.stage) && (r.stage === '待投递' || alertLevel(r) !== '正常')).length, [records])
  const now = () => new Date().toISOString()
  const notify = (text: string) => setToast(text)
  const openAdd = () => { setEditing(undefined); setFormOpen(true) }
  const saveForm = (data: Omit<ApplicationRecord, 'id' | 'updatedAt' | 'history'>) => {
    const time = now()
    if (editing) setRecords(all => all.map(r => r.id !== editing.id ? r : { ...r, ...data, updatedAt: time, history: data.stage !== r.stage ? [...r.history, { id: crypto.randomUUID(), type: 'status', oldStage: r.stage, newStage: data.stage, time, note: '手动编辑状态' }] : r.history }))
    else setRecords(all => [{ ...data, id: crypto.randomUUID(), updatedAt: time, history: [{ id: crypto.randomUUID(), type: 'created', newStage: data.stage, time, note: '创建投递' }] }, ...all])
    setFormOpen(false); setEditing(undefined); notify(editing ? '投递记录已更新' : '投递记录已创建')
  }
  const noChange = (record: ApplicationRecord) => { const time = now(); setRecords(all => all.map(r => r.id === record.id ? { ...r, lastCheckedAt: time, updatedAt: time, history: [...r.history, { id: crypto.randomUUID(), type: 'check', time, note: '确认无变化' }] } : r)); notify('已刷新检查时间') }
  const updateStatus = (record: ApplicationRecord, stage: Stage, note: string, appliedAt = record.appliedAt) => { const time = now(); setRecords(all => all.map(r => r.id === record.id ? { ...r, stage, appliedAt, lastCheckedAt: stage === '待投递' ? r.lastCheckedAt : time, updatedAt: time, history: [...r.history, stage === r.stage ? { id: crypto.randomUUID(), type: 'check', time, note: note || '巡检后状态无变化' } : { id: crypto.randomUUID(), type: 'status', oldStage: r.stage, newStage: stage, time, note: note || '巡检后更新状态' }] } : r)); notify('巡检结果已保存') }
  const importCheckResult = (result: CheckResult) => {
    const target = records.find(r => r.id === result.applicationId) || records.find(r => result.match && r.company === result.match.company && r.role === result.match.role && (!result.match.platform || r.platform === result.match.platform))
    if (!target) throw new Error('未找到与检查结果匹配的投递记录')
    if (result.stage && result.stage !== '待投递' && !target.appliedAt) throw new Error('该记录尚无投递日期，请先在投递档案中补充后再更新阶段')
    const time = result.checkedAt
    setRecords(all => all.map(r => r.id !== target.id ? r : { ...r, stage: result.stage || r.stage, lastCheckedAt: time, updatedAt: time, history: [...r.history, result.stage && result.stage !== r.stage ? { id: crypto.randomUUID(), type: 'status', oldStage: r.stage, newStage: result.stage, time, note: result.message || `来自 ${result.connectorId} 的检查结果` } : { id: crypto.randomUUID(), type: 'import', time, note: result.message || `导入 ${result.connectorId} 检查结果：${result.status}` }] }))
  }
  return <AppShell page={page} setPage={setPage} onAdd={openAdd} queueCount={queueCount}>
    {page === 'overview' && <Dashboard records={records} setPage={setPage} onLoadSample={() => { setRecords(r => [...r, ...SAMPLE_RECORDS.filter(s => !r.some(x => x.id === s.id))]); notify('示例数据已加载，并已明确标注') }} />}
    {page === 'records' && <ApplicationList records={records} onAdd={openAdd} onEdit={r => { setEditing(r); setFormOpen(true) }} onTimeline={setTimeline} onDelete={setDeleting} />}
    {page === 'queue' && <InspectionQueue records={records} onNoChange={noChange} onUpdate={updateStatus} />}
    {page === 'settings' && <DataSettings records={records} onImport={items => setRecords(r => [...items, ...r])} onRestore={setRecords} onClear={() => setRecords([])} onCheckResult={importCheckResult} />}
    <ApplicationForm open={formOpen} record={editing} onClose={() => { setFormOpen(false); setEditing(undefined) }} onSave={saveForm} />
    <TimelineDialog record={timeline} onClose={() => setTimeline(undefined)} />
    <Dialog open={!!deleting} onClose={() => setDeleting(undefined)} title="删除这条投递？" description={deleting ? `${deleting.company} · ${deleting.role}` : ''}><p className="text-sm leading-6 text-stone-600">记录及其完整状态历史会被永久删除，且无法撤销。</p><div className="mt-5 flex justify-end gap-3"><Button variant="ghost" onClick={() => setDeleting(undefined)}>取消</Button><Button variant="danger" onClick={() => { if (deleting) setRecords(r => r.filter(x => x.id !== deleting.id)); setDeleting(undefined); notify('记录已删除') }}>确认删除</Button></div></Dialog>
    {toast && <div role="status" className="fixed bottom-5 left-1/2 z-[60] -translate-x-1/2 rounded-md bg-ink px-4 py-3 text-sm font-semibold text-white shadow-float animate-rise">{toast}</div>}
  </AppShell>
}
