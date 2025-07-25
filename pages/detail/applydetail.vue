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
	      <text class="navbar-title">活动报名</text>
	    </view>
	  </template>
	</uni-nav-bar>
  <view class="container">
    <!-- 顶部banner -->
    <view class="banner-section">
      <image class="banner-image" src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg" mode="aspectFill"></image>
      <view class="banner-overlay">
        <view class="event-title">大模型人才大会</view>
        <view class="event-date">3月15日-4月10日</view>
        <view class="event-location">深圳南山区创意文化北区 C2展厅</view>
        <view class="event-fee">免费</view>
      </view>
    </view>

    <!-- 表单区域 -->
    <view class="form-section">
      <view class="form-title">完善基本资料</view>
      
      <view class="form-content">
        <!-- 姓名 -->
        <view class="form-item">
          <view class="label">姓名</view>
          <input 
            class="input" 
            v-model="formData.name" 
            placeholder="请输入姓名"
            placeholder-class="placeholder"
          />
        </view>

        <!-- 手机号码 -->
        <view class="form-item">
          <view class="label">手机号码</view>
          <view class="phone-input-wrapper">
            <input 
              class="input phone-input" 
              v-model="formData.phone" 
              placeholder="请输入手机号码"
              placeholder-class="placeholder"
              type="number"
            />
            <button class="verify-btn" @click="sendVerifyCode" :disabled="isCountingDown">
              {{ countDownText }}
            </button>
          </view>
        </view>

        <!-- 验证码 -->
        <view class="form-item">
          <view class="label">验证码</view>
          <input 
            class="input" 
            v-model="formData.verifyCode" 
            placeholder="请输入验证码"
            placeholder-class="placeholder"
            type="number"
          />
        </view>

        <!-- 学校 -->
        <view class="form-item">
          <view class="label">学校</view>
          <input 
            class="input" 
            v-model="formData.school" 
            placeholder="请输入学校名称"
            placeholder-class="placeholder"
          />
        </view>

        <!-- 出生日期 -->
        <view class="form-item">
          <view class="label">出生日期</view>
          <picker 
            mode="date" 
            :value="formData.birthDate" 
            @change="onDateChange"
            :end="maxDate"
          >
            <view class="picker-input">
              <text class="picker-text" :class="{ 'placeholder': !formData.birthDate }">
                {{ formData.birthDate || '请选择出生日期' }}
              </text>
              <text class="picker-arrow">></text>
            </view>
          </picker>
        </view>

        <!-- 身份证号码 -->
        <view class="form-item">
          <view class="label">身份证号码</view>
          <input 
            class="input" 
            v-model="formData.idCard" 
            placeholder="请输入身份证号码"
            placeholder-class="placeholder"
          />
        </view>
      </view>

      <!-- 提交按钮 -->
      <view class="submit-section">
        <button class="submit-btn" @click="handleSubmit">马上报名</button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

// 表单数据
const formData = reactive({
  name: '尹慧',
  phone: '18520658976',
  verifyCode: '',
  school: '广州华南商贸学院',
  birthDate: '1997-11-14',
  idCard: ''
})

// 验证码倒计时相关
const countDown = ref(0)
const isCountingDown = computed(() => countDown.value > 0)
const countDownText = computed(() => {
  return isCountingDown.value ? `${countDown.value}s` : '发送验证码'
})

// 最大日期（今天）
const maxDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

// 发送验证码
const sendVerifyCode = () => {
  if (!formData.phone) {
    uni.showToast({
      title: '请先输入手机号码',
      icon: 'none'
    })
    return
  }

  if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
    uni.showToast({
      title: '请输入正确的手机号码',
      icon: 'none'
    })
    return
  }

  // 开始倒计时
  countDown.value = 60
  const timer = setInterval(() => {
    countDown.value--
    if (countDown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)

  // 这里添加实际的发送验证码逻辑
  uni.showToast({
    title: '验证码已发送',
    icon: 'success'
  })
}

// 日期选择
const onDateChange = (e) => {
  formData.birthDate = e.detail.value
}
// 返回函数
function onBack() {
  uni.navigateBack();
}

// 表单验证
const validateForm = () => {
  if (!formData.name.trim()) {
    uni.showToast({ title: '请输入姓名', icon: 'none' })
    return false
  }

  if (!formData.phone) {
    uni.showToast({ title: '请输入手机号码', icon: 'none' })
    return false
  }

  if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
    uni.showToast({ title: '请输入正确的手机号码', icon: 'none' })
    return false
  }

  if (!formData.verifyCode) {
    uni.showToast({ title: '请输入验证码', icon: 'none' })
    return false
  }

  if (!formData.school.trim()) {
    uni.showToast({ title: '请输入学校名称', icon: 'none' })
    return false
  }

  if (!formData.birthDate) {
    uni.showToast({ title: '请选择出生日期', icon: 'none' })
    return false
  }

  if (!formData.idCard) {
    uni.showToast({ title: '请输入身份证号码', icon: 'none' })
    return false
  }

  if (!/^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(formData.idCard)) {
    uni.showToast({ title: '请输入正确的身份证号码', icon: 'none' })
    return false
  }

  return true
}

// 提交表单
const handleSubmit = () => {
  if (!validateForm()) return

  uni.showLoading({ title: '提交中...' })

  // 模拟提交
  setTimeout(() => {
    uni.hideLoading()
    uni.showToast({
      title: '报名成功！',
      icon: 'success'
    })
    
    // 可以在这里添加跳转逻辑
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  }, 2000)
}
</script>

<style lang="scss" scoped>
	@import "../../style/detail.css";
.container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.banner-section {
  position: relative;
  width: 100%;
  height: 400rpx;
  
  .banner-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .banner-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.6));
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-end;
    padding: 40rpx;
    color: #ffffff;
    
    .event-title {
      font-size: 42rpx;
      font-weight: bold;
      margin-bottom: 10rpx;
    }
    
    .event-date {
      font-size: 28rpx;
      margin-bottom: 8rpx;
    }
    
    .event-location {
      font-size: 24rpx;
      margin-bottom: 8rpx;
      opacity: 0.9;
    }
    
    .event-fee {
      font-size: 26rpx;
      color: #ffeb3b;
      font-weight: bold;
    }
  }
}

.form-section {
  background-color: #ffffff;
  margin: 20rpx;
  border-radius: 20rpx;
  overflow: hidden;
}

.form-title {
  padding: 40rpx 40rpx 20rpx;
  font-size: 36rpx;
  font-weight: bold;
  color: #333333;
}

.form-content {
  padding: 0 40rpx;
}

.form-item {
  margin-bottom: 40rpx;
  
  .label {
    font-size: 28rpx;
    color: #333333;
    margin-bottom: 16rpx;
    font-weight: 500;
  }
  
  .input {
    width: 100%;
    height: 88rpx;
    background-color: #f8f9fa;
    border-radius: 12rpx;
    padding: 0 20rpx;
    font-size: 28rpx;
    color: #333333;
    box-sizing: border-box;
    
    &.phone-input {
      width: calc(100% - 220rpx);
    }
  }
  
  .placeholder {
    color: #cccccc;
  }
  
  .phone-input-wrapper {
    display: flex;
    align-items: center;
    gap: 20rpx;
    
    .verify-btn {
      width: 200rpx;
      height: 88rpx;
      background-color: #e53e3e;
      color: #ffffff;
      font-size: 24rpx;
      border-radius: 12rpx;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      white-space: nowrap;
      flex-shrink: 0;
      
      &:disabled {
        background-color: #cccccc;
        color: #999999;
      }
      
      &:not(:disabled):active {
        background-color: #c53030;
      }
    }
  }
  
  .picker-input {
    width: 100%;
    height: 88rpx;
    background-color: #f8f9fa;
    border-radius: 12rpx;
    padding: 0 20rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    
    .picker-text {
      font-size: 28rpx;
      color: #333333;
      
      &.placeholder {
        color: #cccccc;
      }
    }
    
    .picker-arrow {
      font-size: 24rpx;
      color: #999999;
      transform: rotate(90deg);
    }
  }
}

.submit-section {
  padding: 20rpx 40rpx 40rpx;
  
  .submit-btn {
    width: 100%;
    height: 88rpx;
    background-color: #e53e3e;
    color: #ffffff;
    font-size: 32rpx;
    font-weight: bold;
    border-radius: 12rpx;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:active {
      background-color: #c53030;
    }
  }
}
</style>