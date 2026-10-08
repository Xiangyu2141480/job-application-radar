import { BarChart3, ClipboardCheck, Database, ListChecks, Plus, Radar } from 'lucide-react'
import { Button } from './ui/Button'

export type Page = 'overview' | 'records' | 'queue' | 'settings'
const nav = [
  { id: 'overview' as const, label: '总览', icon: BarChart3 },
  { id: 'records' as const, label: '投递记录', icon: ListChecks },
  { id: 'queue' as const, label: '巡检队列', icon: ClipboardCheck },
  { id: 'settings' as const, label: '数据与接入', icon: Database },
]

export function AppShell({ page, setPage, onAdd, queueCount, children }: { page: Page; setPage: (p: Page) => void; onAdd: () => void; queueCount: number; children: React.ReactNode }) {
  return <div className="min-h-screen">
    <header className="sticky top-0 z-30 border-b border-stone-200/90 bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid size-10 shrink-0 place-items-center rounded-md bg-amber text-white shadow-sm"><Radar size={22} strokeWidth={2.5} /></div>
          <div className="min-w-0"><h1 className="truncate text-lg font-extrabold tracking-tight text-ink">秋招雷达</h1><p className="hidden text-xs text-stone-500 sm:block">自己的投递，自己掌握节奏</p></div>
        </div>
        <nav className="ml-auto hidden items-center gap-1 lg:flex" aria-label="主导航">
          {nav.map(item => <button key={item.id} onClick={() => setPage(item.id)} className={`relative flex min-h-10 items-center gap-2 rounded-md px-3 text-sm font-semibold transition ${page === item.id ? 'bg-orange-50 text-amber' : 'text-stone-600 hover:bg-stone-100 hover:text-ink'}`}><item.icon size={17} />{item.label}{item.id === 'queue' && queueCount > 0 && <span className="rounded-full bg-amber px-1.5 text-[10px] text-white">{queueCount}</span>}</button>)}
        </nav>
        <Button onClick={onAdd} className="ml-1 shrink-0"><Plus size={17} /><span className="hidden sm:inline">新增投递</span></Button>
      </div>
      <nav className="flex overflow-x-auto border-t border-stone-100 px-2 lg:hidden" aria-label="移动端主导航">
        {nav.map(item => <button key={item.id} onClick={() => setPage(item.id)} className={`flex min-w-24 flex-1 items-center justify-center gap-1.5 border-b-2 px-2 py-3 text-xs font-semibold ${page === item.id ? 'border-amber text-amber' : 'border-transparent text-stone-500'}`}><item.icon size={16} />{item.label}</button>)}
      </nav>
    </header>
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>
  </div>
}
