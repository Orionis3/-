# -
vue3+elementpuls+pinia
src/
├── views/ # 页面级组件（对应路由）
│ ├── HomeView.vue # 首页
│ ├── AboutView.vue # 关于页
│ ├── BlogView.vue # 博客列表页
│ ├── ArticleView.vue # 文章详情页
│ ├── TravelView.vue # 旅行日记页
│ ├── BooksView.vue # 书单页
│ └── SearchView.vue # 搜索结果页
├── components/ # 可复用组件
│ ├── layout/ # 布局组件
│ │ ├── MainHeader.vue # 顶部导航栏（含搜索、深色模式）
│ │ ├── MainFooter.vue # 页脚
│ │ └── AppLayout.vue # 全局布局容器（整合 header/footer）
│ ├── ui/ # 功能组件
│ │ ├── AvatarCard.vue # 个人信息卡片
│ │ ├── RotateMenu.vue # 旋转菜单转盘
│ │ ├── BackToTop.vue # 返回顶部按钮
│ │ └── ArticleCard.vue # 文章卡片组件
├── router/
│ └── index.js # 路由配置
├── stores/ # Pinia 状态管理（替代 Vuex）
│ ├── index.js # 导出创建好的 pinia 实例
│ ├── useAppStore.js # 应用状态（深色模式、搜索等）
│ └── useDataStore.js # 数据管理（文章、书籍等本地数据）
├── assets/ # 静态资源
│ ├── images/ # 头像、配图等（放一张 avatar.jpg 作为头像）
│ └── styles/ # 样式文件
│ └── global.css # 全局样式（含深色模式）
├── data/ # 本地数据（替代后端）
│ ├── profile.js # 个人信息
│ ├── articles.js # 博客文章
│ ├── books.js # 书单数据
│ └── travels.js # 旅行日记
└── main.js # 入口文件（配置 Element Plus、Pinia 等）
