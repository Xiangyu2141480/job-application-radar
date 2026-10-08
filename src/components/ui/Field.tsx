import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'
const base = 'w-full rounded-md border border-stone-300 bg-white px-3 py-2.5 text-sm text-ink outline-none transition placeholder:text-stone-400 focus:border-amber focus:ring-2 focus:ring-orange-100'
export function Input(props: InputHTMLAttributes<HTMLInputElement>) { return <input className={`${base} ${props.className || ''}`} {...props} /> }
export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) { return <select className={`${base} ${props.className || ''}`} {...props} /> }
export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) { return <textarea className={`${base} min-h-24 resize-y ${props.className || ''}`} {...props} /> }
export function Field({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) { return <label className="grid gap-1.5 text-sm font-medium text-stone-700"><span>{label}{required && <span className="ml-1 text-red-600">*</span>}</span>{children}{error && <span className="text-xs font-normal text-red-600">{error}</span>}</label> }
