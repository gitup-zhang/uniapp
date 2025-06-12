<template>
  <view class="container">
    <view class="header">
      <!-- 状态栏预留高度 -->
      <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>

      <!-- 顶部栏 -->
      <view class="header-top-bar">
        <text class="title-text">我的</text>
        <view class="settings-icon">
          <uni-icons type="gear-filled" size="22" color="#fff"></uni-icons>
        </view>
      </view>

      <!-- 头像 + 名字 + 签名 -->
      <view class="header-content">
        <image class="avatar" src="/static/picture.jpg" mode="aspectFill"></image>
        <view class="user-info">
          <text class="username">胡歌</text>
          <text class="slogan">在阳光灿烂的日子里睡觉呀</text>
        </view>
      </view>
    </view>

    <!-- 卡片悬浮展示 -->
    <view class="main-content">
      <view class="card">
        <view class="top-section">
          <image class="icon" src="/static/icon/fire.png" mode="aspectFit"></image>
          <view class="title-group">
            <text class="card-title">累计在线天数</text>
            <text class="card-number">{{ daysOnline }}</text>
          </view>
        </view>

        <view class="bottom-section">
          <view class="bottom-item">
            <text class="bottom-number">{{ newsViews }}</text>
            <text class="bottom-label">查看新闻数</text>
          </view>
          <view class="vertical-line"></view>
          <view class="bottom-item">
            <text class="bottom-number">{{ policyViews }}</text>
            <text class="bottom-label">查看政策数</text>
          </view>
          <view class="vertical-line"></view>
          <view class="bottom-item">
            <text class="bottom-number">人工智能</text>
            <text class="bottom-label">关注领域</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import {ref} from 'vue'
 let SYSTEMINFO=uni.getSystemInfoSync()
 // 获取状态栏高度
 let statusBarHeight=ref(SYSTEMINFO.statusBarHeight)

</script>
<style lang="scss">
// @import "../../style/message.css";
.container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: env(safe-area-inset-bottom); // 防止底部内容被遮挡
}

.header {
  background: linear-gradient(to right, #ff4d4f, #ff7a7a);
  padding: 0 20rpx;
  padding-top: env(safe-area-inset-top); // 适配刘海屏顶部
  position: relative;
  height: 600rpx;
  box-sizing: border-box;

  .status-bar {
    height: var(--status-bar-height); // 或动态赋值
  }

  .header-top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 20rpx;

    .title-text {
      font-size: 36rpx;
      font-weight: bold;
      color: #fff;
    }

    .settings-icon {
      width: 60rpx;
      height: 60rpx;
    }
  }

  .header-content {
    display: flex;
    align-items: center;
    padding-top: 150rpx;

    .avatar {
      width: 140rpx;
      height: 140rpx;
      border-radius: 50%;
      border: 4rpx solid #fff;
      margin-right: 30rpx;
    }

    .user-info {
      display: flex;
      flex-direction: column;
      color: #fff;

      .username {
        font-size: 40rpx;
        font-weight: bold;
        margin-bottom: 8rpx;
      }

      .slogan {
        font-size: 28rpx;
        opacity: 0.9;
      }
    }
  }
}

.main-content {
  position: relative;
  z-index: 2;
  padding: 0 32rpx;
  margin-top: -100rpx;
}

.card {
  background-color: #fff;
  border-radius: 28rpx;
  box-shadow: 0 16rpx 40rpx rgba(0, 0, 0, 0.08);
  padding: 40rpx;
}

.top-section {
  display: flex;
  align-items: center;
  margin-bottom: 40rpx;

  .icon {
    width: 60rpx;
    height: 60rpx;
    margin-right: 20rpx;
  }

  .title-group {
    display: flex;
    flex-direction: column;

    .card-title {
      font-weight: bold;
      font-size: 32rpx;
      color: #333;
    }

    .card-number {
      font-size: 48rpx;
      font-weight: bold;
      color: #ff4d4f;
      margin-top: 8rpx;
    }
  }
}

.bottom-section {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .bottom-item {
    flex: 1;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;

    .bottom-number {
      font-size: 36rpx;
      font-weight: bold;
      color: #333;
    }

    .bottom-label {
      font-size: 26rpx;
      color: #888;
      margin-top: 4rpx;
    }
  }

  .vertical-line {
    width: 2rpx;
    height: 80rpx;
    background-color: #eee;
    margin: 0 20rpx;
  }
}
</style>