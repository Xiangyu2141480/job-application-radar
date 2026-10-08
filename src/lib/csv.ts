import { STAGES, type ApplicationRecord, type Stage } from '../types'

export const CSV_HEADERS = ['公司', '岗位', '平台', '投递链接', '投递日期', '当前阶段', '最后检查时间', '备注']
const escapeCell = (value: string) => `"${String(value ?? '').replace(/"/g, '""')}"`

export function toCsv(records: ApplicationRecord[]) {
  const rows = records.map(r => [r.company, r.role, r.platform, r.url, r.appliedAt, r.stage, r.lastCheckedAt || '', r.notes])
  return [CSV_HEADERS, ...rows].map(row => row.map(escapeCell).join(',')).join('\n')
}

export function csvTemplate() {
  return [CSV_HEADERS.map(escapeCell).join(','), ['示例：某科技公司', '产品经理', '企业招聘官网', 'https://example.com/job', '2026-09-01', '已投递', '', '请删除本示例行后填写'].map(escapeCell).join(',')].join('\n')
}

function parseRows(text: string) {
  const rows: string[][] = []; let row: string[] = []; let cell = ''; let quoted = false
  const source = text.replace(/^\ufeff/, '')
  for (let i = 0; i < source.length; i++) {
    const char = source[i]
    if (char === '"' && quoted && source[i + 1] === '"') { cell += '"'; i++ }
    else if (char === '"') quoted = !quoted
    else if (char === ',' && !quoted) { row.push(cell.trim()); cell = '' }
    else if ((char === '\n' || char === '\r') && !quoted) { if (char === '\r' && source[i + 1] === '\n') i++; row.push(cell.trim()); if (row.some(Boolean)) rows.push(row); row = []; cell = '' }
    else cell += char
  }
  row.push(cell.trim()); if (row.some(Boolean)) rows.push(row)
  return rows
}

export function parseCsv(text: string): { records: ApplicationRecord[]; errors: string[] } {
  const rows = parseRows(text); const errors: string[] = []
  if (!rows.length) return { records: [], errors: ['CSV 文件为空'] }
  const missing = CSV_HEADERS.filter(h => !rows[0].includes(h))
  if (missing.length) return { records: [], errors: [`缺少必填字段：${missing.join('、')}`] }
  const index = Object.fromEntries(CSV_HEADERS.map(h => [h, rows[0].indexOf(h)]))
  const records = rows.slice(1).flatMap((row, offset) => {
    const line = offset + 2
    const get = (key: string) => row[index[key]] || ''
    if (!get('公司') || !get('岗位') || !get('平台') || !get('投递日期')) { errors.push(`第 ${line} 行：公司、岗位、平台和投递日期为必填项`); return [] }
    if (!STAGES.includes(get('当前阶段') as Stage)) { errors.push(`第 ${line} 行：当前阶段“${get('当前阶段')}”无效`); return [] }
    if (Number.isNaN(new Date(get('投递日期')).getTime())) { errors.push(`第 ${line} 行：投递日期格式无效`); return [] }
    const now = new Date().toISOString()
    return [{ id: crypto.randomUUID(), company: get('公司'), role: get('岗位'), platform: get('平台'), url: get('投递链接'), appliedAt: get('投递日期').slice(0, 10), stage: get('当前阶段') as Stage, lastCheckedAt: get('最后检查时间') || undefined, updatedAt: now, notes: get('备注'), history: [{ id: crypto.randomUUID(), type: 'import' as const, time: now, newStage: get('当前阶段') as Stage, note: '通过 CSV 导入' }] }]
  })
  return { records, errors }
}
