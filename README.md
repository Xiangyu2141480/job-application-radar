# 秋招雷达

本地优先的求职投递工作台，用于管理待投递机会、投递进度、巡检提醒与状态历史。界面采用高密度、低噪声的工作台布局，数据不会上传到服务端。

## 运行模式与数据隔离

项目使用 `VITE_APP_MODE` 区分公开演示版和个人版：

- `demo`（默认）：公开仓库和普通构建的默认模式。首次打开会加载少量**完全虚构**的示例记录，数据写入独立的 `job-application-radar:demo:v1` localStorage 键。
- `personal`：个人使用模式。只读取既有的 `job-application-radar:v1` 数据；为空时展示新增和导入引导，**不会自动注入或回退到示例数据**。

两种模式使用不同的本地存储键，因此切换构建模式不会用演示记录覆盖个人记录。现有 v1 schema 与旧阶段“已拒绝”迁移继续兼容。

## 功能

- 工作台指标：全部、进行中、待跟进/沉默、待投递、Offer。
- 行动队列：优先展示待投递、临近截止和长时间未更新的机会。
- 投递记录：搜索、阶段/平台/预警筛选，新增、编辑、删除与状态时间线。
- 阶段管理：待投递、已投递、笔试、面试、意向、Offer，以及细分结束状态。
- CSV 导入导出与模板下载；JSON 完整备份与恢复。
- 版本化检查结果 JSON 导入，保留手动巡检能力。
- 响应式桌面与移动布局。

## 本地运行

需要 Node.js 18+ 与 pnpm。

```bash
pnpm install
pnpm dev
```

未设置环境变量时自动使用 demo 模式。也可以显式指定：

```bash
VITE_APP_MODE=demo pnpm dev
VITE_APP_MODE=personal pnpm dev
```

## 生产构建

公开演示版：

```bash
VITE_APP_MODE=demo pnpm build
```

个人版：

```bash
VITE_APP_MODE=personal pnpm build
```

产物位于 `dist/`，该目录不提交 Git。

## 导入自己的数据

1. 使用 personal 模式启动或部署。
2. 打开“数据管理”。
3. 可下载 CSV 模板后填写并导入；也可恢复由本应用导出的 JSON 备份。
4. 导入前建议保留原备份。JSON 恢复会替换当前数据，CSV 导入会追加记录。

## 隐私说明

- 投递记录仅保存在当前 origin、当前浏览器的 localStorage 中，不会写入源码或上传服务端。
- 清理站点数据、重置浏览器或更换设备前，请下载 JSON 备份。
- 仓库只包含独立创作的虚构示例；不得把个人备份、private seed、`applications.json` 或处理后的投递文件加入版本控制。
- 不同部署 origin 的 localStorage 不共享；更新同一 origin 的静态资源不会自动删除该 origin 下的数据。

## 开源说明

本项目采用 [MIT License](LICENSE) 开源。
