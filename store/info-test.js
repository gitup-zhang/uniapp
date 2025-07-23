import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const token = ref('')
  const openid = ref('')
  const userInfo = ref({})
  const isLogin = ref(false)

  // 获取用户信息（需要 session_key 解密）
  const getUserProfile = (tokenVal) => {
    uni.getUserProfile({
      desc: '用于完善用户资料',
      success: (userRes) => {
        const { encryptedData, iv } = userRes

        uni.request({
          url: 'http://你的服务器地址/api/user/decrypt',
          method: 'POST',
          data: {
            encryptedData,
            iv,
            token: tokenVal
          },
          success: (decryptRes) => {
            if (decryptRes.data.code === 200) {
              console.log('用户信息：', decryptRes.data.data)
              userInfo.value = decryptRes.data.data
              isLogin.value = true
            } else {
              console.error('解密失败:', decryptRes.data.message)
            }
          }
        })
      },
      fail: (err) => {
        console.error('用户拒绝授权:', err)
      }
    })
  }

  // 微信登录
  const loginWithWeixin = () => {
    uni.login({
      provider: 'weixin',
      success: (loginRes) => {
        if (loginRes.code) {
          uni.request({
            url: 'http://你的服务器地址/api/info/login',
            method: 'POST',
            data: {
              code: loginRes.code
            },
            success: (res) => {
              if (res.data.code === 200) {
                token.value = res.data.data.token
                openid.value = res.data.data.openid
                console.log('登录成功，token:', token.value)
                getUserProfile(token.value)
              } else {
                console.error('登录失败:', res.data.message)
              }
            }
          })
        }
      }
    })
  }

  return {
    token,
    openid,
    userInfo,
    isLogin,
    loginWithWeixin
  }
})
