<template>
  <view class="container">
    <!-- 自定义导航栏 -->
    <view class="custom-navbar">
      <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
      <view class="nav-content">
        <text class="nav-title">消息</text>
      </view>
    </view>

    <!-- 消息列表 -->
    <scroll-view
      class="message-list"
      scroll-y="true"
      :style="{ marginTop: statusBarHeight + 44 + 12 + 'px' }"
    >
      <block v-if="messages.length > 0">
        <view class="message-item" v-for="(msg, index) in messages" :key="index">
          <image :src="msg.avatar" class="avatar"></image>
          <view class="msg-content">
            <view class="msg-title">{{ msg.title }}</view>
            <view class="msg-brief">{{ msg.brief }}</view>
          </view>
          <text class="msg-time">{{ msg.time }}</text>
        </view>
      </block>
      <block v-else>
        <view class="empty">
          <image src="@/static/empty.png" class="empty-img" />
          <text class="empty-text">暂无消息</text>
        </view>
      </block>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      statusBarHeight: 0,
      messages: [
        {
          avatar: '/static/avatar1.png',
          title: '系统通知',
          brief: '您有一条新消息，请及时查收。',
          time: '2025-07-17',
        },
        {
          avatar: '/static/avatar2.png',
          title: '活动提醒',
          brief: '限时优惠已开始，快来参与！',
          time: '2025-07-16',
        },
      ],
    };
  },
  onLoad() {
    const sysInfo = uni.getSystemInfoSync();
    this.statusBarHeight = sysInfo.statusBarHeight;
  },
};
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
  background-color: #903749;
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

/* 消息列表 */
.message-list {
  padding: 0 16px;
  padding-bottom: 20px;
  flex: 1;
}
.message-item {
  background: #ffffff;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);
  border: 1px solid #eee;
  transition: transform 0.2s ease;
}
.message-item:hover {
  transform: translateY(-2px);
}
.avatar {
  width: 48px;
  height: 48px;
  border-radius: 24px;
  margin-right: 12px;
}
.msg-content {
  flex: 1;
}
.msg-title {
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 4px;
}
.msg-brief {
  color: #666;
  font-size: 14px;
}
.msg-time {
  color: #999;
  font-size: 12px;
  margin-left: 8px;
}

/* 空状态 */
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 100px;
}
.empty-img {
  width: 120px;
  height: 120px;
  opacity: 0.5;
}
.empty-text {
  color: #aaa;
  margin-top: 16px;
}
</style>
