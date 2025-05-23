<template>
  <view class="navbar" :style="{ paddingTop: statusBarHeight + 'px', height: navbarHeight + 'px' }">
    <!-- 背景图片层 -->
    <image class="navbar-bg" src="/static/Background 4.png" mode="aspectFill" />

    <!-- 标题层 -->
    <view class="navbar-title">政府政策与行业新闻助手</view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const statusBarHeight = ref(20)
const navbarHeight = ref(70)

onMounted(() => {
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight
  navbarHeight.value = systemInfo.statusBarHeight + 80
})
</script>

<style scoped>
.navbar {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  box-sizing: border-box;
  z-index: 1000;
  overflow: hidden;
}
.navbar-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}
.navbar-title {
  font-size: 20px;
  font-weight: bold;
  color: white;
  margin-bottom: 10px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}
</style>
