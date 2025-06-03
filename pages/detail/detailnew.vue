<template>
  <uni-nav-bar
    statusBar="true"
    backgroundColor="#903749"
    fixed="true"
    :border="false"
    leftIcon="left"
    @clickLeft="onBack"
  >
    <!-- 居中标题插槽 -->
    <template v-slot:default>
      <view class="navbar-center">
        <text class="navbar-title">政策</text>
      </view>
    </template>
  </uni-nav-bar>
</template>

<script setup>
function onBack() {
  uni.navigateBack();
}
</script>

<style scoped>
/* 标题样式 */
.navbar-title {
  font-size: 20px;
  font-weight: bold;
  color: white;
  margin-bottom: 10px; /* 与左侧“新闻”一致的垂直视觉位置 */
}

/* 居中容器，垂直对齐与左侧保持一致 */
/* .navbar-center {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding-bottom: 10px;
  pointer-events: none;
  margin-top: 30rpx;
} */
.navbar-center {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding-bottom: 10px;
  pointer-events: none;
  transform: translateY(20rpx); /* 替代 margin-top */
}


</style>
