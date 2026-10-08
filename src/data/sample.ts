import type { ApplicationRecord } from '../types'

const now = new Date()
const daysFromNow = (days: number) => new Date(now.getTime() + days * 86400000).toISOString().slice(0, 10)
const daysAgo = (days: number) => new Date(now.getTime() - days * 86400000).toISOString()
const dateAgo = (days: number) => daysAgo(days).slice(0, 10)

export const SAMPLE_RECORDS: ApplicationRecord[] = [
  { id: 'demo-northstar', company: '北辰纸飞机（虚构）', role: '体验设计实习生（示例）', platform: '虚构招聘站', url: 'https://example.com/demo/northstar', appliedAt: '', deadline: daysFromNow(2), stage: '待投递', updatedAt: daysAgo(1), notes: '完全虚构示例：整理作品集后投递', isSample: true, history: [{ id: 'demo-h1', type: 'created', time: daysAgo(1), newStage: '待投递', note: '创建虚构示例' }] },
  { id: 'demo-pinecone', company: '松果航线（虚构）', role: '前端工程师（示例）', platform: '虚构公司官网', url: 'https://example.com/demo/pinecone', appliedAt: dateAgo(12), deadline: '', stage: '面试', lastCheckedAt: daysAgo(8), updatedAt: daysAgo(8), notes: '完全虚构示例：等待下一轮安排', isSample: true, history: [{ id: 'demo-h2', type: 'created', time: daysAgo(12), newStage: '已投递', note: '创建虚构示例' }, { id: 'demo-h3', type: 'status', time: daysAgo(8), oldStage: '已投递', newStage: '面试', note: '进入虚构面试流程' }] },
  { id: 'demo-tidepool', company: '潮汐方格（虚构）', role: '数据产品助理（示例）', platform: '虚构校园平台', url: 'https://example.com/demo/tidepool', appliedAt: dateAgo(4), deadline: '', stage: '已投递', lastCheckedAt: daysAgo(3), updatedAt: daysAgo(3), notes: '完全虚构示例：近期已确认进度', isSample: true, history: [{ id: 'demo-h4', type: 'created', time: daysAgo(4), newStage: '已投递', note: '创建虚构示例' }] },
  { id: 'demo-lighthouse', company: '灯塔邮局（虚构）', role: '运营培训生（示例）', platform: '虚构招聘站', url: 'https://example.com/demo/lighthouse', appliedAt: dateAgo(20), deadline: '', stage: 'Offer', lastCheckedAt: daysAgo(2), updatedAt: daysAgo(2), notes: '完全虚构示例：流程已结束', isSample: true, history: [{ id: 'demo-h5', type: 'status', time: daysAgo(2), oldStage: '意向', newStage: 'Offer', note: '收到虚构结果' }] },
]
