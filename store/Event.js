import { defineStore } from 'pinia'
import { ref } from 'vue'
import {getEventList,getEventDetail} from '@/new-apis/events.js'

export const useEventstore=defineStore('event',()=>{
	const eventing=ref([])
	const eventoutdate=ref([])
	const eventcount=ref({
		Eventbefore:0,
		Eventing:0,
		Evented:0
	})
	
	// 进行中活动的分页相关状态
	const currentPage = ref(1)
	const pageSize = ref(10)
	const hasMoreData = ref(true)
	const isLoading = ref(false)
	
	// 历史活动的分页相关状态
	const outdateCurrentPage = ref(1)
	const outdatePageSize = ref(10)
	const outdateHasMoreData = ref(true)
	const outdateIsLoading = ref(false)
	
	// 获取的活动详情
	const eventdetail=ref({})
	
	
	// 获取正在进行中的活动 - 修改为支持分页
	const getlisting=async(num, loadMore = false)=>{
		if (isLoading.value) return
		
		isLoading.value = true
		
		// 如果不是加载更多，显示loading
		if (!loadMore) {
			uni.showLoading({
			  title: '加载中...',
			  mask: true
			})
		}
		
		try{
			const page = loadMore ? currentPage.value + 1 : 1
			const res = await getEventList({
				page: page,
				page_size: num || pageSize.value,
				event_status: "InProgress"
			})
			
			if (loadMore) {
				// 加载更多：追加数据
				eventing.value = [...eventing.value, ...res.data]
				currentPage.value = page
			} else {
				// 首次加载：替换数据
				eventing.value = res.data
				currentPage.value = 1
			}
			
			// 更新总数和是否还有更多数据
			eventcount.value.Eventing = res.total
			hasMoreData.value = eventing.value.length < res.total
			
			console.log(`已加载 ${eventing.value.length}/${res.total} 条活动数据`)
					 
		}catch(error){
			console.log(error)
			uni.showToast({
				title: '加载失败',
				icon: 'error'
			})
		}finally{
			isLoading.value = false
			if (!loadMore) {
				uni.hideLoading()
			}
		}
	}
	
	// 加载更多数据
	const loadMoreEvents = async() => {
		if (!hasMoreData.value || isLoading.value) {
			return
		}
		await getlisting(pageSize.value, true)
	}
	
	// 刷新数据
	const refreshEvents = async() => {
		currentPage.value = 1
		hasMoreData.value = true
		await getlisting(pageSize.value, false)
	}
	
	// 获取过期活动 - 修改为支持分页
	const getlisoutdate=async(num, loadMore = false)=>{
		if (outdateIsLoading.value) return
		
		outdateIsLoading.value = true
		
		// 如果不是加载更多，显示loading
		if (!loadMore) {
			uni.showLoading({
			  title: '加载中...',
			  mask: true
			})
		}
		
		try{
			const page = loadMore ? outdateCurrentPage.value + 1 : 1
			const res = await getEventList({
				page: page,
				page_size: num || outdatePageSize.value,
				event_status: "Completed"
			})
			
			if (loadMore) {
				// 加载更多：追加数据
				eventoutdate.value = [...eventoutdate.value, ...res.data]
				outdateCurrentPage.value = page
			} else {
				// 首次加载：替换数据
				eventoutdate.value = res.data
				outdateCurrentPage.value = 1
			}
			
			// 更新总数和是否还有更多数据
			eventcount.value.Evented = res.total
			outdateHasMoreData.value = eventoutdate.value.length < res.total
			
			console.log(`已加载历史活动 ${eventoutdate.value.length}/${res.total} 条`)
					 
		}catch(error){
			console.log(error)
			uni.showToast({
				title: '加载失败',
				icon: 'error'
			})
		}finally{
			outdateIsLoading.value = false
			if (!loadMore) {
				uni.hideLoading()
			}
		}
	}
	
	// 加载更多历史活动数据
	const loadMoreOutdateEvents = async() => {
		if (!outdateHasMoreData.value || outdateIsLoading.value) {
			return
		}
		await getlisoutdate(outdatePageSize.value, true)
	}
	
	// 刷新历史活动数据
	const refreshOutdateEvents = async() => {
		outdateCurrentPage.value = 1
		outdateHasMoreData.value = true
		await getlisoutdate(outdatePageSize.value, false)
	}
	
	// 获取活动详情
	const geteventdetail=async(id)=>{
		uni.showLoading({
		  title: '加载中...',
		  mask: true
		})
		try{
		const res=await getEventDetail(id)
		eventdetail.value=res.data	
		 console.log("活动详情",eventdetail.value)
					 
		}catch(error){
			console.log(error)
		}finally{
			uni.hideLoading()		
		}
		
	}
	
	return {
		eventing,
		eventoutdate,
		getlisting,
		getlisoutdate,
		geteventdetail,
		eventdetail,
		eventcount,
		// 进行中活动的分页相关
		currentPage,
		pageSize,
		hasMoreData,
		isLoading,
		loadMoreEvents,
		refreshEvents,
		// 历史活动的分页相关
		outdateCurrentPage,
		outdatePageSize,
		outdateHasMoreData,
		outdateIsLoading,
		loadMoreOutdateEvents,
		refreshOutdateEvents
	}
	
	
})