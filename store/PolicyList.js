import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getPolicyList,getPolicyField } from '@/new-apis/policy.js'

export const usePolicyStore = defineStore('policylist', () => {
	// 获取的列表
  const listpolicy = ref([])
  // 政策领域
  const policyfieldlist=ref([])
  // 是否正确返回信息标志位与信息
  const message=ref("")
  

  const getlistpolicy = async () => {
    uni.showLoading({
      title: '加载中...',
      mask: true
    })

    try {
		message.value=""
	
      const res = await getPolicyList({})  // 正确使用 await
      console.log('示例数据：', res.data)
      listpolicy.value = res.data           // 正常赋值
    } catch (error) {
		message.value=error.data.error
      console.log(message.value)
    } finally {
      uni.hideLoading()
    }
  }
  // 政策领域列表
  const policyfield=async()=>{
	  
	  uni.showLoading({
	    title: '加载中...',
	    mask: true
	  })
	  try{
		  const res=await getPolicyField()
		  policyfieldlist.value=['全部', ...res.data.map(item => item.field_name).sort()];
		  console.log(policyfieldlist.value)
	  }catch(error){
		  console.log(error)
	  }finally{
		  uni.hideLoading()
	  }
	  
  }
  
  // 搜索框
  const searchpolicy=async(params)=>{
	  
	  uni.showLoading({
	    title: '加载中...',
	    mask: true
	  })
	  
	  try {
	  	message.value=""

	    const res = await getPolicyList(params) 
		
	    console.log('示例数据：', res.data)
	    listpolicy.value = res.data           // 正常赋值
	  } catch (error) {

		  console.log(error)
	  	// message.value=error.data.error
	   //  console.log(message.value)
	  } finally {
	    uni.hideLoading()
	  }
  }

  return {
    getlistpolicy,
    listpolicy,
	message,
	searchpolicy,
	policyfield,
	policyfieldlist
  }
})
