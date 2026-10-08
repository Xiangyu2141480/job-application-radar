import { useEffect, useState } from 'react'
import { STAGES, type ApplicationRecord, type Stage } from '../types'
import { Button } from './ui/Button'
import { Dialog } from './ui/Dialog'
import { Field, Input, Select, Textarea } from './ui/Field'

const empty = { company: '', role: '', platform: '', url: '', appliedAt: new Date().toISOString().slice(0, 10), stage: '已投递' as Stage, notes: '' }
export function ApplicationForm({ open, record, onClose, onSave }: { open: boolean; record?: ApplicationRecord; onClose: () => void; onSave: (data: typeof empty) => void }) {
  const [form, setForm] = useState(empty); const [errors, setErrors] = useState<Record<string, string>>({})
  useEffect(() => { setForm(record ? { company: record.company, role: record.role, platform: record.platform, url: record.url, appliedAt: record.appliedAt, stage: record.stage, notes: record.notes } : empty); setErrors({}) }, [record, open])
  const set = (key: keyof typeof form, value: string) => setForm(v => ({ ...v, [key]: value }))
  const submit = (e: React.FormEvent) => { e.preventDefault(); const next: Record<string, string> = {}; if (!form.company.trim()) next.company = '请填写公司名称'; if (!form.role.trim()) next.role = '请填写岗位名称'; if (!form.platform.trim()) next.platform = '请填写平台'; if (!form.appliedAt) next.appliedAt = '请选择投递日期'; if (form.url && !/^https?:\/\//i.test(form.url)) next.url = '链接需以 http:// 或 https:// 开头'; setErrors(next); if (!Object.keys(next).length) onSave({ ...form, company: form.company.trim(), role: form.role.trim(), platform: form.platform.trim(), notes: form.notes.trim() }) }
  return <Dialog open={open} onClose={onClose} title={record ? '编辑投递' : '新增投递'} description="保存后仅写入当前浏览器。" wide>
    <form onSubmit={submit} className="grid gap-5 sm:grid-cols-2">
      <Field label="公司" required error={errors.company}><Input value={form.company} onChange={e => set('company', e.target.value)} placeholder="如：某科技公司" autoFocus /></Field>
      <Field label="岗位" required error={errors.role}><Input value={form.role} onChange={e => set('role', e.target.value)} placeholder="如：产品经理校招" /></Field>
      <Field label="招聘平台" required error={errors.platform}><Input value={form.platform} onChange={e => set('platform', e.target.value)} placeholder="如：牛客、企业招聘官网" list="platforms"/><datalist id="platforms"><option value="企业招聘官网"/><option value="牛客"/><option value="BOSS 直聘"/><option value="实习僧"/></datalist></Field>
      <Field label="当前阶段" required><Select value={form.stage} onChange={e => set('stage', e.target.value)}>{STAGES.map(s => <option key={s}>{s}</option>)}</Select></Field>
      <Field label="投递日期" required error={errors.appliedAt}><Input type="date" value={form.appliedAt} onChange={e => set('appliedAt', e.target.value)} max={new Date().toISOString().slice(0, 10)} /></Field>
      <Field label="投递链接" error={errors.url}><Input type="url" value={form.url} onChange={e => set('url', e.target.value)} placeholder="https://…" /></Field>
      <div className="sm:col-span-2"><Field label="备注"><Textarea value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="面试安排、联系人、跟进计划……" /></Field></div>
      <div className="flex justify-end gap-3 border-t border-stone-200 pt-4 sm:col-span-2"><Button type="button" variant="ghost" onClick={onClose}>取消</Button><Button type="submit">{record ? '保存修改' : '创建投递'}</Button></div>
    </form>
  </Dialog>
}
