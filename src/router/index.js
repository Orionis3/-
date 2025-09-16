import { createRouter, createWebHistory } from 'vue-router'
// 引入全局布局组件（只引入一次，不重复声明）

// 带错误捕获的懒加载组件
const HomeView = () => import('@/views/HomeView.vue')
const FoodRotation = () => import('@/views/FoodRotationMenu.vue')
const AboutView = () => import('@/views/AboutView.vue')
const BlogView = () => import('@/views/BlogView.vue')
const ArticleView = () => import('@/views/ArticleView.vue')
const TravelView = () => import('@/views/TravelView.vue')
const BooksView = () => import('@/views/BooksView.vue')
const SearchView = () => import('@/views/SearchView.vue')
const WechatView = () => import('@/views/WechatView.vue')

const routes = [
  { path: '/', name: 'Home', component: HomeView, meta: { title: '首页 - 我的个人博客' } },
  {
    path: '/food-rotation',
    name: 'FoodRotation',
    component: FoodRotation,
    meta: { title: '今天吃什么 - 我的个人博客' }
  },
  {
    path: '/home',
    redirect: '/'
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
    path: '/article', // 动态路由：通过文章ID匹配详情页
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
  },
  {
    path: '/wechat',
    name: 'wechat',
    component: WechatView,
    meta: { title: '微信公众号 - 我的个人博客' }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
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
