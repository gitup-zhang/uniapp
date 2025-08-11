<template>
	<uni-nav-bar
	  statusBar="true"
	  backgroundColor="#ff4757"
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
      <image class="banner-image" :src="EventStore.eventdetail.images[0]" mode="aspectFill"></image>
      <view class="banner-overlay">
        <view class="event-title">{{EventStore.eventdetail.title}}</view>
        <view class="event-date">{{ formatEventDate(EventStore.eventdetail.event_start_time,EventStore.eventdetail.event_end_time)}}</view>
        <view class="event-location">{{ EventStore.eventdetail.event_address }}</view>
        <view class="event-fee">{{EventStore.eventdetail.registration_fee}}</view>
      </view>
    </view>

    <!-- 表单区域 -->
    <view class="form-section">
      <view class="form-header">
        <view class="form-title">完善基本资料</view>
        <button class="edit-btn" @click="handleEdit" :class="{ 'save-mode': isEditing }">
          <text class="btn-icon">{{ isEditing ? '✓' : '✎' }}</text>
          <text class="btn-text">{{ isEditing ? '保存' : '编辑' }}</text>
        </button>
      </view>
      
      <view class="form-content">
        <!-- 基本信息组 -->
        <view class="form-group">
          <view class="group-title">基本信息</view>
          
          <!-- 姓名 -->
          <view class="form-item">
            <view class="label">
              <text>姓名</text>
              <text class="required">*</text>
            </view>
            <input 
              class="input" 
              v-model="formData.name" 
              placeholder="请输入姓名"
              placeholder-class="placeholder"
              :disabled="!isEditing"
              :class="{ 'disabled': !isEditing, 'editing': isEditing }"
            />
          </view>

          <!-- 手机号码 -->
          <view class="form-item">
            <view class="label">
              <text>手机号码</text>
              <text class="required">*</text>
            </view>
            <view class="phone-input-wrapper">
              <input 
                class="input phone-input" 
                v-model="formData.phone" 
                placeholder="请输入手机号码"
                placeholder-class="placeholder"
                type="number"
                :disabled="!isEditing"
                :class="{ 'disabled': !isEditing, 'editing': isEditing }"
                @input="onPhoneInput"
              />
              <button 
                class="verify-btn" 
                @click="sendVerifyCode" 
                :disabled="isCountingDown || !canSendCode"
                v-if="needPhoneVerification || !isSubmitted"
              >
                {{ countDownText }}
              </button>
            </view>
          </view>

          <!-- 验证码 - 只在需要时显示 -->
          <view class="form-item" v-if="needPhoneVerification || !isSubmitted">
            <view class="label">
              <text>验证码</text>
              <text class="required">*</text>
            </view>
            <input 
              class="input verify-code-input" 
              v-model="formData.verifyCode" 
              placeholder="请输入验证码"
              placeholder-class="placeholder"
              type="number"
            />
          </view>

          <!-- 邮箱 -->
          <view class="form-item">
            <view class="label">
              <text>邮箱</text>
              <text class="required">*</text>
            </view>
            <input 
              class="input" 
              v-model="formData.email" 
              placeholder="请输入邮箱地址"
              placeholder-class="placeholder"
              type="email"
              :disabled="!isEditing"
              :class="{ 'disabled': !isEditing, 'editing': isEditing }"
            />
          </view>

          <!-- 出生日期 -->
          <view class="form-item">
            <view class="label">
              <text>出生日期</text>
              <text class="required">*</text>
            </view>
            <picker 
              mode="date" 
              :value="formData.birthDate" 
              @change="onDateChange"
              :end="maxDate"
              :disabled="!isEditing"
            >
              <view class="picker-input" :class="{ 'disabled': !isEditing, 'editing': isEditing }">
                <text class="picker-text" :class="{ 'placeholder': !formData.birthDate }">
                  {{ formData.birthDate || '请选择出生日期' }}
                </text>
                <text class="picker-arrow" v-if="isEditing">❯</text>
              </view>
            </picker>
          </view>

          <!-- 身份证号码 -->
          <view class="form-item">
            <view class="label">
              <text>身份证号码</text>
              <text class="required">*</text>
            </view>
            <input 
              class="input" 
              v-model="formData.idCard" 
              placeholder="请输入身份证号码"
              placeholder-class="placeholder"
              :disabled="!isEditing"
              :class="{ 'disabled': !isEditing, 'editing': isEditing }"
            />
          </view>
        </view>

        <!-- 工作信息组 -->
        <view class="form-group">
          <view class="group-title">工作信息</view>
          
          <!-- 单位 -->
          <view class="form-item">
            <view class="label">
              <text>单位</text>
              <text class="required">*</text>
            </view>
            <input 
              class="input" 
              v-model="formData.unit" 
              placeholder="请输入单位名称"
              placeholder-class="placeholder"
              :disabled="!isEditing"
              :class="{ 'disabled': !isEditing, 'editing': isEditing }"
            />
          </view>

          <!-- 部门 -->
          <view class="form-item">
            <view class="label">部门</view>
            <input 
              class="input" 
              v-model="formData.sectoral" 
              placeholder="请输入部门名称"
              placeholder-class="placeholder"
              :disabled="!isEditing"
              :class="{ 'disabled': !isEditing, 'editing': isEditing }"
            />
          </view>

          <!-- 行业 -->
          <view class="form-item">
            <view class="label">行业</view>
            <picker 
              mode="selector" 
              :range="industryOptions" 
              :value="formData.industryIndex"
              @change="onIndustryChange"
              :disabled="!isEditing"
            >
              <view class="picker-input" :class="{ 'disabled': !isEditing, 'editing': isEditing }">
                <text class="picker-text" :class="{ 'placeholder': formData.industryIndex === -1 }">
                  {{ formData.industryIndex === -1 ? '请选择行业' : industryOptions[formData.industryIndex] }}
                </text>
                <text class="picker-arrow" v-if="isEditing">❯</text>
              </view>
            </picker>
          </view>

          <!-- 职业 -->
          <view class="form-item">
            <view class="label">
              <text>职业</text>
              <text class="required">*</text>
            </view>
            <picker 
              mode="selector" 
              :range="careerOptions" 
              :value="formData.careerIndex"
              @change="onCareerChange"
              :disabled="!isEditing"
            >
              <view class="picker-input" :class="{ 'disabled': !isEditing, 'editing': isEditing }">
                <text class="picker-text" :class="{ 'placeholder': formData.careerIndex === -1 }">
                  {{ formData.careerIndex === -1 ? '请选择职业' : careerOptions[formData.careerIndex] }}
                </text>
                <text class="picker-arrow" v-if="isEditing">❯</text>
              </view>
            </picker>
          </view>
        </view>
      </view>

      <!-- 提交按钮 -->
      <view class="submit-section">
        <button 
          class="submit-btn" 
          @click="handleSubmit"
          :disabled="isEditing"
          :class="{ 'disabled': isEditing }"
        >
          {{ isSubmitted ? '重新报名' : '马上报名' }}
        </button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { onLoad } from '@dcloudio/uni-app'
import {ref,onMounted,reactive,computed} from 'vue'
import {useEventstore} from '@/store/Event.js'
import {useInfoStore} from '@/store/Info.js' 
import {formatEventDate,Dataformat} from '@/utils/data.js'

const EventStore=useEventstore()
const UserStore=useInfoStore()

// 职业选项
const careerOptions = [
 '总经理/CEO',
 '副总经理/副CEO',
 '总监',
 '副总监',
 '部门经理',
 '副经理',
 '主管/组长',
 '高级工程师',
 '工程师',
 '初级工程师',
 '高级专员',
 '专员',
 '助理专员',
 '销售总监',
 '销售经理',
 '销售代表',
 '市场总监',
 '市场经理',
 '市场专员',
 '产品总监',
 '产品经理',
 '产品专员',
 '技术总监',
 '技术经理',
 '架构师',
 '开发工程师',
 '测试工程师',
 '运维工程师',
 '设计总监',
 '设计经理',
 'UI设计师',
 '平面设计师',
 '人事总监',
 '人事经理',
 '人事专员',
 '财务总监',
 '财务经理',
 '会计',
 '出纳',
 '行政总监',
 '行政经理',
 '行政专员',
 '客服经理',
 '客服专员',
 '其他'
]

// 行业选项
const industryOptions = [
  '互联网/电商',
  '金融/银行',
  '房地产/建筑',
  '教育/培训',
  '医疗/健康',
  '制造业',
  '服务业',
  '政府/事业单位',
  '媒体/广告',
  '交通/物流',
  '能源/环保',
  '农业/食品',
  '文化/娱乐',
  '咨询/法律',
  '其他'
]

// 编辑状态
const isEditing = ref(false)
// 是否已提交过报名
const isSubmitted = ref(false)
// 原始手机号（用于判断是否修改了手机号）
const originalPhone = ref('')
// 是否需要手机号验证
const needPhoneVerification = ref(false)

// 表单数据
const formData = reactive({
  name: '',
  phone: '',
  verifyCode: '',
  email: '',
  unit: '',
  sectoral: '',
  industryIndex: -1, // 行业选择索引
  careerIndex: -1, // 职业选择索引，-1表示未选择
  birthDate: '',
  idCard: ''
})

// 验证码倒计时相关
const countDown = ref(0)
const isCountingDown = computed(() => countDown.value > 0)
const countDownText = computed(() => {
  return isCountingDown.value ? `${countDown.value}s` : '发送验证码'
})

// 是否可以发送验证码
const canSendCode = computed(() => {
  return formData.phone && /^1[3-9]\d{9}$/.test(formData.phone)
})

// 最大日期（今天）
const maxDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

// 监听手机号输入变化
const onPhoneInput = () => {
  // 如果是编辑模式且手机号发生变化，需要验证码
  if (isEditing.value && formData.phone !== originalPhone.value && formData.phone) {
    needPhoneVerification.value = true
    formData.verifyCode = '' // 清空验证码
  } else if (formData.phone === originalPhone.value) {
    needPhoneVerification.value = false
    formData.verifyCode = ''
  }
}

// 初始化表单数据（从pinia中获取已有的用户信息）
const initFormData = () => {
  const userInfo = UserStore.info || {}
  
  // 从用户信息中填充表单
  formData.name = userInfo.name || ''
  formData.phone = userInfo.phone_number || ''
  formData.email = userInfo.email || ''
  formData.unit = userInfo.unit || ''
  formData.sectoral = userInfo.department || ''
  formData.birthDate = userInfo.birth_date || ''
  formData.idCard = userInfo.id_card || ''
  
  // 记录原始手机号
  originalPhone.value = formData.phone
  
  // 根据职位和行业字符串找到对应的索引
  if (userInfo.position) {
    const positionIndex = careerOptions.findIndex(option => option === userInfo.position)
    formData.careerIndex = positionIndex !== -1 ? positionIndex : -1
  }
  
  if (userInfo.industry) {
    const industryIndex = industryOptions.findIndex(option => option === userInfo.industry)
    formData.industryIndex = industryIndex !== -1 ? industryIndex : -1
  }
  
  // 判断是否已经有完整信息（已提交过）
  isSubmitted.value = !!(userInfo.name && userInfo.phone_number && userInfo.email)
}

// 保存用户信息到服务器
const saveUserInfo = async () => {
  try {
    uni.showLoading({ title: '保存中...' })
    
    // 构建请求数据，转换表单数据为API格式
    const requestData = {
      name: formData.name.trim(),
      phone_number: formData.phone,
      email: formData.email,
      unit: formData.unit.trim(),
      department: formData.sectoral.trim(),
      birth_date: formData.birthDate,
      id_card: formData.idCard,
      // 将选择索引转换为具体内容
      position: formData.careerIndex !== -1 ? careerOptions[formData.careerIndex] : '',
      industry: formData.industryIndex !== -1 ? industryOptions[formData.industryIndex] : ''
    }
    
    // 如果需要手机验证码，添加验证码字段
    if (needPhoneVerification.value) {
      if (!formData.verifyCode) {
        uni.hideLoading()
        uni.showToast({
          title: '请输入验证码',
          icon: 'none'
        })
        return
      }
      requestData.verify_code = formData.verifyCode
    }
    
    // 发送网络请求 - 请根据你的实际API地址修改
    const response = await UserStore.updateinfo(requestData)
	console.log("response:",response)
    
    // 检查响应结果
    if (response.code === 200 ) { // 根据你的API响应格式调整
      // 请求成功，更新原始手机号
      originalPhone.value = formData.phone
      needPhoneVerification.value = false
      formData.verifyCode = ''
      
      isEditing.value = false
      uni.hideLoading()
      uni.showToast({
        title: '保存成功',
        icon: 'success'
      })
    } else {
      // 请求失败
      throw new Error(response.data.message || '保存失败')
    }
    
  } catch (error) {
    console.error('保存用户信息失败:', error)
    uni.hideLoading()
    uni.showToast({
      title: error.message || '保存失败，请重试',
      icon: 'none',
      duration: 2000
    })
  }
}

// 处理编辑按钮点击
const handleEdit = async () => {
  if (!isEditing.value) {
    // 点击编辑按钮，显示确认提示
    uni.showModal({
      title: '编辑提示',
      content: '表单编辑的内容会同步改变个人信息，是否继续编辑？',
      confirmText: '确认',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          isEditing.value = true
        }
      }
    })
  } else {
    // 点击保存按钮
    if (validateFormData()) {
      await saveUserInfo()
    }
  }
}

// 发送验证码
const sendVerifyCode = async () => {
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

  try {
    uni.showLoading({ title: '发送中...' })
    
    // 这里调用实际的发送验证码API
    // const response = await apiSendVerifyCode(formData.phone)
    
    // 开始倒计时
    countDown.value = 60
    const timer = setInterval(() => {
      countDown.value--
      if (countDown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)

    uni.hideLoading()
    uni.showToast({
      title: '验证码已发送',
      icon: 'success'
    })
  } catch (error) {
    uni.hideLoading()
    uni.showToast({
      title: '发送失败，请重试',
      icon: 'none'
    })
  }
}

// 日期选择
const onDateChange = (e) => {
  formData.birthDate = e.detail.value
}

// 职业选择
const onCareerChange = (e) => {
  formData.careerIndex = e.detail.value
}

// 行业选择
const onIndustryChange = (e) => {
  formData.industryIndex = e.detail.value
}

// 返回函数
function onBack() {
  uni.navigateBack();
}

// 表单数据验证（用于保存时）
const validateFormData = () => {
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

  // 如果需要验证码验证
  if (needPhoneVerification.value && !formData.verifyCode) {
    uni.showToast({ title: '请输入验证码', icon: 'none' })
    return false
  }

  if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    uni.showToast({ title: '请输入正确的邮箱格式', icon: 'none' })
    return false
  }

  if (formData.idCard && !/^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(formData.idCard)) {
    uni.showToast({ title: '请输入正确的身份证号码', icon: 'none' })
    return false
  }

  return true
}

// 表单提交验证
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

  if (!formData.email) {
    uni.showToast({ title: '请输入邮箱地址', icon: 'none' })
    return false
  }

  // 邮箱格式验证
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(formData.email)) {
    uni.showToast({ title: '请输入正确的邮箱格式', icon: 'none' })
    return false
  }

  if (!formData.unit.trim()) {
    uni.showToast({ title: '请输入单位名称', icon: 'none' })
    return false
  }

  if (formData.careerIndex === -1) {
    uni.showToast({ title: '请选择职业', icon: 'none' })
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
  if (isEditing.value) {
    uni.showToast({
      title: '请先保存编辑的内容',
      icon: 'none'
    })
    return
  }

  if (!validateForm()) return

  uni.showLoading({ title: '提交中...' })

  // 模拟提交
  setTimeout(() => {
    uni.hideLoading()
    uni.showToast({
      title: '报名成功！',
      icon: 'success'
    })
    
    isSubmitted.value = true
    
    // 可以在这里添加跳转逻辑
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  }, 2000)
}

// 在组件挂载时调用初始化函数
onMounted(() => {
  initFormData()
})
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
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 40rpx 40rpx 20rpx;
}

.form-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333333;
}

.edit-btn {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 16rpx 28rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
  font-size: 26rpx;
  border-radius: 50rpx;
  border: none;
  box-shadow: 0 4rpx 15rpx rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
  
  .btn-icon {
    font-size: 28rpx;
    font-weight: bold;
  }
  
  .btn-text {
    font-weight: 500;
  }
  
  &.save-mode {
    background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
    box-shadow: 0 4rpx 15rpx rgba(78, 205, 196, 0.4);
  }
  
  &:active {
    transform: translateY(2rpx);
    box-shadow: 0 2rpx 10rpx rgba(102, 126, 234, 0.3);
    
    &.save-mode {
      box-shadow: 0 2rpx 10rpx rgba(78, 205, 196, 0.3);
    }
  }
}

.form-content {
  padding: 0 40rpx;
}

.form-group {
  margin-bottom: 40rpx;
  
  .group-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333333;
    margin-bottom: 30rpx;
    padding-bottom: 16rpx;
    border-bottom: 2rpx solid #f0f0f0;
    position: relative;
    
    &::before {
      content: '';
      position: absolute;
      left: 0;
      bottom: -2rpx;
      width: 60rpx;
      height: 4rpx;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 2rpx;
    }
  }
}

.form-item {
  margin-bottom: 40rpx;
  
  .label {
    display: flex;
    align-items: center;
    gap: 4rpx;
    font-size: 28rpx;
    color: #333333;
    margin-bottom: 16rpx;
    font-weight: 500;
    
    .required {
      color: #ff4757;
      font-size: 26rpx;
    }
  }
  
  .input {
    width: 100%;
    height: 88rpx;
    background-color: #f8f9fa;
    border: 2rpx solid transparent;
    border-radius: 12rpx;
    padding: 0 20rpx;
    font-size: 28rpx;
    color: #333333;
    box-sizing: border-box;
    transition: all 0.3s ease;
    
    &.disabled {
      background-color: #f0f0f0;
      color: #999999;
      border-color: transparent;
    }
    
    &.editing {
      background-color: #ffffff;
      border-color: #667eea;
      box-shadow: 0 0 0 4rpx rgba(102, 126, 234, 0.1);
    }
    
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
      background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
      color: #ffffff;
      font-size: 24rpx;
      border-radius: 12rpx;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      white-space: nowrap;
      flex-shrink: 0;
      box-shadow: 0 2rpx 8rpx rgba(255, 107, 107, 0.3);
      transition: all 0.3s ease;
      
      &.disabled,
      &:disabled {
        background: #cccccc;
        color: #999999;
        box-shadow: none;
      }
      
      &:not(:disabled):not(.disabled):active {
        background: linear-gradient(135deg, #ee5a52 0%, #de4343 100%);
        transform: translateY(1rpx);
      }
    }
  }
  
  .picker-input {
    width: 100%;
    height: 88rpx;
    background-color: #f8f9fa;
    border: 2rpx solid transparent;
    border-radius: 12rpx;
    padding: 0 20rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    transition: all 0.3s ease;
    
    &.disabled {
      background-color: #f0f0f0;
      border-color: transparent;
      
      .picker-text {
        color: #999999;
      }
    }
    
    &.editing {
      background-color: #ffffff;
      border-color: #667eea;
      box-shadow: 0 0 0 4rpx rgba(102, 126, 234, 0.1);
    }
    
    .picker-text {
      font-size: 28rpx;
      color: #333333;
      
      &.placeholder {
        color: #cccccc;
      }
    }
    
    .picker-arrow {
      font-size: 24rpx;
      color: #667eea;
      font-weight: bold;
      transition: transform 0.3s ease;
    }
  }
}

.submit-section {
  padding: 20rpx 40rpx 40rpx;
  
  .submit-btn {
    width: 100%;
    height: 88rpx;
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
    color: #ffffff;
    font-size: 32rpx;
    font-weight: bold;
    border-radius: 12rpx;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4rpx 15rpx rgba(255, 107, 107, 0.4);
    transition: all 0.3s ease;
    
    &.disabled,
    &:disabled {
      background: #cccccc;
      color: #999999;
      box-shadow: none;
    }
    
    &:not(:disabled):not(.disabled):active {
      background: linear-gradient(135deg, #ee5a52 0%, #de4343 100%);
      transform: translateY(2rpx);
      box-shadow: 0 2rpx 10rpx rgba(255, 107, 107, 0.3);
    }
  }
}
</style>