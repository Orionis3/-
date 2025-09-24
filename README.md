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
| 首页     | ![首页展示](https://raw.githubusercontent.com/Orionis3/blog/main/public/shoye.png) | 聚合最新文章、技能雷达图、旅行记忆等核心内容            |
| 技术博客 | ![博客页面](https://raw.githubusercontent.com/Orionis3/blog/main/public/jishuye.png)     | 包含 Vue3/Pinia/TypeScript 等技术实践记录，支持代码高亮 |
| 旅行日记 | ![旅行模块](https://raw.githubusercontent.com/Orionis3/blog/main/public/lvxing.png)   | 记录北京、上海、厦门等 22 个城市的旅行见闻，附带照片墙  |
| 书单推荐 | ![书单页面](https://raw.githubusercontent.com/Orionis3/blog/main/public/shudan.png)    | 涵盖心理学、理财、文学等多领域书籍，含标签分类与读后感  |
| 全局搜索 | ![搜索功能](https://raw.githubusercontent.com/Orionis3/blog/main/public/quanju.png)   | 支持关键词匹配标题、内容、标签，实时返回跨模块结果      |

## 🛠️ 技术栈

- **核心框架**：Vue 3（采用组合式 API 开发）
- **状态管理**：Pinia（替代 Vuex，简化状态逻辑，如 stores/ 目录下的状态管理）
- **UI 组件**：Element Plus（全局注册并二次封装，保证风格统一，见 main.js 中的配置）
- **路由管理**：Vue Router 4（实现页面无刷新跳转，router/index.js 配置路由规则）
- **构建工具**：Vue CLI（基于 Webpack，通过 vue.config.js 配置开发环境，package.json 中包含 @vue/cli-service 等依赖）
- **数据可视化**：ECharts（用于技能雷达图等数据展示，package.json 中已引入）
- **其他工具**：代码规范：ESLint + Prettier（保证代码风格一致）
                语法高亮：highlight.js（用于博客文章代码块展示）
                日期处理：date-fns（处理文章、旅行日记的日期格式化）

## 🚀 本地运行

```bash
# 克隆仓库
git clone https://github.com/Orionis3/blog.git

# 安装依赖
npm install

# 启动开发服务器（默认端口5173）
npm run dev

# 构建生产版本
npm run build
```

📁 项目结构

src/

├── views/          # 页面组件（首页、博客、旅行等7个核心页面）

├── components/     # 可复用组件（导航栏、文章卡片、搜索框等）

├── data/           # 本地数据（articles.js/books.js/travels.js等）

├── stores/         # Pinia状态管理（主题切换、搜索状态等）

├── router/         # 路由配置

└── assets/         # 静态资源（图片、样式）

🔍 功能细节

技术博客模块：

包含 Vue3 状态管理、组件封装、TypeScript 实战等技术文章

支持代码块高亮、阅读量统计、相关文章推荐

旅行日记模块：

按时间线展示旅行记录，包含地点、日期、图文详情

照片墙支持点击放大，适配移动端滑动浏览

书单推荐模块：

按标签分类（心理学 / 理财 / 文学等），支持筛选

每本书附带个人读后感，体现知识吸收与思考

🔄 未来规划

对接 Node.js 后端，实现数据持久化与后台管理

增加文章评论、点赞功能，提升交互性

优化 SEO 配置，提升页面搜索权重

集成个人项目展示模块，关联 GitHub 仓库


👤 关于作者
熊俊杰 | 前端开发爱好者 | 软件工程专业

专注 Vue 生态技术实践，热爱阅读与旅行

联系方式：

GitHub: Orionis3

博客地址: zaywy.zeabur.app

邮箱: 2933346011@qq.com

