import fs from 'node:fs'
import { resolveAppMode } from '../src/lib/appMode.ts'
import { initialRecords } from '../src/lib/initialRecords.ts'

const assert = (condition, message) => {
  if (!condition) throw new Error(message)
}

assert(resolveAppMode(undefined) === 'personal', '未设置环境变量时必须为 personal')
assert(resolveAppMode('') === 'personal', '空环境变量时必须为 personal')
assert(resolveAppMode('personal') === 'personal', '显式 personal 必须为 personal')
assert(resolveAppMode('demo') === 'demo', '显式 demo 必须为 demo')
assert(initialRecords('personal', [1, 2, 3, 4]).length === 0, 'personal 空存储必须初始化为 0 条')
assert(initialRecords('demo', [1, 2, 3, 4]).length === 4, 'demo 空存储必须初始化为 4 条示例')

const backupPath = process.argv[2]
if (backupPath) {
  const backup = JSON.parse(fs.readFileSync(backupPath, 'utf8'))
  const stages = new Set(['待投递', '已投递', '笔试', '面试', '意向', 'Offer', '简历挂', '测评挂', '一面挂', '二面挂', '三面挂', '终面挂', '其他挂', '已撤回'])
  const eventTypes = new Set(['status', 'check', 'created', 'import'])
  const requiredStrings = ['id', 'company', 'role', 'platform', 'url', 'appliedAt', 'updatedAt', 'notes']
  const isDate = value => typeof value === 'string' && value.length > 0 && !Number.isNaN(Date.parse(value))

  assert(backup?.schemaVersion === '1.0', '备份 schemaVersion 必须为 1.0')
  assert(Array.isArray(backup.records), '备份 records 必须为数组')
  assert(backup.records.length === 245, '备份 records 必须正好 245 条')

  const ids = new Set()
  const counts = {}
  backup.records.forEach((record, index) => {
    requiredStrings.forEach(field => assert(typeof record[field] === 'string', `第 ${index + 1} 条的 ${field} 必须为字符串`))
    assert(record.id.length > 0 && !ids.has(record.id), `第 ${index + 1} 条 id 必须非空且唯一`)
    ids.add(record.id)
    assert(stages.has(record.stage), `第 ${index + 1} 条 stage 无效`)
    assert(isDate(record.updatedAt), `第 ${index + 1} 条 updatedAt 无效`)
    assert(record.appliedAt === '' || isDate(record.appliedAt), `第 ${index + 1} 条 appliedAt 无效`)
    assert(record.deadline === undefined || record.deadline === '' || isDate(record.deadline), `第 ${index + 1} 条 deadline 无效`)
    assert(record.lastCheckedAt === undefined || record.lastCheckedAt === '' || isDate(record.lastCheckedAt), `第 ${index + 1} 条 lastCheckedAt 无效`)
    assert(record.isSample === undefined || typeof record.isSample === 'boolean', `第 ${index + 1} 条 isSample 无效`)
    assert(Array.isArray(record.history), `第 ${index + 1} 条 history 必须为数组`)
    record.history.forEach((event, eventIndex) => {
      assert(typeof event.id === 'string' && event.id.length > 0, `第 ${index + 1} 条 history[${eventIndex}] id 无效`)
      assert(eventTypes.has(event.type), `第 ${index + 1} 条 history[${eventIndex}] type 无效`)
      assert(isDate(event.time), `第 ${index + 1} 条 history[${eventIndex}] time 无效`)
      assert(event.note === undefined || typeof event.note === 'string', `第 ${index + 1} 条 history[${eventIndex}] note 无效`)
      assert(event.oldStage === undefined || stages.has(event.oldStage), `第 ${index + 1} 条 history[${eventIndex}] oldStage 无效`)
      assert(event.newStage === undefined || stages.has(event.newStage), `第 ${index + 1} 条 history[${eventIndex}] newStage 无效`)
    })
    counts[record.stage] = (counts[record.stage] ?? 0) + 1
  })
  assert(counts['已投递'] === 146, '已投递必须为 146 条')
  assert(counts['待投递'] === 99, '待投递必须为 99 条')
  assert(Object.keys(counts).length === 2, '备份中只能包含目标的两个阶段统计')
  console.log(`备份验证通过：${backup.records.length} 条（已投递 ${counts['已投递']}，待投递 ${counts['待投递']}）`)
}

console.log('模式与空存储验证通过')
