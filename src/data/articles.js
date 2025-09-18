export default [
  {
    id: '1',
    title: 'Vue3 + Pinia 状态管理踩坑记录',
    date: '2023-10-01',
    tags: ['Vue3', 'Pinia', '前端'],
    views: 1243,
    summary: '记录我在使用Vue3和Pinia时遇到的几个棘手问题及解决方案...',
    tips: '不要在Pinia的action中直接修改state，应该使用返回新对象的方式，否则可能导致响应式失效',
    codeExample: `// 错误写法
actions: {
  updateUser(user) {
    this.user.name = user.name; // 可能不会触发响应式更新
  }
}

// 正确写法
actions: {
  updateUser(user) {
    this.user = { ...this.user, ...user }; // 正确触发更新
  }
}`,
    content: `# Vue3 + Pinia 状态管理踩坑记录

作为一个前端新手，最近在使用Vue3和Pinia开发项目时遇到了不少问题，记录下来希望能帮到同样遇到这些问题的同学。

## 1. 响应式数据丢失问题

刚开始使用Pinia时，我发现有时候更新数据后视图不会刷新，后来才明白是因为直接修改了对象的属性。

\`\`\`javascript
// 错误示例
const store = useUserStore()
store.user.name = '新名字' // 视图不会更新
\`\`\`

正确的做法是创建新对象：

\`\`\`javascript
// 正确示例
const store = useUserStore()
store.user = { ...store.user, name: '新名字' } // 视图会更新
\`\`\`

## 2. 异步action的处理

我在处理异步操作时，忘记了action可以返回Promise，导致组件中无法正确等待数据加载完成。

\`\`\`javascript
// 商店中
actions: {
  async fetchData() {
    this.loading = true
    const data = await api.getData()
    this.data = data
    this.loading = false
    return data // 关键：返回数据
  }
}

// 组件中
async function loadData() {
  const data = await store.fetchData()
  // 可以直接使用获取到的数据
  console.log(data)
}
\`\`\`

## 3. 类型定义问题

使用TypeScript时，一开始没给state正确定义类型，导致开发体验很差，总是出现类型错误。

后来学会了正确定义接口：

\`\`\`typescript
interface User {
  id: string
  name: string
  age?: number
}

const useUserStore = defineStore('user', {
  state: (): { user: User | null, loading: boolean } => ({
    user: null,
    loading: false
  }),
  // ...
})
\`\`\`

这些都是很基础的问题，但对于新手来说很容易踩坑，希望我的记录能帮到大家。`
  },
  {
    id: '2',
    title: 'Element Plus 组件二次封装的那些坑',
    date: '2023-09-15',
    tags: ['Element Plus', '组件封装'],
    views: 987,
    summary: '分享封装Element Plus组件时遇到的事件传递和样式覆盖问题...',
    tips: '封装组件时一定要用v-bind="$attrs"和v-on="$listeners"，否则父组件的属性和事件无法正确传递',
    codeExample: `// 正确的组件封装方式
<template>
  <el-input
    v-bind="$attrs"
    v-on="$listeners"
    :class="{'custom-input': true}"
    :placeholder="placeholder || '请输入'"
  />
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  placeholder: {
    type: String,
    default: ''
  }
})
</script>`,
    content: `# Element Plus 组件二次封装技巧

作为一个刚接触前端不久的开发者，我在封装Element Plus组件时走了不少弯路，这里分享一些经验。

## 1. 属性和事件传递问题

刚开始封装组件时，我把每个属性和事件都手动声明一遍，非常繁琐：

\`\`\`vue
<template>
  <el-button 
    :type="type" 
    :size="size"
    @click="handleClick"
  >
    <slot />
  </el-button>
</template>

<script setup>
const props = defineProps(['type', 'size'])
const emit = defineEmits(['click'])

const handleClick = (e) => {
  emit('click', e)
}
</script>
\`\`\`

后来才知道可以用v-bind="$attrs"和v-on="$listeners"简化：

\`\`\`vue
<template>
  <el-button 
    v-bind="$attrs"
    v-on="$listeners"
  >
    <slot />
  </el-button>
</template>
\`\`\`

这样父组件传递的所有属性和事件都会自动生效，不需要手动声明。

## 2. 样式覆盖问题

想修改组件样式时，直接在<style scoped>中写样式不生效，后来了解到需要用/deep/或::v-deep：

\`\`\`css
::v-deep .el-button {
  border-radius: 4px;
}

// 或者
:deep(.el-button) {
  border-radius: 4px;
}
\`\`\`

但要注意不要过度使用，可能会影响全局样式。

## 3. 插槽传递问题

封装包含插槽的组件时，需要用<slot>标签显式传递：

\`\`\`vue
<template>
  <el-card>
    <template #header>
      <slot name="header">默认标题</slot>
    </template>
    <slot />
    <template #footer>
      <slot name="footer" />
    </template>
  </el-card>
</template>
\`\`\`

这些小技巧虽然简单，但对新手来说很容易困惑，希望能帮到大家。`
  },
  {
    id: '3',
    title: 'Vite 启动慢？我是这样解决的',
    date: '2023-08-28',
    tags: ['Vite', '性能优化', '前端工程化'],
    views: 1562,
    summary: '记录Vite项目启动慢、热更新卡顿的解决过程...',
    tips: '如果node_modules体积过大，可配置optimizeDeps.exclude排除不需要预构建的依赖，显著提升启动速度',
    codeExample: `// vite.config.js
export default defineConfig({
  optimizeDeps: {
    // 排除不需要预构建的依赖
    exclude: ['lodash', 'moment'],
    // 强制预构建某些依赖
    include: ['axios']
  },
  server: {
    // 禁用DNS缓存加速启动
    dns: {
      cache: false
    }
  }
})`,
    content: `# Vite 4.x 性能优化实战指南

作为前端新手，我最近用Vite开发项目时遇到了启动慢、热更新卡顿的问题，花了不少时间解决，记录一下过程。

## 1. 启动速度慢的问题

刚开始我的项目启动要30多秒，简直无法忍受。后来发现是因为依赖太多，Vite预构建耗时过长。

解决方法：在vite.config.js中配置不需要预构建的依赖

\`\`\`javascript
// vite.config.js
export default defineConfig({
  optimizeDeps: {
    exclude: ['lodash', 'moment'] // 排除这些依赖的预构建
  }
})
\`\`\`

这个简单的配置让我的启动时间减少到了10秒左右！

## 2. 热更新不及时

修改代码后，有时候要等好几秒才能看到效果，甚至需要手动刷新。

解决方法：减小模块体积，避免过大的组件文件

我把一个有1000多行代码的大组件拆分成了5个小组件，热更新速度明显提升。

另外发现，使用import * as XXX的方式导入大量内容也会影响热更新，改成按需导入后有所改善。

## 3. 内存占用过高

开发一段时间后，Vite占用内存越来越高，甚至会崩溃。

解决方法：增加Node.js内存限制

在package.json的scripts中添加：

\`\`\`json
"scripts": {
  "dev": "node --max-old-space-size=4096 node_modules/vite/bin/vite.js"
}
\`\`\`

这个方法让Vite运行更稳定，不再频繁崩溃。

这些小技巧虽然简单，但对新手来说可能不太容易发现，希望能帮到大家。`
  },
  {
    id: '4',
    title: 'TypeScript 类型报错？别慌，看这里',
    date: '2023-08-15',
    tags: ['TypeScript', '类型系统', '前端'],
    views: 1123,
    summary: '记录我作为TS新手遇到的常见类型错误及解决方法...',
    tips: '不要轻易使用any类型来逃避类型检查，这会失去TypeScript的意义，尽量使用unknown并配合类型断言',
    codeExample: `// 不好的做法
const data: any = fetchData()
data.user.name = 'test' // 不会报错，但可能运行时出错

// 好的做法
const data: unknown = fetchData()
if (isUser(data)) { // 自定义类型守卫
  data.user.name = 'test' // 安全访问
}

// 类型守卫函数
function isUser(obj: unknown): obj is { user: { name: string } } {
  return typeof obj === 'object' && obj !== null && 'user' in obj 
    && typeof (obj as any).user === 'object' && 'name' in (obj as any).user
}`,
    content: `# TypeScript 新手避坑指南

作为一个刚接触TypeScript的开发者，我经常被各种类型错误搞得头大。这里记录一些常见问题和解决方法。

## 1. "Object is possibly null/undefined" 错误

这是我遇到最多的错误，比如：

\`\`\`typescript
const user = { name: '张三', age: 20 }
const address = user.address.city // 错误：Object is possibly 'undefined'
\`\`\`

解决方法1：使用可选链操作符(?.)

\`\`\`typescript
const city = user.address?.city // 安全访问
\`\`\`

解决方法2：先进行判断

\`\`\`typescript
if (user.address) {
  const city = user.address.city // 安全访问
}
\`\`\`

## 2. 类型断言的正确使用

有时候TypeScript推断的类型和实际不符，这时候需要类型断言：

\`\`\`typescript
const input = document.getElementById('username') as HTMLInputElement
input.value = 'test' // 现在TypeScript知道这是输入框了
\`\`\`

但不要滥用！如果断言错误，运行时还是会出错。

## 3. 函数参数类型问题

刚开始我经常忘记给函数参数指定类型：

\`\`\`typescript
// 错误示例
function add(a, b) {
  return a + b
}
\`\`\`

正确做法是指定类型：

\`\`\`typescript
function add(a: number, b: number): number {
  return a + b
}
\`\`\`

## 4. 处理API返回数据

调用API时，返回的数据类型不确定：

\`\`\`typescript
interface User {
  id: number
  name: string
}

async function fetchUser(): Promise<User> {
  const response = await fetch('/api/user')
  const data = await response.json()
  return data as User // 类型断言
}
\`\`\`

更好的做法是添加类型检查：

\`\`\`typescript
function isUser(data: unknown): data is User {
  return typeof data === 'object' && data !== null && 
    'id' in data && typeof (data as any).id === 'number' &&
    'name' in data && typeof (data as any).name === 'string'
}

// 使用
if (isUser(data)) {
  // 现在TypeScript知道data是User类型了
}
\`\`\`

TypeScript虽然初期会增加一些工作量，但长期来看能减少很多bug，值得学习！`
  },
  {
    id: '5',
    title: 'React 18 升级后遇到的那些问题',
    date: '2023-07-30',
    tags: ['React', '前端框架', '并发渲染'],
    views: 876,
    summary: '记录从React 17升级到18后遇到的兼容性问题及解决方法...',
    tips: '升级React 18后，useEffect的执行时机发生了变化，可能导致一些依赖副作用顺序的代码出现问题，需要重新检查依赖数组',
    codeExample: `// React 17中
useEffect(() => {
  console.log('组件挂载')
  // 设置事件监听
  window.addEventListener('resize', handleResize)
  return () => {
    window.removeEventListener('resize', handleResize)
  }
}, [])

// React 18中严格模式下会执行两次！
// 解决：确保清理函数正确工作
useEffect(() => {
  console.log('组件挂载')
  const handleResize = () => { /* ... */ }
  window.addEventListener('resize', handleResize)
  return () => {
    console.log('清理')
    window.removeEventListener('resize', handleResize)
  }
}, [])`,
    content: `# React 18 升级踩坑记录

最近把项目从React 17升级到了18，本以为很简单，结果遇到了不少问题，记录一下解决过程。

## 1. createRoot 导致的问题

React 18用createRoot替代了ReactDOM.render，但我一开始直接替换后发现应用无法启动。

错误用法：

\`\`\`javascript
// 错误
import { createRoot } from 'react-dom/client'
createRoot(document.getElementById('root')).render(<App />)
\`\`\`

问题出在我使用了React Router v5，它和React 18的并发模式不兼容。解决方法是升级到React Router v6，或者使用legacy_createRoot：

\`\`\`javascript
// 临时解决方法
import { legacy_createRoot } from 'react-dom/client'
legacy_createRoot(document.getElementById('root')).render(<App />)
\`\`\`

当然最好还是升级依赖到兼容版本。

## 2. useEffect 执行两次

在开发环境的严格模式下，React 18会让useEffect执行两次，这是为了检测未清理的副作用。

这导致我的一些初始化代码执行了两次，比如：

\`\`\`javascript
useEffect(() => {
  console.log('初始化')
  // 发送API请求
  fetchData()
  
  return () => {
    console.log('清理')
  }
}, [])
\`\`\`

解决方法是确保清理函数正确工作，或者在开发环境中忽略这个问题（生产环境不会这样）。

## 3. 自动批处理导致的状态更新问题

React 18引入了自动批处理，合并多个状态更新，这可能导致一些依赖连续更新的代码出现问题。

比如：

\`\`\`javascript
const [count, setCount] = useState(0)
const [name, setName] = useState('')

const handleClick = () => {
  setCount(c => c + 1)
  setName('新名字')
  // React 18会合并这两个更新，只触发一次渲染
}
\`\`\`

如果确实需要立即更新，可以使用flushSync：

\`\`\`javascript
import { flushSync } from 'react-dom'

const handleClick = () => {
  flushSync(() => {
    setCount(c => c + 1)
  })
  // 这里count已经更新了
  flushSync(() => {
    setName('新名字')
  })
}
\`\`\`

升级框架虽然能获得新特性，但兼容性问题确实头疼，建议小版本逐步升级，不要跨太大版本。`
  },
  {
    id: '6',
    title: 'CSS Grid布局：新手常犯的5个错误',
    date: '2023-07-12',
    tags: ['CSS', '布局', '前端'],
    views: 1023,
    summary: '分享我学习Grid布局时犯的错误和正确用法...',
    tips: '使用Grid布局时，不要忘记grid容器的display: grid声明，很多时候布局不生效都是因为漏掉了这个',
    codeExample: `// 错误示例：忘记设置display: grid
.container {
  /* 缺少 display: grid; */
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

// 正确示例
.container {
  display: grid; /* 必须设置 */
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

// 常见错误：使用px固定宽度导致响应式问题
// 更好的做法：使用fr单位或minmax
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 10px;
}`,
    content: `# CSS Grid 布局新手避坑指南

作为CSS新手，我在学习Grid布局时遇到了很多困惑，这里分享几个我常犯的错误。

## 1. 忘记设置display: grid

这是最基础也最容易犯的错误！我好几次写了grid-template-columns但没设置display: grid，结果布局完全没效果。

\`\`\`css
/* 错误 */
.grid-container {
  /* 忘记设置 display: grid; */
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

/* 正确 */
.grid-container {
  display: grid; /* 必须设置 */
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
\`\`\`

## 2. 混淆grid容器和grid项属性

刚开始我经常把属于容器的属性用到了项目上，比如把grid-template-columns写到了子元素上。

记住：
- grid-template-columns, grid-template-rows 是容器属性
- grid-column, grid-row 是项目属性

\`\`\`css
/* 错误 */
.grid-item {
  grid-template-columns: 1fr 1fr; /* 这是容器属性 */
}

/* 正确 */
.grid-container {
  display: grid;
  grid-template-columns: 1fr 1fr; /* 容器上设置 */
}

.grid-item:nth-child(1) {
  grid-column: span 2; /* 项目上设置 */
}
\`\`\`

## 3. 响应式布局处理不当

刚开始我用固定像素设置列宽，导致在小屏幕上显示不正常：

\`\`\`css
/* 不推荐 */
.grid-container {
  display: grid;
  grid-template-columns: 300px 300px; /* 固定宽度 */
}
\`\`\`

更好的做法是使用fr单位或minmax函数：

\`\`\`css
/* 推荐 */
.grid-container {
  display: grid;
  grid-template-columns: 1fr 1fr; /* 自适应 */
}

/* 响应式更佳方案 */
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}
\`\`\`

## 4. 过度使用Grid布局

Grid很强大，但不是所有情况都需要用。简单的布局用Flexbox可能更合适，比如垂直居中：

\`\`\`css
/* 简单布局用Flex更合适 */
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
\`\`\`

Grid和Flex不是替代关系，而是互补的，需要根据场景选择。

CSS布局对新手来说确实不容易，多练习多尝试才能掌握。`
  },
  {
    id: '7',
    title: 'Node.js 写接口时踩过的坑',
    date: '2023-06-25',
    tags: ['Node.js', '后端', 'JavaScript'],
    views: 754,
    summary: '记录用Node.js写后端接口时遇到的异步处理、错误处理问题...',
    tips: '在Express中，异步函数的错误不能直接通过try/catch捕获后用next()传递，需要使用中间件或包装函数',
    codeExample: `// 错误的异步错误处理
app.get('/api/users', async (req, res, next) => {
  try {
    const users = await User.find()
    res.json(users)
  } catch (err) {
    // 这样不会被Express错误中间件捕获
    res.status(500).json({ error: err.message })
  }
})

// 正确做法
app.get('/api/users', async (req, res, next) => {
  try {
    const users = await User.find()
    res.json(users)
  } catch (err) {
    next(err) // 传递给错误中间件
  }
})

// 更简洁的方式：使用包装函数
const asyncHandler = (fn) => (req, res, next) => 
  Promise.resolve(fn(req, res, next)).catch(next)

app.get('/api/users', asyncHandler(async (req, res) => {
  const users = await User.find()
  res.json(users)
}))`,
    content: `# Node.js 接口开发避坑指南

作为前端开发者，我最近尝试用Node.js写后端接口，遇到了不少问题，这里分享一下。

## 1. 异步处理不当导致的问题

刚开始写接口时，我经常忘记JavaScript是异步的，导致返回数据为空：

\`\`\`javascript
// 错误示例
app.get('/api/users', (req, res) => {
  let users
  User.find().then(data => {
    users = data // 这里是异步的，下面的res.json会先执行
  })
  res.json(users) // 结果是undefined
})
\`\`\`

正确做法是使用async/await：

\`\`\`javascript
// 正确示例
app.get('/api/users', async (req, res) => {
  const users = await User.find()
  res.json(users) // 现在能正确返回数据了
})
\`\`\`

## 2. 错误处理不完善

一开始我没有处理错误，导致服务器经常崩溃：

\`\`\`javascript
// 危险的写法
app.get('/api/users', async (req, res) => {
  const users = await User.find()
  res.json(users) // 如果数据库出错，会导致服务器崩溃
})
\`\`\`

必须添加错误处理：

\`\`\`javascript
// 正确写法
app.get('/api/users', async (req, res, next) => {
  try {
    const users = await User.find()
    res.json(users)
  } catch (err) {
    next(err) // 传递给错误中间件
  }
})

// 错误中间件
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({
    message: '服务器错误',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  })
})
\`\`\`

## 3. 忘记设置Content-Type

有时候返回JSON数据时，客户端却收到text/plain类型，这是因为忘记设置响应头：

\`\`\`javascript
// 不推荐
app.get('/api/data', (req, res) => {
  res.send(JSON.stringify({ name: 'test' }))
})

// 推荐
app.get('/api/data', (req, res) => {
  res.json({ name: 'test' }) // 自动设置Content-Type为application/json
})
\`\`\`

## 4. 端口已被占用

启动服务器时经常遇到"EADDRINUSE: address already in use :::3000"错误，这是因为端口被占用了。

解决方法：
1. 找到并杀死占用端口的进程
2. 或者使用动态端口：

\`\`\`javascript
app.listen(0, () => {
  console.log('服务器启动在端口:', server.address().port)
})
\`\`\`

Node.js后端开发和前端JavaScript有很多不同，特别是在异步处理和错误处理方面，需要特别注意。`
  },
  {
    id: '8',
    title: 'PWA离线缓存：不是想象中那么简单',
    date: '2023-06-10',
    tags: ['PWA', '缓存', 'Web性能'],
    views: 632,
    summary: '记录实现PWA离线功能时遇到的缓存策略和更新问题...',
    tips: 'Service Worker缓存资源时，一定要正确版本化缓存名称，否则用户会一直使用旧缓存，无法获取更新',
    codeExample: `// 错误的缓存命名方式
const CACHE_NAME = 'my-cache'; // 固定名称，无法更新

// 正确的缓存命名方式
const CACHE_VERSION = 'v1';
const CACHE_NAME = \`my-cache-\${CACHE_VERSION}\`; // 带版本号

// 安装阶段缓存资源
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll([
          '/',
          '/index.html',
          '/styles.css',
          '/app.js'
        ]);
      })
      .then(() => self.skipWaiting())
  );
});

// 激活阶段清理旧缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name); // 删除旧版本缓存
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});`,
    content: `# PWA 离线缓存踩坑记录

最近想给我的网站添加离线功能，尝试了PWA，但过程并不顺利，记录一下遇到的问题。

## 1. 缓存更新问题

刚开始实现时，我发现更新网站内容后，用户仍然看到旧内容，因为Service Worker缓存了旧版本。

问题出在我使用了固定的缓存名称：

\`\`\`javascript
// 错误
const CACHE_NAME = 'my-cache'; // 固定名称

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll([/* 资源列表 */]))
  );
});
\`\`\`

解决方法是给缓存名称添加版本号：

\`\`\`javascript
// 正确
const CACHE_VERSION = 'v1.0.1';
const CACHE_NAME = \`my-cache-\${CACHE_VERSION}\`;

// 激活时删除旧缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(name => {
          if (name !== CACHE_NAME) {
            return caches.delete(name); // 删除旧缓存
          }
        })
      );
    })
  );
});
\`\`\`

## 2. 缓存策略选择错误

我一开始对所有请求都使用了cache-first策略，导致API数据也被缓存，无法获取最新数据：

\`\`\`javascript
// 不适合API的策略
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
\`\`\`

正确做法是对静态资源和API使用不同策略：

\`\`\`javascript
self.addEventListener('fetch', (event) => {
  // 对API请求使用network-first策略
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // 网络失败时使用缓存
          return caches.match(event.request);
        })
    );
  } else {
    // 对静态资源使用cache-first策略
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          return response || fetch(event.request);
        })
    );
  }
});
\`\`\`

## 3. 缓存过大问题

一开始我缓存了太多资源，导致Service Worker安装失败：

\`\`\`javascript
// 不推荐
cache.addAll([
  '/',
  '/index.html',
  '/about.html',
  '/contact.html',
  // ... 太多资源
])
\`\`\`

解决方法是只缓存核心资源，其他资源在用户访问时再缓存：

\`\`\`javascript
// 只缓存核心资源
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/offline.html' // 离线页面
];

// 安装时只缓存核心资源
// 其他资源在fetch时动态缓存
self.addEventListener('fetch', (event) => {
  // 非核心资源，请求后缓存
  if (!CORE_ASSETS.includes(event.request.url)) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // 缓存新请求的资源
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, response.clone());
          });
          return response;
        })
        .catch(() => caches.match(event.request))
    );
  }
});
\`\`\`

PWA离线功能很强大，但缓存策略确实需要仔细设计，否则会带来很多问题。`
  },
  {
    id: '9',
    title: 'Vue 3 组合式API：新手容易混淆的几个点',
    date: '2023-05-28',
    tags: ['Vue3', '组合式API', '前端架构'],
    views: 1345,
    summary: '记录使用Vue3组合式API时遇到的setup、ref、reactive等问题...',
    tips: '在setup中不要解构响应式对象，这会丢失响应性，应该使用toRefs将其转换为ref对象后再解构',
    codeExample: `// 错误做法：解构响应式对象会丢失响应性
const user = reactive({
  name: '张三',
  age: 20
})

const { name, age } = user // 失去响应性
name = '李四' // 不会触发更新

// 正确做法：使用toRefs
import { reactive, toRefs } from 'vue'

const user = reactive({
  name: '张三',
  age: 20
})

const { name, age } = toRefs(user) // 保持响应性
name.value = '李四' // 正确触发更新`,
    content: `# Vue 3 组合式API新手避坑指南

从选项式API转到组合式API时，我遇到了很多困惑，这里分享几个需要注意的点。

## 1. ref和reactive的区别

刚开始我总是搞不清什么时候用ref，什么时候用reactive：

\`\`\`javascript
// ref用于基本类型和对象
const count = ref(0)
const user = ref({ name: '张三' })

// 访问时需要用.value
console.log(count.value) // 0
console.log(user.value.name) // 张三

// reactive只用于对象
const data = reactive({
  list: [],
  loading: false
})

// 访问时不需要.value
console.log(data.loading) // false
\`\`\`

简单来说：
- 基本类型用ref（number, string, boolean等）
- 对象类型可以用reactive或ref，但ref更灵活
- ref对象需要通过.value访问，reactive对象直接访问属性

## 2. 解构响应式对象的问题

我曾经尝试解构reactive对象，结果发现失去了响应性：

\`\`\`javascript
// 错误
const user = reactive({
  name: '张三',
  age: 20
})

const { name, age } = user // 解构后失去响应性

// 修改不会触发更新
name = '李四'
\`\`\`

解决方法是使用toRefs：

\`\`\`javascript
// 正确
import { reactive, toRefs } from 'vue'

const user = reactive({
  name: '张三',
  age: 20
})

const { name, age } = toRefs(user) // 保持响应性

// 注意需要用.value
name.value = '李四' // 会触发更新
\`\`\`

## 3. setup函数的执行时机

刚开始我在setup中访问DOM元素，结果总是null，因为setup执行时DOM还没渲染：

\`\`\`javascript
// 错误
setup() {
  const el = document.getElementById('my-element')
  console.log(el) // null，因为DOM还没渲染

  return {}
}
\`\`\`

解决方法是使用onMounted钩子：

\`\`\`javascript
// 正确
import { onMounted } from 'vue'

setup() {
  onMounted(() => {
    // 组件挂载后执行，DOM已存在
    const el = document.getElementById('my-element')
    console.log(el) // 正确获取元素
  })

  return {}
}
\`\`\`

## 4. 生命周期钩子的变化

组合式API中的生命周期钩子和选项式API略有不同：

\`\`\`javascript
import { onMounted, onUpdated, onUnmounted } from 'vue'

setup() {
  onMounted(() => {
    console.log('组件挂载')
  })

  onUpdated(() => {
    console.log('组件更新')
  })

  onUnmounted(() => {
    console.log('组件卸载')
  })
}
\`\`\`

注意它们都是函数，需要在setup中调用。

组合式API提供了更好的代码组织方式，但对新手来说确实有一些学习曲线，多练习就能掌握。`
  },
  {
    id: '10',
    title: 'WebAssembly：尝试加速前端计算却踩了坑',
    date: '2023-05-15',
    tags: ['Wasm', '性能', '前端'],
    views: 421,
    summary: '记录使用WebAssembly加速JavaScript计算时遇到的性能和兼容性问题...',
    tips: '不要盲目使用WebAssembly，对于简单计算，JavaScript可能更快，因为Wasm有数据传递的额外开销',
    codeExample: `// 错误：对简单计算使用Wasm，反而更慢
// 计算1到n的和
// Rust代码
#[wasm_bindgen]
pub fn sum(n: i32) -> i32 {
    let mut total = 0;
    for i in 1..=n {
        total += i;
    }
    total
}

// JavaScript等效代码
function sum(n) {
    let total = 0;
    for (let i = 1; i <= n; i++) {
        total += i;
    }
    return total;
}

// 对于n < 100000，JS版本更快！因为Wasm有调用开销

// 正确：只对复杂计算使用Wasm
// 比如复杂的数学计算、图像处理等`,
    content: `# WebAssembly 前端性能优化踩坑记

听说WebAssembly能大幅提升前端性能，我就想试试用它来加速我的项目，结果却发现没那么简单。

## 1. 简单计算反而变慢

我首先尝试用Rust写了一个简单的求和函数编译成Wasm，想替代JavaScript版本：

Rust代码：
\`\`\`rust
#[wasm_bindgen]
pub fn sum(n: i32) -> i32 {
    let mut total = 0;
    for i in 1..=n {
        total += i;
    }
    total
}
\`\`\`

然后和JavaScript版本比较性能：

\`\`\`javascript
// JavaScript版本
function sumJS(n) {
  let total = 0;
  for (let i = 1; i <= n; i++) {
    total += i;
  }
  return total;
}

// 测试
console.time('Wasm')
sumWasm(100000)
console.timeEnd('Wasm') // 约1.2ms

console.time('JS')
sumJS(100000)
console.timeEnd('JS') // 约0.8ms
\`\`\`

结果出乎意料，JavaScript版本反而更快！原来对于简单计算，Wasm的调用开销超过了它的性能优势。

## 2. 数据传递的麻烦

Wasm和JavaScript之间传递复杂数据很麻烦，我想传递一个大数组时遇到了困难：

\`\`\`javascript
// 想传递数组给Wasm
const data = new Float32Array(1000000);
// 填充数据...

// 直接传递不行
const result = processDataWasm(data); // 错误

// 正确做法：使用内存缓冲区
const ptr = module._malloc(data.length * 4); // 分配内存
module.HEAPF32.set(data, ptr / 4); // 复制数据

// 调用Wasm函数
module._process_data(ptr, data.length);

// 处理结果...

// 释放内存
module._free(ptr);
\`\`\`

不仅代码复杂，数据复制也消耗了不少时间，抵消了Wasm的性能优势。

## 3. 兼容性和部署问题

我在一些旧浏览器上测试时，发现Wasm不被支持，需要添加降级方案：

\`\`\`javascript
// 检测Wasm支持
if (WebAssembly) {
  // 加载Wasm模块
  loadWasmModule().then(module => {
    // 使用Wasm版本
    wasmModule = module;
  });
} else {
  // 不支持时使用JS版本
  console.warn('浏览器不支持WebAssembly，使用JavaScript fallback');
}
\`\`\`

部署时也需要注意服务器的MIME类型设置，否则会加载失败：

\`\`\`
# Nginx配置
types {
  application/wasm wasm;
}
\`\`\`

经过这次尝试，我明白了WebAssembly并不是银弹，它适合：
1. 复杂的数学计算
2. 图像处理、音视频处理
3. 移植已有的C/C++/Rust库

对于简单的操作，直接用JavaScript可能更好。`
  },
  {
    id: '11',
    title: 'Next.js 13 路由变化让我头疼的事',
    date: '2023-04-30',
    tags: ['Next.js', 'React', 'SSR'],
    views: 987,
    summary: '记录Next.js 13的App Router带来的路由和渲染方式变化及适应过程...',
    tips: 'Next.js 13的App Router中，默认是服务器组件，不能使用useState、useEffect等客户端钩子，需要显式添加"use client"指令',
    codeExample: `// 错误：在服务器组件中使用客户端钩子
// app/page.js
import { useState } from 'react'

export default function Home() {
  const [count, setCount] = useState(0) // 错误！服务器组件不能用useState
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
    </div>
  )
}

// 正确：添加"use client"指令
// app/page.js
'use client' // 声明为客户端组件

import { useState } from 'react'

export default function Home() {
  const [count, setCount] = useState(0) // 现在可以使用了
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
    </div>
  )
}`,
    content: `# Next.js 13 升级踩坑记录

最近把项目升级到了Next.js 13，新的App Router带来了很多变化，也让我遇到了不少问题。

## 1. 服务器组件 vs 客户端组件

最大的变化是引入了服务器组件，默认情况下所有组件都是服务器组件，不能使用客户端的API：

\`\`\`javascript
// 错误示例
// app/page.js
import { useState } from 'react'

export default function Page() {
  const [count, setCount] = useState(0) // 错误！服务器组件不能用useState
  return <div>{count}</div>
}
\`\`\`

解决方法是添加"use client"指令声明为客户端组件：

\`\`\`javascript
// 正确示例
// app/page.js
'use client' // 关键：声明为客户端组件

import { useState } from 'react'

export default function Page() {
  const [count, setCount] = useState(0) // 现在可以使用了
  return <div>{count}</div>
}
\`\`\`

记住：
- 服务器组件：不能用状态、副作用、浏览器API
- 客户端组件：可以用所有React特性，但增加JavaScript发送量

## 2. 路由系统的变化

Next.js 13的路由从基于文件的路由变成了基于文件夹的路由，这让我很不适应：

旧路由（Pages Router）：
\`\`\`
pages/
  index.js        → /
  about.js        → /about
  users/[id].js   → /users/:id
\`\`\`

新路由（App Router）：
\`\`\`
app/
  page.js         → /
  about/
    page.js       → /about
  users/
    [id]/
      page.js     → /users/:id
\`\`\`

获取参数的方式也变了：

\`\`\`javascript
// 旧方式
export async function getServerSideProps(context) {
  const { id } = context.params
  // ...
}

// 新方式
export default async function UserPage({ params }) {
  const { id } = params
  // ...
}
\`\`\`

## 3. 数据获取的变化

新的App Router使用React Server Components的数据获取方式：

\`\`\`javascript
// 新方式：直接在组件中获取数据
async function getUser(id) {
  const res = await fetch(\`https://api.example.com/users/\${id}\`)
  return res.json()
}

export default async function UserPage({ params }) {
  const user = await getUser(params.id) // 直接在组件中await
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.bio}</p>
    </div>
  )
}
\`\`\`

这种方式更直观，但需要注意：
- 数据获取在服务器上进行，不会暴露API密钥
- 默认会缓存数据，需要时可以配置缓存策略

Next.js 13的变化很大，虽然初期需要适应，但新的路由系统和服务器组件确实带来了更好的性能和开发体验。`
  },
  {
    id: '12',
    title: 'ES2023新特性：别用太早，小心兼容性',
    date: '2023-04-18',
    tags: ['JavaScript', 'ES6+', '前端'],
    views: 543,
    summary: '记录使用ES2023新特性时遇到的兼容性问题和转译配置...',
    tips: '使用新的Array方法如toReversed、toSorted时要注意，这些方法返回新数组而不修改原数组，和reverse、sort不同',
    codeExample: `// 容易混淆的点：原数组是否被修改
const arr = [3, 1, 2];

// 传统方法：修改原数组
arr.sort(); // 原数组被修改
console.log(arr); // [1, 2, 3]

// ES2023新方法：返回新数组，不修改原数组
const sortedArr = arr.toSorted();
console.log(arr); // [3, 1, 2]（原数组不变）
console.log(sortedArr); // [1, 2, 3]（新数组）

// 类似的还有：
// toReversed() 替代 reverse()
// toSpliced() 替代 splice()
// with() 替代修改指定索引元素`,
    content: `# ES2023 新特性使用踩坑记

作为前端开发者，我总是想尝试最新的JavaScript特性，但在使用ES2023新特性时遇到了一些问题。

## 1. 兼容性问题

我兴奋地使用了Array的toReversed()方法，结果在一些浏览器上报错：

\`\`\`javascript
const arr = [1, 2, 3];
const reversed = arr.toReversed(); // 在旧浏览器中报错：arr.toReversed is not a function
\`\`\`

查了一下Can I use，发现这个方法在一些旧版本浏览器中不支持，比如Chrome 110以下版本。

解决方法是使用Babel转译或添加polyfill：

\`\`\`bash
# 安装core-js
npm install core-js@3

# 在入口文件中导入
import 'core-js/stable';
\`\`\`

并配置Babel：

\`\`\`json
// .babelrc
{
  "presets": [
    ["@babel/preset-env", {
      "useBuiltIns": "usage",
      "corejs": 3
    }]
  ]
}
\`\`\`

## 2. 新方法与旧方法的区别

我发现toReversed()和传统的reverse()有一个重要区别：

\`\`\`javascript
const arr = [1, 2, 3];

// 传统方法：修改原数组
const reversed1 = arr.reverse();
console.log(arr); // [3, 2, 1]（原数组被修改）
console.log(reversed1); // [3, 2, 1]

// ES2023新方法：返回新数组，不修改原数组
const reversed2 = arr.toReversed();
console.log(arr); // [1, 2, 3]（原数组不变）
console.log(reversed2); // [3, 2, 1]
\`\`\`

这个区别很重要，如果不小心替换，可能会导致依赖原数组不变的代码出错。

## 3. 哈希bang语法的问题

ES2023引入了哈希bang语法，允许在脚本文件开头添加#!/usr/bin/env node：

\`\`\`javascript
#!/usr/bin/env node
console.log('Hello World');
\`\`\`

我在前端代码中也尝试使用，结果Webpack打包时报错。原来这个特性主要用于Node.js脚本，不适合前端代码。

## 4. Array find from last的使用误区

我在使用findLast()方法时，误以为它会改变原数组：

\`\`\`javascript
const numbers = [1, 2, 3, 4, 5];

// 查找最后一个偶数
const lastEven = numbers.findLast(n => n % 2 === 0);
console.log(lastEven); // 4
console.log(numbers); // [1, 2, 3, 4, 5]（原数组不变）
\`\`\`

实际上，和其他find方法一样，它只返回找到的元素，不修改原数组。

使用新特性可以让代码更简洁，但一定要注意兼容性和与旧方法的区别，最好在项目中添加适当的转译和polyfill。`
  },
  {
    id: '13',
    title: 'Tailwind CSS：用了才知道的麻烦事',
    date: '2023-03-25',
    tags: ['Tailwind', 'CSS', '前端工程化'],
    views: 876,
    summary: '记录使用Tailwind CSS时遇到的类名过长、自定义配置等问题...',
    tips: '不要过度使用Tailwind的工具类，对于重复出现的样式组合，应该提取为组件或使用@apply创建自定义类',
    codeExample: `// 不好的做法：类名过长且重复
<button class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300">
  按钮
</button>

// 好的做法：提取为组件或使用@apply
// CSS
.btn-primary {
  @apply bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300;
}

// HTML
<button class="btn-primary">按钮</button>

// 或者在Vue/React中创建组件
// Button.vue
<template>
  <button class="btn-primary">
    <slot />
  </button>
</template>`,
    content: `# Tailwind CSS 新手使用体验与避坑

刚开始用Tailwind CSS时觉得很方便，不用写CSS了，但用久了发现也有不少问题。

## 1. 类名过长问题

写着写着，元素的类名变得越来越长，可读性很差：

\`\`\`html
<div class="flex items-center justify-between p-4 border-b border-gray-200 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
  <h3 class="text-lg font-medium text-gray-900">标题</h3>
  <p class="text-sm text-gray-500">内容</p>
</div>
\`\`\`

解决方法是使用@apply提取重复的类组合：

\`\`\`css
/* styles.css */
.card {
  @apply flex items-center justify-between p-4 border-b border-gray-200 
         bg-white rounded-lg shadow-sm hover:shadow-md 
         transition-shadow duration-300;
}

.card-title {
  @apply text-lg font-medium text-gray-900;
}

.card-content {
  @apply text-sm text-gray-500;
}
\`\`\`

然后在HTML中使用：

\`\`\`html
<div class="card">
  <h3 class="card-title">标题</h3>
  <p class="card-content">内容</p>
</div>
\`\`\`

## 2. 自定义颜色和字体的问题

我想使用项目设计稿中的品牌色，一开始不知道怎么添加：

\`\`\`javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        // 添加自定义颜色
        primary: '#4F46E5', // 品牌主色
        secondary: '#10B981', // 品牌辅助色
      },
      fontFamily: {
        // 添加自定义字体
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
}
\`\`\`

然后就可以在类名中使用了：

\`\`\`html
<div class="text-primary font-inter">使用自定义颜色和字体</div>
\`\`\`

## 3. 生产环境优化问题

开发环境下Tailwind会生成大量的CSS类，导致文件很大，但生产环境需要优化：

确保配置了 purge选项（Tailwind v3中叫content）：

\`\`\`javascript
// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.html',
    './src/**/*.vue',
    './src/**/*.jsx',
  ],
  // ...
}
\`\`\`

这样在生产构建时，Tailwind会自动移除未使用的类，大大减小CSS文件体积。

## 4. 响应式设计的陷阱

Tailwind的响应式前缀很方便，但我一开始用错了顺序：

\`\`\`html
<!-- 错误顺序 -->
<div class="md:flex flex-col">
  <!-- 在中等屏幕以上会应用flex，小屏幕应用flex-col -->
  <!-- 但实际上，后面的类会覆盖前面的，所以永远是flex-col -->
</div>

<!-- 正确顺序 -->
<div class="flex-col md:flex">
  <!-- 小屏幕用flex-col，中等屏幕以上用flex -->
</div>
\`\`\`

记住：响应式前缀应该按照屏幕从小到大的顺序写，后面的会覆盖前面的。

Tailwind CSS确实能提高开发速度，但也需要掌握正确的使用方法，避免项目变得难以维护。`
  },
  {
    id: '14',
    title: 'GraphQL：想替代REST却没那么容易',
    date: '2023-03-10',
    tags: ['GraphQL', 'API', '后端'],
    views: 654,
    summary: '记录尝试用GraphQL替代REST API时遇到的性能和缓存问题...',
    tips: 'GraphQL查询可能导致N+1问题，需要使用dataloader等工具来优化数据库查询',
    codeExample: `// 错误：未优化的查询导致N+1问题
// resolver
const resolvers = {
  Query: {
    users: async () => {
      return await User.findAll();
    }
  },
  User: {
    posts: async (user) => {
      // 每个用户都会触发一次查询，N个用户就是N次查询
      return await Post.findAll({ where: { userId: user.id } });
    }
  }
};

// 正确：使用dataloader优化
const DataLoader = require('dataloader');

const resolvers = {
  Query: {
    users: async () => {
      return await User.findAll();
    }
  },
  User: {
    posts: async (user, _, { postLoader }) => {
      return await postLoader.load(user.id);
    }
  }
};

// 创建dataloader实例
const postLoader = new DataLoader(async (userIds) => {
  // 一次查询获取所有用户的文章
  const posts = await Post.findAll({
    where: { userId: userIds }
  });
  
  // 按userId分组
  const postsByUserId = {};
  posts.forEach(post => {
    if (!postsByUserId[post.userId]) {
      postsByUserId[post.userId] = [];
    }
    postsByUserId[post.userId].push(post);
  });
  
  // 确保顺序与userIds一致
  return userIds.map(id => postsByUserId[id] || []);
});`,
    content: `# GraphQL 实践踩坑记录

听说GraphQL能解决REST API的过度获取和请求次数过多的问题，我就尝试在项目中使用，结果发现也有不少挑战。

## 1. N+1查询问题

GraphQL的灵活性可能导致严重的性能问题，特别是N+1查询问题：

\`\`\`graphql
# 查询所有用户及其文章
query {
  users {
    id
    name
    posts {
      id
      title
    }
  }
}
\`\`\`

如果不优化，这段查询可能导致：
1. 1次查询获取所有用户（1次数据库查询）
2. 对每个用户，1次查询获取其文章（N次数据库查询）

总共1+N次查询，用户多的时候性能很差。

解决方法是使用DataLoader：

\`\`\`javascript
const DataLoader = require('dataloader');

// 创建一个加载器
const postLoader = new DataLoader(async (userIds) => {
  // 一次性查询所有用户的文章
  const posts = await Post.findAll({
    where: { userId: userIds }
  });
  
  // 按用户ID分组
  const postsByUserId = {};
  posts.forEach(post => {
    if (!postsByUserId[post.userId]) {
      postsByUserId[post.userId] = [];
    }
    postsByUserId[post.userId].push(post);
  });
  
  // 按userIds顺序返回结果
  return userIds.map(id => postsByUserId[id] || []);
});

// 在resolver中使用
const resolvers = {
  User: {
    posts: async (user) => {
      return await postLoader.load(user.id);
    }
  }
};
\`\`\`

这样无论有多少用户，都只会执行2次数据库查询。

## 2. 前端缓存问题

REST API的缓存很简单，URL就是天然的缓存键，但GraphQL只有一个端点，缓存更复杂：

\`\`\`javascript
// 所有请求都发到同一个端点
fetch('/graphql', {
  method: 'POST',
  body: JSON.stringify({ query: '...' })
});
\`\`\`

解决方法是使用Apollo Client等专门的GraphQL客户端，它能自动处理缓存：

\`\`\`javascript
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

const client = new ApolloClient({
  uri: '/graphql',
  cache: new InMemoryCache()
});

// 第一次查询会发送请求并缓存结果
client.query({
  query: gql\`
    query GetUser($id: ID!) {
      user(id: $id) {
        id
        name
      }
    }
  \`,
  variables: { id: '1' }
});

// 第二次相同查询会直接使用缓存
client.query({
  query: gql\`...\`,
  variables: { id: '1' }
});
\`\`\`

## 3. 查询复杂度控制

GraphQL允许嵌套查询，恶意用户可能发送非常复杂的查询导致服务器过载：

\`\`\`graphql
# 恶意查询：深度嵌套导致服务器崩溃
query {
  users {
    posts {
      author {
        posts {
          author {
            # 无限嵌套...
          }
        }
      }
    }
  }
}
\`\`\`

解决方法是限制查询深度和复杂度：

\`\`\`javascript
const { depthLimit } = require('graphql-depth-limit');
const { createComplexityLimitRule } = require('graphql-validation-complexity');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  validationRules: [
    depthLimit(5), // 限制最大深度
    createComplexityLimitRule(1000) // 限制复杂度
  ]
});
\`\`\`

GraphQL确实解决了REST的一些问题，但也带来了新的挑战，需要根据项目情况选择是否使用。`
  },
  {
    id: '15',
    title: 'Docker前端开发环境：解决"我这能跑"的问题',
    date: '2023-02-28',
    tags: ['Docker', '前端工程化', 'DevOps'],
    views: 789,
    summary: '记录用Docker统一前端开发环境时遇到的挂载和权限问题...',
    tips: '在Docker中开发前端时，使用卷(volume)挂载代码目录，但要注意容器内Node版本和依赖安装问题，最好在容器内安装依赖',
    codeExample: `# 错误的Dockerfile（开发环境）
FROM node:16

WORKDIR /app

# 错误：在本地安装依赖后复制到容器
COPY package.json package-lock.json ./
RUN npm ci

# 复制代码
COPY . .

# 启动开发服务器
CMD ["npm", "run", "dev"]

# 正确做法：只复制package.json，在容器内安装依赖
FROM node:16

WORKDIR /app

# 先复制依赖文件
COPY package.json package-lock.json ./
RUN npm ci

# 启动脚本：先安装依赖（如果有变化），再启动
CMD ["sh", "-c", "npm ci && npm run dev"]

# docker-compose.yml
version: '3'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules # 避免覆盖容器内的node_modules`,
    content: `# Docker 前端开发环境配置踩坑记

团队开发中经常遇到"我这能跑啊"的问题，都是环境不一致导致的。我尝试用Docker统一开发环境，过程中遇到了不少问题。

## 1. 依赖安装问题

一开始我在本地安装依赖，然后复制到Docker容器中，结果经常出错：

\`\`\`dockerfile
# 错误的Dockerfile
FROM node:16

WORKDIR /app

# 复制本地的依赖和代码
COPY package.json package-lock.json ./
COPY node_modules ./node_modules  # 错误：本地依赖可能和容器环境不兼容
COPY . .

CMD ["npm", "run", "dev"]
\`\`\`

问题在于本地的node_modules是针对本地系统（比如Windows或macOS）编译的，可能和Docker容器中的Linux系统不兼容。

正确做法是在容器内安装依赖：

\`\`\`dockerfile
# 正确的Dockerfile
FROM node:16

WORKDIR /app

# 只复制依赖文件
COPY package.json package-lock.json ./

# 在容器内安装依赖
RUN npm ci

# 复制源代码
COPY . .

CMD ["npm", "run", "dev"]
\`\`\`

## 2. 代码挂载与权限问题

使用Docker Compose挂载代码目录时，遇到了权限问题：

\`\`\`yaml
# docker-compose.yml
version: '3'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - .:/app  # 挂载当前目录到容器内的/app
\`\`\`

这样挂载后，容器内生成的文件（如日志、临时文件）在宿主机上可能会有权限问题，因为容器内通常使用root用户。

解决方法是在容器内创建与宿主机相同UID的用户：

\`\`\`dockerfile
FROM node:16

# 创建与宿主机相同UID的用户
ARG USER_ID=1000
ARG GROUP_ID=1000

RUN groupadd -g \${GROUP_ID} appuser && \
    useradd -m -u \${USER_ID} -g \${GROUP_ID} appuser

WORKDIR /app

# 切换到非root用户
USER appuser

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

CMD ["npm", "run", "dev"]
\`\`\`

然后在构建时传递当前用户的UID和GID：

\`\`\`bash
docker-compose build --build-arg USER_ID=$(id -u) --build-arg GROUP_ID=$(id -g)
\`\`\`

## 3. node_modules 冲突问题

挂载代码后，本地的node_modules会覆盖容器内的node_modules，导致依赖问题：

解决方法是添加一个匿名卷挂载node_modules：

\`\`\`yaml
# docker-compose.yml
version: '3'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules  # 保留容器内的node_modules
\`\`\`

这样容器会使用自己安装的node_modules，而不是宿主机的。

## 4. 热更新问题

有些框架的热更新在Docker中不生效，因为文件系统事件没有被正确触发。

解决方法是配置框架监听文件变化：

对于Vue项目：

\`\`\`javascript
// vue.config.js
module.exports = {
  devServer: {
    watchOptions: {
      poll: true  // 轮询文件变化
    }
  }
};
\`\`\`

对于Webpack项目：

\`\`\`javascript
// webpack.config.js
module.exports = {
  watchOptions: {
    poll: 1000  // 每秒检查一次变化
  }
};
\`\`\`

使用Docker确实能解决环境不一致的问题，但配置起来需要注意很多细节，特别是权限和文件系统相关的问题。`
  },
  {
    id: '16',
    title: 'Nuxt 3 服务端渲染：首屏加载慢的解决',
    date: '2023-02-15',
    tags: ['Nuxt', 'Vue3', 'SSR'],
    views: 890,
    summary: '记录Nuxt 3项目首屏加载慢、数据预取不当的问题及优化方案...',
    tips: 'Nuxt 3中，使用useAsyncData时要注意缓存策略，避免重复请求，对不常变化的数据设置合理的缓存时间',
    codeExample: `// 错误：每次请求都获取数据，没有缓存
const { data } = await useAsyncData('posts', () => {
  return $fetch('/api/posts')
})

// 正确：设置缓存时间
const { data } = await useAsyncData('posts', () => {
  return $fetch('/api/posts')
}, {
  // 缓存1分钟
  maxAge: 60 * 1000,
  // 后台刷新数据，不阻塞用户
  staleTime: 30 * 1000
})

// 对频繁变化的数据使用ssr: false
const { data } = await useAsyncData('user', () => {
  return $fetch('/api/user')
}, {
  ssr: false // 客户端获取，避免服务端缓存用户信息
})`,
    content: `# Nuxt 3 服务端渲染优化踩坑记

我用Nuxt 3开发了一个博客网站，虽然用了服务端渲染(SSR)，但首屏加载还是很慢，经过一番优化终于解决了问题。

## 1. 数据预取时机不当

刚开始我在组件的onMounted钩子中获取数据，结果服务端渲染时没有数据，客户端还要再请求一次：

\`\`\`javascript
// 错误：只在客户端获取数据
onMounted(async () => {
  const response = await fetch('/api/posts')
  posts.value = await response.json()
})
\`\`\`

正确的做法是使用Nuxt提供的数据预取方法：

\`\`\`javascript
// 正确：服务端或客户端预取数据
const { data: posts } = await useAsyncData('posts', () => {
  return $fetch('/api/posts')
})
\`\`\`

useAsyncData会在服务端渲染时获取数据，并在客户端复用，避免重复请求。

## 2. 没有设置缓存策略

所有数据请求都没有缓存，每次访问都重新获取，导致服务器压力大，加载慢：

\`\`\`javascript
// 没有缓存
const { data } = await useAsyncData('posts', () => {
  return $fetch('/api/posts')
})
\`\`\`

解决方法是设置合理的缓存策略：

\`\`\`javascript
// 设置缓存
const { data } = await useAsyncData('posts', () => {
  return $fetch('/api/posts')
}, {
  maxAge: 60 * 1000, // 缓存1分钟
  staleTime: 30 * 1000 // 30秒后后台刷新
})
\`\`\`

对于不常变化的数据（如博客文章），可以设置更长的缓存时间。

## 3. 服务端渲染了不需要的组件

有些组件包含大量客户端交互，不需要服务端渲染，但我还是让它们在服务端渲染了：

解决方法是使用<ClientOnly>组件：

\`\`\`vue
<template>
  <div>
    <!-- 服务端渲染 -->
    <PostContent :post="post" />
    
    <!-- 只在客户端渲染 -->
    <ClientOnly>
      <PostComments :post-id="post.id" />
    </ClientOnly>
  </div>
</template>
\`\`\`

这样评论组件只会在客户端渲染，减轻服务器负担。

## 4. 图片没有优化

页面中的图片没有优化，加载大量高清图片导致首屏加载慢：

解决方法是使用Nuxt的<NuxtImg>组件：

\`\`\`vue
<template>
  <!-- 不推荐 -->
  <img :src="post.coverImage" alt="封面图">
  
  <!-- 推荐 -->
  <NuxtImg 
    :src="post.coverImage" 
    alt="封面图"
    width="600" 
    height="400"
    loading="lazy"
  />
</template>
\`\`\`

NuxtImg会自动优化图片，包括生成不同尺寸、懒加载等。

## 5. 没有使用ISR（增量静态再生）

对于纯静态页面，每次访问都服务端渲染太浪费资源：

解决方法是使用ISR，预渲染页面并定期更新：

\`\`\`javascript
// app.vue 或页面组件
export default {
  // 每小时重新生成页面
  revalidate: 3600,
}
\`\`\`

或者在api路由中设置：

\`\`\`javascript
// server/api/posts.js
export default defineEventHandler(async (event) => {
  // 设置缓存时间
  setResponseHeader(event, 'Cache-Control', 'max-age=3600')
  return await getPosts()
})
\`\`\`

Nuxt 3的服务端渲染功能很强大，但需要正确配置才能发挥最佳性能，特别是缓存策略和数据预取方面。`
  },
  {
    id: '17',
    title: '前端监控：自己搭才知道有多难',
    date: '2023-01-30',
    tags: ['监控', '性能', '前端工程化'],
    views: 567,
    summary: '记录从零搭建前端监控系统时遇到的错误捕获和性能指标问题...',
    tips: "捕获JavaScript错误时，要同时监听window.onerror和window.addEventListener('error')，前者捕获JS错误，后者捕获资源加载错误",
    codeExample: `// 错误：只监听了JS错误，没监听资源错误
window.onerror = function(message, source, lineno, colno, error) {
  console.log('JS错误:', error);
  // 上报错误...
  return true;
};

// 正确：同时监听JS错误和资源错误
// 监听JS错误
window.onerror = function(message, source, lineno, colno, error) {
  reportError({
    type: 'js',
    message: message.toString(),
    source,
    lineno,
    colno,
    stack: error?.stack
  });
  return true;
};

// 监听资源加载错误
window.addEventListener('error', function(event) {
  if (event.target instanceof HTMLElement) {
    reportError({
      type: 'resource',
      tagName: event.target.tagName,
      src: event.target.src || event.target.href,
      message: '资源加载失败'
    });
  }
}, true);

// 监听未捕获的Promise错误
window.addEventListener('unhandledrejection', function(event) {
  reportError({
    type: 'promise',
    message: event.reason?.message || '未处理的Promise拒绝',
    stack: event.reason?.stack
  });
  event.preventDefault();
});`,
    content: `# 前端监控系统搭建踩坑记

为了更好地了解用户体验和解决线上问题，我尝试自己搭建一个简单的前端监控系统，过程中遇到了不少问题。

## 1. 错误捕获不完全

刚开始我只监听了window.onerror，以为能捕获所有错误，但发现很多错误没被捕获：

\`\`\`javascript
// 不完整的错误监听
window.onerror = function(message, source, lineno, colno, error) {
  console.log('捕获到错误:', error);
  // 上报错误...
  return true;
};
\`\`\`

后来发现需要监听多种错误事件：

\`\`\`javascript
// 1. 捕获常规JavaScript错误
window.onerror = function(message, source, lineno, colno, error) {
  reportError({
    type: 'js',
    message: message.toString(),
    source,
    lineno,
    colno,
    stack: error?.stack
  });
  return true;
};

// 2. 捕获资源加载错误（图片、脚本等）
window.addEventListener('error', function(event) {
  if (event.target instanceof HTMLElement) {
    reportError({
      type: 'resource',
      tagName: event.target.tagName,
      src: event.target.src || event.target.href,
      message: '资源加载失败'
    });
  }
}, true);

// 3. 捕获未处理的Promise拒绝
window.addEventListener('unhandledrejection', function(event) {
  reportError({
    type: 'promise',
    message: event.reason?.message || '未处理的Promise拒绝',
    stack: event.reason?.stack
  });
  event.preventDefault(); // 阻止浏览器默认处理
});
\`\`\`

## 2. 跨域脚本错误获取不到详细信息

在加载CDN上的第三方脚本时，错误信息显示为"Script error"，无法获取详细信息：

解决方法是在script标签添加crossorigin属性，并确保CDN设置了正确的CORS头：

\`\`\`html
<script src="https://cdn.example.com/library.js" crossorigin="anonymous"></script>
\`\`\`

这样就能获取到完整的错误信息了。

## 3. 性能指标计算错误

我想计算首次内容绘制(FCP)时间，但不知道怎么正确获取：

\`\`\`javascript
// 错误：直接使用DOMContentLoaded事件
document.addEventListener('DOMContentLoaded', () => {
  const fcpTime = performance.now(); // 这不是FCP时间
  reportPerformance({ type: 'fcp', value: fcpTime });
});
\`\`\`

正确做法是使用PerformanceObserver：

\`\`\`javascript
// 正确：监听性能指标
new PerformanceObserver((entryList) => {
  for (const entry of entryList.getEntriesByName('first-contentful-paint')) {
    reportPerformance({
      type: 'fcp',
      value: entry.startTime
    });
  }
}).observe({ type: 'paint', buffered: true });

// 监听其他指标
new PerformanceObserver((entryList) => {
  for (const entry of entryList.getEntries()) {
    reportPerformance({
      type: entry.name,
      value: entry.startTime
    });
  }
}).observe({ 
  type: 'navigation', 
  buffered: true 
});
\`\`\`

## 4. 监控脚本本身的错误

监控脚本如果出错，会导致整个监控系统失效，还可能影响主应用：

解决方法是将监控脚本放在try-catch中，并使用独立的错误处理：

\`\`\`javascript
try {
  // 监控脚本的主要逻辑
  initMonitor();
} catch (err) {
  // 监控脚本自身的错误处理
  console.error('监控系统初始化失败:', err);
  
  // 可以尝试用简单方式上报
  const img = new Image();
  img.src = \`/monitor/error?msg=\${encodeURIComponent(err.message)}\`;
}
\`\`\`

搭建前端监控系统看似简单，但要考虑的细节很多，特别是错误捕获的完整性和性能指标的准确性。`
  },
  {
    id: '18',
    title: 'Svelte：看起来简单，实则有坑',
    date: '2023-01-15',
    tags: ['Svelte', '前端框架', '响应式'],
    views: 432,
    summary: '记录学习Svelte时遇到的响应式和生命周期问题...',
    tips: 'Svelte的响应式基于赋值操作，直接修改数组或对象的属性不会触发更新，需要重新赋值',
    codeExample: `// 错误：直接修改数组元素不会触发更新
let items = ['a', 'b', 'c'];

function addItem() {
  items.push('d'); // 不会触发更新
}

// 正确：重新赋值触发更新
function addItem() {
  items = [...items, 'd']; // 正确触发更新
}

// 错误：直接修改对象属性
let user = { name: '张三', age: 20 };

function updateAge() {
  user.age = 21; // 不会触发更新
}

// 正确：重新赋值
function updateAge() {
  user = { ...user, age: 21 }; // 正确触发更新
}

// 或者使用扩展运算符
function updateAge() {
  user.age += 1;
  user = user; // 强制更新
}`,
    content: `# Svelte 新手学习踩坑记

Svelte号称"无虚拟DOM"的前端框架，语法看起来很简单，但实际使用中还是遇到了不少问题。

## 1. 响应式原理理解错误

Svelte的响应式不是基于Proxy或Object.defineProperty，而是基于赋值操作，这让我一开始很不适应：

\`\`\`javascript
// 错误示例：直接修改数组不会触发更新
let items = ['a', 'b', 'c'];

function addItem() {
  items.push('d'); // 不会触发更新
}
\`\`\`

正确的做法是重新赋值：

\`\`\`javascript
// 正确示例
let items = ['a', 'b', 'c'];

function addItem() {
  items = [...items, 'd']; // 重新赋值触发更新
}
\`\`\`

对象也是一样：

\`\`\`javascript
// 错误
let user = { name: '张三', age: 20 };

function updateAge() {
  user.age = 21; // 不会触发更新
}

// 正确
function updateAge() {
  user = { ...user, age: 21 }; // 重新赋值
}
\`\`\`

或者更简单的方式：

\`\`\`javascript
function updateAge() {
  user.age += 1;
  user = user; // 强制更新
}
\`\`\`

## 2. 生命周期函数使用不当

Svelte的生命周期函数和其他框架名称不同，我一开始用错了：

\`\`\`javascript
// 错误：使用了React的生命周期命名习惯
import { onMounted, onUpdated } from 'svelte'; // 错误，Svelte没有这些导入

// 正确：Svelte的生命周期是特殊函数
<script>
  // 组件挂载后
  function onMount() {
    console.log('组件挂载了');
  }
  
  // 组件更新后
  function afterUpdate() {
    console.log('组件更新了');
  }
  
  // 组件销毁前
  function onDestroy() {
    console.log('组件要销毁了');
  }
</script>
\`\`\`

注意这些函数不需要导入，直接在<script>标签中定义即可。

## 3. 事件修饰符的区别

Svelte的事件修饰符和Vue类似但有区别，我一开始混淆了：

\`\`\`html
<!-- Vue中的写法 -->
<button @click.prevent="handleClick">点击</button>

<!-- Svelte中的写法 -->
<button on:click|preventDefault={handleClick}>点击</button>
\`\`\`

Svelte的修饰符更接近原生事件方法名：
- preventDefault → |preventDefault
- stopPropagation → |stopPropagation
- once → |once

## 4. 样式作用域问题

Svelte的样式默认是作用域内的，但我想写全局样式时遇到了困难：

\`\`\`html
<!-- 作用域内样式 -->
<style>
  .title {
    color: red;
  }
</style>

<!-- 全局样式 -->
<style global>
  body {
    margin: 0;
    padding: 0;
  }
</style>
\`\`\`

使用global修饰符可以定义全局样式。

Svelte确实能写出更简洁的代码，没有虚拟DOM的特性也让它性能很好，但响应式原理和其他框架不同，需要一段时间适应。`
  },
  {
    id: '19',
    title: '前端模块化：从混乱到规范的过程',
    date: '2022-12-28',
    tags: ['JavaScript', '模块化', '前端工程化'],
    views: 654,
    summary: '记录项目中模块化管理混乱的问题及规范化过程...',
    tips: '在使用ES模块时，避免循环依赖，尽量保持模块间的单向依赖关系，复杂项目可以画模块依赖图',
    codeExample: `// 错误：循环依赖
// moduleA.js
import { funcB } from './moduleB.js';

export function funcA() {
  funcB();
}

// moduleB.js
import { funcA } from './moduleA.js'; // 循环依赖！

export function funcB() {
  funcA();
}

// 正确：引入中间模块解决循环依赖
// common.js
export const sharedData = {
  value: 0
};

// moduleA.js
import { sharedData } from './common.js';

export function funcA() {
  sharedData.value += 1;
}

// moduleB.js
import { sharedData } from './common.js';

export function funcB() {
  console.log(sharedData.value);
}`,
    content: `# 前端模块化实践踩坑记

随着项目越来越大，代码模块化变得越来越重要。我经历了从混乱的全局变量到规范的模块化的过程，记录一下遇到的问题。

## 1. 全局变量污染

项目初期没有使用模块化，所有代码都在全局作用域，导致变量冲突：

\`\`\`javascript
// util.js
function formatDate() {
  // ...
}

// api.js
function formatDate() { // 错误：重复定义，覆盖了之前的函数
  // ...
}
\`\`\`

解决方法是使用IIFE创建私有作用域：

\`\`\`javascript
// util.js
const Util = (function() {
  function formatDate() {
    // ...
  }
  
  return {
    formatDate: formatDate
  };
})();

// api.js
const Api = (function() {
  function formatDate() {
    // ...
  }
  
  return {
    formatDate: formatDate
  };
})();
\`\`\`

更好的方法是使用ES模块：

\`\`\`javascript
// util.js
export function formatDate() {
  // ...
}

// api.js
export function formatDate() {
  // ...
}

// 使用时
import { formatDate as formatDateUtil } from './util.js';
import { formatDate as formatDateApi } from './api.js';
\`\`\`

## 2. 循环依赖问题

使用ES模块时，不小心创建了循环依赖，导致模块加载错误：

\`\`\`javascript
// moduleA.js
import { funcB } from './moduleB.js';

export function funcA() {
  funcB();
}

// moduleB.js
import { funcA } from './moduleA.js'; // 循环依赖！

export function funcB() {
  funcA();
}
\`\`\`

解决方法是重构代码，消除循环依赖：

\`\`\`javascript
// 创建中间模块
// common.js
export const shared = {
  // 共享的数据或方法
};

// moduleA.js
import { shared } from './common.js';

export function funcA() {
  shared.value = 1;
}

// moduleB.js
import { shared } from './common.js';

export function funcB() {
  console.log(shared.value);
}
\`\`\`

## 3. 模块划分不合理

一开始模块划分太细，导致导入语句过多：

\`\`\`javascript
// 导入太多
import { Button } from './components/Button.js';
import { Input } from './components/Input.js';
import { Select } from './components/Select.js';
// ... 更多导入
\`\`\`

解决方法是创建一个入口模块：

\`\`\`javascript
// components/index.js
export { Button } from './Button.js';
export { Input } from './Input.js';
export { Select } from './Select.js';

// 使用时
import { Button, Input, Select } from './components/index.js';
\`\`\`

## 4. 动态导入的问题

想按需加载模块，却不知道怎么正确使用动态导入：

\`\`\`javascript
// 错误
import('./heavyModule.js').then(module => {
  module.doSomething();
});

// 但在使用模块中的默认导出时出错
import('./heavyModule.js').then(module => {
  // 错误：不知道默认导出需要通过module.default访问
  module.doSomething();
});
\`\`\`

正确使用动态导入：

\`\`\`javascript
// 命名导出
import('./heavyModule.js').then(({ doSomething }) => {
  doSomething();
});

// 默认导出
import('./heavyModule.js').then(module => {
  const HeavyComponent = module.default;
  // 使用默认导出
});

// 或者使用async/await
async function loadModule() {
  const { doSomething } = await import('./heavyModule.js');
  doSomething();
}
\`\`\`

良好的模块化设计能显著提高代码的可维护性，但需要注意避免循环依赖和合理划分模块。`
  },
  {
    id: '20',
    title: 'Three.js 3D可视化：从入门到放弃再到入门',
    date: '2022-12-10',
    tags: ['Three.js', '3D', '可视化'],
    views: 789,
    summary: '记录学习Three.js时遇到的场景配置、性能和模型加载问题...',
    tips: '使用Three.js时，一定要确保渲染循环(requestAnimationFrame)正确实现，并且在组件卸载时停止渲染，否则会导致内存泄漏',
    codeExample: `// 错误：没有正确清理Three.js资源
function initThreeJs() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  
  // 添加物体...
  
  // 渲染循环
  function animate() {
    requestAnimationFrame(animate);
    // 动画逻辑
    renderer.render(scene, camera);
  }
  animate();
}

// 正确：添加清理机制
let animationId;
let renderer, scene, camera;

function initThreeJs() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  
  // 添加物体...
  
  // 渲染循环
  function animate() {
    animationId = requestAnimationFrame(animate);
    // 动画逻辑
    renderer.render(scene, camera);
  }
  animate();
}

// 清理函数
function cleanupThreeJs() {
  // 停止动画循环
  cancelAnimationFrame(animationId);
  
  // 移除渲染器
  if (renderer && renderer.domElement) {
    document.body.removeChild(renderer.domElement);
    renderer.dispose();
  }
  
  // 清理场景
  if (scene) {
    // 移除所有物体
    while (scene.children.length > 0) {
      scene.remove(scene.children[0]);
    }
  }
}`,
    content: `# Node.js 接口开发避坑指南

作为前端开发者，我最近尝试用Node.js写后端接口，遇到了不少问题，这里分享一下。

## 1. 异步处理不当导致的问题

刚开始写接口时，我经常忘记JavaScript是异步的，导致返回数据为空：

\`\`\`javascript
// 错误示例
app.get('/api/users', (req, res) => {
  let users
  User.find().then(data => {
    users = data // 这里是异步的，下面的res.json会先执行
  })
  res.json(users) // 结果是undefined
})
\`\`\`

正确做法是使用async/await：

\`\`\`javascript
// 正确示例
app.get('/api/users', async (req, res) => {
  const users = await User.find()
  res.json(users) // 现在能正确返回数据了
})
\`\`\`

## 2. 错误处理不完善

一开始我没有处理错误，导致服务器经常崩溃：

\`\`\`javascript
// 危险的写法
app.get('/api/users', async (req, res) => {
  const users = await User.find()
  res.json(users) // 如果数据库出错，会导致服务器崩溃
})
\`\`\`

必须添加错误处理：

\`\`\`javascript
// 正确写法
app.get('/api/users', async (req, res, next) => {
  try {
    const users = await User.find()
    res.json(users)
  } catch (err) {
    next(err) // 传递给错误中间件
  }
})

// 错误中间件
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({
    message: '服务器错误',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  })
})
\`\`\`

## 3. 忘记设置Content-Type

有时候返回JSON数据时，客户端却收到text/plain类型，这是因为忘记设置响应头：

\`\`\`javascript
// 不推荐
app.get('/api/data', (req, res) => {
  res.send(JSON.stringify({ name: 'test' }))
})

// 推荐
app.get('/api/data', (req, res) => {
  res.json({ name: 'test' }) // 自动设置Content-Type为application/json
})
\`\`\`

## 4. 端口已被占用

启动服务器时经常遇到"EADDRINUSE: address already in use :::3000"错误，这是因为端口被占用了。

解决方法：
` // 此处补充了缺失的模板字符串闭合符号 `
  },
  {
    id: '8',
    title: 'Three.js 学习踩坑记',
    date: '2023-06-10',
    tags: ['Three.js', '3D', '前端'],
    views: 632,
    summary: '记录学习Three.js过程中遇到的模型加载、渲染性能等问题...',
    tips: 'Three.js中加载外部模型时，务必在服务器环境下运行，否则会出现跨域问题导致加载失败',
    codeExample: `// 错误：本地直接打开HTML文件加载模型
const loader = new GLTFLoader();
loader.load('./model.glb', (gltf) => {
  scene.add(gltf.scene);
}, undefined, (error) => {
  console.error(error); // 会出现跨域错误
});

// 正确：使用服务器运行
// 1. 安装简单服务器
// npm install -g serve
// 2. 启动服务器
// serve .
// 3. 通过http://localhost:5000访问`,
    content: `# Three.js 学习踩坑记

想在网页中实现3D效果，我选择了Three.js，但学习过程并不顺利，遇到了很多问题。

## 1. 模型加载失败问题

刚开始我直接在本地打开HTML文件加载glb模型，结果一直失败：

\`\`\`javascript
const loader = new GLTFLoader();
loader.load('./model.glb', (gltf) => {
  scene.add(gltf.scene);
}, undefined, (error) => {
  console.error(error); // Access to fetch at 'file:///...' from origin 'null' has been blocked by CORS policy
});
\`\`\`

原因是浏览器的CORS政策阻止了本地文件访问，解决方法是使用服务器运行：

\`\`\`bash
# 使用Node.js的serve包
npm install -g serve
serve .
# 然后通过http://localhost:5000访问
\`\`\`

## 2. 性能问题

导入复杂模型后，页面变得非常卡顿，帧率只有十几帧。

解决方法：
1. 简化模型（减少多边形数量）
2. 使用LOD（细节层次）技术
3. 开启渲染优化

\`\`\`javascript
// 开启渲染优化
renderer.setPixelRatio(window.devicePixelRatio);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 柔和阴影，性能更好
\`\`\`

## 3. 灯光设置问题

模型加载后一片漆黑，忘记添加灯光了：

\`\`\`javascript
// 添加环境光
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// 添加平行光
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);
\`\`\`

## 4. 相机位置问题

有时候模型加载了但看不到，可能是相机位置不对：

\`\`\`javascript
// 设置相机位置，确保能看到模型
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5; // 适当调整z轴位置

// 或者让相机看向模型
camera.lookAt(model.position);
\`\`\`

Three.js入门有一定门槛，遇到问题多查看官方文档和示例，慢慢就能掌握了。`
  }
]
