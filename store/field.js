import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getPolicyField } from '../new-apis/policy.js'


export const usefieldstore=defineStore('field',()=>{
	// 政策领域
	const fieldlist=ref([])
	
	// 政策领域列表
	  const getfield=async()=>{
		  
		  uni.showLoading({
		    title: '加载中...',
		    mask: true
		  })
		  try{
			  const res=await getPolicyField()
			  // fieldlist.value=['全部', ...res.data.map(item => item.field_name).sort()];
			  fieldlist.value=res.data
			  console.log(fieldlist.value)
		  }catch(error){
			  console.log(error)
		  }finally{
			  uni.hideLoading()
		  }
		  
	  }
	return{
		fieldlist,
		getfield
	}
	
})