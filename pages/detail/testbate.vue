<template>
  <view class="profile-container">
    
	<uni-nav-bar
	  statusBar="true"
	  backgroundColor="#ff4757"
	  fixed="true"
	  :border="false"
	  leftIcon="left"
	  @clickLeft="goBack"
	>
	  <!-- 居中标题插槽 -->
	  <template v-slot:default>
	    <view class="navbar-center">
	      <text class="navbar-title">个人信息</text>
	    </view>
	  </template>
	</uni-nav-bar>

    <!-- 头部背景装饰 -->
    <view class="header-decoration">
      <view class="deco-circle deco-1"></view>
      <view class="deco-circle deco-2"></view>
      <view class="deco-circle deco-3"></view>
    </view>

    <!-- 个人信息内容 -->
    <view class="profile-content">
      <!-- 头像区域 -->
      <view class="avatar-section">
        <view class="avatar-wrapper" @click="changeAvatar">
          <image 
            class="profile-avatar" 
            :src="userInfo.info.avatar_url || '/static/icon/empty.png'" 
            mode="aspectFill"
          />
          <view class="avatar-overlay">
            <uni-icons type="camera" size="24" color="#fff"/>
          </view>
          <view class="online-badge">
            <view class="badge-dot"></view>
          </view>
        </view>
        <!-- 修改：姓名变为可点击编辑 -->
        <text class="username clickable-name" @click="editField('name')">
          {{ userInfo.info.name || '点击设置姓名' }}
        </text>
        <text class="user-id">ID: {{ userInfo.info.userId || '123456789' }}</text>
      </view>

      <!-- 信息卡片列表 -->
      <view class="info-cards">
        <!-- 基本信息卡片 -->
        <view class="info-card">
          <view class="card-header">
            <view class="header-icon basic-icon">
              <uni-icons type="person" size="18" color="#fff"/>
            </view>
            <text class="card-title">基本信息</text>
          </view>
          <view class="card-content">
            <view class="info-item clickable" @click="editField('nickname')">
              <view class="item-icon">
                <uni-icons type="person-filled" size="16" color="#666"/>
              </view>
              <view class="item-content">
                <text class="item-label">昵称</text>
                <text class="item-value">{{ userInfo.info.nickname || '点击设置' }}</text>
              </view>
              <view class="item-arrow">
                <uni-icons type="right" size="14" color="#ccc"/>
              </view>
            </view>
            <view class="info-item clickable" @click="editField('gender')">
              <view class="item-icon">
                <uni-icons type="flag" size="16" color="#666"/>
              </view>
              <view class="item-content">
                <text class="item-label">性别</text>
                <text class="item-value">{{ getGenderText(userInfo.info.gender) }}</text>
              </view>
              <view class="item-arrow">
                <uni-icons type="right" size="14" color="#ccc"/>
              </view>
            </view>
          </view>
        </view>

        <!-- 工作信息卡片 -->
        <view class="info-card">
          <view class="card-header">
            <view class="header-icon work-icon">
              <uni-icons type="briefcase" size="18" color="#fff"/>
            </view>
            <text class="card-title">工作信息</text>
          </view>
          <view class="card-content">
            <view class="info-item clickable" @click="editField('unit')">
              <view class="item-icon">
                <uni-icons type="home" size="16" color="#666"/>
              </view>
              <view class="item-content">
                <text class="item-label">单位</text>
                <text class="item-value">{{ userInfo.info.unit || '点击设置单位' }}</text>
              </view>
              <view class="item-arrow">
                <uni-icons type="right" size="14" color="#ccc"/>
              </view>
            </view>
            <view class="info-item clickable" @click="editField('department')">
              <view class="item-icon">
                <uni-icons type="gear" size="16" color="#666"/>
              </view>
              <view class="item-content">
                <text class="item-label">部门</text>
                <text class="item-value">{{ userInfo.info.department || '点击设置部门' }}</text>
              </view>
              <view class="item-arrow">
                <uni-icons type="right" size="14" color="#ccc"/>
              </view>
            </view>
            <!-- 修改：职位改为选择器 -->
            <view class="info-item clickable" @click="editField('position')">
              <view class="item-icon">
                <uni-icons type="star" size="16" color="#666"/>
              </view>
              <view class="item-content">
                <text class="item-label">职位</text>
                <text class="item-value">{{ userInfo.info.position || '点击选择职位' }}</text>
              </view>
              <view class="item-arrow">
                <uni-icons type="right" size="14" color="#ccc"/>
              </view>
            </view>
            <view class="info-item clickable" @click="editField('industry')">
              <view class="item-icon">
                <uni-icons type="calendar" size="16" color="#666"/>
              </view>
              <view class="item-content">
                <text class="item-label">行业</text>
                <text class="item-value">{{ userInfo.info.industry || '点击选择行业' }}</text>
              </view>
              <view class="item-arrow">
                <uni-icons type="right" size="14" color="#ccc"/>
              </view>
            </view>
          </view>
        </view>

        <!-- 联系方式卡片 -->
        <view class="info-card">
          <view class="card-header">
            <view class="header-icon contact-icon">
              <uni-icons type="phone" size="18" color="#fff"/>
            </view>
            <text class="card-title">联系方式</text>
          </view>
          <view class="card-content">
            <view class="info-item clickable" @click="editField('phone')">
              <view class="item-icon">
                <uni-icons type="phone-filled" size="16" color="#666"/>
              </view>
              <view class="item-content">
                <text class="item-label">手机号码</text>
                <text class="item-value">{{ formatPhoneNumber(userInfo.info.phone_number) }}</text>
              </view>
              <view class="item-arrow">
                <uni-icons type="right" size="14" color="#ccc"/>
              </view>
            </view>
            <view class="info-item clickable" @click="editField('email')">
              <view class="item-icon">
                <uni-icons type="email" size="16" color="#666"/>
              </view>
              <view class="item-content">
                <text class="item-label">邮箱地址</text>
                <text class="item-value">{{ userInfo.info.email || '点击绑定邮箱' }}</text>
              </view>
              <view class="item-arrow">
                <uni-icons type="right" size="14" color="#ccc"/>
              </view>
            </view>
          </view>
        </view>
      </view> 
      <!-- 退出登录按钮 -->
      <view class="logout-section">
        <button class="logout-btn" @click="confirmLogout">
          <uni-icons type="loop" size="20" color="#ff4757"/>
          <text class="logout-text">退出登录</text>
        </button>
      </view>
    </view>

    <!-- 编辑字段弹窗 -->
    <uni-popup ref="editPopup" type="center" :mask-click="false">
      <view class="edit-modal">
        <view class="modal-header">
          <text class="modal-title">编辑{{ getFieldLabel(currentField) }}</text>
          <view class="modal-close" @click="closeEdit">
            <uni-icons type="closeempty" size="20" color="#999"/>
          </view>
        </view>
        
        <view class="modal-form">
          <!-- 普通输入框 -->
          <view v-if="isTextInput(currentField)" class="form-group">
            <input 
              class="form-input" 
              v-model="editValue" 
              :placeholder="getFieldPlaceholder(currentField)"
              :maxlength="getFieldMaxLength(currentField)"
              :type="currentField === 'phone' ? 'number' : 'text'"
            />
          </view>
          
          <!-- 手机号验证 -->
          <view v-if="currentField === 'phone'" class="form-group">
            <view class="phone-verify">
              <input 
                class="verify-input" 
                v-model="verifyCode" 
                placeholder="请输入验证码"
                maxlength="6"
                type="number"
              />
              <button 
                class="send-code-btn" 
                @click="sendVerifyCode"
                :disabled="!canSendCode || codeSending"
              >
                {{ getCodeButtonText() }}
              </button>
            </view>
          </view>
          
          <!-- 多行文本输入 -->
          <view v-if="currentField === 'slogan'" class="form-group">
            <textarea 
              class="form-textarea" 
              v-model="editValue" 
              placeholder="请输入个性签名"
              maxlength="100"
            />
          </view>
          
          <!-- 性别选择 -->
          <view v-if="currentField === 'gender'" class="form-group">
            <view class="gender-options">
              <view 
                class="gender-item" 
                :class="{ active: editValue === 'F' }"
                @click="editValue = 'F'"
              >
                <uni-icons type="person" size="16" :color="editValue === 'F' ? '#fff' : '#666'"/>
                <text class="gender-label">女</text>
              </view>
              <view 
                class="gender-item" 
                :class="{ active: editValue === 'M' }"
                @click="editValue = 'M'"
              >
                <uni-icons type="person" size="16" :color="editValue === 'M' ? '#fff' : '#666'"/>
                <text class="gender-label">男</text>
              </view>
            </view>
          </view>
          
          <!-- 生日选择 -->
          <view v-if="currentField === 'birthday'" class="form-group">
            <picker 
              mode="date" 
              :value="editValue" 
              @change="onDateChange"
            >
              <view class="date-picker">
                <text class="picker-text">{{ editValue || '请选择生日' }}</text>
                <uni-icons type="calendar" size="16" color="#999"/>
              </view>
            </picker>
          </view>
          
          <!-- 行业选择 -->
          <view v-if="currentField === 'industry'" class="form-group">
            <picker 
              :value="industryIndex" 
              :range="fieldstore.industory"
              @change="onIndustryChange"
            >
              <view class="industry-picker">
                <text class="picker-text">{{ editValue || '请选择行业' }}</text>
                <uni-icons type="calendar" size="16" color="#999"/>
              </view>
            </picker>
          </view>
          
          <!-- 修改：职位选择器 -->
          <view v-if="currentField === 'position'" class="form-group">
            <picker 
              :value="positionIndex" 
              :range="positionOptions"
              @change="onPositionChange"
            >
              <view class="position-picker">
                <text class="picker-text">{{ editValue || '请选择职位' }}</text>
                <uni-icons type="star" size="16" color="#999"/>
              </view>
            </picker>
          </view>
        </view>
        
        <view class="modal-actions">
          <button class="action-btn cancel-btn" @click="closeEdit">取消</button>
          <button class="action-btn save-btn" @click="saveField" :disabled="isSaving">
            {{ isSaving ? '保存中...' : '保存' }}
          </button>
        </view>
      </view>
    </uni-popup>

    <!-- 加载提示 -->
    <uni-popup ref="loadingPopup" type="center">
      <view class="loading-modal">
        <uni-load-more status="loading" :content-text="loadingText"/>
      </view>
    </uni-popup>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useInfoStore } from '@/store/Info.js'
import {usefieldstore} from '@/store/field.js'


// Store 和基础数据
const userInfo = useInfoStore()
const fieldstore=usefieldstore()
const SYSTEMINFO = uni.getSystemInfoSync()
const statusBarHeight = ref(SYSTEMINFO.statusBarHeight)

// 弹窗引用
const editPopup = ref(null)
const loadingPopup = ref(null)

// 状态变量
const isSaving = ref(false)
const loadingText = ref({ more: '加载中...' })
const currentField = ref('')
const editValue = ref('')
const verifyCode = ref('')
const codeSending = ref(false)
const countdown = ref(0)
const canSendCode = ref(true)

// // 行业选项
// let industryOptions = []

// 新增：职位选项
const positionOptions = [
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

// 计算当前选中的行业索引
const industryIndex = computed(() => {
  return fieldstore.industory.indexOf(editValue.value) >= 0 ? fieldstore.industory.indexOf(editValue.value) : 0
})

// 新增：计算当前选中的职位索引
const positionIndex = computed(() => {
  return positionOptions.indexOf(editValue.value) >= 0 ? positionOptions.indexOf(editValue.value) : 0
})

// 页面挂载
onMounted(() => {
  initPage()
})

// 初始化页面
const initPage = () => {
  // 页面初始化逻辑
  fieldstore.getindustory()
  
}

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}

// 格式化手机号
const formatPhoneNumber = (phone) => {
  if (!phone) return '未绑定'
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

// 获取性别文本
const getGenderText = (gender) => {
	console.log("获取到的性别：",gender)
  const genderMap = {
    'M': '男',
    'F': '女'
  }
  // return genderMap[gender] || '点击设置性别'
  return gender
}

// 获取字段标签
const getFieldLabel = (field) => {
  const labels = {
	'name': '姓名',
    'nickname': '昵称',
    'slogan': '个性签名',
    'gender': '性别',
    'birthday': '生日',
    'unit': '单位',
    'department': '部门',
    'position': '职位',
    'industry': '行业',
    'email': '邮箱',
    'phone': '手机号码'
  }
  return labels[field] || ''
}

// 获取字段占位符
const getFieldPlaceholder = (field) => {
  const placeholders = {
	'name': '请输入姓名',
    'nickname': '请输入昵称',
    'unit': '请输入单位名称',
    'department': '请输入部门名称',
    'position': '请选择职位',
    'email': '请输入邮箱地址',
    'phone': '请输入新手机号码'
  }
  return placeholders[field] || ''
}

// 获取字段最大长度
const getFieldMaxLength = (field) => {
  const maxLengths = {
	'name': 20,  
    'nickname': 20,
    'unit': 50,
    'department': 30,
    'position': 30,
    'email': 50,
    'phone': 11
  }
  return maxLengths[field] || 50
}

// 修改：判断是否为文本输入（职位不再是文本输入）
const isTextInput = (field) => {
  return ['name','nickname', 'unit', 'department', 'email', 'phone'].includes(field)
}

// 编辑字段
const editField = (field) => {
  currentField.value = field
  editValue.value = userInfo.info[field] || ''
  verifyCode.value = ''
  editPopup.value?.open()
}

// 关闭编辑弹窗
const closeEdit = () => {
  editPopup.value?.close()
  currentField.value = ''
  editValue.value = ''
  verifyCode.value = ''
  // 清除倒计时
  if (countdown.value > 0) {
    clearInterval(countdownTimer.value)
    countdown.value = 0
    canSendCode.value = true
  }
}

// 倒计时定时器
let countdownTimer = ref(null)

// 发送验证码
const sendVerifyCode = async () => {
  if (!editValue.value) {
    uni.showToast({
      title: '请先输入手机号',
      icon: 'none'
    })
    return
  }

  // 手机号格式验证
  const phoneRegex = /^1[3-9]\d{9}$/
  if (!phoneRegex.test(editValue.value)) {
    uni.showToast({
      title: '手机号格式不正确',
      icon: 'none'
    })
    return
  }

  try {
    codeSending.value = true
    
    // 调用发送验证码接口
    await sendPhoneVerifyCode(editValue.value)
    
    uni.showToast({
      title: '验证码已发送',
      icon: 'success'
    })
    
    // 开始倒计时
    startCountdown()
    
  } catch (error) {
    console.error('发送验证码失败:', error)
    uni.showToast({
      title: '发送失败，请重试',
      icon: 'error'
    })
  } finally {
    codeSending.value = false
  }
}

// 开始倒计时
const startCountdown = () => {
  canSendCode.value = false
  countdown.value = 60
  
  countdownTimer.value = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(countdownTimer.value)
      canSendCode.value = true
    }
  }, 1000)
}

// 获取验证码按钮文本
const getCodeButtonText = () => {
  if (codeSending.value) return '发送中...'
  if (countdown.value > 0) return `${countdown.value}s`
  return '发送验证码'
}

// 发送验证码API
const sendPhoneVerifyCode = async (phone) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: 'https://your-api-domain.com/api/phone/send-code',
      method: 'POST',
      data: { phone },
      header: {
        'Authorization': `Bearer ${userInfo.token}`
      },
      success: (res) => {
        if (res.data.success) {
          resolve(res.data.data)
        } else {
          reject(new Error(res.data.message || '发送失败'))
        }
      },
      fail: (error) => {
        reject(error)
      }
    })
  })
}

// 日期选择变化
const onDateChange = (e) => {
  editValue.value = e.detail.value
}

// 行业选择变化
const onIndustryChange = (e) => {
  const index = e.detail.value
  editValue.value = fieldstore.industory[index]
}

// 新增：职位选择变化
const onPositionChange = (e) => {
  const index = e.detail.value
  editValue.value = positionOptions[index]
}

// 保存字段
const saveField = async () => {
  if (!editValue.value && currentField.value !== 'slogan') {
    uni.showToast({
      title: `请输入${getFieldLabel(currentField.value)}`,
      icon: 'none'
    })
    return
  }

  // 手机号特殊处理
  if (currentField.value === 'phone') {
    if (!verifyCode.value) {
      uni.showToast({
        title: '请输入验证码',
        icon: 'none'
      })
      return
    }
    
    const phoneRegex = /^1[3-9]\d{9}$/
    if (!phoneRegex.test(editValue.value)) {
      uni.showToast({
        title: '手机号格式不正确',
        icon: 'none'
      })
      return
    }
    
    if (verifyCode.value.length !== 6) {
      uni.showToast({
        title: '验证码格式不正确',
        icon: 'none'
      })
      return
    }
  }

  // 邮箱格式验证
  if (currentField.value === 'email' && editValue.value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(editValue.value)) {
      uni.showToast({
        title: '邮箱格式不正确',
        icon: 'none'
      })
      return
    }
  }

  try {
    isSaving.value = true
    
    // 调用保存接口
    const updateData = {
      [currentField.value]: editValue.value
    }
    
    // 手机号需要传递验证码
    if (currentField.value === 'phone') {
      updateData.verifyCode = verifyCode.value
    }
    console.log("更新的数据：",updateData)
    
    // 更新本地数据
	await userInfo.updateinfo(updateData)
    await userInfo.getinfo()
    
    uni.showToast({
      title: '保存成功',
      icon: 'success'
    })
    
    closeEdit()
    
  } catch (error) {
    console.error('保存失败:', error)
    uni.showToast({
      title: error.message || '保存失败，请重试',
      icon: 'error'
    })
  } finally {
    isSaving.value = false
  }
}

// 更换头像
const changeAvatar = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
		
      uploadAvatar(res.tempFilePaths[0])
    }
  })
}

// 上传头像
const uploadAvatar = async (filePath) => {
  try {
    showLoading('上传头像中...')
	const res=await userInfo.uploadimage(filePath)
	await userInfo.updateinfo({'avatar_url':res.data.url})
	await userInfo.getinfo()
	console.log("res:",res)
    
    uni.showToast({
      title: '头像更新成功',
      icon: 'success'
    })
  } catch (error) {
    uni.showToast({
      title: '头像更新失败',
      icon: 'error'
    })
  } finally {
    hideLoading()
  }
}

// 修改密码
const changePassword = () => {
  uni.navigateTo({
    url: '/pages/change-password/index'
  })
}

// 隐私设置
const privacySettings = () => {
  uni.navigateTo({
    url: '/pages/privacy/index'
  })
}

// 确认退出登录
const confirmLogout = () => {
  uni.showModal({
    title: '确认退出',
    content: '确定要退出当前账号吗？',
    confirmColor: '#ff4757',
    success: (res) => {
      if (res.confirm) {
        logout()
      }
    }
  })
}

// 退出登录
const logout = async () => {
  try {
    showLoading('正在退出...')
    
    // 清空本地存储
    await userInfo.deleteinfo()
    
    uni.showToast({
      title: '已退出登录',
      icon: 'success'
    })
    
    // 返回首页或登录页
    uni.reLaunch({
      url: '/pages/mymessage/mymessage'
    })
    
  } catch (error) {
    console.error('退出登录失败:', error)
  } finally {
    hideLoading()
  }
}

// 显示加载提示
const showLoading = (text = '加载中...') => {
  loadingText.value.more = text
  loadingPopup.value?.open()
}

// 隐藏加载提示
const hideLoading = () => {
  loadingPopup.value?.close()
}
</script>

<style lang="scss" scoped>
	@import "../../style/detail.css";
.profile-container {
  min-height: 100vh;
  background: linear-gradient(180deg, #ff4757 0%, #ff6b7a 100%);
  position: relative;
}

.status-bar {
	
  background: transparent;
}


.nav-bar {
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32rpx;
  position: relative;
  z-index: 10;
  


  .nav-back {
    width: 64rpx;
    height: 64rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    backdrop-filter: blur(10rpx);
  }

  .nav-title {
    font-size: 36rpx;
    font-weight: 700;
    color: #fff;
  }

  .nav-right {
    width: 64rpx;
  }
}

.header-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 400rpx;
  pointer-events: none;

  .deco-circle {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);

    &.deco-1 {
      width: 200rpx;
      height: 200rpx;
      top: 100rpx;
      right: -50rpx;
    }

    &.deco-2 {
      width: 120rpx;
      height: 120rpx;
      top: 200rpx;
      left: -30rpx;
    }

    &.deco-3 {
      width: 80rpx;
      height: 80rpx;
      top: 320rpx;
      right: 100rpx;
    }
  }
}

.profile-content {
  position: relative;
  z-index: 1;
  padding: 0 32rpx 32rpx;
}

.avatar-section {
  text-align: center;
  margin-bottom: 32rpx;
  padding-top: 20rpx;

  .avatar-wrapper {
    position: relative;
    display: inline-block;
    margin-bottom: 24rpx;

    .profile-avatar {
      width: 160rpx;
      height: 160rpx;
      border-radius: 50%;
      border: 6rpx solid rgba(255, 255, 255, 0.3);
      box-shadow: 0 12rpx 32rpx rgba(0, 0, 0, 0.15);
    }

    .avatar-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.4);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    &:active .avatar-overlay {
      opacity: 1;
    }

    .online-badge {
      position: absolute;
      bottom: 12rpx;
      right: 12rpx;
      width: 32rpx;
      height: 32rpx;
      background: #fff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);

      .badge-dot {
        width: 16rpx;
        height: 16rpx;
        background: #2ed573;
        border-radius: 50%;
        animation: pulse 2s infinite;
      }
    }
  }

  .username {
    display: block;
    font-size: 40rpx;
    font-weight: 700;
    color: #fff;
    margin-bottom: 8rpx;
    
    /* 新增：可点击姓名样式 */
    &.clickable-name {
      cursor: pointer;
      position: relative;
      padding: 8rpx 16rpx;
      border-radius: 20rpx;
      transition: all 0.3s ease;
      
      &:hover {
        background: rgba(255, 255, 255, 0.1);
      }
      
      &:active {
        background: rgba(255, 255, 255, 0.2);
        transform: scale(0.98);
      }
      
      /* 添加编辑图标提示 */
      &::after {
        content: '';
        display: inline-block;
        width: 24rpx;
        height: 24rpx;
        background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTExLjc0MiAyLjAxNUM2LjQxIDMuNzUgMS41IDUuNDE1IDEuNSA3LjVDMS41IDkuNTg1IDYuNDEgMTEuMjUgMTEuNzQyIDEyLjk4NUMxMi4wMzQgMTMuMDk3IDEyLjM1OSAxMy4wOTcgMTIuNjUxIDEyLjk4NUMxNy45ODMgMTEuMjUgMjIuOTAzIDkuNTg1IDIyLjkwMyA3LjVDMjIuOTAzIDUuNDE1IDE3Ljk4MyAzLjc1IDEyLjY1MSAyLjAxNUMxMi4zNTkgMS45MDMgMTIuMDM0IDEuOTAzIDExLjc0MiAyLjAxNVoiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuNyIvPgo8L3N2Zz4K') no-repeat center;
        background-size: contain;
        margin-left: 8rpx;
        opacity: 0.7;
      }
    }
  }

  .user-id {
    display: block;
    font-size: 26rpx;
    color: rgba(255, 255, 255, 0.8);
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.info-cards {
  .info-card {
    background: #fff;
    border-radius: 24rpx;
    margin-bottom: 24rpx;
    overflow: hidden;
    box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.08);

    .card-header {
      display: flex;
      align-items: center;
      padding: 32rpx;
      background: linear-gradient(135deg, #f8f9fa, #fff);
      border-bottom: 1rpx solid #f0f0f0;

      .header-icon {
        width: 64rpx;
        height: 64rpx;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 24rpx;

        &.basic-icon {
          background: linear-gradient(135deg, #667eea, #764ba2);
        }

        &.work-icon {
          background: linear-gradient(135deg, #f093fb, #f5576c);
        }

        &.contact-icon {
          background: linear-gradient(135deg, #2ed573, #7bed9f);
        }

        &.stats-icon {
          background: linear-gradient(135deg, #ff9a9e, #fecfef);
        }

        &.security-icon {
          background: linear-gradient(135deg, #ffa726, #ffcc02);
        }
      }

      .card-title {
        font-size: 32rpx;
        font-weight: 700;
        color: #333;
      }
    }

    .card-content {
      padding: 0 32rpx 32rpx;

      .info-item {
        display: flex;
        align-items: flex-start;
        padding: 24rpx 0;
        border-bottom: 1rpx solid #f8f9fa;
        position: relative;

        &:last-child {
          border-bottom: none;
        }

        &.clickable {
          cursor: pointer;
          transition: background-color 0.3s ease;

          &:hover {
            background: #f8f9fa;
          }

          &:active {
            background: #f0f0f0;
          }
        }

        .item-icon {
          width: 40rpx;
          height: 40rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 24rpx;
          margin-top: 4rpx;
        }

        .item-content {
          flex: 1;

          .item-label {
            display: block;
            font-size: 28rpx;
            color: #666;
            margin-bottom: 8rpx;
          }

          .item-value {
            display: block;
            font-size: 30rpx;
            color: #333;
            font-weight: 500;
            line-height: 1.4;
          }
        }

        .item-arrow {
          width: 32rpx;
          height: 32rpx;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }

      .stats-grid {
        display: flex;
        padding: 24rpx 0;

        .stats-item {
          flex: 1;
          text-align: center;

          .stats-number {
            display: block;
            font-size: 48rpx;
            font-weight: 700;
            color: #333;
            margin-bottom: 8rpx;
          }

          .stats-label {
            display: block;
            font-size: 26rpx;
            color: #666;
          }
        }
      }
    }
  }
}

.logout-section {
  margin-top: 40rpx;
  padding: 0 32rpx;

  .logout-btn {
    width: 100%;
    height: 88rpx;
    background: #fff;
    border: 2rpx solid #ff4757;
    border-radius: 44rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;

    &:active {
      background: #ff4757;
      transform: scale(0.98);

      .logout-text {
        color: #fff;
      }
    }

    &::after {
      border: none;
    }

    .logout-text {
      font-size: 32rpx;
      font-weight: 600;
      color: #ff4757;
      margin-left: 12rpx;
      transition: color 0.3s ease;
    }
  }
}

// 编辑弹窗样式
.edit-modal {
  background: #fff;
  border-radius: 24rpx;
  width: 680rpx;
  max-width: 92vw;
  max-height: 80vh;
  overflow: hidden;

  .modal-header {
    height: 100rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 32rpx;
    border-bottom: 1rpx solid #f0f0f0;
    background: #fff;

    .modal-title {
      font-size: 32rpx;
      font-weight: 700;
      color: #333;
    }

    .modal-close {
      width: 60rpx;
      height: 60rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: background-color 0.3s ease;

      &:active {
        background: #f8f9fa;
      }
    }
  }

  .modal-form {
    padding: 40rpx;
    max-height: 60vh;
    overflow-y: auto;

    .form-group {
      margin-bottom: 32rpx;

      &:last-child {
        margin-bottom: 0;
      }

      .form-input{
        width: 100%;
        height: 96rpx;
        padding: 0 32rpx;
        border: 2rpx solid #e8e8e8;
        border-radius: 16rpx;
        font-size: 32rpx;
        color: #333;
        background: #fff;
        transition: border-color 0.3s ease;
        box-sizing: border-box;
        line-height: 96rpx;
        display: flex;
        align-items: center;

        &:focus {
          border-color: #ff4757;
          outline: none;
        }

        &::placeholder {
          color: #999;
          line-height: 96rpx;
        }
      }

      .form-textarea {
		   width: 100%;
		          padding: 28rpx 24rpx;
		          border: 2rpx solid #e8e8e8;
		          border-radius: 16rpx;
		          font-size: 30rpx;
		          color: #333;
		          background: #fff;
		          transition: border-color 0.3s ease;
		          box-sizing: border-box;
		          line-height: 1.4;
        height: 160rpx;
        line-height: 1.6;
        padding: 24rpx 32rpx;
        resize: none;
        font-family: inherit;
        vertical-align: top;
      }

      .phone-verify {
        display: flex;
        gap: 20rpx;
        align-items: stretch;

        .verify-input {
          flex: 1;
          height: 96rpx;
          padding: 0 32rpx;
          border: 2rpx solid #e8e8e8;
          border-radius: 16rpx;
          font-size: 32rpx;
          color: #333;
          background: #fff;
          transition: border-color 0.3s ease;
          box-sizing: border-box;
          line-height: 96rpx;

          &:focus {
            border-color: #ff4757;
            outline: none;
          }

          &::placeholder {
            color: #999;
            line-height: 96rpx;
          }
        }

        .send-code-btn {
          height: 96rpx;
          padding: 0 40rpx;
          background: linear-gradient(135deg, #ff4757, #ff6b7a);
          color: #fff;
          border: none;
          border-radius: 16rpx;
          font-size: 28rpx;
          font-weight: 600;
          white-space: nowrap;
          transition: all 0.3s ease;
          min-width: 200rpx;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: center;

          &:disabled {
            opacity: 0.6;
            background: #ccc;
          }

          &:not(:disabled):active {
            transform: scale(0.98);
          }

          &::after {
            border: none;
          }
        }
      }

      .gender-options {
        display: flex;
        gap: 24rpx;

        .gender-item {
          flex: 1;
          height: 96rpx;
          border: 2rpx solid #e8e8e8;
          border-radius: 16rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          cursor: pointer;

          &.active {
            border-color: #ff4757;
            background: #ff4757;
          }

          &:active {
            transform: scale(0.98);
          }

          .gender-label {
            margin-left: 8rpx;
            font-size: 32rpx;
            font-weight: 500;
            color: #333;
            transition: color 0.3s ease;
          }

          &.active .gender-label {
            color: #fff;
          }
        }
      }

      .date-picker, .industry-picker, .position-picker {
        height: 96rpx;
        padding: 0 32rpx;
        border: 2rpx solid #e8e8e8;
        border-radius: 16rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #fff;
        transition: border-color 0.3s ease;
        box-sizing: border-box;

        &:active {
          border-color: #ff4757;
        }

        .picker-text {
          font-size: 32rpx;
          color: #333;
          flex: 1;
          line-height: 1;
        }
      }
    }
  }

  .modal-actions {
    padding: 32rpx 40rpx 40rpx;
    display: flex;
    gap: 24rpx;
    border-top: 1rpx solid #f0f0f0;
    background: #fff;

    .action-btn {
      flex: 1;
      height: 88rpx;
      border-radius: 16rpx;
      font-size: 30rpx;
      font-weight: 600;
      border: none;
      transition: all 0.3s ease;

      &:active {
        transform: scale(0.98);
      }

      &::after {
        border: none;
      }

      &.cancel-btn {
        background: #f8f9fa;
        color: #666;

        &:active {
          background: #e8e8e8;
        }
      }

      &.save-btn {
        background: linear-gradient(135deg, #ff4757, #ff6b7a);
        color: #fff;
        box-shadow: 0 4rpx 16rpx rgba(255, 71, 87, 0.3);

        &:disabled {
          opacity: 0.7;
          transform: none;
        }
      }
    }
  }
}

// 加载提示样式
.loading-modal {
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
  .profile-content {
    padding: 0 20rpx 20rpx;
  }
  
  .nav-bar {
    padding: 0 20rpx;
  }
  
  .edit-modal {
    width: 95vw;
  }
  
  .info-card .card-content {
    padding: 0 20rpx 20rpx;
  }
}

// 暗色主题适配
@media (prefers-color-scheme: dark) {
  .info-card {
    background: #2d2d2d;
    
    .card-header {
      background: linear-gradient(135deg, #333, #2d2d2d);
      border-bottom-color: #444;
    }
    
    .card-title {
      color: #fff;
    }
    
    .item-label {
      color: #ccc;
    }
    
    .item-value {
      color: #fff;
    }
    
    .info-item {
      border-bottom-color: #444;
      
      &.clickable:hover {
        background: #3d3d3d;
      }
      
      &.clickable:active {
        background: #4d4d4d;
      }
    }
    
    .stats-number {
      color: #fff;
    }
    
    .stats-label {
      color: #ccc;
    }
  }
  
  .logout-btn {
    background: #2d2d2d;
    border-color: #ff4757;
  }
  
  .edit-modal {
    background: #2d2d2d;
    
    .modal-header {
      background: #2d2d2d;
      border-bottom-color: #444;
    }
    
    .modal-title {
      color: #fff;
    }
    
    .phone-verify {
      .verify-input {
        background: #3d3d3d;
        border-color: #4d4d4d;
        color: #fff;
        
        &::placeholder {
          color: #999;
        }
      }
    }
    
    .form-input, .form-textarea, .date-picker, .industry-picker, .position-picker {
      background: #3d3d3d;
      border-color: #4d4d4d;
      color: #fff;
      
      &::placeholder {
        color: #999;
      }
    }
    
    .gender-item {
      background: #3d3d3d;
      border-color: #4d4d4d;
      
      .gender-label {
        color: #fff;
      }
    }
    
    .picker-text {
      color: #fff;
    }
    
    .modal-actions {
      background: #2d2d2d;
      border-top-color: #444;
    }
    
    .cancel-btn {
      background: #3d3d3d;
      color: #ccc;
    }
  }
}
</style>