<template>
  <view class="container">
    <!-- 状态栏占位 -->
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
    <!-- 导航栏 -->
    <view class="nav-bar">
      <text class="nav-title">个人信息</text>
      <view class="nav-right"></view>
    </view>

    <!-- 未登录状态 - 简约登录界面 -->
    <view v-if="!userInfo.signal" class="login-container">
      <view class="login-card">
        <!-- Logo区域 -->
        <view class="logo-section">
          <image
            class="logo-image"
            src="/static/icon/logo.png"
            mode="aspectFit"
          />
          <text class="app-title">智慧平台</text>
          <text class="app-slogan">欢迎登录</text>
        </view>

        <!-- 登录方式切换 -->
        <view class="login-tabs">
          <view
            class="tab-item"
            :class="{ active: loginType === 'account' }"
            @click="switchLoginType('account')"
          >
            账号登录
          </view>
          <view
            class="tab-item"
            :class="{ active: loginType === 'sms' }"
            @click="switchLoginType('sms')"
          >
            短信登录
          </view>
          <view
            class="tab-item"
            :class="{ active: loginType === 'wechat' }"
            @click="switchLoginType('wechat')"
          >
            微信登录
          </view>
        </view>

        <!-- 账号密码登录 -->
        <view v-if="loginType === 'account'" class="login-form">
          <view class="form-item">
            <view
              class="input-wrapper"
              :class="{ error: accountForm.usernameError }"
            >
              <uni-icons type="person" size="20" color="#999" />
              <input
                class="form-input"
                placeholder="请输入账号/手机号"
                v-model="accountForm.username"
                :disabled="isLogging"
                @blur="validateUsername"
                @input="clearUsernameError"
              />
            </view>
            <text v-if="accountForm.usernameError" class="error-tip">{{
              accountForm.usernameError
            }}</text>
          </view>

          <view class="form-item">
            <view
              class="input-wrapper"
              :class="{ error: accountForm.passwordError }"
            >
              <uni-icons type="locked" size="20" color="#999" />
              <input
                class="form-input"
                placeholder="请输入密码"
                password
                v-model="accountForm.password"
                :disabled="isLogging"
                @blur="validatePassword"
                @input="clearPasswordError"
              />
              <text class="forgot-password" @click="handleForgotPassword"
                >忘记密码？</text
              >
            </view>
            <text v-if="accountForm.passwordError" class="error-tip">{{
              accountForm.passwordError
            }}</text>
          </view>

          <button
            class="login-btn"
            @click="handleAccountLogin"
            :disabled="isLogging"
          >
            <uni-load-more
              v-if="isLogging"
              status="loading"
              color="#fff"
              :content-text="{ contentnomore: '' }"
            />
            <text v-else>登录</text>
          </button>
        </view>

        <!-- 短信验证码登录 -->
        <view v-if="loginType === 'sms'" class="login-form">
          <view class="form-item">
            <view class="input-wrapper" :class="{ error: smsForm.phoneError }">
              <uni-icons type="phone" size="20" color="#999" />
              <input
                class="form-input"
                placeholder="请输入手机号"
                type="number"
                maxlength="11"
                v-model="smsForm.phone"
                :disabled="isLogging"
                @blur="validatePhone"
                @input="clearPhoneError"
              />
            </view>
            <text v-if="smsForm.phoneError" class="error-tip">{{
              smsForm.phoneError
            }}</text>
          </view>

          <view class="form-item">
            <view class="input-wrapper" :class="{ error: smsForm.codeError }">
              <uni-icons type="chatboxes" size="20" color="#999" />
              <input
                class="form-input"
                placeholder="请输入验证码"
                type="number"
                maxlength="6"
                v-model="smsForm.code"
                :disabled="isLogging"
                @blur="validateSmsCode"
                @input="clearCodeError"
              />
              <button
                class="sms-btn"
                @click="sendSmsCode"
                :disabled="!isValidPhone || smsCountdown > 0"
              >
                {{ smsCountdown > 0 ? `${smsCountdown}s` : "获取验证码" }}
              </button>
            </view>
            <text v-if="smsForm.codeError" class="error-tip">{{
              smsForm.codeError
            }}</text>
          </view>

          <button
            class="login-btn"
            @click="handleSmsLogin"
            :disabled="isLogging"
          >
            <uni-load-more
              v-if="isLogging"
              status="loading"
              color="#fff"
              :content-text="{ contentnomore: '' }"
            />
            <text v-else>登录</text>
          </button>
        </view>

        <!-- 微信登录 -->
        <view v-if="loginType === 'wechat'" class="login-form">
          <view class="wechat-info">
            <uni-icons type="weixin" size="60" color="#1aad19" />
            <text class="wechat-text">使用微信授权登录</text>
            <text class="wechat-desc">安全快捷，一键登录</text>
          </view>

          <button
            class="login-btn wechat-btn"
            open-type="getPhoneNumber"
            @getphonenumber="handlePhoneAuth"
            :disabled="isLogging"
            @click="wechatlogin"
          >
            <uni-load-more
              v-if="isLogging"
              status="loading"
              color="#fff"
              :content-text="{ contentnomore: '' }"
            />
            <view v-else class="btn-content">
              <uni-icons type="weixin" size="20" color="#fff" />
              <text>微信授权登录</text>
            </view>
          </button>
        </view>

        <!-- 隐私协议 -->
        <view class="privacy-notice">
          <text class="notice-text">登录即表示同意</text>
          <text class="notice-link" @click="showUserAgreement"
            >《用户协议》</text
          >
          <text class="notice-text">和</text>
          <text class="notice-link" @click="showPrivacyPolicy"
            >《隐私政策》</text
          >
        </view>
      </view>
    </view>

    <!-- 已登录状态 - 保持原有样式 -->
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
              <!-- <text class="user-signature">{{ userInfo.info.slogan || '点击设置个人签名' }}</text> -->
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
              <text class="stats-title">我的数据统计</text>
              <!-- <text class="stats-subtitle">累计在线 {{ userInfo.info.daysOnline || 0 }} 天</text> -->
            </view>
          </view>

          <view class="stats-grid">
            <view class="stat-item">
              <text class="stat-number">{{
                userInfo.info.newsViews || 0
              }}</text>
              <text class="stat-label">新闻阅读</text>
              <!--              <view class="stat-trend">
                <uni-icons type="up" size="12" color="#2ed573"/>
                <text class="trend-value">+12</text>
              </view> -->
            </view>

            <view class="stat-divider"></view>

            <view class="stat-item">
              <text class="stat-number">{{
                userInfo.info.policyViews || 0
              }}</text>
              <text class="stat-label">政策查看</text>
              <!-- <view class="stat-trend">
                <uni-icons type="up" size="12" color="#2ed573"/>
                <text class="trend-value">+5</text>
              </view> -->
            </view>

            <view class="stat-divider"></view>

            <view class="stat-item">
              <text class="stat-number">{{ userInfo.info.field || 3 }}</text>
              <text class="stat-label">关注领域</text>
              <!-- <view class="stat-trend">
                <uni-icons type="minus" size="12" color="#ffa726"/>
                <text class="trend-value">0</text>
              </view> -->
            </view>
          </view>
        </view>

        <!-- 活动区域 -->
        <view class="activity-section">
          <view class="section-header">
            <text class="section-title">我的活动</text>
            <view class="section-more" @click="viewAllActivities">
              <text class="more-text">查看全部</text>
              <uni-icons type="right" size="14" color="#999" />
            </view>
          </view>

          <ActivityTicket :activityData="myActivityData" @cancel="onCancel" />
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
import { ref, computed, onMounted, reactive, watch } from "vue";
import { useInfoStore } from "@/store/Info.js";
import ActivityTicket from "../../components/ActivityTicket/ActivityTicket.vue";

// Store 和基础数据
const userInfo = useInfoStore();
const SYSTEMINFO = uni.getSystemInfoSync();
const statusBarHeight = ref(SYSTEMINFO.statusBarHeight);

// 弹窗引用
const loadingPopup = ref(null);

// 加载状态
const isLogging = ref(false);
const loadingText = ref({ more: "加载中..." });

// 登录类型
const loginType = ref("account"); // account, sms, wechat

// 表单数据
const accountForm = reactive({
  username: "",
  password: "",
  usernameError: "",
  passwordError: "",
});

const smsForm = reactive({
  phone: "",
  code: "",
  phoneError: "",
  codeError: "",
});

// 短信验证码倒计时
const smsCountdown = ref(0);

// 计算属性
const isValidPhone = computed(() => {
  return /^1[3-9]\d{9}$/.test(smsForm.phone);
});

// 活动数据
const myActivityData = ref({
  title: "AI前沿研讨会",
  location: "北京中关村科技园",
  date: "8月10日-8月12日",
  checkText: "查看须知",
  joinText: "加入群聊",
});

// 页面挂载
onMounted(() => {
  initPage();
});

// 初始化页面
const initPage = async () => {
  try {
    // await userInfo.checkLoginStatus()
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
  } catch (error) {
    console.error("获取用户信息失败:", error);
  }
};

// 格式化手机号显示
const formatPhoneNumber = (phone) => {
  if (!phone) return "";
  return phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
};

// 切换登录方式
const switchLoginType = (type) => {
  loginType.value = type;
  // 清空表单数据和错误信息
  accountForm.username = "";
  accountForm.password = "";
  accountForm.usernameError = "";
  accountForm.passwordError = "";
  smsForm.phone = "";
  smsForm.code = "";
  smsForm.phoneError = "";
  smsForm.codeError = "";
};

// 表单验证方法
const validateUsername = () => {
  if (!accountForm.username.trim()) {
    accountForm.usernameError = "请输入账号或手机号";
    return false;
  }
  accountForm.usernameError = "";
  return true;
};

const validatePassword = () => {
  if (!accountForm.password.trim()) {
    accountForm.passwordError = "请输入密码";
    return false;
  }
  if (accountForm.password.length < 6) {
    accountForm.passwordError = "密码长度不能少于6位";
    return false;
  }
  accountForm.passwordError = "";
  return true;
};

const validatePhone = () => {
  if (!smsForm.phone.trim()) {
    smsForm.phoneError = "请输入手机号";
    return false;
  }
  if (!isValidPhone.value) {
    smsForm.phoneError = "请输入正确的手机号格式";
    return false;
  }
  smsForm.phoneError = "";
  return true;
};

const validateSmsCode = () => {
  if (!smsForm.code.trim()) {
    smsForm.codeError = "请输入验证码";
    return false;
  }
  if (smsForm.code.length !== 6) {
    smsForm.codeError = "验证码为6位数字";
    return false;
  }
  smsForm.codeError = "";
  return true;
};

// 清除错误信息的方法
const clearUsernameError = () => {
  if (accountForm.usernameError) {
    accountForm.usernameError = "";
  }
};

const clearPasswordError = () => {
  if (accountForm.passwordError) {
    accountForm.passwordError = "";
  }
};

const clearPhoneError = () => {
  if (smsForm.phoneError) {
    smsForm.phoneError = "";
  }
};

const clearCodeError = () => {
  if (smsForm.codeError) {
    smsForm.codeError = "";
  }
};

// 账号密码登录
const handleAccountLogin = async () => {
  // 验证表单
  const isUsernameValid = validateUsername();
  const isPasswordValid = validatePassword();

  if (!isUsernameValid || !isPasswordValid) {
    return;
  }

  try {
    isLogging.value = true;

    // 调用账号登录API
    const loginResult = await callAccountLoginAPI({
      username: accountForm.username,
      password: accountForm.password,
    });

    await userInfo.saveLoginInfo(loginResult);
    await refreshUserData();

    uni.showToast({
      title: "登录成功",
      icon: "success",
    });
  } catch (error) {
    console.error("账号登录失败:", error);
    uni.showToast({
      title: error.message || "登录失败，请重试",
      icon: "error",
    });
  } finally {
    isLogging.value = false;
  }
};

// 发送短信验证码
const sendSmsCode = async () => {
  // 验证手机号
  if (!validatePhone()) {
    return;
  }

  try {
    // 调用发送短信API
    // await callSendSmsAPI({ phone: smsForm.phone })

    // 开始倒计时
    smsCountdown.value = 60;
    const timer = setInterval(() => {
      smsCountdown.value--;
      if (smsCountdown.value <= 0) {
        clearInterval(timer);
      }
    }, 1000);

    uni.showToast({
      title: "验证码已发送",
      icon: "success",
    });
  } catch (error) {
    console.error("发送验证码失败:", error);
    uni.showToast({
      title: error.message || "发送失败，请重试",
      icon: "error",
    });
  }
};

// 短信验证码登录
const handleSmsLogin = async () => {
  // 验证表单
  const isPhoneValid = validatePhone();
  const isCodeValid = validateSmsCode();

  if (!isPhoneValid || !isCodeValid) {
    return;
  }

  try {
    isLogging.value = true;

    // 调用短信登录API
    const loginResult = await callSmsLoginAPI({
      phone: smsForm.phone,
      code: smsForm.code,
    });

    await userInfo.saveLoginInfo(loginResult);
    await refreshUserData();

    uni.showToast({
      title: "登录成功",
      icon: "success",
    });
  } catch (error) {
    console.error("短信登录失败:", error);
    uni.showToast({
      title: error.message || "登录失败，请重试",
      icon: "error",
    });
  } finally {
    isLogging.value = false;
  }
};
const wechatlogin = async () => {
  try {
    await userInfo.loginWithWeChat();
    initPage();
  } catch (e) {
    console.log(e);
  }
};

// 处理微信手机号授权
// const handlePhoneAuth = async (e) => {

// 	// 微信手机号授权逻辑
//   // console.log('手机号授权回调:', e)

//   // if (e.detail.errMsg !== 'getPhoneNumber:ok') {
//   //   uni.showToast({
//   //     title: '授权失败，请重试',
//   //     icon: 'error'
//   //   })
//   //   return
//   // }

//   try {
//     isLogging.value = true

//     const loginRes = await uni.login({
//       provider: 'weixin'
//     })

//     if (loginRes[1].errMsg !== 'login:ok') {
//       throw new Error('获取登录凭证失败')
//     }
// 	console.log(loginRes)

//   //   const loginData = {
//   //     code: loginRes[1].code,
//   //     phoneCode: e.detail.code,
//   //     encryptedData: e.detail.encryptedData,
//   //     iv: e.detail.iv
//   //   }

//   //   const loginResult = await callWechatLoginAPI(loginData)
//   //   await userInfo.saveLoginInfo(loginResult)
//   //   await refreshUserData()

//     uni.showToast({
//       title: '登录成功',
//       icon: 'success'
//     })

//   } catch (error) {
//     console.error('微信登录失败:', error)
//     uni.showToast({
//       title: '登录失败，请重试',
//       icon: 'error'
//     })
//   } finally {
//     isLogging.value = false
//   }
// }

// 忘记密码
const handleForgotPassword = () => {
  uni.navigateTo({
    url: "/pages/auth/forgot-password",
  });
};

// API调用函数
const callAccountLoginAPI = async (data) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: "https://your-api-domain.com/api/account-login",
      method: "POST",
      data,
      success: (res) => {
        if (res.data.success) {
          resolve(res.data.data);
        } else {
          reject(new Error(res.data.message || "登录失败"));
        }
      },
      fail: (error) => {
        reject(error);
      },
    });
  });
};

const callSendSmsAPI = async (data) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: "https://your-api-domain.com/api/send-sms",
      method: "POST",
      data,
      success: (res) => {
        if (res.data.success) {
          resolve(res.data.data);
        } else {
          reject(new Error(res.data.message || "发送失败"));
        }
      },
      fail: (error) => {
        reject(error);
      },
    });
  });
};

const callSmsLoginAPI = async (data) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: "https://your-api-domain.com/api/sms-login",
      method: "POST",
      data,
      success: (res) => {
        if (res.data.success) {
          resolve(res.data.data);
        } else {
          reject(new Error(res.data.message || "登录失败"));
        }
      },
      fail: (error) => {
        reject(error);
      },
    });
  });
};

const callWechatLoginAPI = async (data) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: "https://your-api-domain.com/api/wechat-login",
      method: "POST",
      data,
      success: (res) => {
        if (res.data.success) {
          resolve(res.data.data);
        } else {
          reject(new Error(res.data.message || "登录失败"));
        }
      },
      fail: (error) => {
        reject(error);
      },
    });
  });
};

// 跳转到个人资料页面
const goToProfile = () => {
  uni.navigateTo({
    url: "/pages/detail/profile",
  });
};

// 显示用户协议
const showUserAgreement = () => {
  uni.navigateTo({
    url: "/pages/agreement/user",
  });
};

// 显示隐私政策
const showPrivacyPolicy = () => {
  uni.navigateTo({
    url: "/pages/agreement/privacy",
  });
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

// 活动相关事件处理
const onCheck = (data) => {
  console.log("查看活动:", data);
  uni.navigateTo({
    url: "/pages/activity/detail?id=" + data.id,
  });
};

const onJoin = (data) => {
  console.log("加入群聊:", data);
  uni.showToast({
    title: "已加入群聊",
    icon: "success",
  });
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

// 简约登录界面样式
.login-container {
  min-height: calc(100vh - 200rpx);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40rpx;
}

.login-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 60rpx 40rpx 40rpx;
  width: 100%;
  box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.1);
}

.logo-section {
  text-align: center;
  margin-bottom: 60rpx;

  .logo-image {
    width: 120rpx;
    height: 120rpx;
    border-radius: 24rpx;
    margin-bottom: 24rpx;
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

.login-tabs {
  display: flex;
  background: #f8f9fa;
  border-radius: 16rpx;
  padding: 8rpx;
  margin-bottom: 40rpx;

  .tab-item {
    flex: 1;
    text-align: center;
    padding: 20rpx 16rpx;
    font-size: 28rpx;
    color: #666;
    border-radius: 12rpx;
    transition: all 0.3s ease;
    font-weight: 500;

    &.active {
      background: #fff;
      color: #667eea;
      box-shadow: 0 4rpx 12rpx rgba(102, 126, 234, 0.15);
      font-weight: 600;
    }
  }
}

.login-form {
  .form-item {
    margin-bottom: 32rpx;

    .input-wrapper {
      display: flex;
      align-items: center;
      background: #f8f9fa;
      border-radius: 16rpx;
      padding: 0 24rpx;
      position: relative;
      border: 2rpx solid transparent;
      transition: all 0.3s ease;

      &.error {
        border-color: #ff4757;
        background: rgba(255, 71, 87, 0.05);
      }

      .form-input {
        flex: 1;
        height: 88rpx;
        font-size: 30rpx;
        color: #333;
        margin-left: 16rpx;
      }

      .forgot-password {
        font-size: 26rpx;
        color: #667eea;
        position: absolute;
        right: 24rpx;
      }

      .sms-btn {
        background: #667eea;
        color: #fff;
        border: none;
        border-radius: 12rpx;
        padding: 16rpx 24rpx;
        font-size: 24rpx;
        margin-left: 16rpx;

        &:disabled {
          background: #ccc;
        }

        &::after {
          border: none;
        }
      }
    }

    .error-tip {
      display: block;
      color: #ff4757;
      font-size: 24rpx;
      margin-top: 12rpx;
      margin-left: 24rpx;
      animation: shake 0.5s ease-in-out;
    }
  }

  .wechat-info {
    text-align: center;
    padding: 60rpx 0;

    .wechat-text {
      display: block;
      font-size: 32rpx;
      color: #333;
      margin: 24rpx 0 12rpx;
      font-weight: 600;
    }

    .wechat-desc {
      display: block;
      font-size: 26rpx;
      color: #666;
    }
  }

  .login-btn {
    width: 100%;
    height: 88rpx;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    border-radius: 16rpx;
    color: #fff;
    font-size: 32rpx;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 32rpx;

    &:disabled {
      opacity: 0.6;
    }

    &::after {
      border: none;
    }

    &.wechat-btn {
      background: linear-gradient(135deg, #1aad19 0%, #259b24 100%);

      .btn-content {
        display: flex;
        align-items: center;

        text {
          margin-left: 12rpx;
        }
      }
    }
  }
}

.privacy-notice {
  text-align: center;
  margin-top: 40rpx;

  .notice-text,
  .notice-link {
    font-size: 24rpx;
    color: #999;
  }

  .notice-link {
    color: #667eea;
    font-weight: 500;
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

      .user-signature {
        display: block;
        font-size: 26rpx;
        opacity: 0.9;
        line-height: 1.3;
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

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5rpx);
  }
  75% {
    transform: translateX(5rpx);
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

      .stats-subtitle {
        display: block;
        font-size: 26rpx;
        color: #ff4757;
        font-weight: 500;
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

      .stat-trend {
        display: flex;
        align-items: center;
        justify-content: center;

        .trend-value {
          font-size: 22rpx;
          color: #2ed573;
          margin-left: 4rpx;
          font-weight: 600;
        }
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
  .login-card {
    margin: 0 20rpx;
    padding: 40rpx 24rpx;
  }

  .header {
    padding: 24rpx;
  }

  .main-content {
    padding: 24rpx;
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
// }
</style>
