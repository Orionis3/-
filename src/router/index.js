import { createRouter, createWebHistory } from 'vue-router'

// 带错误捕获的懒加载组件
const HomeView = () =>
  import('@/views/HomeView.vue').catch((err) => {
    console.error('❌ HomeView加载失败:', err)
    return { template: '<div style="padding: 20px;">首页加载失败，请检查组件是否存在</div>' }
  })

const AboutView = () =>
  import('@/views/AboutView.vue').catch((err) => {
    console.error('❌ AboutView加载失败:', err)
    return { template: '<div style="padding: 20px;">关于页加载失败</div>' }
  })

const BlogView = () =>
  import('@/views/BlogView.vue').catch((err) => {
    console.error('❌ BlogView加载失败:', err)
    return { template: '<div style="padding: 20px;">技术分享页加载失败</div>' }
  })

const ArticleView = () =>
  import('@/views/ArticleView.vue').catch((err) => {
    console.error('❌ ArticleView加载失败:', err)
    return { template: '<div style="padding: 20px;">文章详情页加载失败</div>' }
  })

const TravelView = () =>
  import('@/views/TravelView.vue').catch((err) => {
    console.error('❌ TravelView加载失败:', err)
    return { template: '<div style="padding: 20px;">旅行日记页加载失败</div>' }
  })

const BooksView = () =>
  import('@/views/BooksView.vue').catch((err) => {
    console.error('❌ BooksView加载失败:', err)
    return { template: '<div style="padding: 20px;">书单页加载失败</div>' }
  })

const SearchView = () =>
  import('@/views/SearchView.vue').catch((err) => {
    console.error('❌ SearchView加载失败:', err)
    return { template: '<div style="padding: 20px;">搜索页加载失败</div>' }
  })

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { title: '首页 - 我的个人博客' } // 页面标题
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
