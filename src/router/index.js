import { createRouter, createWebHistory } from 'vue-router'

// 带错误捕获的懒加载组件
const lazyLoad = (view) => {
  return () =>
    import(`@/views/${view}.vue`).catch((error) => {
      console.error(`Failed to load component ${view}:`, error)
      // 移除错误页面 fallback，因为该组件不存在
      throw error
    })
}

// 路由组件懒加载
const HomeView = lazyLoad('HomeView')
const FoodRotation = lazyLoad('FoodRotationMenu')
const AboutView = lazyLoad('AboutView')
const BlogView = lazyLoad('BlogView')
const ArticleView = lazyLoad('ArticleView')
const ArticlesListView = lazyLoad('ArticlesListView') // 添加文章列表组件懒加载
const TravelView = lazyLoad('TravelView')
const TravelDetaView = lazyLoad('TravelDetaView')
const BooksView = lazyLoad('BooksView')
const SearchView = lazyLoad('SearchView')
const WechatView = lazyLoad('WechatView')

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: {
      title: '首页 - 我的个人博客',
      keepAlive: false
    }
  },
  {
    path: '/food-rotation',
    name: 'FoodRotation',
    component: FoodRotation,
    meta: {
      title: '今天吃什么 - 我的个人博客',
      keepAlive: true
    }
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
    path: '/articles', // 文章列表页路由
    name: 'articles',
    component: ArticlesListView,
    meta: { title: '文章列表 - 我的个人博客' }
  },
  {
    path: '/articles/:id',
    name: 'articleDetail', // 修改名称以区分列表和详情
    component: ArticleView,
    meta: { title: '文章详情 - 我的个人博客' },
    props: true
  },
  {
    path: '/travel',
    name: 'travel',
    component: TravelView,
    meta: { title: '旅行日记 - 我的个人博客' }
  },
  {
    path: '/travel/:id',
    name: 'travelDetail',
    component: TravelDetaView,
    meta: { title: '旅行日记详情 - 我的个人博客' },
    props: true
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
    meta: { title: '搜索结果 - 我的个人博客' },
    props: (route) => ({ query: route.query.q })
  },
  {
    path: '/wechat',
    name: 'wechat',
    component: WechatView,
    meta: { title: '微信公众号 - 我的个人博客' }
  }
  // 暂时移除404路由配置，因为ErrorView不存在
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

router.beforeEach((to, from, next) => {
  next()
})

router.afterEach((to) => {
  document.title = to.meta.title || '我的个人博客'
})

export default router
