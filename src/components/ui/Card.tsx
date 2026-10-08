import type { HTMLAttributes, PropsWithChildren } from 'react'

export function Card({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return <section className={`rounded-lg border border-stone-200 bg-white shadow-sm ${className}`} {...props} />
}
export function CardHeader({ children, className = '' }: PropsWithChildren<{ className?: string }>) { return <div className={`border-b border-stone-100 px-5 py-4 ${className}`}>{children}</div> }
export function CardContent({ children, className = '' }: PropsWithChildren<{ className?: string }>) { return <div className={`p-5 ${className}`}>{children}</div> }
