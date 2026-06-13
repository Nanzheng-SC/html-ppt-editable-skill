# html-ppt-editable

一个给 Codex / Claude Code / Cursor / 兼容 Agent 用的 HTML PPT skill。

把 `html-ppt-skill` 的主题、模板、演讲者模式和 `frontend-slides` 的浏览器内联编辑能力合在一起：AI 先帮你生成一份像样的静态 HTML slides，后面你可以直接在浏览器里点字改、自动保存、再导出完整 HTML。

核心：

> 让 agent 先把 deck 做到能看，再让人直接在浏览器里微调文字；不用每改一个字都重新用 Agent。

## 适合谁

- 想让 AI 做 PPT，但不想拿到一份「只能重跑不能手改」产物的佬友。
- 做技术分享、课程课件、周报、pitch deck、小红书图文轮播的佬友。
- 喜欢 HTML/CSS 的可控性，但懒得每次从零搭 slides runtime 的佬友。
- 需要演讲者模式、逐字稿、预览窗口、键盘翻页的佬友。
- 想把 outline / 文档 / 想法直接变成可展示 deck 的佬友。

## 它能做什么

| 能力 | 说明 |
|---|---|
| 可编辑 HTML slides | 生成后按 `E` 进入编辑模式，直接改页面上的标题、段落、表格、列表 |
| 本地自动保存 | 编辑草稿写入 `localStorage`，刷新页面也不丢 |
| 导出完整 HTML | `Ctrl+S` / `Cmd+S` 保存一份带修改内容的 HTML |
| 键盘演示 | 方向键、空格、Home、End 翻页 |
| 主题切换 | 按 `T` 在内置主题间切换 |
| 演讲者模式 | 按 `S` 打开 presenter window，带当前页、下一页、逐字稿、计时器 |
| 总览模式 | 按 `O` 查看所有 slides |
| 静态部署 | 纯 HTML/CSS/JS，无需构建，丢到静态服务器就能跑 |

## 内容一览

| 内容 | 数量 | 位置 |
|---|---:|---|
| 主题 | 36 | `assets/themes/*.css` |
| 完整 deck 模板 | 15 | `templates/full-decks/<name>/` |
| 单页布局 | 31 | `templates/single-page/*.html` |
| Canvas FX | 20 | `assets/animations/fx/*.js` |
| Showcase deck | 4 | `templates/*-showcase.html` |
| 验证截图 | 56 | `scripts/verify-output/` |
| 可编辑 runtime | 1 | `assets/editable-runtime.js` |

## 安装

装到 Codex skills 目录：

```bash
npx skills add https://github.com/Nanzheng-SC/html-ppt-editable-skill
```

或者手动 clone：

```bash
git clone https://github.com/Nanzheng-SC/html-ppt-editable-skill ~/.codex/skills/html-ppt-editable
```

目录名建议保持：

```text
html-ppt-editable/
├── SKILL.md
├── assets/
├── templates/
├── references/
├── scripts/
└── examples/
```

## 推荐调用方式

做技术分享：

```text
用 html-ppt-editable 做一份 8 页技术分享 slides，中文，偏工程实践风格，带演讲者 notes。
```

做 pitch deck：

```text
用 html-ppt-editable 把这个商业计划改成 10 页 pitch deck，风格克制专业，最后给我可编辑 HTML。
```

做小红书图文：

```text
用 html-ppt-editable 做 9 页小红书轮播，白底柔和风，适合手机截图发布。
```

把大纲变 deck：

```text
用 html-ppt-editable 把下面 outline 变成一份可演示的 HTML slides，生成后保留浏览器内编辑能力。
```

## 浏览器快捷键

```text
← → Space PgUp PgDn Home End   翻页
F                               全屏
T                               切换主题
S                               打开演讲者模式
O                               slide 总览
N                               notes 抽屉
E                               开关内联文字编辑
Ctrl+S / Cmd+S                  保存编辑后的完整 HTML
```

编辑模式说明：

- 鼠标移到左上角会出现编辑按钮。
- 按 `E` 可以直接进入或退出编辑模式。
- 标题、段落、列表、表格、caption 等可见文本会变成可编辑。
- speaker notes 默认不会变成可编辑内容，避免把讲稿误改到画面上。
- 对固定标签、页码、法律声明等不希望编辑的文字，可以加 `data-edit-lock`。

## 快速开始

从模板新建 deck：

```bash
./scripts/new-deck.sh my-talk
```

打开示例：

```bash
open examples/demo-deck/index.html
open templates/theme-showcase.html
open templates/layout-showcase.html
open templates/animation-showcase.html
open templates/full-decks-index.html
```

Windows 上可以直接双击这些 HTML，也可以用浏览器打开文件路径。

## 项目结构

```text
html-ppt-editable/
├── SKILL.md                      agent 入口说明
├── README.md                     本文件
├── README_EDITABLE.md            编辑能力变更说明
├── references/                   主题、布局、动画、演讲者模式等详细参考
├── assets/
│   ├── base.css                  共享设计 token 和基础组件
│   ├── runtime.js                翻页、主题、演讲者模式、总览模式
│   ├── editable-runtime.js       浏览器内联编辑、自动保存、导出
│   ├── themes/*.css              36 套主题
│   └── animations/               CSS 动画和 Canvas FX
├── templates/
│   ├── deck-editable.html        可编辑 starter
│   ├── deck.html                 原始 starter
│   ├── full-decks/               15 套完整 deck 模板
│   └── single-page/              31 个单页布局
├── scripts/
│   ├── new-deck.sh               新建 deck 脚本
│   └── render.sh                 headless Chrome 导出 PNG
└── examples/demo-deck/           可运行示例
```

## 来源与致谢

这个 skill 不是从零重写，而是在两个优秀开源项目 / skill 的基础上做的整合增强：

| 来源 | 本仓库使用的能力 |
|---|---|
| [`lewislulu/html-ppt-skill`](https://github.com/lewislulu/html-ppt-skill) | HTML PPT 模板体系、36 套主题、完整 deck 模板、单页布局、动画资源、键盘 runtime、演讲者模式 |
| [`zarazhangrui/frontend-slides`](https://github.com/zarazhangrui/frontend-slides) | 浏览器内联编辑思路，包括隐藏编辑入口、`E` 开关编辑、本地自动保存、显式保存导出 |

特别感谢 `html-ppt-skill` 原作者 lewis，把 HTML slides 的模板、主题、演讲者模式和动效系统打得很完整；也感谢 `frontend-slides` 提供了「生成后还能在浏览器里直接改字」这个非常实用的交互方向。

本仓库主要做的是把两套能力合成一个 Codex skill：

- 新增 `assets/editable-runtime.js`，负责内联编辑、草稿保存和 HTML 导出。
- 新增 `templates/deck-editable.html`，作为可编辑 deck starter。
- 更新模板引用，让生成的 deck 同时带演示 runtime 和编辑 runtime。
- 重写 `SKILL.md`，让 agent 优先按“模板生成 + 浏览器可编辑”的方式工作。
- 新增 `references/editable-runtime.md`，说明编辑 runtime 的约定和使用边界。

原项目版权声明和 MIT License 均已保留。本仓库在此基础上继续 MIT 开源，感谢各位原作者和佬友。

## 设计原则

- 先生成能看的 deck，再允许人直接修字。
- 不绑构建工具，静态 HTML 优先。
- 模板先行，少让 agent 临场发明结构。
- notes 和画面内容分开，演讲稿不误暴露。
- 保存导出走浏览器原生能力，能 `showSaveFilePicker` 就直接保存，不支持就降级下载。

## License

MIT。

**学 AI，上 L 站**

**欢迎各位佬友使用、fork、提 issue、改模板。**
