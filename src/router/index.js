import { createRouter, createWebHistory } from 'vue-router'

// 导入页面组件（使用懒加载优化性能）
const HomeView = () => import('@/views/HomeView.vue')
const AboutView = () => import('@/views/AboutView.vue')
const BlogView = () => import('@/views/BlogView.vue')
const ArticleView = () => import('@/views/ArticleView.vue')
const TravelView = () => import('@/views/TravelView.vue')
const BooksView = () => import('@/views/BooksView.vue')
const SearchView = () => import('@/views/SearchView.vue')

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { title: '首页 - 我的个人博客' } // 页面标题
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView,
    meta: { title: '关于我 - 我的个人博客' }
  },
  {
    path: '/blog',
    name: 'blog',
    component: BlogView,
    meta: { title: '技术分享 - 我的个人博客' }
  },
  {
    path: '/article/:id', // 动态路由：通过文章ID匹配详情页
    name: 'article',
    component: ArticleView,
    meta: { title: '文章详情 - 我的个人博客' }
  },
  {
    path: '/travel',
    name: 'travel',
    component: TravelView,
    meta: { title: '旅行日记 - 我的个人博客' }
  },
  {
    path: '/books',
    name: 'books',
    component: BooksView,
    meta: { title: '书单 - 我的个人博客' }
  },
  {
    path: '/search',
    name: 'search',
    component: SearchView,
    meta: { title: '搜索结果 - 我的个人博客' }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL), // Vite中使用import.meta.env
  routes,
  scrollBehavior() {
    // 路由切换时自动滚动到顶部
    return { top: 0 }
  }
})

// 动态修改页面标题
router.afterEach((to) => {
  document.title = to.meta.title
})

export default router
