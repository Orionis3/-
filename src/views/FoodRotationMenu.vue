<template>
  <!-- 只在当前路由是食品转盘页时显示 -->
  <div id="toEat" v-if="isFoodRotationRoute">
    <!-- 转盘容器 -->
    <div class="wrapper">
      <!-- 转盘边缘闪烁灯 -->
      <div
        :class="['light', onRotation ? 'light-twinkling' : '']"
        v-for="(light, idx) in foodList"
        :key="idx"
      ></div>
      <!-- 转盘主体 -->
      <div class="panel">
        <!-- 菜品扇区 -->
        <div class="sector" v-for="(food, idx) in foodList" :key="idx">
          <div class="sector-inner">
            <span>{{ food }}</span>
          </div>
        </div>
        <!-- 中心指针按钮 -->
        <div
          :class="['pointer', onRotation ? 'pointer-trans' : '']"
          @transitionend="afterTransitionend"
          @click="handleClick"
        >
          吃什么呢
        </div>
      </div>
    </div>

    <!-- 结果展示区 -->
    <div class="result">{{ result }}</div>

    <!-- 功能按钮区 -->
    <div class="random-button">
      <el-button @click="handleRandom">随机转盘配置</el-button>
      <el-button type="primary" plain @click="handleEditRandomList">自定义随机列表</el-button>
    </div>
    <el-button type="danger" plain @click="showEdit = true">自定义当前配置</el-button>

    <!-- 自定义当前配置弹窗 -->
    <el-dialog title="当前配置" v-model="showEdit" width="336px">
      <div class="content">
        <ul>
          <li class="popBox-list" v-for="(food, idx) in foodList" :key="idx">
            <span class="popBox-list__text">{{ food }}</span>
            <el-button size="small" @click="handleRandomOne(idx)">随机</el-button>
            <el-button size="small" type="primary" plain @click="handleEdit(idx)">修改</el-button>
          </li>
        </ul>
      </div>
    </el-dialog>

    <!-- 自定义随机列表弹窗 -->
    <el-dialog title="提示" v-model="dialogVisible" width="336px">
      <el-input
        type="textarea"
        :rows="10"
        placeholder="请输入内容"
        v-model="randomListText"
      ></el-input>
      <span style="font-size: 12px; text-align: left"
        >请使用空格对食物进行分隔，如：“牛肉 鸡排 汉堡”</span
      >
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveRandomList">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ElButton, ElDialog, ElInput, ElMessage, ElMessageBox } from 'element-plus'

// 路由判断 - 控制转盘显示
const route = useRoute()
const isFoodRotationRoute = ref(false)

const checkRoute = () => {
  isFoodRotationRoute.value = route.path === '/food-rotation'
}

onMounted(() => {
  checkRoute()
  handleRandom() // 初始化随机菜品
})

watch(route, checkRoute)

// 菜品数据
const foodList = ref([
  '北京烤鸭',
  '烧鸡',
  '快餐',
  '麻辣烫',
  '炒饭',
  '面',
  '寿司',
  '烤肉',
  '火锅',
  '饺子'
])
const onRotation = ref(false)
const result = ref('点击中间按钮看看今天吃啥')
const nextStatus = ref({})
const showEdit = ref(false)
const dialogVisible = ref(false)
const randomListText = ref('')

// 预设随机菜品库
const randomList = ref([
  '北京烤鸭',
  '泰餐',
  '寿司',
  '烧鸡',
  '盖浇饭',
  '砂锅',
  '大排档',
  '米线',
  '满汉全席',
  '西餐',
  '麻辣烫',
  '自助餐',
  '炒面',
  '快餐',
  '水果',
  '西北风',
  '馄饨',
  '火锅',
  '烧烤',
  '泡面',
  '速冻水饺',
  '日本料理',
  '涮羊肉',
  '味千拉面',
  '肯德基',
  '面包',
  '扬州炒饭',
  '茶餐厅',
  '海底捞',
  '咖啡',
  '比萨',
  '麦当劳',
  '兰州拉面',
  '沙县小吃',
  '烤鱼',
  '海鲜',
  '铁板烧',
  '韩国料理',
  '粥',
  '东南亚菜',
  '甜点',
  '农家菜',
  '川菜',
  '粤菜',
  '湘菜',
  '本帮菜',
  '竹笋烤肉'
])

// 工具函数
const randomNumBoth = (Min, Max) => {
  const Range = Max - Min
  const Rand = Math.random()
  return Min + Math.floor(Rand * Range)
}

// 转盘功能
const reset = () => {
  onRotation.value = false
  result.value = '   '
}

const getReward = () => {
  const pointer = document.querySelector('.pointer')
  const currentDeg = nextStatus.value.deg || 0
  const rotateDeg = Math.random() * 360 + 1080
  const totalDeg = currentDeg + rotateDeg
  const rewardIndex = Math.floor(((totalDeg + 18) % 360) / 36)
  const rewardText = foodList.value[rewardIndex]

  nextStatus.value = { deg: totalDeg, food: rewardText }
  pointer.style.transform = `rotateZ(${totalDeg}deg)`
}

const afterTransitionend = () => {
  setTimeout(() => {
    onRotation.value = false
    result.value = `就决定是你了！${nextStatus.value.food}`
  }, 300)
}

const handleClick = () => {
  if (onRotation.value) return
  reset()
  onRotation.value = true
  getReward()
}

// 配置函数
const handleRandom = () => {
  const newArr = [...randomList.value]
  foodList.value = foodList.value.map(() => {
    const randomIdx = randomNumBoth(0, newArr.length)
    const selected = newArr[randomIdx]
    newArr.splice(randomIdx, 1)
    return selected
  })

  if (nextStatus.value.deg) {
    const rewardIndex = Math.floor(((nextStatus.value.deg + 18) % 360) / 36)
    nextStatus.value.food = foodList.value[rewardIndex]
    result.value = `就决定是你了！${nextStatus.value.food}`
  }
}

const handleEditRandomList = () => {
  dialogVisible.value = true
  randomListText.value = randomList.value.join(' ')
}

const saveRandomList = () => {
  dialogVisible.value = false
  const newList = randomListText.value.split(' ').filter((item) => item.trim())
  if (newList.length) randomList.value = newList
}

const handleRandomOne = (index) => {
  const randomIdx = randomNumBoth(0, randomList.value.length)
  const newFood = randomList.value[randomIdx]
  foodList.value[index] = newFood

  if (nextStatus.value.food === foodList.value[index]) {
    nextStatus.value.food = newFood
    result.value = `就决定是你了！${newFood}`
  }

  ElMessage({ type: 'success', message: `已随机为: ${newFood}` })
}

const handleEdit = (index) => {
  ElMessageBox.prompt(`请输入需要替换【${foodList.value[index]}】的食物`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  })
    .then(({ value }) => {
      if (!value.trim()) return
      const oldFood = foodList.value[index]
      foodList.value[index] = value.trim()

      if (nextStatus.value.food === oldFood) {
        nextStatus.value.food = value.trim()
        result.value = `就决定是你了！${value.trim()}`
      }

      ElMessage({ type: 'success', message: `已修改为: ${value.trim()}` })
    })
    .catch(() => {
      ElMessage({ type: 'info', message: '取消修改' })
    })
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  border: none;
  outline: none;
  user-select: none;
}

#toEat {
  text-align: center;
  padding: 20px 0;
}

.wrapper {
  position: relative;
  height: 200px;
  width: 200px;
  padding: 20px;
  background-color: #ff5555;
  box-shadow: #000000 0px 0px 10px;
  border-radius: 50%;
  margin: 20px auto;
}

.light {
  position: absolute;
  height: 10px;
  width: 10px;
  border-radius: 50%;
  top: 5px;
  left: 115px;
  transform-origin: 5px 115px;
}

.light-twinkling {
  animation: 1s twinkling 3, 100ms 3s twinkling 3;
}

.light:nth-child(2n) {
  background-color: #fafce7;
}
.light:nth-child(2n + 1) {
  background-color: #ffe58b;
}
.light:nth-child(2) {
  transform: rotate(36deg);
}
.light:nth-child(3) {
  transform: rotate(72deg);
}
.light:nth-child(4) {
  transform: rotate(108deg);
}
.light:nth-child(5) {
  transform: rotate(144deg);
}
.light:nth-child(6) {
  transform: rotate(180deg);
}
.light:nth-child(7) {
  transform: rotate(216deg);
}
.light:nth-child(8) {
  transform: rotate(252deg);
}
.light:nth-child(9) {
  transform: rotate(288deg);
}
.light:nth-child(10) {
  transform: rotate(324deg);
}

.panel {
  position: relative;
  height: 200px;
  width: 200px;
  background-color: #b7b7b7;
  border-radius: 50%;
}

.sector {
  position: absolute;
  left: 100px;
  top: 0px;
  width: 100px;
  height: 200px;
  font-size: 14px;
  border-radius: 0px 100px 100px 0;
  overflow: hidden;
  transform-origin: left center;
}

.sector:nth-child(1) {
  transform: rotate(-18deg);
}
.sector:nth-child(2) {
  transform: rotate(18deg);
}
.sector:nth-child(3) {
  transform: rotate(54deg);
}
.sector:nth-child(4) {
  transform: rotate(90deg);
}
.sector:nth-child(5) {
  transform: rotate(126deg);
}
.sector:nth-child(6) {
  transform: rotate(162deg);
}
.sector:nth-child(7) {
  transform: rotate(198deg);
}
.sector:nth-child(8) {
  transform: rotate(234deg);
}
.sector:nth-child(9) {
  transform: rotate(270deg);
}
.sector:nth-child(10) {
  transform: rotate(306deg);
}

.sector:nth-child(2n + 1) .sector-inner {
  background: #fef6e0;
}
.sector:nth-child(2n) .sector-inner {
  background: #ffffff;
}

.sector-inner {
  text-align: center;
  display: block;
  width: 40px;
  padding: 5px 3px 0 57px;
  height: 195px;
  transform: translateX(-100px) rotate(36deg);
  transform-origin: right center;
  border-radius: 100px 0 0 100px;
}

.sector-inner span {
  display: block;
  transform-origin: center;
  transform: rotate(-19deg);
  color: #d46854;
  margin-top: 20px;
}

.pointer {
  position: absolute;
  left: 79px;
  top: 79px;
  z-index: 10;
  height: 30px;
  width: 30px;
  padding: 6px;
  color: #fff899;
  line-height: 15px;
  font-size: 12px;
  text-align: center;
  background-color: #ff5350;
  border-radius: 50%;
  border: 1px solid #ff5350;
  cursor: pointer;
}

.pointer::after {
  content: '';
  position: absolute;
  left: 14px;
  top: -24px;
  border-width: 12px 6px;
  border-style: solid;
  border-color: transparent;
  border-bottom-color: #ff5350;
}

.pointer-trans {
  transition: transform 3s cubic-bezier(0.2, 0.93, 0.43, 1);
}

.result {
  height: 50px;
  line-height: 50px;
  text-align: center;
  font-size: 16px;
  color: #333;
  margin: 0 auto;
}

.random-button {
  margin-bottom: 10px;
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
}

.popBox-list {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0;
  padding: 5px 0;
  border-bottom: 1px solid #f5f5f5;
}

.popBox-list__text {
  text-align: left;
  width: 170px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: #666;
}

@keyframes twinkling {
  50% {
    background: transparent;
  }
}

@media (max-width: 480px) {
  .wrapper {
    height: 180px;
    width: 180px;
    padding: 15px;
  }
  .panel {
    height: 180px;
    width: 180px;
  }
  .pointer {
    left: 70px;
    top: 70px;
    height: 28px;
    width: 28px;
    font-size: 11px;
  }
  .sector-inner span {
    font-size: 12px;
    margin-top: 15px;
  }
  .result {
    font-size: 14px;
    height: 40px;
    line-height: 40px;
  }
}
</style>
