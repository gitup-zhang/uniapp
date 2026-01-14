import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getinfologin, getinfoprofile, updateprofile, IsUserRegistered } from '@/new-apis/info.js'
import { userRegisteredEvents } from '@/new-apis/events.js'

export const useInfoStore = defineStore('peopleinfo', () => {
	// 个人信息
	let info = ref({})
	
	// Token管理 - 改为双token
	const accessToken = ref("")
	const refreshToken = ref("")
	const sessionSign = ref("")
	
	// 标志位，判断是否登录
	const signal = ref(false)
	// 是否报名的标志位
	const isapply = ref(false)
	// 已经报名的活动
	const applyactivity = ref([])
	const applyactivityhistory = ref([])
	const eventcount = ref({
		Eventbefore: 0,
		Eventing: 0,
		Evented: 0
	})
	
	// 持久化存储Token信息
	const setTokens = (access, refresh, session) => {
		accessToken.value = access
		refreshToken.value = refresh
		sessionSign.value = session
		signal.value = true
		
		// 持久化到本地
		uni.setStorageSync('accessToken', access)
		uni.setStorageSync('refreshToken', refresh)
		uni.setStorageSync('sessionSign', session)
	}
	
	// 从本地恢复Token
	const loadTokensFromStorage = () => {
		try {
			const access = uni.getStorageSync('accessToken')
			const refresh = uni.getStorageSync('refreshToken')
			const session = uni.getStorageSync('sessionSign')
			
			if (access && refresh && session) {
				accessToken.value = access
				refreshToken.value = refresh
				sessionSign.value = session
				signal.value = true
				return true
			}
		} catch (e) {
			console.error('加载Token失败:', e)
		}
		return false
	}
	
	// 刷新Token
	const refreshAccessToken = async () => {
		try {
			console.log('开始刷新Token...')
			
			const res = await uni.request({
				url: 'http://47.113.194.28:8080/api/user/refreshToken', // 替换为你的刷新接口
				method: 'POST',
				header: {
					'Content-Type': 'application/json'
				},
				data: {
					refresh_token: refreshToken.value,
					session_sign: sessionSign.value
				}
			})
			
			if (res.data.code === 200) {
				// 更新Token
				setTokens(
					res.data.access_token,
					res.data.refresh_token,
					sessionSign.value // session_sign 可能不会改变，使用原值或新值
				)
				console.log('Token刷新成功')
				return true
			} else if (res.data.code === 40003) {
				// 刷新令牌过期，需要重新登录
				console.log('刷新令牌过期，需要重新登录')
				deleteinfo()
				uni.showToast({
					title: '登录已过期，请重新登录',
					icon: 'none'
				})
				// 跳转到登录页
				uni.navigateTo({
					url: '/pages/login/login'
				})
				return false
			}
		} catch (error) {
			console.error('刷新Token失败:', error)
			// 刷新失败，清除登录信息
			deleteinfo()
			return false
		}
	}
	
	// 获取个人信息
	const getinfo = async () => {
		signal.value = true
		const res = await getinfoprofile()
		info.value = res.data
	}
	
	// 更新个人信息
	const updateinfo = async (params) => {
		const res = await updateprofile(params)
		await getinfo()
		return res
	}
	
	// 微信登录
	const loginWithWeChat = async (encryptedData, iv) => {
		try {
			// 1. 登录获取临时登录凭证 code
			const loginRes = await uni.login({ provider: 'weixin' })
			
			if (loginRes.errMsg === "login:ok") {
				const codes = loginRes.code
				console.log('微信code:', codes)
				
				// 2. 发送 code 到你自己的后端
				const res = await getinfologin({
					code: codes,
					encrypted_data: encryptedData,
					iv: iv
				})
				
				console.log('登录响应:', res)
				
				if (res.code === 200) {
					// 保存双Token
					setTokens(
						res.access_token,
						res.refresh_token,
						res.session_sign
					)
					
					signal.value = true
					console.log("登录成功")
					return true
				} else {
					uni.showToast({
						title: res.message || '登录失败',
						icon: 'none'
					})
					return false
				}
			}
		} catch (err) {
			console.error("登录失败", err)
			uni.showToast({
				title: '登录失败，请重试',
				icon: 'none'
			})
			return false
		}
	}
	
	// 清除登录信息
	function deleteinfo() {
		accessToken.value = ''
		refreshToken.value = ''
		sessionSign.value = ''
		signal.value = false
		info.value = {}
		
		uni.removeStorageSync('accessToken')
		uni.removeStorageSync('refreshToken')
		uni.removeStorageSync('sessionSign')
	}
	
	// 上传图片
	const uploadimage = async (filepath) => {
		return new Promise((resolve, reject) => {
			uni.uploadFile({
				url: 'http://47.113.194.28:8080/api/file/upload',
				filePath: filepath,
				name: 'file',
				formData: {
					biz_type: 'AVATAR'
				},
				header: {
					'Content-Type': 'multipart/form-data',
					Authorization: accessToken.value ? `Bearer ${accessToken.value}` : '',
				},
				success: (res) => {
					try {
						const data = JSON.parse(res.data)
						console.log('上传成功:', data)
						resolve(data)
					} catch (e) {
						console.error('解析失败:', e)
						reject(e)
					}
				},
				fail: (err) => {
					console.error('上传失败:', err)
					uni.showToast({
						title: '上传失败',
						icon: 'none'
					})
					reject(err)
				}
			})
		})
	}
	
	const getUserProfile = async () => {
		uni.getUserProfile({
			desc: '用于完善用户资料',
			success: async (userRes) => {
				console.log(userRes)
				const { encryptedData, iv } = userRes
				console.log(encryptedData)
				
				try {
					const res = await getinfoprofile({
						encryptedData: encryptedData,
						iv: iv,
						token: accessToken.value
					})
					console.log(res)
				} catch (error) {
					console.error('请求出错:', error)
				}
			},
			fail: (err) => {
				console.error('用户拒绝授权:', err)
			}
		})
	}
	
	// 查询是否已经报名
	const IsRegistered = async (id) => {
		try {
			const res = await IsUserRegistered(id)
			console.log("报名信息：", res)
			if (res.data.is_registered === "N") {
				console.log("没有报名")
				isapply.value = false
			} else {
				console.log("已经报名")
				isapply.value = true
			}
		} catch (e) {
			console.log(e)
		}
	}
	
	// 查询已经报名的活动
	const userapply = async () => {
		try {
			const res = await userRegisteredEvents({ event_status: "InProgress" })
			applyactivity.value = Array.isArray(res.data) ? res.data : []
			
			// 统计未开始和已开始的数量
			const now = new Date()
			let enting = 0
			let ented = 0
			
			applyactivity.value.forEach(event => {
				const start = new Date(event.event_start_time)
				const end = new Date(event.event_end_time)
				
				if (now >= start && now <= end) {
					enting++
				} else if (now < start) {
					ented++
				}
				eventcount.value.Eventing = enting
				eventcount.value.Eventbefore = ented
			})
			
			const reshistory = await userRegisteredEvents({ event_status: "Completed" })
			applyactivityhistory.value = Array.isArray(reshistory.data) ? reshistory.data : []
			eventcount.value.Evented = reshistory.total
			
			console.log("活动数量信息：", eventcount)
		} catch (e) {
			console.log(e)
		}
	}
	
	return {
		info,
		accessToken,
		refreshToken,
		sessionSign,
		signal,
		getinfo,
		deleteinfo,
		eventcount,
		loginWithWeChat,
		getUserProfile,
		updateinfo,
		uploadimage,
		setTokens,
		loadTokensFromStorage,
		refreshAccessToken,
		IsRegistered,
		isapply,
		userapply,
		applyactivity,
		applyactivityhistory
	}
})