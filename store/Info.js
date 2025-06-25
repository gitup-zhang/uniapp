import { defineStore } from 'pinia'
import { ref } from 'vue'


export const useInfoStore=defineStore('peopleinfo',()=>{
	// 个人信息
	let info=ref({})
	// 标志位，判断是否登录
	const signal=ref(false)
	const getinfo=async()=>{
		signal.value=true
		info.value={
			username: '胡歌',
			slogan: '在阳光灿烂的日子里睡觉呀',
			newsViews: 123,
			policyViews: 234,
			daysOnline :128,
			field : '人工智能',
			Image :'/static/picture.jpg'
		}
		
	}
	function deleteinfo(){
		signal.value=false
		info.value={}
	}
	
	
	return{
		info,
		signal,
		getinfo,
		deleteinfo
	}
	
})
