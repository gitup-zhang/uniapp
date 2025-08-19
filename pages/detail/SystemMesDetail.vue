<template>
  <view class="message-detail-page">
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
          <text class="nav-title">消息详情</text>
        </view>
        <view class="nav-right">
          <!-- <view class="action-btn" @tap="shareMessage">
            <text class="action-icon">⊙</text>
          </view> -->
        </view>
      </view>
    </view>

    <!-- 详情内容 -->
    <scroll-view 
      class="detail-content"
      :style="{ marginTop: statusBarHeight + 48 + 'px' }"
      scroll-y="true"
      :bounces="true"
    >
      <view class="content-wrapper">
        <!-- 加载状态 -->
        <view v-if="isLoading" class="loading-container">
          <view class="loading-spinner"></view>
          <text class="loading-text">正在加载详情...</text>
        </view>

        <!-- 详情卡片 -->
        <view v-else-if="messageDetail" class="detail-card">
          <!-- 装饰线条 -->
          <view class="decoration-line"></view>
          
          <!-- 消息头部信息 -->
          <view class="message-header">
            <view class="header-icon-wrapper">
              <view class="message-icon">
                <text class="icon-text">📢</text>
              </view>
              <view class="icon-glow"></view>
            </view>
            
            <view class="header-info">
              <text class="message-title">{{ messageDetail.title }}</text>
              <view class="meta-info">
                <view class="meta-item">
                  <text class="meta-label">发布时间</text>
                  <text class="meta-value">{{ formatTime(messageDetail.time) }}</text>
                </view>
                <view class="meta-item" v-if="messageDetail.sender">
                  <text class="meta-label">发送方</text>
                  <text class="meta-value">{{ messageDetail.sender }}</text>
                </view>
                <view class="meta-item" v-if="messageDetail.category">
                  <text class="meta-label">类别</text>
                  <view class="category-tag">
                    <text class="category-text">{{ messageDetail.category }}</text>
                  </view>
                </view>
              </view>
            </view>
          </view>

          <!-- 重要性标识 -->
          <view v-if="messageDetail.priority" class="priority-section">
            <view class="priority-indicator" :class="`priority-${messageDetail.priority}`">
              <view class="priority-icon">
                <text class="priority-text">{{ getPriorityIcon(messageDetail.priority) }}</text>
              </view>
              <text class="priority-label">{{ getPriorityLabel(messageDetail.priority) }}</text>
            </view>
          </view>

          <!-- 消息正文 -->
          <view class="message-body">
            <view class="content-section">
              <text class="content-text" :class="{ 'large-text': isLargeText }">{{ messageDetail.content }}</text>
            </view>

            <!-- 附件信息 -->
           <!-- <view v-if="messageDetail.attachments && messageDetail.attachments.length > 0" class="attachments-section">
              <view class="section-title">
                <text class="title-text">相关附件</text>
              </view>
              <view class="attachments-list">
                <view 
                  v-for="(attachment, index) in messageDetail.attachments" 
                  :key="index"
                  class="attachment-item"
                  @tap="previewAttachment(attachment)"
                >
                  <view class="attachment-icon">
                    <text class="attachment-type">{{ getFileIcon(attachment.type) }}</text>
                  </view>
                  <view class="attachment-info">
                    <text class="attachment-name">{{ attachment.name }}</text>
                    <text class="attachment-size">{{ formatFileSize(attachment.size) }}</text>
                  </view>
                  <view class="attachment-action">
                    <text class="action-text">预览</text>
                  </view>
                </view>
              </view>
            </view> -->

            <!-- 相关链接 -->
            <!-- <view v-if="messageDetail.links && messageDetail.links.length > 0" class="links-section">
              <view class="section-title">
                <text class="title-text">相关链接</text>
              </view>
              <view class="links-list">
                <view 
                  v-for="(link, index) in messageDetail.links" 
                  :key="index"
                  class="link-item"
                  @tap="openLink(link.url)"
                >
                  <view class="link-icon">
                    <text class="link-symbol">🔗</text>
                  </view>
                  <view class="link-info">
                    <text class="link-title">{{ link.title }}</text>
                    <text class="link-desc">{{ link.description }}</text>
                  </view>
                  <view class="link-arrow">
                    <text class="arrow-icon">→</text>
                  </view>
                </view>
              </view>
            </view> -->
          </view>

          <!-- 操作按钮区域 -->
          <!-- <view class="action-section">
            <view class="action-buttons">
              <view class="action-btn-item" @tap="markAsRead">
                <view class="btn-icon">
                  <text class="btn-icon-text">✓</text>
                </view>
                <text class="btn-text">标记已读</text>
              </view>
              
              <view class="action-btn-item" @tap="collectMessage">
                <view class="btn-icon">
                  <text class="btn-icon-text">⭐</text>
                </view>
                <text class="btn-text">收藏消息</text>
              </view>
              
              <view class="action-btn-item" @tap="shareMessage">
                <view class="btn-icon">
                  <text class="btn-icon-text">↗</text>
                </view>
                <text class="btn-text">分享消息</text>
              </view>
            </view> -->
    <!--      </view> -->

          <!-- 底部信息 -->
          <!-- <view class="footer-info">
            <view class="info-item">
              <text class="info-label">消息ID：</text>
              <text class="info-value">{{ messageDetail.id }}</text>
            </view>
            <view class="info-item" v-if="messageDetail.readCount">
              <text class="info-label">阅读次数：</text>
              <text class="info-value">{{ messageDetail.readCount }}</text>
            </view>
          </view> -->
        </view>

        <!-- 错误状态 -->
        <view v-else class="error-state">
          <view class="error-illustration">
            <view class="error-circle">
              <text class="error-icon">❌</text>
            </view>
          </view>
          <text class="error-title">加载失败</text>
          <text class="error-desc">消息内容加载失败，请检查网络后重试</text>
          <view class="retry-btn" @tap="loadMessageDetail">
            <text class="retry-text">重新加载</text>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 底部浮动按钮 -->
    <!-- <view class="floating-actions" v-if="!isLoading && messageDetail">
      <view class="float-btn primary" @tap="handlePrimaryAction">
        <text class="float-btn-text">{{ messageDetail.actionText || '确认已读' }}</text>
      </view>
    </view> -->
  </view>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'

// 响应式数据
const statusBarHeight = ref(0)
const isLoading = ref(false)
const messageDetail = ref(null)
const messageId = ref('')
const messageTitle = ref('')

// 计算属性
const isLargeText = computed(() => {
  return messageDetail.value?.content?.length > 500
})

// 生命周期
onMounted(() => {
  const sysInfo = uni.getSystemInfoSync()
  statusBarHeight.value = sysInfo.statusBarHeight || 0
})

onLoad((options) => {
  messageId.value = options.id || ''
  messageTitle.value = decodeURIComponent(options.title || '')
  loadMessageDetail()
})

// 方法定义
const loadMessageDetail = async () => {
  isLoading.value = true
  
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 模拟详情数据
    messageDetail.value = {
      id: messageId.value || 'msg_001',
      title: messageTitle.value || '系统维护通知',
      content: `尊敬的用户，为了给您提供更优质的服务体验，我们将于今晚23:00至次日01:00进行系统全面维护升级。本次维护涉及服务器硬件升级、数据库性能优化、安全系统更新、新功能模块部署等多个方面。

维护期间，以下功能将暂时无法使用：
• 用户登录注册
• 在线支付交易  
• 文件上传下载
• 实时消息推送
• 数据报表生成
• 第三方接口调用

为确保您的数据安全，我们强烈建议您在维护开始前及时保存所有工作进度，备份重要数据，并退出系统。

维护完成后，系统将实现以下改进：
✓ 响应速度提升60%以上
✓ 并发处理能力增强3倍
✓ 数据安全等级提升至金融级标准
✓ 新增智能推荐功能
✓ 优化移动端用户体验

预计维护将按时完成，如遇特殊情况需要延长维护时间，我们会第一时间通过短信、邮件等方式通知您。维护期间给您带来的不便，我们深表歉意。

如有任何紧急问题或疑问，请通过以下方式联系我们：
• 24小时客服热线：400-888-6666
• 紧急邮箱：emergency@example.com  
• 官方微信客服

感谢您一直以来的信任与支持！`,
      time: new Date().toISOString(),
      sender: '系统管理员',
      category: '系统通知',
      priority: 'high',
      readCount: 1247,
      actionText: '确认知悉',
      attachments: [
        {
          name: '维护详细计划.pdf',
          type: 'pdf',
          size: 2048000
        },
        {
          name: '功能更新说明.docx',
          type: 'doc',
          size: 1536000
        }
      ],
      links: [
        {
          title: '官方帮助中心',
          description: '查看更多常见问题解答',
          url: 'https://help.example.com'
        },
        {
          title: '服务状态页面',
          description: '实时监控系统运行状态',
          url: 'https://status.example.com'
        }
      ]
    }

  } catch (error) {
    console.error('加载消息详情失败:', error)
    messageDetail.value = null
  } finally {
    isLoading.value = false
  }
}

const formatTime = (timeStr) => {
  if (!timeStr) return ''
  
  try {
    const time = new Date(timeStr)
    const year = time.getFullYear()
    const month = String(time.getMonth() + 1).padStart(2, '0')
    const date = String(time.getDate()).padStart(2, '0')
    const hours = String(time.getHours()).padStart(2, '0')
    const minutes = String(time.getMinutes()).padStart(2, '0')
    const seconds = String(time.getSeconds()).padStart(2, '0')
    
    return `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`
  } catch (error) {
    return String(timeStr)
  }
}

const getPriorityIcon = (priority) => {
  const icons = {
    low: '📘',
    medium: '📙', 
    high: '📕',
    urgent: '🚨'
  }
  return icons[priority] || '📘'
}

const getPriorityLabel = (priority) => {
  const labels = {
    low: '一般',
    medium: '重要',
    high: '紧急',
    urgent: '特急'
  }
  return labels[priority] || '一般'
}

const getFileIcon = (type) => {
  const icons = {
    pdf: '📄',
    doc: '📝',
    docx: '📝',
    xls: '📊',
    xlsx: '📊',
    ppt: '📺',
    pptx: '📺',
    txt: '📃',
    image: '🖼️',
    zip: '📦'
  }
  return icons[type] || '📁'
}

const formatFileSize = (bytes) => {
  if (!bytes) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

const goBack = () => {
  uni.navigateBack()
}

const shareMessage = () => {
  uni.showActionSheet({
    itemList: ['复制链接', '分享到微信', '分享到QQ'],
    success: (res) => {
      const actions = ['复制链接', '分享到微信', '分享到QQ']
      uni.showToast({
        title: `${actions[res.tapIndex]}成功`,
        icon: 'success'
      })
    }
  })
}

const markAsRead = () => {
  uni.showToast({
    title: '已标记为已读',
    icon: 'success'
  })
}

const collectMessage = () => {
  uni.showToast({
    title: '已收藏消息',
    icon: 'success'
  })
}

const previewAttachment = (attachment) => {
  uni.showToast({
    title: `预览 ${attachment.name}`,
    icon: 'none'
  })
}

const openLink = (url) => {
  uni.showToast({
    title: '正在跳转...',
    icon: 'loading'
  })
}

const handlePrimaryAction = () => {
  uni.showModal({
    title: '确认操作',
    content: '确认已阅读并知悉此消息内容？',
    success: (res) => {
      if (res.confirm) {
        uni.showToast({
          title: '操作成功',
          icon: 'success'
        })
        setTimeout(() => {
          goBack()
        }, 1500)
      }
    }
  })
}
</script>

<style scoped>
.message-detail-page {
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

.back-btn, .action-btn {
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

.back-btn:active, .action-btn:active {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(0.95);
}

.back-icon, .action-icon {
  font-size: 44rpx;
  color: white;
  font-weight: 300;
}

.back-icon {
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

/* 详情内容 */
.detail-content {
  flex: 1;
  height: 100vh;
}

.content-wrapper {
  padding: 32rpx 24rpx 200rpx;
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

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 28rpx;
  color: #9ca3af;
  font-weight: 500;
}

/* 详情卡片 */
.detail-card {
  background: white;
  border-radius: 24rpx;
  overflow: hidden;
  box-shadow: 0 8rpx 32rpx rgba(239, 68, 68, 0.08);
  border: 2rpx solid rgba(239, 68, 68, 0.05);
  animation: fadeInUp 0.6s ease forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 装饰线条 */
.decoration-line {
  height: 6rpx;
  background: linear-gradient(90deg, #ef4444 0%, #f87171 50%, #fca5a5 100%);
}

/* 消息头部 */
.message-header {
  display: flex;
  align-items: flex-start;
  padding: 40rpx 32rpx 24rpx;
  gap: 24rpx;
}

.header-icon-wrapper {
  position: relative;
  flex-shrink: 0;
}

.message-icon {
  width: 96rpx;
  height: 96rpx;
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3rpx solid rgba(239, 68, 68, 0.1);
  position: relative;
  z-index: 2;
}

.icon-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120rpx;
  height: 120rpx;
  background: radial-gradient(circle, rgba(239, 68, 68, 0.1) 0%, transparent 70%);
  border-radius: 50%;
  animation: pulse 3s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { 
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.5;
  }
  50% { 
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0.2;
  }
}

.icon-text {
  font-size: 36rpx;
}

.header-info {
  flex: 1;
}

.message-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #1f2937;
  line-height: 1.4;
  margin-bottom: 20rpx;
  letter-spacing: 0.5rpx;
}

.meta-info {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.meta-label {
  font-size: 24rpx;
  color: #6b7280;
  font-weight: 500;
  min-width: 120rpx;
}

.meta-value {
  font-size: 26rpx;
  color: #374151;
  font-weight: 600;
}

.category-tag {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border-radius: 20rpx;
  padding: 6rpx 16rpx;
}

.category-text {
  font-size: 22rpx;
  color: white;
  font-weight: 600;
}

/* 重要性标识 */
.priority-section {
  padding: 0 32rpx 24rpx;
}

.priority-indicator {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 16rpx 24rpx;
  border-radius: 16rpx;
  border: 2rpx solid;
}

.priority-low {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  border-color: #60a5fa;
}

.priority-medium {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-color: #f59e0b;
}

.priority-high {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  border-color: #ef4444;
}

.priority-urgent {
  background: linear-gradient(135deg, #fde2e7 0%, #fbb6ce 100%);
  border-color: #ec4899;
}

.priority-icon {
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.priority-text {
  font-size: 24rpx;
}

.priority-label {
  font-size: 26rpx;
  font-weight: 600;
}

.priority-low .priority-label { color: #1d4ed8; }
.priority-medium .priority-label { color: #d97706; }
.priority-high .priority-label { color: #dc2626; }
.priority-urgent .priority-label { color: #be185d; }

/* 消息正文 */
.message-body {
  padding: 0 32rpx 32rpx;
}

.content-section {
  margin-bottom: 32rpx;
}

.content-text {
  font-size: 30rpx;
  line-height: 1.8;
  color: #374151;
  text-align: justify;
  word-break: break-word;
  white-space: pre-wrap;
}

.content-text.large-text {
  font-size: 28rpx;
  line-height: 1.7;
}

/* 区域标题 */
.section-title {
  margin-bottom: 20rpx;
  padding-bottom: 12rpx;
  border-bottom: 3rpx solid #fee2e2;
}

.title-text {
  font-size: 30rpx;
  font-weight: 700;
  color: #ef4444;
}

/* 附件区域 */
.attachments-section {
  margin-bottom: 32rpx;
}

.attachments-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.attachment-item {
  display: flex;
  align-items: center;
  padding: 20rpx;
  background: #f9fafb;
  border-radius: 16rpx;
  border: 2rpx solid #e5e7eb;
  transition: all 0.3s ease;
}

.attachment-item:active {
  background: #f3f4f6;
  border-color: #d1d5db;
  transform: scale(0.98);
}

.attachment-icon {
  width: 64rpx;
  height: 64rpx;
  background: white;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.attachment-type {
  font-size: 28rpx;
}

.attachment-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}

.attachment-name {
  font-size: 28rpx;
  color: #374151;
  font-weight: 600;
}

.attachment-size {
  font-size: 24rpx;
  color: #6b7280;
}

.attachment-action {
  padding: 12rpx 20rpx;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border-radius: 20rpx;
}

.action-text {
  font-size: 24rpx;
  color: white;
  font-weight: 600;
}

/* 链接区域 */
.links-section {
  margin-bottom: 32rpx;
}

.links-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.link-item {
  display: flex;
  align-items: center;
  padding: 20rpx;
  background: #f9fafb;
  border-radius: 16rpx;
  border: 2rpx solid #e5e7eb;
  transition: all 0.3s ease;
}

.link-item:active {
  background: #f3f4f6;
  border-color: #d1d5db;
  transform: scale(0.98);
}

.link-icon {
  width: 64rpx;
  height: 64rpx;
  background: white;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.link-symbol {
  font-size: 28rpx;
}

.link-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}

.link-title {
  font-size: 28rpx;
  color: #374151;
  font-weight: 600;
}

.link-desc {
  font-size: 24rpx;
  color: #6b7280;
  line-height: 1.4;
}

.link-arrow {
  width: 40rpx;
  height: 40rpx;
  background: #ef4444;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.arrow-icon {
  font-size: 20rpx;
  color: white;
  font-weight: bold;
}

/* 操作按钮区域 */
.action-section {
  padding: 32rpx 0;
  border-top: 2rpx solid #fee2e2;
}

.action-buttons {
  display: flex;
  justify-content: space-around;
}

.action-btn-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
  padding: 20rpx;
  transition: all 0.3s ease;
}

.action-btn-item:active {
  transform: scale(0.95);
}

.btn-icon {
  width: 80rpx;
  height: 80rpx;
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3rpx solid rgba(239, 68, 68, 0.1);
}

.btn-icon-text {
  font-size: 32rpx;
}

.btn-text {
  font-size: 24rpx;
  color: #374151;
  font-weight: 600;
}

/* 底部信息 */
.footer-info {
  padding: 24rpx 0 0;
  border-top: 2rpx solid #f3f4f6;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.info-label {
  font-size: 24rpx;
  color: #6b7280;
  font-weight: 500;
}

.info-value {
  font-size: 24rpx;
  color: #9ca3af;
  font-family: 'Monaco', 'Menlo', monospace;
}

/* 错误状态 */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  gap: 32rpx;
}

.error-illustration {
  position: relative;
}

.error-circle {
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

.error-circle::before {
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

.error-icon {
  font-size: 80rpx;
}

.error-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #374151;
  text-align: center;
}

.error-desc {
  font-size: 28rpx;
  color: #9ca3af;
  text-align: center;
  line-height: 1.6;
  max-width: 400rpx;
}

.retry-btn {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border-radius: 50rpx;
  padding: 20rpx 40rpx;
  box-shadow: 0 8rpx 24rpx rgba(239, 68, 68, 0.3);
  transition: all 0.3s ease;
}

.retry-btn:active {
  transform: scale(0.95);
  box-shadow: 0 4rpx 16rpx rgba(239, 68, 68, 0.4);
}

.retry-text {
  font-size: 28rpx;
  color: white;
  font-weight: 600;
}

/* 底部浮动按钮 */
.floating-actions {
  position: fixed;
  bottom: 40rpx;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
}

.float-btn {
  padding: 24rpx 48rpx;
  border-radius: 50rpx;
  box-shadow: 0 12rpx 32rpx rgba(239, 68, 68, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.float-btn.primary {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

.float-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.6s ease;
}

.float-btn:active::before {
  left: 100%;
}

.float-btn:active {
  transform: translateX(-50%) scale(0.95);
  box-shadow: 0 8rpx 24rpx rgba(239, 68, 68, 0.4);
}

.float-btn-text {
  font-size: 32rpx;
  color: white;
  font-weight: 700;
  text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
}

/* 响应式设计 */
@media (max-width: 750rpx) {
  .content-wrapper {
    padding: 24rpx 16rpx 200rpx;
  }
  
  .message-header {
    padding: 32rpx 24rpx 20rpx;
    gap: 20rpx;
  }
  
  .message-body {
    padding: 0 24rpx 24rpx;
  }
  
  .message-icon {
    width: 80rpx;
    height: 80rpx;
  }
  
  .icon-glow {
    width: 100rpx;
    height: 100rpx;
  }
  
  .icon-text {
    font-size: 32rpx;
  }
  
  .message-title {
    font-size: 32rpx;
  }
  
  .content-text {
    font-size: 28rpx;
  }
  
  .content-text.large-text {
    font-size: 26rpx;
  }
  
  .error-circle {
    width: 160rpx;
    height: 160rpx;
  }
  
  .error-icon {
    font-size: 64rpx;
  }
  
  .floating-actions {
    bottom: 30rpx;
  }
}

/* 暗黑模式支持 */
@media (prefers-color-scheme: dark) {
  .message-detail-page {
    background: linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%);
  }
  
  .detail-card {
    background: #1f2937;
    border-color: rgba(239, 68, 68, 0.2);
    box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.3);
  }
  
  .message-title {
    color: #f9fafb;
  }
  
  .content-text {
    color: #d1d5db;
  }
  
  .meta-value {
    color: #e5e7eb;
  }
  
  .message-icon, .btn-icon {
    background: linear-gradient(135deg, #2d1b1b 0%, #3c2626 100%);
    border-color: rgba(239, 68, 68, 0.2);
  }
  
  .attachment-item, .link-item {
    background: #374151;
    border-color: #4b5563;
  }
  
  .attachment-item:active, .link-item:active {
    background: #4b5563;
    border-color: #6b7280;
  }
  
  .attachment-icon, .link-icon {
    background: #1f2937;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.3);
  }
  
  .attachment-name, .link-title {
    color: #f9fafb;
  }
  
  .attachment-size, .link-desc {
    color: #d1d5db;
  }
  
  .btn-text {
    color: #e5e7eb;
  }
  
  .footer-info {
    border-color: #374151;
  }
  
  .info-label {
    color: #9ca3af;
  }
  
  .info-value {
    color: #6b7280;
  }
  
  .error-circle {
    background: linear-gradient(135deg, #2d1b1b 0%, #3c2626 50%, #4a2c2c 100%);
  }
  
  .error-title {
    color: #f9fafb;
  }
  
  .error-desc {
    color: #9ca3af;
  }
  
  .section-title {
    border-color: rgba(239, 68, 68, 0.3);
  }
}

/* 高级动画效果 */
.detail-card {
  position: relative;
  overflow: hidden;
}

.detail-card::before {
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

.detail-card:hover::before {
  left: 100%;
}

/* 滚动优化 */
.detail-content {
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}

/* 触摸反馈优化 */
.back-btn,
.action-btn,
.action-btn-item,
.attachment-item,
.link-item,
.float-btn,
.retry-btn {
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}

/* 长文本处理 */
.content-text {
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
}

/* 列表项动画 */
.attachment-item,
.link-item {
  animation: slideInLeft 0.6s ease forwards;
  opacity: 0;
  transform: translateX(-30rpx);
}

.attachment-item:nth-child(1),
.link-item:nth-child(1) { 
  animation-delay: 0.1s; 
}

.attachment-item:nth-child(2),
.link-item:nth-child(2) { 
  animation-delay: 0.2s; 
}

.attachment-item:nth-child(3),
.link-item:nth-child(3) { 
  animation-delay: 0.3s; 
}

@keyframes slideInLeft {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 无障碍支持 */
@media (prefers-reduced-motion: reduce) {
  .detail-card,
  .attachment-item,
  .link-item,
  .error-circle,
  .loading-spinner,
  .icon-glow {
    animation: none;
  }
  
  .float-btn,
  .retry-btn,
  .attachment-item,
  .link-item {
    transition: none;
  }
}

/* 高分辨率适配 */
@media (-webkit-min-device-pixel-ratio: 2) {
  .decoration-line {
    height: 3px;
  }
  
  .detail-card {
    border-width: 1px;
  }
  
  .priority-indicator,
  .attachment-item,
  .link-item {
    border-width: 1px;
  }
}

/* 横屏适配 */
@media (orientation: landscape) and (max-height: 500px) {
  .error-state {
    height: 40vh;
  }
  
  .error-circle {
    width: 120rpx;
    height: 120rpx;
  }
  
  .error-icon {
    font-size: 48rpx;
  }
  
  .floating-actions {
    bottom: 20rpx;
  }
}
</style>