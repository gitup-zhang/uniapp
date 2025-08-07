import { defineStore } from 'pinia'
import { ref } from 'vue'
import {getEventList,getEventDetail} from '@/new-apis/events.js'

export const useEventstore=defineStore('event',()=>{
	const eventing=ref([])
	const eventoutdate=ref([])
	
	// 获取的活动详情
	const eventdetail=ref({})
	
	const getlisting=async(num)=>{
		uni.showLoading({
		  title: '加载中...',
		  mask: true
		})
		try{
		const res=await getEventList({page_size:num,event_status:"InProgress"})
		eventing.value=res.data		 
					 
		}catch(error){
					  console.log(error)
		}finally{
			uni.hideLoading()		
		}
		
	}
	// 获取过期活动
	const getlisoutdate=async(num)=>{
		uni.showLoading({
		  title: '加载中...',
		  mask: true
		})
		try{
		const res=await getEventList({page_size:num,event_status:"Completed"})
		eventoutdate.value=res.data		 
					 
		}catch(error){
					  console.log(error)
		}finally{
			uni.hideLoading()		
		}
		
	}
	// 获取活动详情
	const geteventdetail=async(id)=>{
		uni.showLoading({
		  title: '加载中...',
		  mask: true
		})
		try{
		const res=await getEventDetail(id)
		eventdetail.value=res	
		 console.log(eventdetail.value)
					 
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
		eventdetail
	}
	
	
})