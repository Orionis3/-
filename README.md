# 个人博客系统（Vue3 + Pinia）

一个融合「技术分享、生活记录与知识管理」的多功能个人主页，基于 Vue3 生态开发，既展示前端技术实践，又作为个人成长的数字化载体。

## 🌟 项目特色

- **多模块内容聚合**：包含技术博客（前端开发踩坑记录）、旅行日记（22 篇城市游记）、书单推荐（22 本精选书籍及读后感）三大核心模块，通过全局搜索实现跨内容联动。
- **工程化实践**：采用 Vue3 组合式 API（`<script setup>`）、Pinia 状态管理、组件化设计（封装导航栏、内容卡片等 10+可复用组件），符合现代前端开发规范。
- **用户体验优化**：支持深色/浅色模式切换、响应式布局（适配移动端与桌面端）、卡片悬停动画等细节交互，提升浏览体验。
- **数据本地化方案**：通过 JSON 文件模拟后端数据，降低开发门槛，便于后续对接真实接口。

## 📸 功能展示

| 模块     | 截图                                                                                                  | 说明                                                    |
| -------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| 首页     | ![首页展示](https://github.com/Orionis3/your-repo/blob/main/assets/screenshots/homepage.png?raw=true) | 聚合最新文章、技能雷达图、旅行记忆等核心内容            |
| 技术博客 | ![博客页面](https://github.com/Orionis3/your-repo/blob/main/assets/screenshots/blog.png?raw=true)     | 包含 Vue3/Pinia/TypeScript 等技术实践记录，支持代码高亮 |
| 旅行日记 | ![旅行模块](https://github.com/Orionis3/your-repo/blob/main/assets/screenshots/travel.png?raw=true)   | 记录北京、上海、厦门等 22 个城市的旅行见闻，附带照片墙  |
| 书单推荐 | ![书单页面](https://github.com/Orionis3/your-repo/blob/main/assets/screenshots/books.png?raw=true)    | 涵盖心理学、理财、文学等多领域书籍，含标签分类与读后感  |
| 全局搜索 | ![搜索功能](https://github.com/Orionis3/your-repo/blob/main/assets/screenshots/search.gif?raw=true)   | 支持关键词匹配标题、内容、标签，实时返回跨模块结果      |

## 🛠️ 技术栈

- **核心框架**：Vue3（组合式 API）
- **状态管理**：Pinia（替代 Vuex，简化状态逻辑）
- **UI 组件**：Element Plus（二次封装，保证风格统一）
- **路由管理**：Vue Router（实现页面无刷新跳转）
- **构建工具**：Vite（快速热更新，提升开发效率）
- **数据可视化**：ECharts（技能雷达图展示）

## 🚀 本地运行

```bash
# 克隆仓库
git clone https://github.com/Orionis3/your-repo.git

# 安装依赖
npm install

# 启动开发服务器（默认端口5173）
npm run dev

# 构建生产版本
npm run build
```
