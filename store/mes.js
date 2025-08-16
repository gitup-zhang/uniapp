import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { geteventmes, getsystemmes } from '@/new-apis/mes.js'

export const useMesstore = defineStore('mes', () => {
	// 系统消息
	const systemmes = ref([])
	// 组内消息
	const groupmes = ref([])
	// 加载状态
	const loading = ref(false)
	// 错误状态
	const error = ref(null)
	// 最后更新时间
	const lastUpdateTime = ref(null)

	// 计算属性 - 总未读数量
	const totalUnreadCount = computed(() => {
		const systemUnread = systemmes.value.reduce((count, msg) => {
			return count + msg.unread_count
		}, 0)
		
		const groupUnread = groupmes.value.reduce((count, msg) => {
			return count + msg.unread_count 
		}, 0)
		
		return systemUnread + groupUnread
	})

	// 系统消息未读数量
	const systemUnreadCount = computed(() => {
		return systemmes.value.reduce((count, msg) => {
			// const res=count + (msg.is_read === 0 ? 1 : 0)
			const res=count +msg.unread_count
			console.log("数量",res)
			return res
		}, 0)
	})

	// 群组消息未读数量
	const groupUnreadCount = computed(() => {
		return groupmes.value.reduce((count, msg) => {
			// return count + (msg.unread_count || (msg.is_read === 0 ? 1 : 0))
			return count + msg.unread_count 
		}, 0)
	})

	// 获取消息数据
	const getsystem = async (forceRefresh = false) => {
		// 如果数据已存在且不是强制刷新，则跳过
		if (!forceRefresh && systemmes.value.length > 0 && groupmes.value.length > 0) {
			console.log('消息数据已存在，跳过加载')
			return {
				success: true,
				data: {
					systemMessages: systemmes.value,
					groupMessages: groupmes.value
				}
			}
		}

		loading.value = true
		error.value = null

		try {
			console.log('开始加载消息数据...')
			
			// 并行获取系统消息和群组消息
			const [systemRes, groupRes] = await Promise.all([
				getsystemmes({ type_codes: "SYSTEM" }),
				geteventmes()
			])

			// 更新系统消息
			if (systemRes && systemRes.data) {
				systemmes.value = Array.isArray(systemRes.data) ? systemRes.data : []
				console.log('系统消息加载成功:', systemmes.value.length, '条')
				console.log(systemmes.value)
			} else {
				systemmes.value = []
				console.warn('系统消息数据格式异常')
			}

			// 更新群组消息
			if (groupRes && groupRes.data) {
				groupmes.value = Array.isArray(groupRes.data) ? groupRes.data : []
				console.log('群组消息加载成功:', groupmes.value.length, '条')
			} else {
				groupmes.value = []
				console.warn('群组消息数据格式异常')
			}

			// 更新最后加载时间
			lastUpdateTime.value = new Date().toISOString()
			
			return {
				success: true,
				data: {
					systemMessages: systemmes.value,
					groupMessages: groupmes.value
				}
			}
			
		} catch (err) {
			console.error('加载消息失败:', err)
			error.value = err.message || '加载消息失败'
			
			// 如果是网络错误，保持现有数据
			if (err.code !== 'NETWORK_ERROR') {
				systemmes.value = []
				groupmes.value = []
			}
			
			throw err
		} finally {
			loading.value = false
		}
	}

	// 刷新消息数据
	const refreshMessages = async () => {
		return await getsystem(true)
	}

	// 标记系统消息为已读
	const markSystemMessageAsRead = async (messageId) => {
		try {
			// 这里应该调用API标记消息为已读
			// await markSystemMessageReadAPI(messageId)
			
			// 更新本地状态
			const messageIndex = systemmes.value.findIndex(msg => msg.id === messageId)
			if (messageIndex !== -1) {
				systemmes.value[messageIndex].is_read = 1
				// 如果有unread_count字段，也要清零
				if (systemmes.value[messageIndex].unread_count !== undefined) {
					systemmes.value[messageIndex].unread_count = 0
				}
				console.log('系统消息已标记为已读:', messageId)
				return true
			}
			return false
		} catch (error) {
			console.error('标记系统消息已读失败:', error)
			throw error
		}
	}

	// 标记群组消息为已读
	const markGroupMessageAsRead = async (messageId) => {
		try {
			// 这里应该调用API标记消息为已读
			// await markGroupMessageReadAPI(messageId)
			
			// 更新本地状态
			const messageIndex = groupmes.value.findIndex(msg => msg.id === messageId)
			if (messageIndex !== -1) {
				groupmes.value[messageIndex].is_read = 1
				if (groupmes.value[messageIndex].unread_count) {
					groupmes.value[messageIndex].unread_count = 0
				}
				console.log('群组消息已标记为已读:', messageId)
				return true
			}
			return false
		} catch (error) {
			console.error('标记群组消息已读失败:', error)
			throw error
		}
	}

	// 批量标记消息为已读
	const markMultipleAsRead = async (messageIds, messageType = 'all') => {
		try {
			const results = []
			
			if (messageType === 'all' || messageType === 'system') {
				const systemIds = messageIds.filter(id => 
					systemmes.value.some(msg => msg.id === id && msg.is_read === 0)
				)
				for (const id of systemIds) {
					const result = await markSystemMessageAsRead(id)
					results.push({ id, type: 'system', success: result })
				}
			}
			
			if (messageType === 'all' || messageType === 'group') {
				const groupIds = messageIds.filter(id => 
					groupmes.value.some(msg => msg.id === id && (msg.is_read === 0 || msg.unread_count > 0))
				)
				for (const id of groupIds) {
					const result = await markGroupMessageAsRead(id)
					results.push({ id, type: 'group', success: result })
				}
			}
			
			console.log('批量标记已读完成:', results)
			return results
		} catch (error) {
			console.error('批量标记已读失败:', error)
			throw error
		}
	}

	// 根据ID获取系统消息
	const getSystemMessageById = (messageId) => {
		return systemmes.value.find(msg => msg.id === messageId)
	}

	// 根据ID获取群组消息
	const getGroupMessageById = (messageId) => {
		return groupmes.value.find(msg => msg.id === messageId)
	}

	// 获取最新的未读消息
	const getLatestUnreadMessages = (limit = 5) => {
		const unreadSystemMessages = systemmes.value
			.filter(msg => msg.is_read === 0)
			.map(msg => ({ ...msg, type: 'system' }))
		
		const unreadGroupMessages = groupmes.value
			.filter(msg => msg.is_read === 0 || msg.unread_count > 0)
			.map(msg => ({ ...msg, type: 'group' }))
		
		const allUnread = [...unreadSystemMessages, ...unreadGroupMessages]
			.sort((a, b) => {
				const timeA = new Date(b.created_at || b.updated_at || b.latest_time || 0)
				const timeB = new Date(a.created_at || a.updated_at || a.latest_time || 0)
				return timeA - timeB
			})
		
		return allUnread.slice(0, limit)
	}

	// 清空所有消息数据
	const clearAllMessages = () => {
		systemmes.value = []
		groupmes.value = []
		error.value = null
		lastUpdateTime.value = null
		console.log('消息数据已清空')
	}

	// 添加新的系统消息（用于实时推送）
	const addSystemMessage = (message) => {
		if (message && typeof message === 'object') {
			// 检查是否已存在相同ID的消息
			const existingIndex = systemmes.value.findIndex(msg => msg.id === message.id)
			if (existingIndex !== -1) {
				// 更新已存在的消息
				systemmes.value[existingIndex] = { ...systemmes.value[existingIndex], ...message }
			} else {
				// 添加新消息到开头
				systemmes.value.unshift(message)
			}
			console.log('新增/更新系统消息:', message.title || message.id)
		}
	}

	// 添加新的群组消息（用于实时推送）
	const addGroupMessage = (message) => {
		if (message && typeof message === 'object') {
			const existingIndex = groupmes.value.findIndex(msg => 
				msg.group_name === message.group_name || msg.id === message.id
			)
			
			if (existingIndex !== -1) {
				// 更新已存在的群组消息
				groupmes.value[existingIndex] = { ...groupmes.value[existingIndex], ...message }
			} else {
				// 添加新的群组消息
				groupmes.value.unshift(message)
			}
			console.log('新增/更新群组消息:', message.group_name || message.id)
		}
	}

	// 更新消息的未读数量
	const updateMessageUnreadCount = (messageId, messageType, unreadCount) => {
		if (messageType === 'system') {
			const messageIndex = systemmes.value.findIndex(msg => msg.id === messageId)
			if (messageIndex !== -1) {
				systemmes.value[messageIndex].is_read = unreadCount > 0 ? 0 : 1
				if (systemmes.value[messageIndex].unread_count !== undefined) {
					systemmes.value[messageIndex].unread_count = unreadCount
				}
			}
		} else if (messageType === 'group') {
			const messageIndex = groupmes.value.findIndex(msg => msg.id === messageId)
			if (messageIndex !== -1) {
				groupmes.value[messageIndex].unread_count = unreadCount
				groupmes.value[messageIndex].is_read = unreadCount > 0 ? 0 : 1
			}
		}
	}

	// 检查是否有新消息（可用于轮询）
	const hasNewMessages = computed(() => {
		return totalUnreadCount.value > 0
	})

	// 获取数据状态信息
	const getDataStatus = () => {
		return {
			loading: loading.value,
			error: error.value,
			lastUpdateTime: lastUpdateTime.value,
			systemMessageCount: systemmes.value.length,
			groupMessageCount: groupmes.value.length,
			totalUnreadCount: totalUnreadCount.value,
			systemUnreadCount: systemUnreadCount.value,
			groupUnreadCount: groupUnreadCount.value,
			hasData: systemmes.value.length > 0 || groupmes.value.length > 0
		}
	}

	return {
		// 状态数据
		systemmes,
		groupmes,
		loading,
		error,
		lastUpdateTime,
		
		// 计算属性
		totalUnreadCount,
		systemUnreadCount,
		groupUnreadCount,
		hasNewMessages,
		
		// 方法
		getsystem,
		refreshMessages,
		markSystemMessageAsRead,
		markGroupMessageAsRead,
		markMultipleAsRead,
		getSystemMessageById,
		getGroupMessageById,
		getLatestUnreadMessages,
		clearAllMessages,
		addSystemMessage,
		addGroupMessage,
		updateMessageUnreadCount,
		getDataStatus
	}
})