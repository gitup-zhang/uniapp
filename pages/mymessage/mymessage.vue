<template>
  <view class="container">
    <!-- 状态栏占位 -->
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
    <!-- 导航栏 -->
    <view class="nav-bar">
      <text class="nav-title">个人信息</text>
      <view class="nav-right"></view>
    </view>

    <!-- 未登录状态 - 简约登录引导 -->
    <view v-if="!userInfo.signal" class="not-login-container">
      <view class="not-login-card">
        <!-- Logo区域 -->
        <view class="logo-section">
          <image class="logo-image" src="/static/logo.jpg" mode="aspectFit" />
          <text class="app-title">智源齐说</text>
        </view>

        <!-- 登录提示 -->
        <view class="login-prompt">
          <view class="prompt-content">
            <text class="prompt-title">欢迎来到智源齐说</text>
            <text class="prompt-desc"
              >登录后可查看个人信息、管理活动等更多功能</text
            >
          </view>

          <!-- 登录按钮 -->
          <button class="goto-login-btn" @click="goToLogin">
            <view class="btn-content">
              <uni-icons type="person" size="20" color="#fff" />
              <text>立即登录</text>
            </view>
          </button>

          <!-- 功能预览 -->
          <view class="features-preview">
            <view class="feature-item">
              <uni-icons type="calendar" size="24" color="#667eea" />
              <text>活动管理</text>
            </view>
            <view class="feature-item">
              <uni-icons type="person" size="24" color="#667eea" />
              <text>个人资料</text>
            </view>
            <view class="feature-item">
              <uni-icons type="chat" size="24" color="#667eea" />
              <text>消息通知</text>
            </view>
          </view>
        </view>

        <!-- 装饰元素 -->
        <view class="decoration">
          <view class="deco-circle deco-1"></view>
          <view class="deco-circle deco-2"></view>
          <view class="deco-circle deco-3"></view>
        </view>
      </view>
    </view>

    <!-- 已登录状态 -->
    <view v-else class="main-container">
      <!-- 简洁的头部区域 -->
      <view class="header">
        <view class="header-content">
          <!-- 用户信息卡片 -->
          <view class="user-card" @click="goToProfile">
            <view class="avatar-section">
              <image
                class="user-avatar"
                :src="userInfo.info.avatar_url || '/static/icon/empty.png'"
                mode="aspectFill"
              />
              <view class="online-indicator">
                <view class="indicator-dot"></view>
              </view>
            </view>

            <view class="user-details">
              <text class="user-name">{{
                userInfo.info.nickname || "用户"
              }}</text>
              <text class="user-phone">{{
                formatPhoneNumber(userInfo.info.phone)
              }}</text>
            </view>

            <view class="profile-enter">
              <uni-icons type="right" size="18" color="rgba(255,255,255,0.8)" />
            </view>
          </view>
        </view>

        <!-- 头部装饰 -->
        <view class="header-decoration">
          <view class="deco-circle deco-1"></view>
          <view class="deco-circle deco-2"></view>
        </view>
      </view>

      <!-- 主要内容区域 -->
      <view class="main-content">
        <!-- 数据统计卡片 -->
        <view class="stats-overview">
          <view class="stats-header">
            <view class="stats-icon-wrapper">
              <image
                class="stats-icon"
                src="/static/icon/fire.png"
                mode="aspectFit"
              />
            </view>
            <view class="stats-info">
              <text class="stats-title">我的活动信息</text>
            </view>
          </view>

          <view class="stats-grid">
            <view class="stat-item">
              <text class="stat-number">{{
                userInfo.eventcount.Eventbefore || 0
              }}</text>
              <text class="stat-label">未开始</text>
            </view>

            <view class="stat-divider"></view>

            <view class="stat-item">
              <text class="stat-number">{{
                userInfo.eventcount.Eventing || 0
              }}</text>
              <text class="stat-label">进行中</text>
            </view>

            <view class="stat-divider"></view>

            <view class="stat-item">
              <text class="stat-number">{{
                userInfo.eventcount.Evented || 0
              }}</text>
              <text class="stat-label">已过期</text>
            </view>
          </view>
        </view>

        <!-- 活动区域 - 新增空状态处理 -->
        <view class="activity-section">
          <view class="section-header">
            <text class="section-title">我的活动</text>
            <view class="section-more" @click="viewAllActivities">
              <text class="more-text">查看全部</text>
              <uni-icons type="right" size="14" color="#999" />
            </view>
          </view>

          <!-- 有活动时显示活动卡片 -->
          <ActivityTicket
            v-if="hasActivities"
            :activityData="myActivityData"
            @cancel="onCancel"
          />

          <!-- 没有活动时显示空状态 -->
          <view v-else class="empty-activity">
            <view class="empty-card">
              <!-- 空状态文案 -->
              <view class="empty-content">
                <text class="empty-title">暂无活动</text>
                <text class="empty-desc"
                  >您还没有参加任何活动，快去发现精彩活动吧！</text
                >
              </view>

              <!-- 操作按钮 -->
              <view class="empty-actions">
                <button class="discover-btn" @click="discoverActivities">
                  <uni-icons type="search" size="16" color="#fff" />
                  <text>发现活动</text>
                </button>
                <button class="refresh-btn" @click="refreshActivities">
                  <uni-icons type="refresh" size="16" color="#667eea" />
                  <text>刷新</text>
                </button>
              </view>

              <!-- 装饰元素 -->
              <view class="empty-decoration">
                <view class="deco-dot deco-1"></view>
                <view class="deco-dot deco-2"></view>
                <view class="deco-dot deco-3"></view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 加载提示 -->
    <uni-popup ref="loadingPopup" type="center">
      <view class="loading-container">
        <uni-load-more status="loading" :content-text="loadingText" />
      </view>
    </uni-popup>
  </view>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
import { useInfoStore } from "@/store/Info.js";
import ActivityTicket from "../../components/ActivityTicket/ActivityTicket.vue";
import { cancelapply } from "@/new-apis/events.js";
import { useEventstore } from "@/store/Event.js";

// Store 和基础数据
const userInfo = useInfoStore();
const SYSTEMINFO = uni.getSystemInfoSync();
const statusBarHeight = ref(SYSTEMINFO.statusBarHeight);

// 弹窗引用
const loadingPopup = ref(null);

// 加载状态
const loadingText = ref({ more: "加载中..." });

// 活动数据和状态
const myActivityData = ref(null); // 改为 null 表示没有活动

const hasActivities = computed(() => {
  return myActivityData.value && Object.keys(myActivityData.value).length > 0;
});

// 页面挂载
onMounted(() => {
  initPage();
});

onShow(async () => {
  console.log("已加载");
  initPage();
});

// 初始化页面
const initPage = async () => {
  try {
    if (userInfo.signal) {
      await refreshUserData();
    }
  } catch (error) {
    console.error("页面初始化失败:", error);
  }
};

// 刷新用户数据
const refreshUserData = async () => {
  try {
    await userInfo.getinfo();
    await userInfo.userapply();
    // 这里可以添加获取活动数据的逻辑
    await loadUserActivities();
  } catch (error) {
    console.error("获取用户信息失败:", error);
  }
};

// 加载用户活动数据
const loadUserActivities = async () => {
  try {
    // 这里模拟从API获取活动数据
    myActivityData.value =
      userInfo.applyactivity?.length > 0 ? userInfo.applyactivity[0] : null;
  } catch (error) {
    console.error("获取活动数据失败:", error);
    myActivityData.value = null;
  }
};

// 格式化手机号显示
const formatPhoneNumber = (phone) => {
  if (!phone) return "";
  return phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
};

// 跳转到登录页面
const goToLogin = () => {
  uni.navigateTo({
    url: "/pages/detail/Login",
  });
};

// 跳转到个人资料页面
const goToProfile = () => {
  uni.navigateTo({
    url: "/pages/detail/profile",
  });
};

// 空状态相关方法
const discoverActivities = () => {
  uni.switchTab({
    url: "../news/news",
  });
};

const refreshActivities = async () => {
  try {
    initPage();

    uni.showToast({
      title: "刷新完成",
      icon: "success",
    });
  } catch (error) {
    console.error("刷新活动失败:", error);
    uni.showToast({
      title: "刷新失败",
      icon: "error",
    });
  } finally {
    hideLoading();
  }
};

// 显示加载提示
const showLoading = (text = "加载中...") => {
  loadingText.value.more = text;
  loadingPopup.value?.open();
};

// 隐藏加载提示
const hideLoading = () => {
  loadingPopup.value?.close();
};

const onCancel = async (data) => {
  uni.showModal({
    title: "确认取消",
    content: `确定要取消报名"${data.title}"吗？`,
    success: (res) => {
      if (res.confirm) {
        cancelSignUp(data);
      }
    },
  });
};

// 取消报名的具体实现
const cancelSignUp = async (activityData) => {
  try {
    await cancelapply(activityData.id);
    initPage();

    uni.showToast({
      title: "取消报名成功",
      icon: "success",
    });
  } catch (error) {
    console.error("取消报名失败:", error.data);
    uni.showToast({
      title: error.data.message,
      icon: "none",
    });
  }
};

const viewAllActivities = () => {
  uni.navigateTo({
    url: "/pages/detail/activityjoined",
  });
};
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background: linear-gradient(180deg, #ff4757 0%, #ff6b7a 100%);
}

.nav-bar {
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32rpx;
  position: relative;
  z-index: 10;

  .nav-title {
    font-size: 36rpx;
    font-weight: 700;
    color: #fff;
  }

  .nav-right {
    width: 64rpx;
  }
}

.status-bar {
  background: transparent;
}

// 未登录状态样式
.not-login-container {
  min-height: calc(100vh - 200rpx);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40rpx;
}

.not-login-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 32rpx;
  padding: 60rpx 40rpx;
  width: 100%;
  backdrop-filter: blur(20rpx);
  border: 1rpx solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 32rpx 80rpx rgba(0, 0, 0, 0.15);
  position: relative;
  overflow: hidden;
}

.logo-section {
  text-align: center;
  margin-bottom: 60rpx;

  .logo-image {
    width: 120rpx;
    height: 120rpx;
    border-radius: 24rpx;
    margin-bottom: 24rpx;
    box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.1);
  }

  .app-title {
    display: block;
    font-size: 48rpx;
    font-weight: 700;
    color: #333;
    margin-bottom: 12rpx;
  }

  .app-slogan {
    display: block;
    font-size: 28rpx;
    color: #666;
  }
}

.login-prompt {
  .prompt-content {
    text-align: center;
    margin-bottom: 48rpx;

    .prompt-title {
      display: block;
      font-size: 36rpx;
      font-weight: 700;
      color: #333;
      margin-bottom: 16rpx;
    }

    .prompt-desc {
      display: block;
      font-size: 26rpx;
      color: #666;
      line-height: 1.5;
      max-width: 480rpx;
      margin: 0 auto;
    }
  }

  .goto-login-btn {
    width: 100%;
    height: 88rpx;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    border-radius: 20rpx;
    color: #fff;
    font-size: 32rpx;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 48rpx;
    box-shadow: 0 12rpx 32rpx rgba(102, 126, 234, 0.4);
    transition: all 0.3s ease;

    &:active {
      transform: translateY(2rpx);
      box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.3);
    }

    &::after {
      border: none;
    }

    .btn-content {
      display: flex;
      align-items: center;

      text {
        margin-left: 12rpx;
      }
    }
  }

  .features-preview {
    display: flex;
    justify-content: space-between;
    margin-top: 40rpx;

    .feature-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 1;

      text {
        font-size: 24rpx;
        color: #666;
        margin-top: 12rpx;
        font-weight: 500;
      }
    }
  }
}

.decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;

  .deco-circle {
    position: absolute;
    border-radius: 50%;
    background: linear-gradient(
      135deg,
      rgba(102, 126, 234, 0.1) 0%,
      rgba(118, 75, 162, 0.1) 100%
    );
    animation: float 6s ease-in-out infinite;

    &.deco-1 {
      width: 120rpx;
      height: 120rpx;
      top: 60rpx;
      right: 40rpx;
      animation-delay: -2s;
    }

    &.deco-2 {
      width: 80rpx;
      height: 80rpx;
      bottom: 100rpx;
      left: 60rpx;
      animation-delay: -4s;
    }

    &.deco-3 {
      width: 60rpx;
      height: 60rpx;
      top: 40%;
      left: 20rpx;
      animation-delay: -1s;
    }
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
    opacity: 0.3;
  }
  50% {
    transform: translateY(-20rpx) rotate(180deg);
    opacity: 0.6;
  }
}

// 已登录状态样式保持原有
.main-container {
  min-height: 80vh;
  background: linear-gradient(180deg, #ff4757 0%, #ff6b7a 100%);
}

.header {
  position: relative;
  padding: 32rpx;
  overflow: hidden;

  .header-content {
    position: relative;
    z-index: 2;
  }

  .user-card {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 24rpx;
    padding: 32rpx;
    display: flex;
    align-items: center;
    backdrop-filter: blur(20rpx);
    border: 1rpx solid rgba(255, 255, 255, 0.2);
    transition: all 0.3s ease;

    &:active {
      transform: scale(0.98);
      background: rgba(255, 255, 255, 0.2);
    }

    .avatar-section {
      position: relative;
      margin-right: 24rpx;

      .user-avatar {
        width: 120rpx;
        height: 120rpx;
        border-radius: 50%;
        border: 4rpx solid rgba(255, 255, 255, 0.3);
      }

      .online-indicator {
        position: absolute;
        bottom: 4rpx;
        right: 4rpx;
        width: 24rpx;
        height: 24rpx;
        background: #fff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;

        .indicator-dot {
          width: 12rpx;
          height: 12rpx;
          background: #2ed573;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }
      }
    }

    .user-details {
      flex: 1;
      color: #fff;

      .user-name {
        display: block;
        font-size: 36rpx;
        font-weight: 700;
        margin-bottom: 6rpx;
      }

      .user-phone {
        display: block;
        font-size: 24rpx;
        opacity: 0.8;
        margin-bottom: 6rpx;
      }
    }

    .profile-enter {
      width: 40rpx;
      height: 40rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
    }
  }

  .header-decoration {
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;

    .deco-circle {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.08);

      &.deco-1 {
        width: 160rpx;
        height: 160rpx;
        top: -80rpx;
        right: -40rpx;
      }

      &.deco-2 {
        width: 100rpx;
        height: 100rpx;
        bottom: -50rpx;
        right: 60rpx;
      }
    }
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.main-content {
  background: #f8f9fa;
  border-radius: 32rpx 32rpx 0 0;
  padding: 32rpx;
  margin-top: -16rpx;
  position: relative;
  z-index: 1;
}

.stats-overview {
  background: #fff;
  border-radius: 24rpx;
  padding: 32rpx;
  margin-bottom: 32rpx;
  box-shadow: 0 8rpx 32rpx rgba(255, 71, 87, 0.1);

  .stats-header {
    display: flex;
    align-items: center;
    margin-bottom: 32rpx;

    .stats-icon-wrapper {
      width: 64rpx;
      height: 64rpx;
      margin-right: 24rpx;
      display: flex;
      align-items: center;
      justify-content: center;

      .stats-icon {
        width: 48rpx;
        height: 48rpx;
      }
    }

    .stats-info {
      flex: 1;

      .stats-title {
        display: block;
        font-size: 32rpx;
        font-weight: 700;
        color: #333;
        margin-bottom: 4rpx;
      }
    }
  }

  .stats-grid {
    display: flex;
    align-items: center;

    .stat-item {
      flex: 1;
      text-align: center;

      .stat-number {
        display: block;
        font-size: 48rpx;
        font-weight: 700;
        color: #333;
        margin-bottom: 8rpx;
      }

      .stat-label {
        display: block;
        font-size: 26rpx;
        color: #666;
        margin-bottom: 8rpx;
      }
    }

    .stat-divider {
      width: 2rpx;
      height: 80rpx;
      background: #f0f0f0;
      margin: 0 24rpx;
    }
  }
}

.activity-section {
  margin-bottom: 32rpx;

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24rpx;

    .section-title {
      font-size: 32rpx;
      font-weight: 700;
      color: #333;
    }

    .section-more {
      display: flex;
      align-items: center;
      padding: 8rpx 16rpx;
      border-radius: 20rpx;
      transition: all 0.3s ease;

      &:active {
        background: rgba(255, 71, 87, 0.1);
      }

      .more-text {
        font-size: 26rpx;
        color: #999;
        margin-right: 8rpx;
      }
    }
  }
}

// 空状态样式
.empty-activity {
  .empty-card {
    background: #fff;
    border-radius: 24rpx;
    padding: 60rpx 40rpx;
    text-align: center;
    position: relative;
    overflow: hidden;
    box-shadow: 0 8rpx 32rpx rgba(255, 71, 87, 0.1);

    .empty-content {
      margin-bottom: 40rpx;

      .empty-title {
        display: block;
        font-size: 36rpx;
        font-weight: 700;
        color: #333;
        margin-bottom: 16rpx;
      }

      .empty-desc {
        display: block;
        font-size: 28rpx;
        color: #666;
        line-height: 1.5;
        max-width: 480rpx;
        margin: 0 auto;
      }
    }

    .empty-actions {
      display: flex;
      justify-content: center;
      gap: 24rpx;

      .discover-btn,
      .refresh-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 24rpx 32rpx;
        border-radius: 16rpx;
        font-size: 28rpx;
        font-weight: 600;
        border: none;
        transition: all 0.3s ease;

        &::after {
          border: none;
        }

        text {
          margin-left: 8rpx;
        }

        &:active {
          transform: scale(0.95);
        }
      }

      .discover-btn {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: #fff;
        box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.3);
      }

      .refresh-btn {
        background: #f8f9fa;
        color: #667eea;
        border: 2rpx solid #667eea;

        &:active {
          background: rgba(102, 126, 234, 0.1);
        }
      }
    }

    .empty-decoration {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      overflow: hidden;

      .deco-dot {
        position: absolute;
        border-radius: 50%;
        background: linear-gradient(
          135deg,
          rgba(102, 126, 234, 0.1) 0%,
          rgba(118, 75, 162, 0.1) 100%
        );
        animation: float 6s ease-in-out infinite;

        &.deco-1 {
          width: 80rpx;
          height: 80rpx;
          top: 40rpx;
          right: 60rpx;
          animation-delay: -2s;
        }

        &.deco-2 {
          width: 60rpx;
          height: 60rpx;
          bottom: 80rpx;
          left: 40rpx;
          animation-delay: -4s;
        }

        &.deco-3 {
          width: 40rpx;
          height: 40rpx;
          top: 50%;
          left: 80rpx;
          animation-delay: -1s;
        }
      }
    }
  }
}

// 加载提示样式
.loading-container {
  background: rgba(0, 0, 0, 0.8);
  border-radius: 16rpx;
  padding: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10rpx);
}

// 响应式适配
@media screen and (max-width: 320px) {
  .not-login-card {
    margin: 0 20rpx;
    padding: 40rpx 24rpx;
  }

  .header {
    padding: 24rpx;
  }

  .main-content {
    padding: 24rpx;
  }

  .empty-card {
    padding: 40rpx 24rpx;

    .empty-actions {
      flex-direction: column;
      gap: 16rpx;

      .discover-btn,
      .refresh-btn {
        width: 100%;
      }
    }
  }
}

// 暗色主题适配
// @media (prefers-color-scheme: dark) {
//   .main-content {
//     background: #1a1a1a;
//   }

//   .stats-overview {
//     background: #2d2d2d;

//     .stats-title {
//       color: #fff;
//     }

//     .stat-number {
//       color: #fff;
//     }

//     .stat-label {
//       color: #ccc;
//     }
//   }

//   .section-title {
//     color: #fff;
//   }

//   .empty-card {
//     background: #2d2d2d;

//     .empty-title {
//       color: #fff;
//     }

//     .empty-desc {
//       color: #ccc;
//     }

//     .refresh-btn {
//       background: #3d3d3d;
//       color: #667eea;
//       border-color: #667eea;
//     }
//   }
// }
</style>
