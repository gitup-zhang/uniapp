<template>
  <view class="system-message-page">
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
          <text class="nav-title">系统消息</text>
        </view>
        <view class="nav-right">
          <view class="message-count" v-if="messages.length > 0">
            <text class="count-text"></text>
          </view>
        </view>
      </view>
    </view>

    <!-- 消息列表 -->
    <scroll-view
      class="message-list"
      :style="{ marginTop: statusBarHeight + 48 + 'px' }"
      scroll-y="true"
      :bounces="true"
      :refresher-enabled="true"
      :refresher-triggered="isRefreshing"
      @refresherrefresh="handleRefresh"
      @refresherrestore="handleRefreshRestore"
      @scrolltolower="loadMore"
    >
      <view class="list-wrapper">
        <!-- 加载状态 -->
        <view v-if="isLoading && messages.length === 0" class="loading-container">
          <view class="loading-spinner"></view>
          <text class="loading-text">正在加载消息...</text>
        </view>

        <!-- 消息列表 -->
        <view v-else class="messages-container">
          <!-- 消息项 -->
          <view 
            v-for="(message, index) in messages" 
            :key="message.id"
            class="message-item"
            :class="{ 'expanded': message.expanded }"
          >
            <!-- 消息卡片 -->
            <view class="message-card">
              <!-- 装饰线条 -->
              <view class="decoration-line"></view>
              
              <!-- 消息头部 -->
              <view class="message-header">
                <view class="message-icon">
                  <text class="icon-text">📢</text>
                </view>
                <view class="header-content">
                  <text class="message-title">{{ message.title }}</text>
                  <text class="message-time">{{ formatTime(message.time) }}</text>
                </view>
              </view>

              <!-- 消息内容区域 -->
              <view class="message-body">
                <!-- 短内容直接显示 -->
                <view v-if="getContentType(message.content) === 'short'" class="content-wrapper">
                  <text class="content-text">{{ message.content }}</text>
                </view>

                <!-- 中等长度内容可折叠 -->
                <view v-else-if="getContentType(message.content) === 'medium'" class="content-wrapper">
                  <text 
                    class="content-text" 
                    :class="{ 'content-collapsed': !message.expanded }"
                  >
                    {{ message.content }}
                  </text>
                  
                  <!-- 折叠/展开控制 -->
                  <view class="toggle-section">
                    <view class="fade-mask" v-if="!message.expanded"></view>
                    <view class="toggle-btn" @tap="toggleContent(index)">
                      <text class="toggle-text">{{ message.expanded ? '收起' : '展开' }}</text>
                      <view class="toggle-icon" :class="{ 'rotated': message.expanded }">
                        <text class="icon-arrow">▼</text>
                      </view>
                    </view>
                  </view>
                </view>

                <!-- 超长内容显示预览 -->
                <view v-else class="content-wrapper">
                  <text class="content-preview">{{ getPreviewText(message.content) }}</text>
                  
                  <view class="action-section">
                    <view class="detail-btn" @tap="viewFullContent(message)">
                      <view class="btn-content">
                        <text class="btn-text">查看完整内容</text>
                        <view class="btn-arrow">
                          <text class="arrow-icon">→</text>
                        </view>
                      </view>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>

          <!-- 加载更多 -->
          <view v-if="hasMore" class="load-more-section">
            <view v-if="isLoadingMore" class="loading-more">
              <view class="loading-spinner small"></view>
              <text class="loading-text">加载更多消息...</text>
            </view>
            <view v-else class="load-more-trigger" @tap="loadMore">
              <view class="load-trigger-btn">
                <text class="trigger-text">加载更多消息</text>
                <view class="trigger-icon">
                  <text class="icon-plus">+</text>
                </view>
              </view>
            </view>
          </view>

          <!-- 无更多数据 -->
          <view v-else-if="messages.length > 0" class="no-more-section">
            <view class="no-more-line"></view>
            <text class="no-more-text">已显示全部消息</text>
            <view class="no-more-line"></view>
          </view>
        </view>

        <!-- 空状态 -->
        <view v-if="!isLoading && messages.length === 0" class="empty-state">
          <view class="empty-illustration">
            <view class="empty-circle">
              <text class="empty-icon">📭</text>
            </view>
          </view>
          <text class="empty-title">暂无系统消息</text>
          <text class="empty-desc">系统重要通知会在这里显示</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'

// 响应式数据
const statusBarHeight = ref(0)
const isLoading = ref(false)
const isRefreshing = ref(false)
const isLoadingMore = ref(false)
const hasMore = ref(true)
const currentPage = ref(1)
const messages = ref([])

// 内容长度配置
const CONTENT_CONFIG = {
  SHORT_LIMIT: 80,     // 短内容限制（字符数）
  MEDIUM_LIMIT: 300,   // 中等内容限制
  PREVIEW_LENGTH: 120, // 预览内容长度
  COLLAPSE_HEIGHT: 3   // 折叠时显示行数
}

// 生命周期
onMounted(async () => {
  const sysInfo = uni.getSystemInfoSync()
  statusBarHeight.value = sysInfo.statusBarHeight || 0
})

onLoad(async (options) => {
  await loadMessages()
})

// 方法定义
const loadMessages = async (page = 1) => {
  if (page === 1) {
    isLoading.value = true
  } else {
    isLoadingMore.value = true
  }

  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 800)) // 模拟网络延迟
    const mockMessages = generateMockMessages(page)
    
    if (page === 1) {
      messages.value = mockMessages.map(msg => ({
        ...msg,
        expanded: false
      }))
    } else {
      messages.value.push(...mockMessages.map(msg => ({
        ...msg,
        expanded: false
      })))
    }

    hasMore.value = page < 3
    currentPage.value = page

  } catch (error) {
    console.error('加载消息失败:', error)
    uni.showToast({
      title: '加载失败，请重试',
      icon: 'none',
      duration: 2000
    })
  } finally {
    isLoading.value = false
    isLoadingMore.value = false
  }
}

const generateMockMessages = (page) => {
  const messages = []
  const baseId = (page - 1) * 8

  const messageTemplates = [
    {
      title: '系统维护通知',
      shortContent: '系统将于今晚23:00进行维护升级，预计2小时完成。',
      mediumContent: '尊敬的用户，系统将于今晚23:00-次日01:00进行例行维护升级。维护期间，部分功能可能暂时无法使用，包括登录、支付、数据同步等。我们建议您提前保存工作进度，避免数据丢失。维护完成后，系统性能将得到显著提升，感谢您的理解与支持。如有紧急问题，请联系在线客服。',
      longContent: '尊敬的用户，为了给您提供更优质的服务体验，我们将于今晚23:00至次日01:00进行系统全面维护升级。本次维护涉及服务器硬件升级、数据库性能优化、安全系统更新、新功能模块部署等多个方面。维护期间，以下功能将暂时无法使用：用户登录注册、在线支付交易、文件上传下载、实时消息推送、数据报表生成、第三方接口调用等核心服务。为确保您的数据安全，我们强烈建议您在维护开始前及时保存所有工作进度，备份重要数据，并退出系统。维护完成后，系统将实现以下改进：响应速度提升60%以上、并发处理能力增强3倍、数据安全等级提升至金融级标准、新增智能推荐功能、优化移动端用户体验。预计维护将按时完成，如遇特殊情况需要延长维护时间，我们会第一时间通过短信、邮件等方式通知您。维护期间给您带来的不便，我们深表歉意。如有任何紧急问题或疑问，请通过以下方式联系我们：24小时客服热线400-888-6666、紧急邮箱emergency@example.com、官方微信客服。感谢您一直以来的信任与支持！'
    },
    {
      title: '安全提醒通知',
      shortContent: '检测到您的账户存在异常登录行为，请及时检查。',
      mediumContent: '安全提醒：我们的风控系统检测到您的账户在北京地区有异常登录记录，时间为今日14:30。如果这是您本人操作，请忽略此消息。如果不是您本人操作，请立即修改密码，启用双重验证，并检查账户资金安全。我们建议定期更换密码，使用复杂密码组合，不在公共场所登录账户。',
      longContent: '重要安全提醒：我们的智能风控系统在今日14:30:25检测到您的账户出现异常登录行为。具体信息如下：登录地点：北京市朝阳区（IP:120.244.xxx.xxx）、设备信息：Windows 10专业版Chrome浏览器、登录状态：成功登录并进行了部分操作。系统同时检测到以下异常特征：登录地点与您常用地点不符、设备指纹信息陌生、登录时间段异常、操作行为模式与平时差异较大。如果这是您本人的正常操作，请点击确认安全按钮，系统将记录此次登录为安全行为。如果这不是您本人操作，说明您的账户可能已被他人盗用，请立即采取以下安全措施：1.立即修改账户密码，建议使用包含大小写字母、数字、特殊符号的强密码；2.启用双重验证功能，绑定手机号码和邮箱；3.检查并清除可疑登录设备；4.修改密保问题和答案；5.检查账户资金变动和重要信息修改记录；6.如发现任何损失，请立即联系客服进行处理。为了您的账户安全，我们建议：定期更换密码（建议每3个月一次）、不要在公共网络或设备上登录、开启登录短信提醒功能、定期查看账户安全报告。如需帮助，请联系7×24小时安全专线：400-666-8888。'
    },
    {
      title: '新功能上线公告',
      shortContent: '全新的智能推荐功能已正式上线，快来体验吧！',
      mediumContent: '好消息！经过3个月的精心开发，全新的AI智能推荐系统现已正式上线！新功能基于深度学习算法，能够根据您的使用习惯和偏好，为您推荐最相关的内容和服务。同时，我们还优化了界面设计，提升了系统响应速度，增加了夜间模式等实用功能。赶快更新到最新版本，体验更智能、更便捷的服务吧！',
      longContent: '重大更新公告！经过我们产品团队3个月的潜心研发和精心打磨，基于最新AI技术的智能推荐系统现已正式发布上线！本次更新是我们产品历史上最重要的里程碑之一，将为您带来前所未有的个性化体验。核心功能亮点：1.AI智能推荐引擎：采用先进的深度学习和神经网络算法，通过分析您的浏览历史、操作习惯、兴趣标签等多维度数据，实现99.7%准确率的个性化内容推荐；2.实时学习能力：系统会根据您的每一次点击、停留时间、分享行为等实时调整推荐策略，越用越懂您；3.多场景适配：支持首页推荐、搜索联想、相关推荐、跨品类推荐等多种场景，全方位提升使用体验；4.隐私保护：所有个性化分析均在本地进行，绝不上传个人隐私数据，确保信息安全。界面体验升级：全新Material You设计语言、支持深色/浅色主题自动切换、优化动画效果和交互反馈、提升页面加载速度50%、新增手势操作和快捷键支持。功能增强：新增批量操作、增强搜索功能、支持多格式文件预览、优化移动端适配、增加无障碍支持。立即更新：您可以通过应用商店搜索更新，或在设置中检查版本更新。首次使用时，系统会引导您完成个性化设置，整个过程仅需3分钟。我们相信这次更新将为您带来全新的使用体验，如有任何问题或建议，欢迎通过意见反馈渠道与我们联系。感谢您的支持与信任！'
    }
  ]

  for (let i = 0; i < 8; i++) {
    const template = messageTemplates[i % messageTemplates.length]
    const contentType = i % 3 // 0: short, 1: medium, 2: long
    
    let content = ''
    switch (contentType) {
      case 0:
        content = template.shortContent
        break
      case 1:
        content = template.mediumContent
        break
      case 2:
        content = template.longContent
        break
    }

    messages.push({
      id: `msg_${baseId + i + 1}`,
      title: template.title,
      content: content,
      time: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
    })
  }

  return messages
}

const getContentType = (content) => {
  if (!content) return 'short'
  
  const length = content.length
  if (length <= CONTENT_CONFIG.SHORT_LIMIT) {
    return 'short'
  } else if (length <= CONTENT_CONFIG.MEDIUM_LIMIT) {
    return 'medium'
  } else {
    return 'long'
  }
}

const getPreviewText = (content) => {
  if (!content) return ''
  return content.length > CONTENT_CONFIG.PREVIEW_LENGTH 
    ? content.substring(0, CONTENT_CONFIG.PREVIEW_LENGTH) + '...'
    : content
}

const toggleContent = (index) => {
  messages.value[index].expanded = !messages.value[index].expanded
}

const viewFullContent = (message) => {
  // 跳转到消息详情页
  uni.navigateTo({
    url: `/pages/message-detail/index?id=${message.id}&title=${encodeURIComponent(message.title)}`
  })
}

const formatTime = (timeStr) => {
  if (!timeStr) return ''
  
  try {
    const time = new Date(timeStr)
    const now = new Date()
    const diff = now - time
    
    if (diff < 60000) {
      return '刚刚'
    } else if (diff < 3600000) {
      return `${Math.floor(diff / 60000)}分钟前`
    } else if (diff < 86400000) {
      return `${Math.floor(diff / 3600000)}小时前`
    } else if (diff < 604800000) {
      return `${Math.floor(diff / 86400000)}天前`
    } else {
      const month = String(time.getMonth() + 1).padStart(2, '0')
      const date = String(time.getDate()).padStart(2, '0')
      const hours = String(time.getHours()).padStart(2, '0')
      const minutes = String(time.getMinutes()).padStart(2, '0')
      
      if (time.getFullYear() === now.getFullYear()) {
        return `${month}-${date} ${hours}:${minutes}`
      } else {
        return `${time.getFullYear()}-${month}-${date}`
      }
    }
  } catch (error) {
    return String(timeStr)
  }
}

const handleRefresh = async () => {
  isRefreshing.value = true
  try {
    await loadMessages(1)
    uni.showToast({
      title: '刷新成功',
      icon: 'success',
      duration: 1500
    })
  } catch (error) {
    uni.showToast({
      title: '刷新失败',
      icon: 'error'
    })
  } finally {
    isRefreshing.value = false
  }
}

const handleRefreshRestore = () => {
  isRefreshing.value = false
}

const loadMore = async () => {
  if (!hasMore.value || isLoadingMore.value) return
  await loadMessages(currentPage.value + 1)
}

const goBack = () => {
  uni.navigateBack()
}
</script>

<style scoped>
.system-message-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #fff5f5 0%, #fef2f2 100%);
}

/* 导航栏 */
.custom-navbar {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  box-shadow: 0 8rpx 32rpx rgba(239, 68, 68, 0.3);
}

.nav-content {
  height: 88rpx;
  display: flex;
  align-items: center;
  padding: 0 32rpx;
}

.nav-left, .nav-right {
  width: 80rpx;
  display: flex;
  align-items: center;
}

.nav-right {
  justify-content: flex-end;
}

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
  justify-content: center;
}

.nav-title {
  font-size: 36rpx;
  font-weight: 600;
  color: white;
  text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.message-count {
  background: rgba(255, 255, 255, 0.25);
  border-radius: 20rpx;
  padding: 8rpx 16rpx;
  backdrop-filter: blur(10rpx);
  border: 2rpx solid rgba(255, 255, 255, 0.3);
}

.count-text {
  font-size: 24rpx;
  color: white;
  font-weight: 600;
}

/* 消息列表 */
.message-list {
  flex: 1;
  height: 100vh;
}

.list-wrapper {
  padding: 32rpx 24rpx 100rpx;
}

/* 加载状态 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400rpx;
  gap: 32rpx;
}

.loading-spinner {
  width: 64rpx;
  height: 64rpx;
  border: 4rpx solid rgba(239, 68, 68, 0.1);
  border-left: 4rpx solid #ef4444;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-spinner.small {
  width: 48rpx;
  height: 48rpx;
  border-width: 3rpx;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 28rpx;
  color: #9ca3af;
  font-weight: 500;
}

/* 消息容器 */
.messages-container {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

/* 消息项 */
.message-item {
  animation: fadeInUp 0.6s ease forwards;
  opacity: 0;
  transform: translateY(30rpx);
}

.message-item:nth-child(1) { animation-delay: 0.1s; }
.message-item:nth-child(2) { animation-delay: 0.2s; }
.message-item:nth-child(3) { animation-delay: 0.3s; }
.message-item:nth-child(4) { animation-delay: 0.4s; }

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 消息卡片 */
.message-card {
  background: white;
  border-radius: 24rpx;
  overflow: hidden;
  box-shadow: 0 8rpx 32rpx rgba(239, 68, 68, 0.08);
  border: 2rpx solid rgba(239, 68, 68, 0.05);
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.message-card:hover {
  transform: translateY(-4rpx);
  box-shadow: 0 16rpx 48rpx rgba(239, 68, 68, 0.15);
  border-color: rgba(239, 68, 68, 0.1);
}

/* 装饰线条 */
.decoration-line {
  height: 6rpx;
  background: linear-gradient(90deg, #ef4444 0%, #f87171 50%, #fca5a5 100%);
}

/* 消息头部 */
.message-header {
  display: flex;
  align-items: center;
  padding: 32rpx 32rpx 16rpx;
}

.message-icon {
  width: 80rpx;
  height: 80rpx;
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24rpx;
  border: 3rpx solid rgba(239, 68, 68, 0.1);
}

.icon-text {
  font-size: 32rpx;
}

.header-content {
  flex: 1;
}

.message-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #1f2937;
  line-height: 1.4;
  margin-bottom: 8rpx;
  letter-spacing: 0.5rpx;
}

.message-time {
  font-size: 24rpx;
  color: #6b7280;
  font-weight: 500;
}

/* 消息内容 */
.message-body {
  padding: 0 32rpx 32rpx;
}

.content-wrapper {
  position: relative;
}

.content-text {
  font-size: 28rpx;
  line-height: 1.8;
  color: #374151;
  text-align: justify;
  word-break: break-word;
}

/* 折叠状态的内容 */
.content-collapsed {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  position: relative;
}

/* 渐变遮罩 */
.fade-mask {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60rpx;
  background: linear-gradient(transparent, white);
  pointer-events: none;
}

/* 切换按钮区域 */
.toggle-section {
  position: relative;
  margin-top: 24rpx;
}

.toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  padding: 16rpx 24rpx;
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  border-radius: 50rpx;
  border: 2rpx solid rgba(239, 68, 68, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.toggle-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(239, 68, 68, 0.1), transparent);
  transition: left 0.6s ease;
}

.toggle-btn:active::before {
  left: 100%;
}

.toggle-btn:active {
  transform: scale(0.98);
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
}

.toggle-text {
  font-size: 26rpx;
  color: #ef4444;
  font-weight: 600;
}

.toggle-icon {
  transition: transform 0.3s ease;
}

.toggle-icon.rotated {
  transform: rotate(180deg);
}

.icon-arrow {
  font-size: 20rpx;
  color: #ef4444;
}

/* 预览内容 */
.content-preview {
  font-size: 28rpx;
  line-height: 1.8;
  color: #374151;
  text-align: justify;
  margin-bottom: 24rpx;
}

/* 操作区域 */
.action-section {
  display: flex;
  justify-content: center;
}

.detail-btn {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border-radius: 50rpx;
  padding: 20rpx 32rpx;
  box-shadow: 0 8rpx 24rpx rgba(239, 68, 68, 0.3);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.detail-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.6s ease;
}

.detail-btn:active::before {
  left: 100%;
}

.detail-btn:active {
  transform: scale(0.95);
  box-shadow: 0 4rpx 16rpx rgba(239, 68, 68, 0.4);
}

.btn-content {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.btn-text {
  font-size: 28rpx;
  color: white;
  font-weight: 600;
}

.btn-arrow {
  transition: transform 0.3s ease;
}

.detail-btn:active .btn-arrow {
  transform: translateX(4rpx);
}

.arrow-icon {
  font-size: 24rpx;
  color: white;
  font-weight: bold;
}

/* 加载更多区域 */
.load-more-section {
  display: flex;
  justify-content: center;
  padding: 48rpx 0;
}

.loading-more {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.load-more-trigger {
  display: flex;
  justify-content: center;
}

.load-trigger-btn {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 20rpx 40rpx;
  background: white;
  border: 3rpx solid #fee2e2;
  border-radius: 50rpx;
  transition: all 0.3s ease;
  box-shadow: 0 4rpx 16rpx rgba(239, 68, 68, 0.1);
}

.load-trigger-btn:active {
  transform: scale(0.95);
  border-color: #fca5a5;
  background: #fef2f2;
}

.trigger-text {
  font-size: 28rpx;
  color: #ef4444;
  font-weight: 600;
}

.trigger-icon {
  width: 32rpx;
  height: 32rpx;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-plus {
  font-size: 20rpx;
  color: white;
  font-weight: bold;
}

/* 无更多数据 */
.no-more-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24rpx;
  padding: 48rpx 0;
}

.no-more-line {
  flex: 1;
  height: 2rpx;
  background: linear-gradient(90deg, transparent, #fee2e2, transparent);
}

.no-more-text {
  font-size: 26rpx;
  color: #9ca3af;
  font-weight: 500;
  white-space: nowrap;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  gap: 32rpx;
}

.empty-illustration {
  position: relative;
}

.empty-circle {
  width: 200rpx;
  height: 200rpx;
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 50%, #fecaca 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  animation: float 3s ease-in-out infinite;
  box-shadow: 0 16rpx 48rpx rgba(239, 68, 68, 0.15);
}

.empty-circle::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 4rpx solid rgba(239, 68, 68, 0.1);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10rpx); }
}

@keyframes pulse {
  0%, 100% { 
    transform: scale(1);
    opacity: 0.3;
  }
  50% { 
    transform: scale(1.1);
    opacity: 0.1;
  }
}

.empty-icon {
  font-size: 80rpx;
}

.empty-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #374151;
  text-align: center;
}

.empty-desc {
  font-size: 28rpx;
  color: #9ca3af;
  text-align: center;
  line-height: 1.6;
  max-width: 400rpx;
}

/* 响应式设计 */
@media (max-width: 750rpx) {
  .list-wrapper {
    padding: 24rpx 16rpx 100rpx;
  }
  
  .message-header {
    padding: 24rpx 24rpx 12rpx;
  }
  
  .message-body {
    padding: 0 24rpx 24rpx;
  }
  
  .message-icon {
    width: 64rpx;
    height: 64rpx;
    margin-right: 16rpx;
  }
  
  .icon-text {
    font-size: 28rpx;
  }
  
  .message-title {
    font-size: 30rpx;
  }
  
  .content-text, .content-preview {
    font-size: 26rpx;
  }
  
  .empty-circle {
    width: 160rpx;
    height: 160rpx;
  }
  
  .empty-icon {
    font-size: 64rpx;
  }
}

/* 暗黑模式支持 */
@media (prefers-color-scheme: dark) {
  .system-message-page {
    background: linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%);
  }
  
  .message-card {
    background: #1f2937;
    border-color: rgba(239, 68, 68, 0.2);
    box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.3);
  }
  
  .message-card:hover {
    box-shadow: 0 16rpx 48rpx rgba(0, 0, 0, 0.4);
    border-color: rgba(239, 68, 68, 0.3);
  }
  
  .message-title {
    color: #f9fafb;
  }
  
  .content-text, .content-preview {
    color: #d1d5db;
  }
  
  .message-time {
    color: #9ca3af;
  }
  
  .message-icon {
    background: linear-gradient(135deg, #2d1b1b 0%, #3c2626 100%);
    border-color: rgba(239, 68, 68, 0.2);
  }
  
  .toggle-btn {
    background: linear-gradient(135deg, #2d1b1b 0%, #3c2626 100%);
    border-color: rgba(239, 68, 68, 0.2);
  }
  
  .toggle-btn:active {
    background: linear-gradient(135deg, #3c2626 0%, #4a2c2c 100%);
  }
  
  .fade-mask {
    background: linear-gradient(transparent, #1f2937);
  }
  
  .load-trigger-btn {
    background: #1f2937;
    border-color: rgba(239, 68, 68, 0.2);
  }
  
  .load-trigger-btn:active {
    background: #2d1b1b;
    border-color: rgba(239, 68, 68, 0.3);
  }
  
  .empty-circle {
    background: linear-gradient(135deg, #2d1b1b 0%, #3c2626 50%, #4a2c2c 100%);
  }
  
  .empty-title {
    color: #f9fafb;
  }
  
  .empty-desc {
    color: #9ca3af;
  }
  
  .no-more-line {
    background: linear-gradient(90deg, transparent, rgba(239, 68, 68, 0.2), transparent);
  }
}

/* 高级动画效果 */
.message-card {
  position: relative;
  overflow: hidden;
}

.message-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg, 
    transparent, 
    rgba(239, 68, 68, 0.03), 
    transparent
  );
  transition: left 0.8s ease;
}

.message-card:hover::before {
  left: 100%;
}

/* 平滑滚动 */
.message-list {
  scroll-behavior: smooth;
}

/* 触摸优化 */
.back-btn,
.toggle-btn,
.detail-btn,
.load-trigger-btn {
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}

/* 无障碍支持 */
@media (prefers-reduced-motion: reduce) {
  .message-item,
  .empty-circle,
  .loading-spinner {
    animation: none;
  }
  
  .message-card,
  .toggle-btn,
  .detail-btn {
    transition: none;
  }
}

/* 高分辨率屏幕优化 */
@media (-webkit-min-device-pixel-ratio: 2) {
  .decoration-line {
    height: 3px;
  }
  
  .message-card {
    border-width: 1px;
  }
}

/* 横屏适配 */
@media (orientation: landscape) and (max-height: 500px) {
  .empty-state {
    height: 40vh;
  }
  
  .empty-circle {
    width: 120rpx;
    height: 120rpx;
  }
  
  .empty-icon {
    font-size: 48rpx;
  }
}
</style>