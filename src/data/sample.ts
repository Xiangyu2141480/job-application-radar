import type { ApplicationRecord } from '../types'

const now = new Date()
const daysAgo = (days: number) => new Date(now.getTime() - days * 86400000).toISOString()
const dateAgo = (days: number) => daysAgo(days).slice(0, 10)

export const SAMPLE_RECORDS: ApplicationRecord[] = [
  { id: 'sample-byte', company: '示例科技', role: '产品经理校招', platform: '企业招聘官网', url: 'https://example.com/careers', appliedAt: dateAgo(16), stage: '面试', lastCheckedAt: daysAgo(8), updatedAt: daysAgo(8), notes: '示例数据：一面后等待结果', isSample: true, history: [
    { id: 'h1', type: 'created', time: daysAgo(16), newStage: '已投递', note: '创建投递' },
    { id: 'h2', type: 'status', time: daysAgo(8), oldStage: '已投递', newStage: '面试', note: '进入一面' },
  ]},
  { id: 'sample-cloud', company: '云杉网络（示例）', role: '前端开发工程师', platform: '牛客', url: 'https://www.nowcoder.com/', appliedAt: dateAgo(15), stage: '笔试', lastCheckedAt: daysAgo(15), updatedAt: daysAgo(15), notes: '示例数据：等待笔试结果', isSample: true, history: [{ id: 'h3', type: 'created', time: daysAgo(15), newStage: '笔试', note: '导入示例' }] },
  { id: 'sample-ocean', company: '远洋数据（示例）', role: '数据分析师', platform: 'BOSS 直聘', url: 'https://www.zhipin.com/', appliedAt: dateAgo(5), stage: '已投递', lastCheckedAt: daysAgo(3), updatedAt: daysAgo(3), notes: '示例数据：正常跟进中', isSample: true, history: [{ id: 'h4', type: 'created', time: daysAgo(5), newStage: '已投递', note: '创建投递' }, { id: 'h5', type: 'check', time: daysAgo(3), note: '确认无变化' }] },
  { id: 'sample-lab', company: '青禾实验室（示例）', role: '算法工程师', platform: '企业招聘官网', url: 'https://example.com/jobs', appliedAt: dateAgo(24), stage: '一面挂', lastCheckedAt: daysAgo(2), updatedAt: daysAgo(2), notes: '示例数据：流程已结束', isSample: true, history: [{ id: 'h6', type: 'status', time: daysAgo(2), oldStage: '面试', newStage: '一面挂', note: '收到流程终止通知' }] },
]
