import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {  getsystemmes, getmesgroup } from '@/new-apis/mes.js'

export const useMesstore = defineStore('mes', () => {
	// 系统消息
	const systemmes = ref([])
	// 组内消息
	const groupmes = ref([])
	// 加载状态
	const loading = ref(false)
	// 下拉刷新状态
	const refreshing = ref(false)
	// 加载更多状态
	const loadingMore = ref(false)
	// 错误状态
	const error = ref(null)
	// 系统或群组的消息列表
	const MessageList = ref([])
	// 获取到的信息结构体
	const MseList = ref({
		total: 0,
		page: 1,
		page_size: 10,
		has_more: false
	})
	
	// 最后更新时间
	const lastUpdateTime = ref(null)
	
	// 当前加载的消息类型和参数，用于加载更多
	const currentLoadParams = ref(null)

	// 辅助函数 - 检查消息是否未读
	const isMessageUnread = (msg) => {
		// 优先使用 has_unread 字段
		if (msg.has_unread !== undefined) {
			return msg.has_unread === 'Y' || msg.has_unread === true
		}
		// 兼容旧的 unread_count 字段
		if (msg.unread_count !== undefined) {
			return msg.unread_count > 0
		}
		// 兼容 is_read 字段
		if (msg.is_read !== undefined) {
			return msg.is_read === 0 || msg.is_read === false
		}
		return false
	}

	// 计算属性 - 总未读数量 (改为统计有未读消息的条数)
	const totalUnreadCount = computed(() => {
		const systemUnread = systemmes.value.filter(msg => isMessageUnread(msg)).length
		const groupUnread = groupmes.value.filter(msg => isMessageUnread(msg)).length
		return systemUnread + groupUnread
	})

	// 系统消息未读数量 (改为统计有未读消息的条数)
	const systemUnreadCount = computed(() => {
		const count = systemmes.value.filter(msg => isMessageUnread(msg)).length
		console.log("系统消息未读数量", count)
		return count
	})

	// 群组消息未读数量 (改为统计有未读消息的条数)
	const groupUnreadCount = computed(() => {
		const count = groupmes.value.filter(msg => isMessageUnread(msg)).length
		console.log("群组消息未读数量：", count)
		return count
	})

	// 是否还有更多数据
	const hasMoreData = computed(() => {
		if (!MseList.value.total) return false
		const totalPages = Math.ceil(MseList.value.total / MseList.value.page_size)
		return MseList.value.page < totalPages
	})

	// 获取系统和群组的消息数据
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
				getsystemmes({ type_code: "SYSTEM" }),
				getsystemmes({ type_code: "GROUP" })
			])

			// 更新系统消息
			if (systemRes && systemRes.data) {
				systemmes.value = Array.isArray(systemRes.data) ? systemRes.data : []
				console.log('系统消息加载成功:', systemmes.value.length, '条')
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

	// 获取系统或群组的消息列表（优化分页支持）
	const getMessageList = async (id,params) => {
		const { message_type, page = 1, page_size = 10, isRefresh = false, isLoadMore = false, ...otherParams } = params || {}
		
		try {
			// 设置对应的加载状态
			if (isRefresh) {
				refreshing.value = true
			} else if (isLoadMore) {
				loadingMore.value = true
			} else {
				loading.value = true
			}
			error.value = null
			
			console.log('加载消息列表参数:', { message_type, page, page_size, isRefresh, isLoadMore, ...otherParams })
			
			const requestParams = {
				message_type: message_type,
				page: page,
				page_size: page_size,
				...otherParams
			}
			
			// 保存当前加载参数，用于后续加载更多
			if (!isLoadMore) {
				currentLoadParams.value = { message_type, page_size, ...otherParams }
			}
			
			const res = await getmesgroup(id,requestParams)
			
			if (!res || !res.data) {
				throw new Error('消息数据格式错误')
			}
			
			// 处理返回的消息数据，添加展开状态
			const newMessages = Array.isArray(res.data) ? res.data.map(msg => ({
				...msg,
				expanded: false
			})) : []
			
			// 更新消息结构体信息
			MseList.value = {
				page: res.page || page,
				total: res.total || 0,
				page_size: res.page_size || page_size,
				has_more: hasMoreData.value
			}
			
			// 根据操作类型更新消息列表
			if (isRefresh || page === 1) {
				// 刷新或首次加载，替换数据
				MessageList.value = newMessages
				console.log('刷新消息列表完成，共', newMessages.length, '条消息')
			} else if (isLoadMore) {
				// 加载更多，追加数据并去重
				const existingIds = new Set(MessageList.value.map(msg => msg.id))
				const uniqueNewMessages = newMessages.filter(msg => !existingIds.has(msg.id))
				MessageList.value = [...MessageList.value, ...uniqueNewMessages]
				console.log('加载更多消息完成，新增', uniqueNewMessages.length, '条消息，总共', MessageList.value.length, '条')
			} else {
				// 普通加载，替换数据
				MessageList.value = newMessages
			}
			
			// 更新最后加载时间
			lastUpdateTime.value = new Date().toISOString()
			
			console.log("获得的消息数据", MessageList.value)
			console.log("获取到的信息结构体", MseList.value)
			
			return {
				success: true,
				data: newMessages,
				page: res.page,
				total: res.total,
				page_size: res.page_size,
				has_more: hasMoreData.value
			}
			
		} catch (err) {
			console.error('获取消息列表失败:', err)
			error.value = err.message || '获取消息列表失败'
			throw err
		} finally {
			// 清除所有加载状态
			loading.value = false
			refreshing.value = false
			loadingMore.value = false
		}
	}

	// 加载更多消息（增强版本）
	const loadMoreMessages = async (params) => {
		const { message_type, page_size = 10, ...otherParams } = params || {}
		
		if (!hasMoreData.value || loadingMore.value) {
			console.log('没有更多数据或正在加载中')
			return { success: false, message: '没有更多数据' }
		}
		
		const nextPage = MseList.value.page + 1
		
		// 合并当前加载参数和新参数
		const mergedParams = {
			...currentLoadParams.value,
			...params,
			page: nextPage,
			page_size,
			isLoadMore: true
		}
		
		return await getMessageList(mergedParams)
	}

	// 刷新消息列表（增强版本）
	const refreshMessageList = async (params) => {
		const { message_type, page_size = 10, ...otherParams } = params || {}
		
		// 重置分页信息
		MseList.value.page = 1
		
		const mergedParams = {
			message_type,
			page: 1,
			page_size,
			isRefresh: true,
			...otherParams
		}
		
		return await getMessageList(mergedParams)
	}

	// 清空消息列表
	const clearMessageList = () => {
		MessageList.value = []
		MseList.value = {
			total: 0,
			page: 1,
			page_size: 10,
			has_more: false
		}
		currentLoadParams.value = null
		loading.value = false
		refreshing.value = false
		loadingMore.value = false
		error.value = null
	}

	// 切换消息展开状态
	const toggleMessageExpanded = (messageId) => {
		const messageIndex = MessageList.value.findIndex(msg => msg.id === messageId)
		if (messageIndex !== -1) {
			MessageList.value[messageIndex].expanded = !MessageList.value[messageIndex].expanded
			return MessageList.value[messageIndex].expanded
		}
		return false
	}

	// 批量切换消息展开状态
	const toggleMultipleExpanded = (messageIds, expanded) => {
		const updatedMessages = []
		messageIds.forEach(id => {
			const messageIndex = MessageList.value.findIndex(msg => msg.id === id)
			if (messageIndex !== -1) {
				MessageList.value[messageIndex].expanded = expanded
				updatedMessages.push(MessageList.value[messageIndex])
			}
		})
		return updatedMessages
	}

	// 标记系统消息为已读
	const markSystemMessageAsRead = async (messageId) => {
		try {
			// 这里应该调用API标记消息为已读
			// await markSystemMessageReadAPI(messageId)
			
			// 更新系统消息列表中的状态
			const systemMessageIndex = systemmes.value.findIndex(msg => msg.id === messageId)
			if (systemMessageIndex !== -1) {
				systemmes.value[systemMessageIndex].is_read = 1
				systemmes.value[systemMessageIndex].has_unread = 'N'
				// 兼容旧字段
				if (systemmes.value[systemMessageIndex].unread_count !== undefined) {
					systemmes.value[systemMessageIndex].unread_count = 0
				}
			}
			
			// 更新MessageList中的状态
			const messageIndex = MessageList.value.findIndex(msg => msg.id === messageId)
			if (messageIndex !== -1) {
				MessageList.value[messageIndex].is_read = 1
				MessageList.value[messageIndex].has_unread = 'N'
				if (MessageList.value[messageIndex].unread_count !== undefined) {
					MessageList.value[messageIndex].unread_count = 0
				}
			}
			
			console.log('系统消息已标记为已读:', messageId)
			return true
			
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
			
			// 更新群组消息列表中的状态
			const groupMessageIndex = groupmes.value.findIndex(msg => msg.id === messageId)
			if (groupMessageIndex !== -1) {
				groupmes.value[groupMessageIndex].is_read = 1
				groupmes.value[groupMessageIndex].has_unread = 'N'
				// 兼容旧字段
				if (groupmes.value[groupMessageIndex].unread_count !== undefined) {
					groupmes.value[groupMessageIndex].unread_count = 0
				}
			}
			
			// 更新MessageList中的状态
			const messageIndex = MessageList.value.findIndex(msg => msg.id === messageId)
			if (messageIndex !== -1) {
				MessageList.value[messageIndex].is_read = 1
				MessageList.value[messageIndex].has_unread = 'N'
				if (MessageList.value[messageIndex].unread_count !== undefined) {
					MessageList.value[messageIndex].unread_count = 0
				}
			}
			
			console.log('群组消息已标记为已读:', messageId)
			return true
			
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
				const systemIds = messageIds.filter(id => {
					const msg = systemmes.value.find(msg => msg.id === id)
					return msg && isMessageUnread(msg)
				})
				for (const id of systemIds) {
					try {
						const result = await markSystemMessageAsRead(id)
						results.push({ id, type: 'system', success: result })
					} catch (error) {
						results.push({ id, type: 'system', success: false, error })
					}
				}
			}
			
			if (messageType === 'all' || messageType === 'group') {
				const groupIds = messageIds.filter(id => {
					const msg = groupmes.value.find(msg => msg.id === id)
					return msg && isMessageUnread(msg)
				})
				for (const id of groupIds) {
					try {
						const result = await markGroupMessageAsRead(id)
						results.push({ id, type: 'group', success: result })
					} catch (error) {
						results.push({ id, type: 'group', success: false, error })
					}
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

	// 根据ID获取消息列表中的消息
	const getMessageById = (messageId) => {
		return MessageList.value.find(msg => msg.id === messageId)
	}

	// 获取最新的未读消息
	const getLatestUnreadMessages = (limit = 5) => {
		const unreadSystemMessages = systemmes.value
			.filter(msg => isMessageUnread(msg))
			.map(msg => ({ ...msg, type: 'system' }))
		
		const unreadGroupMessages = groupmes.value
			.filter(msg => isMessageUnread(msg))
			.map(msg => ({ ...msg, type: 'group' }))
		
		const allUnread = [...unreadSystemMessages, ...unreadGroupMessages]
			.sort((a, b) => {
				const timeA = new Date(a.created_at || a.updated_at || a.latest_time || a.send_time || 0)
				const timeB = new Date(b.created_at || b.updated_at || b.latest_time || b.send_time || 0)
				return timeB - timeA
			})
		
		return allUnread.slice(0, limit)
	}

	// 清空所有消息数据
	const clearAllMessages = () => {
		systemmes.value = []
		groupmes.value = []
		MessageList.value = []
		MseList.value = {
			total: 0,
			page: 1,
			page_size: 10,
			has_more: false
		}
		currentLoadParams.value = null
		error.value = null
		lastUpdateTime.value = null
		loading.value = false
		refreshing.value = false
		loadingMore.value = false
		console.log('所有消息数据已清空')
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
			
			// 如果当前MessageList显示的是系统消息，也要更新
			if (MessageList.value.length > 0 && MessageList.value[0].message_type === 'SYSTEM') {
				const messageListIndex = MessageList.value.findIndex(msg => msg.id === message.id)
				if (messageListIndex !== -1) {
					MessageList.value[messageListIndex] = { 
						...MessageList.value[messageListIndex], 
						...message,
						expanded: MessageList.value[messageListIndex].expanded
					}
				} else {
					MessageList.value.unshift({
						...message,
						expanded: false
					})
					// 更新总数
					MseList.value.total += 1
				}
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
			
			// 如果当前MessageList显示的是群组消息，也要更新
			if (MessageList.value.length > 0 && MessageList.value[0].message_type === 'GROUP') {
				const messageListIndex = MessageList.value.findIndex(msg => msg.id === message.id)
				if (messageListIndex !== -1) {
					MessageList.value[messageListIndex] = { 
						...MessageList.value[messageListIndex], 
						...message,
						expanded: MessageList.value[messageListIndex].expanded
					}
				} else {
					MessageList.value.unshift({
						...message,
						expanded: false
					})
					// 更新总数
					MseList.value.total += 1
				}
			}
			
			console.log('新增/更新群组消息:', message.group_name || message.id)
		}
	}

	// 更新消息的未读状态 (修改为使用 has_unread 字段)
	const updateMessageUnreadStatus = (messageId, messageType, hasUnread) => {
		const unreadValue = hasUnread ? 'Y' : 'N'
		const isReadValue = hasUnread ? 0 : 1
		
		if (messageType === 'system') {
			const messageIndex = systemmes.value.findIndex(msg => msg.id === messageId)
			if (messageIndex !== -1) {
				systemmes.value[messageIndex].has_unread = unreadValue
				systemmes.value[messageIndex].is_read = isReadValue
				// 兼容旧字段
				if (systemmes.value[messageIndex].unread_count !== undefined) {
					systemmes.value[messageIndex].unread_count = hasUnread ? 1 : 0
				}
			}
		} else if (messageType === 'group') {
			const messageIndex = groupmes.value.findIndex(msg => msg.id === messageId)
			if (messageIndex !== -1) {
				groupmes.value[messageIndex].has_unread = unreadValue
				groupmes.value[messageIndex].is_read = isReadValue
				// 兼容旧字段
				if (groupmes.value[messageIndex].unread_count !== undefined) {
					groupmes.value[messageIndex].unread_count = hasUnread ? 1 : 0
				}
			}
		}
		
		// 同时更新MessageList中的数据
		const listMessageIndex = MessageList.value.findIndex(msg => msg.id === messageId)
		if (listMessageIndex !== -1) {
			MessageList.value[listMessageIndex].has_unread = unreadValue
			MessageList.value[listMessageIndex].is_read = isReadValue
			// 兼容旧字段
			if (MessageList.value[listMessageIndex].unread_count !== undefined) {
				MessageList.value[listMessageIndex].unread_count = hasUnread ? 1 : 0
			}
		}
	}

	// 保留旧方法名以兼容现有代码
	const updateMessageUnreadCount = (messageId, messageType, unreadCount) => {
		updateMessageUnreadStatus(messageId, messageType, unreadCount > 0)
	}

	// 检查是否有新消息（可用于轮询）
	const hasNewMessages = computed(() => {
		return totalUnreadCount.value > 0
	})

	// 获取数据状态信息
	const getDataStatus = () => {
		return {
			loading: loading.value,
			refreshing: refreshing.value,
			loadingMore: loadingMore.value,
			error: error.value,
			lastUpdateTime: lastUpdateTime.value,
			systemMessageCount: systemmes.value.length,
			groupMessageCount: groupmes.value.length,
			messageListCount: MessageList.value.length,
			totalUnreadCount: totalUnreadCount.value,
			systemUnreadCount: systemUnreadCount.value,
			groupUnreadCount: groupUnreadCount.value,
			hasData: systemmes.value.length > 0 || groupmes.value.length > 0,
			hasMoreData: hasMoreData.value,
			pagination: MseList.value,
			currentLoadParams: currentLoadParams.value
		}
	}

	// 搜索消息
	const searchMessages = (keyword, messageType = 'all') => {
		if (!keyword) return []
		
		const searchIn = (messages) => {
			return messages.filter(msg => 
				(msg.title && msg.title.includes(keyword)) ||
				(msg.content && msg.content.includes(keyword)) ||
				(msg.group_name && msg.group_name.includes(keyword)) ||
				(msg.sender_name && msg.sender_name.includes(keyword))
			)
		}
		
		let results = []
		if (messageType === 'all' || messageType === 'system') {
			results.push(...searchIn(systemmes.value).map(msg => ({ ...msg, type: 'system' })))
		}
		if (messageType === 'all' || messageType === 'group') {
			results.push(...searchIn(groupmes.value).map(msg => ({ ...msg, type: 'group' })))
		}
		if (messageType === 'current') {
			results.push(...searchIn(MessageList.value).map(msg => ({ ...msg, type: 'current' })))
		}
		
		return results.sort((a, b) => {
			const timeA = new Date(a.created_at || a.updated_at || a.latest_time || a.send_time || 0)
			const timeB = new Date(b.created_at || b.updated_at || b.latest_time || b.send_time || 0)
			return timeB - timeA
		})
	}

	// 重置加载状态（用于错误恢复）
	const resetLoadingStates = () => {
		loading.value = false
		refreshing.value = false
		loadingMore.value = false
		error.value = null
	}

	// 检查数据一致性
	const validateDataConsistency = () => {
		const issues = []
		
		// 检查分页信息
		if (MseList.value.page < 1) {
			issues.push('页码不能小于1')
		}
		
		if (MseList.value.page_size < 1) {
			issues.push('页面大小不能小于1')
		}
		
		if (MseList.value.total < 0) {
			issues.push('总数不能为负数')
		}
		
		// 检查消息列表
		const duplicateIds = MessageList.value
			.map(msg => msg.id)
			.filter((id, index, arr) => arr.indexOf(id) !== index)
		
		if (duplicateIds.length > 0) {
			issues.push(`发现重复的消息ID: ${duplicateIds.join(', ')}`)
		}
		
		return {
			isValid: issues.length === 0,
			issues
		}
	}

	return {
		// 状态数据
		systemmes,
		groupmes,
		loading,
		refreshing,
		loadingMore,
		error,
		lastUpdateTime,
		MessageList,
		MseList,
		currentLoadParams,
		
		// 计算属性
		totalUnreadCount,
		systemUnreadCount,
		groupUnreadCount,
		hasNewMessages,
		hasMoreData,
		
		// 工具函数
		isMessageUnread,
		
		// 方法
		getsystem,
		refreshMessages,
		getMessageList,
		loadMoreMessages,
		refreshMessageList,
		clearMessageList,
		toggleMessageExpanded,
		toggleMultipleExpanded,
		markSystemMessageAsRead,
		markGroupMessageAsRead,
		markMultipleAsRead,
		getSystemMessageById,
		getGroupMessageById,
		getMessageById,
		getLatestUnreadMessages,
		clearAllMessages,
		addSystemMessage,
		addGroupMessage,
		updateMessageUnreadStatus,
		updateMessageUnreadCount, // 保留兼容性
		getDataStatus,
		searchMessages,
		resetLoadingStates,
		validateDataConsistency
	}
})