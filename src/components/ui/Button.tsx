import type { ButtonHTMLAttributes, PropsWithChildren } from 'react'

export function Button({ className = '', variant = 'primary', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'danger' }) {
  const variants = { primary: 'bg-ink text-white hover:bg-amber focus-visible:ring-amber', secondary: 'border border-stone-300 bg-white text-ink hover:border-amber hover:bg-orange-50', ghost: 'text-stone-600 hover:bg-stone-100 hover:text-ink', danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-400' }
  return <button className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-3.5 py-2 text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-45 ${variants[variant]} ${className}`} {...props} />
}

export function IconButton({ className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={`inline-flex size-10 items-center justify-center rounded-md text-stone-500 transition hover:bg-orange-50 hover:text-amber focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber ${className}`} {...props} />
}

export function Badge({ children, tone = 'neutral' }: PropsWithChildren<{ tone?: 'neutral' | 'amber' | 'teal' | 'red' | 'blue' }>) {
  const tones = { neutral: 'bg-stone-100 text-stone-600', amber: 'bg-amber-50 text-amber-800 ring-amber-200', teal: 'bg-teal-50 text-teal-800 ring-teal-200', red: 'bg-red-50 text-red-700 ring-red-200', blue: 'bg-sky-50 text-sky-700 ring-sky-200' }
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${tones[tone]}`}>{children}</span>
}
