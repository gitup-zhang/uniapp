<template>
  <view class="container">
    <!-- 自定义导航栏 -->
    <view class="custom-navbar">
      <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
      <view class="nav-content">
        <text class="nav-title">消息</text>
      </view>
    </view>
    
    <!-- 固定筛选标签 -->
    <view class="filter-tabs-fixed" :style="{ top: statusBarHeight + 44 + 'px' }">
      <view class="tabs-container">
        <view 
          class="filter-tab" 
          :class="{ active: activeTab === 'all' }"
          @tap="switchTab('all')"
        >
          全部
           <view class="tab-badge" v-if="unreadCount > 0">{{ unreadCount > 99 ? '99+' : unreadCount }}</view>
        </view>
        <view 
          class="filter-tab" 
          :class="{ active: activeTab === 'system' }"
          @tap="switchTab('system')"
        >
          系统消息
            <view class="tab-badge" v-if="systemUnreadCount > 0">{{ systemUnreadCount }}</view>
        </view>
        <view 
          class="filter-tab" 
          :class="{ active: activeTab === 'group' }"
          @tap="switchTab('group')"
        >
          群组消息
           <view class="tab-badge" v-if="groupUnreadCount > 0">{{ groupUnreadCount }}</view>
        </view>
      </view>
      
      <!-- 一键已读按钮 -->
      <view 
        class="mark-all-read-btn" 
        @tap="markAllAsRead"
        v-if="unreadCount > 0"
      >
        <text class="mark-all-icon">✓</text>
        <text class="mark-all-text">全部已读</text>
      </view>
    </view>
    
    <!-- 消息列表 - 使用recycle-view优化长列表性能 -->
    <recycle-view
      class="message-list"
      :style="{ marginTop: statusBarHeight + 44 + 68 + 'px' }"
      :enable-back-to-top="true"
      :bounces="false"
      batch="8"
      cache="4"
    >
      <recycle-item 
        v-for="(msg, index) in filteredMessages" 
        :key="`msg-${msg.id}`"
        class="message-item-wrapper"
      >
        <view 
          class="message-item" 
          :class="messageItemClass(msg)"
          @tap="handleMessageTap(msg, index)"
        >
          <!-- 消息类型指示器 - 简化 -->
          <view class="message-indicator">
            <view class="indicator-dot" :class="msg.type"></view>
          </view>
          
          <!-- 头像/图标 - 优化图片加载 -->
          <view class="avatar-container">
            <image 
              v-if="msg.type === 'group'" 
              :src="msg.avatar" 
              class="avatar group-avatar"
              mode="aspectFill"
              :lazy-load="true"
              :fade-show="false"
              @error="handleAvatarError"
            />
            <view v-else class="system-icon">
              <text class="icon">📢</text>
            </view>
            <!-- 简化未读小红点 -->
            <view v-if="!msg.isRead" class="unread-badge"></view>
          </view>
          
          <!-- 消息内容 - 优化布局 -->
          <view class="msg-content">
            <!-- 标题行 - 单独一行确保不被遮挡 -->
            <view class="msg-title-row">
              <text class="msg-title">{{ msg.title }}</text>
              <view class="msg-priority" v-if="msg.priority === 'high'">
                
              </view>
            </view>
            
            <!-- 消息简介 -->
            <text class="msg-brief">{{ msg.brief }}</text>
            
            <!-- 底部信息行 -->
            <view class="msg-footer">
              <view class="msg-meta">
                <text class="msg-time">{{ formatTime(msg.time) }}</text>
                <text v-if="msg.type === 'group'" class="member-count">{{ msg.memberCount }}人</text>
              </view>
              <view class="msg-source">
                <text v-if="msg.type === 'system'" class="tag system-tag">系统消息</text>
                <text v-else class="tag group-tag">{{ msg.groupName }}</text>
              </view>
            </view>
          </view>
          
          <!-- 右侧操作 - 简化 -->
          <view class="msg-actions">
            <view class="action-btn" @tap.stop="toggleRead(msg, index)">
              <text class="action-icon">{{ msg.isRead ? '📖' : '👁️' }}</text>
            </view>
            <text class="chevron-icon">›</text>
          </view>
        </view>
      </recycle-item>
      
      <!-- 空状态 -->
      <view v-if="filteredMessages.length === 0" class="empty">
        <view class="empty-icon">💬</view>
        <text class="empty-title">{{ getEmptyTitle() }}</text>
        <text class="empty-desc">{{ getEmptyDesc() }}</text>
      </view>
    </recycle-view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// 响应式数据
const statusBarHeight = ref(0)
const activeTab = ref('all')

const messages = ref([
  {
    id: 1,
    type: 'system',
    title: '系统通知',
    brief: '您有一条新的系统消息，请及时查收。新功能已上线，快来体验吧！',
    time: '2025-07-30 14:30',
    isRead: false,
    priority: 'high'
  },
  {
    id: 2,
    type: 'system',
    title: '维护公告',
    brief: '系统将于今晚22:00-23:00进行维护升级，期间可能影响使用。',
    time: '2025-07-30 10:15',
    isRead: true,
    priority: 'normal'
  },
  {
    id: 3,
    type: 'group',
    title: '前端开发技术分享会报名开始',
    brief: '本次分享会将围绕Vue3最新特性、性能优化技巧以及实战案例进行深入讲解，适合有一定基础的前端开发者参与...',
    avatar: '/static/group1.png',
    groupName: '技术交流',
    memberCount: 128,
    time: '2025-07-30 16:45',
    isRead: false,
    priority: 'normal'
  },
  {
    id: 4,
    type: 'group',
    title: 'Vue.js 3.4版本更新说明',
    brief: 'Vue.js团队正式发布了3.4版本，新增了多项重要特性：响应式系统优化、组合式API增强、性能提升等...',
    avatar: '/static/group2.png',
    groupName: '学习讨论',
    memberCount: 56,
    time: '2025-07-30 12:20',
    isRead: true,
    priority: 'normal'
  },
  {
    id: 5,
    type: 'group',
    title: '新项目技术方案讨论会议通知',
    brief: '关于下一个项目的技术栈选择和架构设计，将在明天上午10点召开讨论会议，请相关同事准时参加...',
    avatar: '/static/group3.png',
    groupName: '工作协作',
    memberCount: 15,
    time: '2025-07-29 18:30',
    isRead: false,
    priority: 'high'
  },
  {
    id: 6,
    type: 'group',
    title: '前端开发技术分享会报名开始报名开始宿舍还是',
    brief: '本次分享会将围绕Vue3最新特性、性能优化技巧以及实战案例进行深入讲解，适合有一定基础的前端开发者参与...',
    avatar: '/static/group1.png',
    groupName: '技术交流',
    memberCount: 128,
    time: '2025-07-30 16:45',
    isRead: false,
    priority: 'normal'
  },
  {
    id: 7,
    type: 'group',
    title: 'Vue.js 3.4版本更新说明',
    brief: 'Vue.js团队正式发布了3.4版本，新增了多项重要特性：响应式系统优化、组合式API增强、性能提升等...',
    avatar: '/static/group2.png',
    groupName: '学习讨论',
    memberCount: 56,
    time: '2025-07-30 12:20',
    isRead: true,
    priority: 'normal'
  },
  {
    id: 8,
    type: 'group',
    title: '新项目技术方案讨论会议通知新建西安报名手速还使其Iis',
    brief: '关于下一个项目的技术栈选择和架构设计，将在明天上午10点召开讨论会议，请相关同事准时参加...',
    avatar: '/static/group3.png',
    groupName: '工作协作',
    memberCount: 15,
    time: '2025-07-29 18:30',
    isRead: false,
    priority: 'high'
  }
])

// 计算属性
const filteredMessages = computed(() => {
  if (activeTab.value === 'all') {
    return messages.value
  }
  return messages.value.filter(msg => msg.type === activeTab.value)
})

const unreadCount = computed(() => {
  return messages.value.filter(msg => !msg.isRead).length
})

const systemUnreadCount = computed(() => {
  return messages.value.filter(msg => msg.type === 'system' && !msg.isRead).length
})

const groupUnreadCount = computed(() => {
  return messages.value.filter(msg => msg.type === 'group' && !msg.isRead).length
})

// 生命周期
onMounted(() => {
  const sysInfo = uni.getSystemInfoSync()
  statusBarHeight.value = sysInfo.statusBarHeight
})

// 方法 - 优化class计算
const messageItemClass = (msg) => {
  const classes = []
  if (msg.type === 'system') classes.push('system-message')
  if (msg.type === 'group') classes.push('group-message')
  if (!msg.isRead) classes.push('unread')
  return classes.join(' ')
}

const switchTab = (tab) => {
  activeTab.value = tab
}

const handleMessageTap = (msg, index) => {
  // 标记为已读
  if (!msg.isRead) {
    const messageIndex = messages.value.findIndex(m => m.id === msg.id)
    messages.value[messageIndex].isRead = true
  }
  
  // 跳转到详情页面
  if (msg.type === 'system') {
    uni.navigateTo({
      url: `/pages/system-message/index?id=${msg.id}`
    })
  } else {
    uni.navigateTo({
      url: `/pages/group-chat/index?groupId=${msg.id}`
    })
  }
}

const toggleRead = (msg, index) => {
  const messageIndex = messages.value.findIndex(m => m.id === msg.id)
  messages.value[messageIndex].isRead = !msg.isRead
}

// 优化时间格式化 - 缓存结果
const timeCache = new Map()
const formatTime = (time) => {
  if (timeCache.has(time)) {
    return timeCache.get(time)
  }
  
  const now = new Date()
  const msgTime = new Date(time)
  const diff = now - msgTime
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  let result
  if (days === 0) {
    const hours = Math.floor(diff / (1000 * 60 * 60))
    if (hours === 0) {
      const minutes = Math.floor(diff / (1000 * 60))
      result = minutes <= 0 ? '刚刚' : `${minutes}分钟前`
    } else {
      result = `${hours}小时前`
    }
  } else if (days === 1) {
    result = '昨天'
  } else if (days <= 7) {
    result = `${days}天前`
  } else {
    result = time.split(' ')[0]
  }
  
  timeCache.set(time, result)
  return result
}

const handleAvatarError = () => {
  console.log('头像加载失败')
}

const getEmptyTitle = () => {
  const titles = {
    all: '暂无消息',
    system: '暂无系统消息',
    group: '暂无群组消息'
  }
  return titles[activeTab.value]
}

const getEmptyDesc = () => {
  const descs = {
    all: '目前还没有任何消息',
    system: '暂时没有系统通知',
    group: '您还未加入任何群组'
  }
  return descs[activeTab.value]
}

const markAllAsRead = () => {
  const currentMessages = activeTab.value === 'all' 
    ? messages.value 
    : messages.value.filter(msg => msg.type === activeTab.value)
  
  currentMessages.forEach(msg => {
    if (!msg.isRead) {
      const messageIndex = messages.value.findIndex(m => m.id === msg.id)
      if (messageIndex !== -1) {
        messages.value[messageIndex].isRead = true
      }
    }
  })
  
  // 显示成功提示
  uni.showToast({
    title: `已标记${currentMessages.filter(msg => !msg.isRead).length || '所有'}条消息为已读`,
    icon: 'success',
    duration: 1500
  })
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f6fa;
}

/* 自定义导航栏 */
.custom-navbar {
  background-color: #ff4757;
  color: white;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 999;
}

.status-bar {
  width: 100%;
}

.nav-content {
  height: 44px;
  display: flex;
  align-items: center;
  padding-left: 16px;
}

.nav-title {
  font-size: 18px;
  font-weight: bold;
}

/* 固定筛选标签 - 重新布局 */
.filter-tabs-fixed {
  position: fixed;
  left: 0;
  width: 100%;
  z-index: 998;
  background: #f5f6fa;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(0,0,0,0.05);
}

.tabs-container {
  display: flex;
  gap: 8px;
}

.filter-tab {
  padding: 8px 16px;
  background: white;
  border-radius: 20px;
  font-size: 14px;
  color: #666;
  border: 2px solid transparent;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  position: relative;
}

.filter-tab.active {
  background: #903749;
  color: white;
  box-shadow: 0 4px 12px rgba(144, 55, 73, 0.3);
}

.tab-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  background: #ff4757;
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  border: 2px solid white;
}

/* 一键已读按钮 */
.mark-all-read-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
  color: white;
  font-size: 13px;
  font-weight: 600;
}

.mark-all-read-btn:active {
  transform: scale(0.95);
  box-shadow: 0 1px 4px rgba(16, 185, 129, 0.4);
}

.mark-all-icon {
  font-size: 14px;
  font-weight: bold;
}

.mark-all-text {
  font-size: 12px;
}

/* 消息列表 - 使用recycle-view优化 */
.message-list {
  flex: 1;
  background: #f5f6fa;
  padding: 0 16px;
  padding-bottom: 20px;
}

.message-item-wrapper {
  margin-bottom: 12px;
}

/* 消息项 - 现代卡片设计 */
.message-item {
  background: white;
  border-radius: 16px;
  padding: 18px;
  display: flex;
  align-items: flex-start;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #f0f2f5;
  position: relative;
  overflow: hidden;
}

.message-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(180deg, #e9ecef 0%, #dee2e6 100%);
}

.message-item.system-message {
  background: linear-gradient(135deg, rgba(255, 107, 107, 0.03) 0%, rgba(238, 90, 36, 0.02) 100%);
  border-color: rgba(255, 107, 107, 0.08);
}

.message-item.system-message::before {
  background: linear-gradient(180deg, #ff6b6b 0%, #ee5a24 100%);
  box-shadow: 0 0 8px rgba(255, 107, 107, 0.3);
}

.message-item.group-message {
  background: linear-gradient(135deg, rgba(72, 52, 212, 0.03) 0%, rgba(102, 126, 234, 0.02) 100%);
  border-color: rgba(72, 52, 212, 0.08);
}

.message-item.group-message::before {
  background: linear-gradient(180deg, #4834d4 0%, #667eea 100%);
  box-shadow: 0 0 8px rgba(72, 52, 212, 0.3);
}

.message-item.unread {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.03) 0%, rgba(34, 197, 94, 0.02) 100%);
  border-color: rgba(16, 185, 129, 0.12);
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.08);
}

.message-item.unread::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 0;
  height: 0;
  border-left: 20px solid transparent;
  border-top: 20px solid #10b981;
  opacity: 0.1;
}

/* 消息指示器 - 现代化设计 */
.message-indicator {
  margin-right: 14px;
  padding-top: 6px;
}

.indicator-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #e9ecef;
  position: relative;
}

.indicator-dot::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: white;
}

.indicator-dot.system {
  background: linear-gradient(45deg, #ff6b6b 0%, #ee5a24 100%);
  box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);
}

.indicator-dot.group {
  background: linear-gradient(45deg, #4834d4 0%, #667eea 100%);
  box-shadow: 0 2px 8px rgba(72, 52, 212, 0.3);
}

/* 头像容器 - 优化设计 */
.avatar-container {
  position: relative;
  margin-right: 14px;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  border: 2px solid #f8f9fa;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.group-avatar {
  border-color: rgba(72, 52, 212, 0.15);
}

.system-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.25);
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.system-icon .icon {
  font-size: 20px;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
}

/* 显眼的未读小红点 */
.unread-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 16px;
  height: 16px;
  background: linear-gradient(135deg, #ff4757 0%, #ff3838 100%);
  border-radius: 50%;
  border: 3px solid white;
  box-shadow: 0 2px 8px rgba(255, 71, 87, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.unread-badge::before {
  content: '';
  width: 6px;
  height: 6px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* 消息内容 - 重新布局 */
.msg-content {
  flex: 1;
  min-width: 0;
}

/* 标题行 - 独立一行 */
.msg-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
  gap: 12px;
}

.msg-title {
  font-weight: 600;
  font-size: 16px;
  color: #1a202c;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.3;
}

.msg-priority {
  flex-shrink: 0;
}

.msg-brief {
  color: #4a5568;
  font-size: 14px;
  line-height: 1.4;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 底部信息行 */
.msg-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.msg-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.msg-time {
  color: #718096;
  font-weight: 500;
}

.member-count {
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  color: #4a5568;
  padding: 2px 8px;
  border-radius: 8px;
  font-weight: 500;
  border: 1px solid #e2e8f0;
}

.msg-source {
  flex-shrink: 0;
}

.tag {
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 12px;
  font-weight: 600;
  letter-spacing: 0.3px;
  line-height: 1;
}

.system-tag {
  background: linear-gradient(135deg, rgba(255, 107, 107, 0.15) 0%, rgba(238, 90, 36, 0.1) 100%);
  color: #dc2626;
  border: 1px solid rgba(255, 107, 107, 0.2);
}

.group-tag {
  background: linear-gradient(135deg, rgba(72, 52, 212, 0.15) 0%, rgba(102, 126, 234, 0.1) 100%);
  color: #4338ca;
  border: 1px solid rgba(72, 52, 212, 0.2);
}

.priority-tag {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(217, 119, 6, 0.1) 100%);
  color: #d97706;
  border: 1px solid rgba(245, 158, 11, 0.2);
}

/* 右侧操作 - 现代化操作区 */
.msg-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 12px;
}

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.action-btn:active {
  transform: scale(0.95);
  background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e0 100%);
}

.action-icon {
  font-size: 14px;
}

.chevron-icon {
  font-size: 20px;
  color: #a0aec0;
  font-weight: bold;
  opacity: 0.6;
}

/* 空状态 */
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 20px;
  text-align: center;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 12px;
  opacity: 0.3;
}

.empty-title {
  font-size: 16px;
  font-weight: 500;
  color: #495057;
  margin-bottom: 6px;
}

.empty-desc {
  font-size: 13px;
  color: #adb5bd;
}
</style>