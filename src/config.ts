export type AppMode = 'personal' | 'demo'

const value = import.meta.env.VITE_APP_MODE
export const APP_MODE: AppMode = value === 'personal' ? 'personal' : 'demo'
export const IS_PERSONAL = APP_MODE === 'personal'
