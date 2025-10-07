import { defineStore } from 'pinia'
import { ref } from 'vue'
import {getArticleList} from '@/new-apis/articles.js'
import {getEventList} from '@/new-apis/events.js'

export const useSelectedstore=defineStore('selected',()=>{
	// 精选政策
	const policys=ref([])
	const policytotal=ref(0)
	// 精选新闻
	const news=ref([])
	const newstotal=ref(0)
	// 活动
	const event=ref([])
	const eventtotal=ref(0)
	
	const getselected=async()=>{
			  
			  uni.showLoading({
			    title: '加载中...',
			    mask: true
			  })
			  try{
				  const res_new=await getArticleList({page_size:8,article_type:"NEWS"})
				  
				  news.value=res_new.data
				  newstotal.value=res_new.total
				  const res_policy=await getArticleList({page_size:8,article_type:"POLICY"})
				  policys.value=res_policy.data
				  policytotal.value=res_policy.total
				  
			  }catch(error){
				  console.log(error)
			  }finally{
				  uni.hideLoading()
			  }
			  
			  
	}
	
	const getevent=async()=>{
		uni.showLoading({
		  title: '加载中...',
		  mask: true
		})
		try{
			const resing = await getEventList({
				page_size: 8,
				event_status: "InProgress"
			})
			const redbefore=await getEventList({
				page_size: 8,
				event_status: "NotBegun"
			})
			event.value=[...resing.data,...redbefore.data]
			console.log(event.value)
			eventtotal.value=resing.total+redbefore.total
			
			
		}catch(e){
			console.log(e)
		}finally{
			uni.hideLoading()
		}
		
	}
	return{
				  news,
				  policys,
				 getselected,
				  policytotal,
				  newstotal,
				  getevent,
				  event,
				  eventtotal
				  
			  }
	
})