<template>
  <view class="navbar" :style="{ paddingTop: statusBarHeight + 'px', height: navbarHeight + 'px' }">
    <view class="navbar-bg" />
    <view class="navbar-title">{{ props.title }}</view>
  </view>
</template>


<script setup>
import { ref, onMounted } from 'vue'
const props=defineProps(['title'])

const statusBarHeight = ref(20)
const navbarHeight = ref(64)

onMounted(() => {
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight
  navbarHeight.value = systemInfo.statusBarHeight + 44
})
</script>

<style scoped>
.navbar {
  position: relative;
  width: 100%;
  display: flex;
  align-items: flex-end;
  box-sizing: border-box;
  z-index: 1000;
  padding-left: 16px;
}
.navbar-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, #f43f3b, #ec008c);
  z-index: -1;
}
.navbar-title {
  font-size: 20px;
  font-weight: bold;
  color: white;
  margin-bottom: 10px;
  text-align: left;
}

</style>
