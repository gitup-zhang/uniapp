import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getPolicyList,getPolicyField } from '@/new-apis/policy.js'

export const usePolicyStore = defineStore('policylist', () => {
	// 获取的列表
  const listpolicy = ref([])
  const page =ref(1)

  // 是否正确返回信息标志位与信息
  const message=ref("")
    // 加载状态
    const loading = ref(false)
    const hasMore = ref(true)

  const getlistpolicy = async () => {
    uni.showLoading({
      title: '加载中...',
      mask: true
    })

    try {
		message.value=""
	
      const res = await getPolicyList({})  // 正确使用 await
      console.log('示例数据：', res.data)
	  page.value=res.page
	  if(res.page*res.page_size<res.total){
		  hasMore.value=true
	  }else{
		  hasMore.value=false
	  }
	  console.log(hasMore.value)
	  
	  
      listpolicy.value = res.data           // 正常赋值
    } catch (error) {
		message.value=error.data.error
      console.log(message.value)
    } finally {
      uni.hideLoading()
    }
  }
  
  const getmorelist=async(parma)=>{
	  if(loading.value||!hasMore.value) return
	  
	  
	  try{
		 loading.value=true 
		 
		const res = await getPolicyList(parma)
		page.value=res.page
		if(res.page*res.page_size<res.total){
				  hasMore.value=true
		}else{
				  hasMore.value=false
		}
		// 拼接新数据
		listpolicy.value=listpolicy.value.concat(res.data)
	  }catch(error){
		  
	  }finally{
		  loading.value=false
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
		page.value=res.page
		if(res.page*res.page_size<res.total){
				  hasMore.value=true
		}else{
				  hasMore.value=false
		}
		
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
	getmorelist,
	loading,
	hasMore,
	page
  }
})
