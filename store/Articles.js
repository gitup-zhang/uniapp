import { defineStore } from 'pinia'
import { ref } from 'vue'
import {getArticleList} from '@/new-apis/articles.js'

export const useArticlesStore=defineStore('articlelist',()=>{
	// 获取到的政策列表
	const listpolicy=ref([])
	const page=ref(1)
	// 获取到的新闻列表
	const listnew=ref([])
	const pagenew=ref(1)
	
	// 加载状态
	const loading = ref(false)
	const hasMore = ref(true)
	// 首次加载状态
	const initialLoading = ref(false)

	// 获取政策列表
	const getlistpolicy=async(params)=>{
		let signal = params.article_type; 

		loading.value = false
		hasMore.value = true
		
		// 只在非刷新状态下显示loading
		if (!params.isRefresh) {
			uni.showLoading({
				title: '加载中...',
				mask: true
			})
		}
		
		try{
			const res = await getArticleList(params)
			page.value = res.page
			
			// 计算是否还有更多数据
			if(res.page * res.page_size < res.total){
				hasMore.value = true
			} else {
				hasMore.value = false
			}
			
			// 根据文章类型分别处理数据
			if(signal === "POLICY"){
				listpolicy.value = res.data || []
			} else {
				listnew.value = res.data || []
			}
			
			// 如果是第一页且没有数据，显示空状态
			if (res.page === 1 && (!res.data || res.data.length === 0)) {
				console.log('当前列表为空')
			}
			
		} catch(error) {
			console.error('获取文章列表失败:', error)
			
			// 网络错误处理
			const errorMessage = getErrorMessage(error)
			uni.showToast({
				title: errorMessage,
				icon: 'none',
				duration: 2000
			})
			
			// 错误时重置状态
			if(signal === "POLICY"){
				listpolicy.value = []
			} else {
				listnew.value = []
			}
			hasMore.value = false
			
		} finally {
			if (!params.isRefresh) {
				uni.hideLoading()
			}
		}
	}

	// 加载更多文章
	const getarticlemore=async(params)=>{
		let signal = params.article_type; 
		
		// 如果正在加载或没有更多数据，直接返回
		if(loading.value || !hasMore.value) {
			console.log('加载更多被阻止:', { loading: loading.value, hasMore: hasMore.value })
			return
		}
		
		try{
			loading.value = true 
			
			const res = await getArticleList(params)
			page.value = res.page
			
			// 计算是否还有更多数据
			if(res.page * res.page_size < res.total){
				hasMore.value = true
			} else {
				hasMore.value = false
			}
			
			// 拼接新数据
			if(res.data && res.data.length > 0) {
				if(signal === "POLICY"){
					listpolicy.value = [...listpolicy.value, ...res.data]
				} else {
					listnew.value = [...listnew.value, ...res.data]
				}
				console.log(`成功加载更多 ${res.data.length} 条数据`)
			} else {
				// 如果返回的数据为空，设置没有更多
				hasMore.value = false
				console.log('服务器返回空数据，设置hasMore为false')
			}
			
		} catch(error) {
			console.error('加载更多失败:', error)
			
			const errorMessage = getErrorMessage(error)
			uni.showToast({
				title: errorMessage,
				icon: 'none',
				duration: 2000
			})
			
			// 错误时不改变hasMore状态，允许用户重试
		} finally {
			loading.value = false
		}
	}

	// 错误信息处理
	const getErrorMessage = (error) => {
		if (!error) return '未知错误'
		
		// 网络错误
		if (error.errMsg && error.errMsg.includes('request:fail')) {
			return '网络连接失败，请检查网络'
		}
		
		// 超时错误
		if (error.errMsg && error.errMsg.includes('timeout')) {
			return '请求超时，请重试'
		}
		
		// 服务器错误
		if (error.statusCode) {
			switch (error.statusCode) {
				case 400:
					return '请求参数错误'
				case 401:
					return '未授权访问'
				case 403:
					return '访问被拒绝'
				case 404:
					return '请求的资源不存在'
				case 500:
					return '服务器内部错误'
				case 502:
					return '网关错误'
				case 503:
					return '服务暂不可用'
				default:
					return `服务器错误 (${error.statusCode})`
			}
		}
		
		// 其他错误
		return error.message || '请求失败，请重试'
	}

	// 重置page页码和加载状态
	function resetpage(num){
		page.value = num
		loading.value = false
		hasMore.value = true
	}

	// 重置所有状态
	function resetAllState() {
		listpolicy.value = []
		listnew.value = []
		page.value = 1
		pagenew.value = 1
		loading.value = false
		hasMore.value = true
		initialLoading.value = false
	}

	// 清空指定类型的列表
	function clearList(type) {
		if (type === 'policy') {
			listpolicy.value = []
		} else if (type === 'news') {
			listnew.value = []
		}
		page.value = 1
		loading.value = false
		hasMore.value = true
	}

	// 获取当前列表状态
	function getListStatus(type) {
		const list = type === 'policy' ? listpolicy.value : listnew.value
		return {
			isEmpty: list.length === 0,
			count: list.length,
			isLoading: loading.value,
			hasMore: hasMore.value,
			currentPage: page.value
		}
	}

	// 刷新列表（下拉刷新使用）
	async function refreshList(params) {
		const refreshParams = { ...params, isRefresh: true, page: 1 }
		page.value = 1
		loading.value = false
		hasMore.value = true
		
		try {
			await getlistpolicy(refreshParams)
		} catch (error) {
			console.error('刷新列表失败:', error)
			throw error
		}
	}
	
	return {
		// 数据
		listpolicy,
		listnew,
		page,
		pagenew,
		loading,
		hasMore,
		initialLoading,
		
		// 方法
		getlistpolicy,
		getarticlemore,
		resetpage,
		resetAllState,
		clearList,
		getListStatus,
		refreshList,
		getErrorMessage
	}
		})