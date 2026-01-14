// utils/request.js

// 按平台设定 BASE_URL
let BASE_URL = ''

// #ifdef H5
BASE_URL = import.meta.env.DEV ? '/api' : 'http://47.113.194.28:8080/api'
// #endif

// #ifndef H5
BASE_URL = 'http://47.113.194.28:8080/api'
// #endif

// 引入 pinia store
import { useInfoStore } from '@/store/Info.js'

// 标记是否正在刷新token
let isRefreshing = false
// 存储等待重试的请求队列
let requestQueue = []

// 辅助函数：将对象参数转为 URL 查询字符串
function buildQuery(params) {
  return Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&')
}

// 处理请求队列
const processQueue = (error, token = null) => {
  requestQueue.forEach(promise => {
    if (error) {
      promise.reject(error)
    } else {
      promise.resolve(token)
    }
  })
  requestQueue = []
}

// 通用请求方法
function request(url, method, data = {}, header = {}, isRetry = false) {
  const userStore = useInfoStore()
  const token = userStore.accessToken
  
  console.log("获取到的accessToken：" + token)

  let requestUrl = url
  const upperMethod = method.toUpperCase()

  if (upperMethod === 'GET' && Object.keys(data).length > 0) {
    const queryString = buildQuery(data)
    requestUrl += (requestUrl.includes('?') ? '&' : '?') + queryString
  }

  return new Promise((resolve, reject) => {
    uni.request({
      url: BASE_URL + requestUrl,
      method: upperMethod,
      header: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
        ...header
      },
      data: upperMethod === 'GET' ? undefined : data,
      success: async (res) => {
        // 请求成功
        if (res.statusCode === 200) {
          resolve(res.data)
        } 
        // Token过期处理
        else if (res.statusCode === 401 || res.data?.code === 40002) {
          console.log('Token过期，尝试刷新...')
          
          // 如果已经是重试请求，直接跳转登录
          if (isRetry) {
            console.log('重试失败，跳转登录')
            userStore.deleteinfo()
            uni.showToast({
              title: '登录已过期，请重新登录',
              icon: 'none'
            })
            uni.navigateTo({
              url: '/pages/login/login'
            })
            reject(new Error('登录已过期'))
            return
          }
          
          // 如果正在刷新token，将请求加入队列
          if (isRefreshing) {
            console.log('等待token刷新...')
            return new Promise((resolve, reject) => {
              requestQueue.push({
                resolve: (newToken) => {
                  // token刷新成功，重新发起请求
                  request(url, method, data, header, true)
                    .then(resolve)
                    .catch(reject)
                },
                reject
              })
            })
          }
          
          // 开始刷新token
          isRefreshing = true
          
          try {
            const refreshSuccess = await userStore.refreshAccessToken()
            
            if (refreshSuccess) {
              // 刷新成功，处理队列中的请求
              processQueue(null, userStore.accessToken)
              
              // 重新发起当前请求
              const retryRes = await request(url, method, data, header, true)
              resolve(retryRes)
            } else {
              // 刷新失败，清空队列
              processQueue(new Error('Token刷新失败'))
              reject(new Error('Token刷新失败'))
            }
          } catch (error) {
            console.error('Token刷新异常:', error)
            processQueue(error)
            reject(error)
          } finally {
            isRefreshing = false
          }
        }
        // 刷新令牌过期
        else if (res.data?.code === 40003) {
          console.log('刷新令牌过期，需要重新登录')
          userStore.deleteinfo()
          uni.showToast({
            title: '登录已过期，请重新登录',
            icon: 'none'
          })
          uni.navigateTo({
            url: '/pages/login/login'
          })
          reject(new Error('刷新令牌过期'))
        }
        // 其他错误
        else {
          reject(res)
        }
      },
      fail: (err) => {
        console.error('请求失败:', err)
        uni.showToast({
          title: '网络连接失败',
          icon: 'none'
        })
        reject(err)
      }
    })
  })
}

export default {
  get: (url, data, header) => request(url, 'GET', data, header),
  post: (url, data, header) => request(url, 'POST', data, header),
  put: (url, data, header) => request(url, 'PUT', data, header),
  delete: (url, data, header) => request(url, 'DELETE', data, header)
}