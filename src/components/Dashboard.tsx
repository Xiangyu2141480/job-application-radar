import { AlertTriangle, ArrowRight, CheckCircle2, Clock3, Send, Trophy } from 'lucide-react'
import type { ApplicationRecord, Stage } from '../types'
import { ACTIVE_STAGES, alertLevel, ENDED_STAGES, formatDate } from '../lib/radar'
import { Button, Badge } from './ui/Button'
import { Card, CardContent, CardHeader } from './ui/Card'
import type { Page } from './AppShell'

const stageColors: Record<Stage, string> = { '已投递': 'bg-stone-400', '笔试': 'bg-sky-500', '面试': 'bg-amber', '意向': 'bg-teal', 'Offer': 'bg-emerald-500', '已拒绝': 'bg-red-400', '已撤回': 'bg-stone-300' }

export function Dashboard({ records, setPage, onLoadSample }: { records: ApplicationRecord[]; setPage: (page: Page) => void; onLoadSample: () => void }) {
  const active = records.filter(r => ACTIVE_STAGES.includes(r.stage)).length
  const alerts = records.filter(r => ['7天+', '14天+'].includes(alertLevel(r))).length
  const overdue = records.filter(r => alertLevel(r) === '14天+').length
  const ended = records.filter(r => ENDED_STAGES.includes(r.stage)).length
  const stats = [
    { label: '总投递', value: records.length, icon: Send, tone: 'text-ink bg-stone-100' },
    { label: '进行中', value: active, icon: Clock3, tone: 'text-sky-700 bg-sky-50' },
    { label: '待跟进', value: alerts, icon: AlertTriangle, tone: 'text-amber bg-orange-50' },
    { label: '疑似沉默', value: overdue, icon: AlertTriangle, tone: 'text-red-700 bg-red-50' },
    { label: '已结束', value: ended, icon: CheckCircle2, tone: 'text-teal bg-teal-50' },
  ]
  const stageData = (['已投递', '笔试', '面试', '意向', 'Offer', '已拒绝', '已撤回'] as Stage[]).map(stage => ({ stage, count: records.filter(r => r.stage === stage).length }))
  const max = Math.max(1, ...stageData.map(s => s.count))
  const recent = [...records].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 4)

  if (!records.length) return <div className="grid min-h-[60vh] place-items-center"><div className="max-w-lg text-center animate-rise"><div className="mx-auto mb-5 grid size-20 place-items-center rounded-full border border-orange-200 bg-orange-50 text-amber"><RadarMark /></div><h2 className="text-3xl font-extrabold tracking-tight text-ink">让每次投递都有回声</h2><p className="mx-auto mt-3 max-w-md leading-7 text-stone-600">从第一条真实投递开始。数据只保存在当前浏览器，不会上传到服务器。</p><div className="mt-7 flex flex-wrap justify-center gap-3"><Button onClick={() => setPage('records')}>开始记录<ArrowRight size={17} /></Button><Button variant="secondary" onClick={onLoadSample}>加载示例数据</Button></div><p className="mt-4 text-xs text-stone-400">示例会被明确标注，可随时单独删除。</p></div></div>

  return <div className="space-y-6">
    <div className="flex flex-wrap items-end justify-between gap-4 animate-rise"><div><p className="mb-1 text-sm font-bold uppercase tracking-widest text-amber">今日雷达</p><h2 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">把注意力留给值得跟进的机会</h2></div>{alerts > 0 && <Button variant="secondary" onClick={() => setPage('queue')}>处理 {alerts} 条待巡检<ArrowRight size={16} /></Button>}</div>
    {records.some(r => r.isSample) && <div className="flex items-center gap-3 rounded-md border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-800"><Badge tone="blue">示例数据</Badge><span>当前包含演示记录，不会与真实记录混淆。</span></div>}
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">{stats.map((s, i) => <Card key={s.label} className={`animate-rise ${i > 1 ? 'animate-delay-1' : ''}`}><CardContent className="p-4"><div className={`mb-3 grid size-9 place-items-center rounded-md ${s.tone}`}><s.icon size={18} /></div><p className="text-2xl font-extrabold tabular-nums text-ink">{s.value}</p><p className="text-sm text-stone-500">{s.label}</p></CardContent></Card>)}</div>
    <div className="grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
      <Card className="animate-rise animate-delay-1"><CardHeader><h3 className="font-bold text-ink">阶段分布</h3><p className="mt-1 text-sm text-stone-500">快速判断投递漏斗停在哪一段</p></CardHeader><CardContent className="space-y-4">{stageData.map(item => <div key={item.stage} className="grid grid-cols-[4rem_1fr_2rem] items-center gap-3 text-sm"><span className="text-stone-600">{item.stage}</span><div className="h-2.5 overflow-hidden rounded-full bg-stone-100"><div className={`h-full rounded-full ${stageColors[item.stage]} transition-all duration-500`} style={{ width: `${item.count ? Math.max(8, item.count / max * 100) : 0}%` }} /></div><span className="text-right font-bold tabular-nums">{item.count}</span></div>)}</CardContent></Card>
      <Card className="animate-rise animate-delay-2"><CardHeader><h3 className="font-bold text-ink">最近动态</h3><p className="mt-1 text-sm text-stone-500">按记录更新时间排序</p></CardHeader><CardContent className="divide-y divide-stone-100 p-0">{recent.map(r => <button key={r.id} onClick={() => setPage('records')} className="flex w-full items-center gap-3 px-5 py-3.5 text-left transition hover:bg-orange-50"><div className="grid size-9 shrink-0 place-items-center rounded-full bg-stone-100 text-stone-500"><Trophy size={16} /></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold text-ink">{r.company} · {r.role}</p><p className="mt-0.5 text-xs text-stone-500">{r.stage} · {formatDate(r.updatedAt, true)}</p></div>{r.isSample && <Badge tone="blue">示例</Badge>}</button>)}</CardContent></Card>
    </div>
  </div>
}
function RadarMark() { return <div className="relative size-10 rounded-full border-2 border-amber"><span className="absolute left-1/2 top-1/2 h-px w-8 -translate-x-1/2 rotate-45 bg-amber"/><span className="absolute inset-2 rounded-full border border-orange-300"/><span className="absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber"/></div> }
