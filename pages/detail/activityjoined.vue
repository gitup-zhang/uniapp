<template>
  <view class="page-container">
    <!-- 自定义导航栏 -->
    <view class="custom-navbar">
      <!-- 状态栏占位 -->
      <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
      <!-- 导航栏内容 -->
      <view class="navbar-content">
        <view class="navbar-left" @click="onBack">
          <text class="back-icon">←</text>
        </view>
        <view class="navbar-center">
          <text class="navbar-title">参加的活动</text>
        </view>
        <view class="navbar-right">
          <!-- 右侧可以放置其他操作按钮 -->
        </view>
      </view>
    </view>
    
    <!-- Tab栏 -->
    <view class="tab-bar">
      <view class="tab-bar-placeholder" :style="{ height: (statusBarHeight + 44) + 'px' }"></view>
      <view class="tab-container">
        <view 
          class="tab-item" 
          :class="{ active: activeTab === 'active' }"
          @click="switchTab('active')"
        >
          <text class="tab-text">未过期</text>
          <view class="tab-indicator" v-if="activeTab === 'active'"></view>
        </view>
        <view 
          class="tab-item" 
          :class="{ active: activeTab === 'expired' }"
          @click="switchTab('expired')"
        >
          <text class="tab-text">已过期</text>
          <view class="tab-indicator" v-if="activeTab === 'expired'"></view>
        </view>
      </view>
    </view>
    
    <!-- 内容区域 -->
    <view class="content-container">
      <!-- 占位区域，避免被导航栏和tab栏遮挡 -->
      <view class="content-placeholder" :style="{ height: (statusBarHeight + 44 + 50) + 'px' }"></view>
      
      <!-- 活动列表 - 统一使用scroll-view -->
      <scroll-view 
        class="activity-list" 
        scroll-y="true" 
        :show-scrollbar="false"
        :enable-back-to-top="false"
      >
        <view class="list-content">
          <view v-if="currentActivityList.length === 0" class="empty-state">
            <view class="empty-icon">📅</view>
            <text class="empty-text">{{ activeTab === 'active' ? '暂无未过期的活动' : '暂无已过期的活动' }}</text>
          </view>
          
          <view v-else class="activity-items">
            <ActivityTicketList
              v-for="activity in currentActivityList"
              :key="activity.id"
			  :status="activeTab" 
              :activityData="activity"
              @action="handleAction"
              @cancel="handleCancel"
            />
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue'
import ActivityTicketList from '@/components/ActivityTicket/ActivityTicketList.vue'// 根据你的实际路径调整
import { useInfoStore } from '@/store/Info.js'
import {cancelapply} from '@/new-apis/events.js'

const useinfo = useInfoStore()

// 获取系统状态栏高度
const statusBarHeight = ref(0)

// Tab相关状态
const activeTab = ref('active') // 'active' | 'expired'

// 活动列表数据
const activityList = ref([])
const expiredActivityList = ref([])

// 根据当前tab返回对应的活动列表
const currentActivityList = computed(() => {
  return activeTab.value === 'active' ? activityList.value : expiredActivityList.value
})

// 切换Tab
const switchTab = (tab) => {
  if (activeTab.value !== tab) {
    activeTab.value = tab
  }
}

// 页面加载时获取数据
onMounted(() => {
  // 获取系统信息
  const systemInfo = uni.getSystemInfoSync()
  statusBarHeight.value = systemInfo.statusBarHeight || 20
   // 加载活动数据
  loadActivityData()
})

// 加载活动数据
const loadActivityData = async () => {
  try {
     await useinfo.userapply()
    activityList.value = useinfo.applyactivity
    expiredActivityList.value = useinfo.applyactivityhistory
  } catch (error) {
    console.error('加载活动数据失败:', error)
    uni.showToast({
      title: '加载失败',
      icon: 'error'
    })
  }
}

// 处理主要操作（如签到）
const handleAction = (activityData) => {
  console.log('操作活动:', activityData)
  
  // 对已过期的活动不允许操作
  if (activeTab.value === 'expired') {
    uni.showToast({
      title: '活动已过期，无法操作',
      icon: 'none'
    })
    return
  }
  
  uni.showToast({
    title: `执行: ${activityData.statusText}`,
    icon: 'success'
  })
  
  // 这里添加你的具体业务逻辑
  // 比如跳转到签到页面、执行签到操作等
}

// 处理取消报名
const handleCancel = (activityData) => {
  console.log('取消报名:', activityData)
  
  // 对已过期的活动不允许取消报名
  if (activeTab.value === 'expired') {
    uni.showToast({
      title: '活动已过期，无法取消报名',
      icon: 'none'
    })
    return
  }
  
  uni.showModal({
    title: '确认取消',
    content: `确定要取消报名"${activityData.title}"吗？`,
    success: (res) => {
      if (res.confirm) {
        // 执行取消报名的逻辑
        cancelSignUp(activityData)
      }
    }
  })
}

// 取消报名的具体实现
const cancelSignUp = async (activityData) => {
  try {
    await cancelapply(activityData.id)
    loadActivityData()
    
    uni.showToast({
      title: '取消报名成功',
      icon: 'success'
    })
  } catch (error) {
    console.error('取消报名失败:', error)
    uni.showToast({
      title: '取消失败',
      icon: 'error'
    })
  }
}

// 返回函数
function onBack() {
  uni.navigateBack()
}
</script>

<style scoped>
@import "../../style/detail.css";

.page-container {
  height: 100vh;
  background: #f5f5f5;
}

.content-container {
  height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

/* 自定义导航栏样式 */
.custom-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: linear-gradient(135deg, #ff4757, #ff3742);
  box-shadow: 0 2rpx 10rpx rgba(255, 71, 87, 0.3);
}

.status-bar {
  width: 100%;
  background: transparent;
}

.navbar-content {
  height: 88rpx;
  display: flex;
  align-items: center;
  padding: 0 32rpx;
  position: relative;
}

.navbar-left {
  width: 88rpx;
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s ease;
}

.navbar-left:active {
  background-color: rgba(255, 255, 255, 0.1);
}

.back-icon {
  font-size: 40rpx;
  color: white;
  font-weight: bold;
  line-height: 1;
}

.navbar-center {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.navbar-title {
  font-size: 36rpx;
  font-weight: bold;
  color: white;
  text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
}

.navbar-right {
  width: 88rpx;
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Tab栏样式 */
.tab-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
  background: white;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.tab-bar-placeholder {
  width: 100%;
  background: transparent;
}

.tab-container {
  display: flex;
  height: 100rpx;
  background: white;
  border-bottom: 1rpx solid #f0f0f0;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.3s ease;
}

.tab-item:active {
  background-color: rgba(255, 71, 87, 0.05);
}

.tab-text {
  font-size: 30rpx;
  color: #666;
  font-weight: 500;
  transition: color 0.3s ease;
}

.tab-item.active .tab-text {
  color: #ff4757;
  font-weight: 600;
}

.tab-indicator {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60rpx;
  height: 6rpx;
  background: linear-gradient(135deg, #ff4757, #ff3742);
  border-radius: 3rpx;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    width: 0;
    opacity: 0;
  }
  to {
    width: 60rpx;
    opacity: 1;
  }
}

/* 简化后的列表样式 */
.activity-list {
  flex: 1;
  width: 100%;
}

.list-content {
  padding-bottom: 20rpx;
  box-sizing: border-box;
  min-height: 100%;
  display: flex;
  flex-direction: column;
}

.activity-items {
  flex: 1;
}

.content-placeholder {
  flex-shrink: 0;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  min-height: 60vh;
  padding: 40rpx;
}

/* 空状态样式 */
.empty-icon {
  font-size: 100rpx;
  margin-bottom: 20rpx;
  opacity: 0.5;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
  text-align: center;
}
</style>