import type { HTMLAttributes, PropsWithChildren } from 'react'
export function Card({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) { return <section className={`rounded-lg border border-slate-200 bg-white ${className}`} {...props}/> }
export function CardHeader({ children, className = '' }: PropsWithChildren<{ className?: string }>) { return <div className={`border-b border-slate-100 px-4 py-3 ${className}`}>{children}</div> }
export function CardContent({ children, className = '' }: PropsWithChildren<{ className?: string }>) { return <div className={`p-4 ${className}`}>{children}</div> }
