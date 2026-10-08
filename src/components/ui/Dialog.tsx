import { X } from 'lucide-react'
import type { PropsWithChildren } from 'react'
import { IconButton } from './Button'

export function Dialog({ open, onClose, title, description, children, wide = false }: PropsWithChildren<{ open: boolean; onClose: () => void; title: string; description?: string; wide?: boolean }>) {
  if (!open) return null
  return <div className="fixed inset-0 z-50 grid place-items-center bg-stone-900/30 p-4 backdrop-blur-sm" role="presentation" onMouseDown={e => e.target === e.currentTarget && onClose()}>
    <section role="dialog" aria-modal="true" aria-label={title} className={`max-h-[92vh] w-full overflow-y-auto rounded-lg border border-stone-200 bg-paper shadow-float animate-rise ${wide ? 'max-w-3xl' : 'max-w-xl'}`}>
      <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-stone-200 bg-paper/95 px-5 py-4 backdrop-blur">
        <div><h2 className="text-lg font-bold text-ink">{title}</h2>{description && <p className="mt-1 text-sm text-stone-500">{description}</p>}</div>
        <IconButton aria-label="关闭" onClick={onClose}><X size={18} /></IconButton>
      </header>
      <div className="p-5">{children}</div>
    </section>
  </div>
}
