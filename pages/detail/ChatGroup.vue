<template>
  <view class="admin-message-container">
    <!-- 自定义导航栏 -->
    <view class="custom-navbar">
      <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
      <view class="nav-content">
        <view class="nav-left" @tap="goBack">
          <view class="back-btn">
            <text class="back-icon">‹</text>
          </view>
        </view>
        <view class="nav-center">
          <text class="nav-title">{{ groupName }}</text>
          <text class="nav-subtitle">管理员通知</text>
        </view>
        <view class="nav-right"></view>
      </view>
    </view>
	

    <!-- 消息列表区域 -->
    <scroll-view
      class="message-list"
      :style="{ marginTop: statusBarHeight + 38 + 'px' }"
      scroll-y="true"
      :scroll-into-view="scrollIntoView"
      :scroll-with-animation="true"
      :bounces="false"
    >
      <view class="message-list-content">
        <!-- 按日期分组显示消息 -->
        <template v-for="(group, dateKey) in groupedMessages" :key="dateKey">
          <view class="date-divider">
            <view class="date-line"></view>
            <text class="date-text">{{ dateKey }}</text>
            <view class="date-line"></view>
          </view>

          <!-- 使用管理员消息组件 -->
          <AdminMessage
            v-for="message in group"
            :key="message.id"
            :message="message"
            @messageClick="handleMessageClick"
            @actionClick="handleActionClick"
            @markRead="handleMarkRead"
          />
        </template>

        <!-- 没有消息提示 -->
        <view v-if="messages.length === 0 && !isLoading" class="empty-state">
          <view class="empty-icon">📢</view>
          <text class="empty-title">暂无管理员消息</text>
          <text class="empty-desc">管理员发布的通知消息将在这里显示</text>
        </view>
      </view>
    </scroll-view>

    <!-- 加载遮罩 -->
    <view v-if="isLoading" class="loading-overlay">
      <view class="loading-content">
        <view class="loading-spinner"></view>
        <text class="loading-text">加载中...</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import AdminMessage from '@/components/AdminMessage/AdminMessage.vue'

// 页面参数
const props = defineProps({
  id: String,
  groupName: String
})

// 页面状态
const statusBarHeight = ref(0)
const isLoading = ref(false)
const scrollIntoView = ref('')

// 群组信息
const groupId = ref('')
const groupName = ref('管理员通知')

// 消息相关
const messages = ref([])

// 生命周期
onMounted(async () => {
  const sysInfo = uni.getSystemInfoSync()
  statusBarHeight.value = sysInfo.statusBarHeight || 0
})

onLoad(async (options) => {
  groupId.value = options.id || ''
  groupName.value = decodeURIComponent(options.groupName || '管理员通知')
  
  await loadMessages()
})

onShow(() => {
  scrollToTop()
})

// 计算属性
const groupedMessages = computed(() => {
  const grouped = {}
  
  messages.value.forEach(message => {
    const date = new Date(message.created_at)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    let dateKey = ''
    if (isSameDay(date, today)) {
      dateKey = '今天'
    } else if (isSameDay(date, yesterday)) {
      dateKey = '昨天'
    } else if (date.getFullYear() === today.getFullYear()) {
      dateKey = `${date.getMonth() + 1}月${date.getDate()}日`
    } else {
      dateKey = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
    }
    
    if (!grouped[dateKey]) {
      grouped[dateKey] = []
    }
    grouped[dateKey].push(message)
  })
  
  return grouped
})

// 方法定义
const isSameDay = (date1, date2) => {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate()
}

const loadMessages = async () => {
  isLoading.value = true
  
  try {
    // 模拟包含媒体内容的管理员消息数据
    const mockMessages = generateMockAdminMessagesWithMedia()
    messages.value = mockMessages
    
  } catch (error) {
    console.error('加载消息失败:', error)
    uni.showToast({
      title: '加载消息失败',
      icon: 'error'
    })
  } finally {
    isLoading.value = false
  }
}

const generateMockAdminMessagesWithMedia = () => {
  const messageTypes = [
    { type: 'announcement', label: '公告' },
    { type: 'maintenance', label: '维护' },
    { type: 'event', label: '活动' },
    { type: 'security', label: '安全' },
    { type: 'update', label: '更新' }
  ]
  
  const mockMessages = []
  
  // 短内容消息
  mockMessages.push({
    id: 'msg_1',
    title: '系统维护完成',
    content: '系统维护已完成，感谢您的耐心等待。',
    type: 'maintenance',
    priority: 'normal',
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    sender_name: '系统管理员',
    read_status: 'read'
  })
  
  // 中等长度内容消息
  mockMessages.push({
    id: 'msg_2',
    title: '新功能上线通知',
    content: `亲爱的用户，我们很高兴地宣布，经过团队的不懈努力，新版本已正式上线！本次更新包含以下重要功能：

1. 全新的用户界面设计，提升用户体验
2. 增加了智能推荐功能
3. 优化了系统性能和稳定性
4. 修复了已知问题

请及时更新到最新版本，体验全新功能！`,
    type: 'update',
    priority: 'normal',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    sender_name: '系统管理员',
    read_status: 'unread'
  })
  
  // 长内容消息
  mockMessages.push({
    id: 'msg_3',
    title: '重要安全公告',
    content: `各位用户：

近期我们监测到网络上出现了一些针对我们平台的钓鱼网站和虚假信息，为了保护您的账户安全和个人信息，请务必注意以下几点：

一、官方渠道识别
1. 请认准我们的官方域名：example.com
2. 官方客服电话：400-123-4567
3. 官方微信公众号：ExampleApp
4. 官方QQ群：123456789

二、安全防护措施
1. 定期修改密码，建议使用强密码
2. 开启两步验证功能
3. 不要在公共网络环境下登录账户
4. 及时更新APP到最新版本

三、诈骗识别指南
1. 我们不会通过短信或邮件要求您提供密码
2. 任何要求转账或充值的信息都是诈骗
3. 官方客服不会主动联系要求提供验证码
4. 请勿点击来源不明的链接

四、紧急联系方式
如果您发现账户异常或遇到安全问题，请立即通过以下方式联系我们：
- 客服热线：400-123-4567（24小时服务）
- 在线客服：APP内"帮助与反馈"
- 官方邮箱：security@example.com

我们会持续加强安全防护措施，但也需要您的配合。请提高警惕，保护好自己的账户安全。如果您发现可疑活动，请及时举报。

感谢您的理解与支持！`,
    type: 'security',
    priority: 'high',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    sender_name: '安全团队',
    read_status: 'unread',
    actions: [
      { id: 'view_detail', type: 'primary', label: '查看详情', url: '/pages/security/detail' },
      { id: 'mark_read', type: 'secondary', label: '标记已读' }
    ]
  })
  
  // 包含图片的消息
  mockMessages.push({
    id: 'msg_4',
    title: '活动海报发布',
    content: `双十一购物狂欢节即将开始！查看活动详情：
[img:https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg]
活动时间：11月1日-11月11日
优惠力度：全场5折起！`,
    type: 'event',
    priority: 'normal',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    sender_name: '运营团队',
    read_status: 'read'
  })
  
  // 包含视频的消息
  mockMessages.push({
    id: 'msg_5',
    title: '新功能演示视频',
    content: `我们为大家准备了新功能的详细演示视频，快来看看吧：
[video:https://media.w3.org/2010/05/sintel/trailer.mp4]
视频时长：3分钟，建议在WiFi环境下观看。`,
    type: 'update',
    priority: 'normal',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    sender_name: '产品团队',
    read_status: 'unread'
  })
  
  // 包含多张图片的消息
  mockMessages.push({
    id: 'msg_6',
    title: '用户反馈处理结果',
    content: `感谢大家的反馈！我们已经完成了界面优化：
更新前：
[img:https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg]
更新后：
[img:https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg]
主要改进：界面更加简洁美观，操作更加便捷。`,
    type: 'update',
    priority: 'normal',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    sender_name: '设计团队',
    read_status: 'read'
  })
  
  // 纯图片消息
  mockMessages.push({
    id: 'msg_7',
    content: `[img:https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg]`,
    type: 'announcement',
    priority: 'normal',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    sender_name: '系统管理员',
    read_status: 'read'
  })
  
  return mockMessages.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
}

const scrollToTop = () => {
  nextTick(() => {
    if (messages.value.length > 0) {
      scrollIntoView.value = `msg-${messages.value[0].id}`
    }
  })
}

const goBack = () => {
  uni.navigateBack()
}

// 事件处理方法
const handleMessageClick = (message) => {
  // 处理消息点击事件 - 跳转到详情页
  uni.navigateTo({
    url: `/pages/admin-message/detail?id=${message.id}&title=${encodeURIComponent(message.title || '管理员通知')}`
  })
}

const handleActionClick = (action, message) => {
  // 处理操作按钮点击事件
  switch (action.type) {
    case 'primary':
      if (action.url) {
        uni.navigateTo({
          url: `${action.url}?id=${message.id}`
        })
      }
      break
    case 'secondary':
      if (action.id === 'mark_read') {
        markAsRead(message)
      }
      break
    default:
      uni.showToast({
        title: '操作成功',
        icon: 'success'
      })
  }
}

const handleMarkRead = (message) => {
  markAsRead(message)
}

const markAsRead = async (message) => {
  try {
    // 这里调用API标记消息为已读
    // await markMessageAsRead(message.id)
    
    // 更新本地状态
    const messageIndex = messages.value.findIndex(msg => msg.id === message.id)
    if (messageIndex !== -1) {
      messages.value[messageIndex].read_status = 'read'
    }
    
    uni.showToast({
      title: '已标记为已读',
      icon: 'success',
      duration: 1500
    })
    
  } catch (error) {
    console.error('标记已读失败:', error)
    uni.showToast({
      title: '操作失败',
      icon: 'error'
    })
  }
}
</script>

<style scoped>
.admin-message-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f8fafc;
}

/* 导航栏样式 */
.custom-navbar {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%);
  color: white;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  box-shadow: 0 2rpx 16rpx rgba(102, 126, 234, 0.3);
}

.status-bar {
  width: 100%;
}

.nav-content {
  height: 88rpx;
  display: flex;
  align-items: center;
  padding: 0 32rpx;
  position: relative;
}

.nav-left {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  transition: background-color 0.2s ease;
}

.nav-left:active {
  background-color: rgba(255, 255, 255, 0.1);
}

/* .back-icon {
  font-size: 48rpx;
  font-weight: 300;
  color: white;
} */
.back-btn {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(10rpx);
}

.back-btn:active {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(0.95);
}

.back-icon {
  font-size: 44rpx;
  color: white;
  font-weight: 300;
  margin-left: -4rpx;
}

.nav-center {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 32rpx;
}

.nav-title {
  font-size: 32rpx;
  font-weight: 600;
  color: white;
  line-height: 1.2;
}

.nav-subtitle {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 4rpx;
}

.nav-right {
  width: 60rpx;
}

/* 消息列表样式 */
.message-list {
  flex: 1;
  background: #f8fafc;
}

.message-list-content {
  padding: 32rpx 24rpx 100rpx;
}

/* 日期分隔线 */
.date-divider {
  display: flex;
  align-items: center;
  margin: 40rpx 0 32rpx;
}

.date-line {
  flex: 1;
  height: 2rpx;
  background: #e2e8f0;
}

.date-text {
  font-size: 24rpx;
  color: #64748b;
  padding: 0 24rpx;
  background: #f8fafc;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 40rpx;
  gap: 24rpx;
}

.empty-icon {
  font-size: 120rpx;
  opacity: 0.6;
}

.empty-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #334155;
}

.empty-desc {
  font-size: 26rpx;
  color: #64748b;
  text-align: center;
  line-height: 1.6;
}

/* 加载样式 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-content {
  background: white;
  border-radius: 24rpx;
  padding: 48rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24rpx;
  box-shadow: 0 16rpx 48rpx rgba(0, 0, 0, 0.2);
}

.loading-spinner {
  width: 60rpx;
  height: 60rpx;
  border: 6rpx solid #e2e8f0;
  border-top: 6rpx solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-text {
  font-size: 28rpx;
  color: #64748b;
  margin-top: 16rpx;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 响应式设计 */
@media (max-width: 750rpx) {
  .message-list-content {
    padding: 24rpx 16rpx 80rpx;
  }
}

/* 暗黑模式适配 */
@media (prefers-color-scheme: dark) {
  .admin-message-container {
    background: #0f172a;
  }
  
  .message-list {
    background: #0f172a;
  }
  
  .date-text {
    background: #0f172a;
    color: #64748b;
  }
  
  .date-line {
    background: #334155;
  }
  
  .empty-title {
    color: #f1f5f9;
  }
  
  .empty-desc {
    color: #94a3b8;
  }
  
  .loading-content {
    background: #1e293b;
  }
}
</style>