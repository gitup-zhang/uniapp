<template>
  <view class="container">
    <view class="header">
      <view class="status-bar"></view>

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
<script>
export default {
  data() {
    return {
      daysOnline: 112,
      newsViews: 457,
      policyViews: 113
    }
  }
}
</script>
<style lang="scss">
.container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.header {
  background: linear-gradient(to right, #ff4d4f, #ff7a7a);
  height: 320px;
  padding: 0 20px;
  position: relative;


  .status-bar {
    height: var(--status-bar-height);
  }

  .header-top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
	margin-top: 35px;
	// 修改我的垂直位置

    .title-text {
      font-size: 20px;
      font-weight: bold;
      color: #fff;
    }

    .settings-icon {
      width: 30px;
      height: 30px;
    }
  }

  .header-content {
    display: flex;
    align-items: center;
    padding-top: 90px;

    .avatar {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      border: 2px solid #fff;
      margin-right: 15px;
    }

    .user-info {
      display: flex;
      flex-direction: column;
      color: #fff;

      .username {
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 4px;
      }

      .slogan {
        font-size: 14px;
        opacity: 0.9;
      }
    }
  }
}

.main-content {
  position: relative;
  z-index: 2;
  padding: 0 16px;
  margin-top: -50px;
}

.card {
  background-color: #fff;
  border-radius: 14px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  padding: 20px;
}

.top-section {
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  .icon {
    width: 30px;
    height: 30px;
    margin-right: 10px;
  }

  .title-group {
    display: flex;
    flex-direction: column;

    .card-title {
      font-weight: bold;
      font-size: 16px;
      color: #333;
    }

    .card-number {
      font-size: 24px;
      font-weight: bold;
      color: #ff4d4f;
      margin-top: 4px;
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
      font-size: 18px;
      font-weight: bold;
      color: #333;
    }

    .bottom-label {
      font-size: 13px;
      color: #888;
      margin-top: 2px;
    }
  }

  .vertical-line {
    width: 1px;
    height: 40px;
    background-color: #eee;
    margin: 0 10px;
  }
}
</style>