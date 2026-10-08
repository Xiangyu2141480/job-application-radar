import { resolveAppMode } from './lib/appMode'

export type AppMode = 'personal' | 'demo'

export const APP_MODE: AppMode = resolveAppMode(import.meta.env.VITE_APP_MODE)
export const IS_PERSONAL = APP_MODE === 'personal'
