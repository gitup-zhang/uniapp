import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getinfologin,getinfoprofile,updateprofile,IsUserRegistered } from '@/new-apis/info.js'
import {userRegisteredEvents} from '@/new-apis/events.js'
//import { EAnimationBlendType } from 'XrFrame'

export const useInfoStore=defineStore('peopleinfo',()=>{
	// 个人信息
	let info=ref({})
	
	const token =ref("")
	// 标志位，判断是否登录
	const signal=ref(false)
	// 是否报名的标志位
	const isapply=ref(false)
	// 已经报名的活动
	const applyactivity=ref([])
	const applyactivityhistory=ref([])
	const eventcount=ref({
		Eventbefore:0,
		Eventing:0,
		Evented:0
	})
	
	// 持久化存储个人信息
	const setToken = (t) => {
	    token.value = t
	    signal.value = true
	    uni.setStorageSync('token', t)
	}
	
	// 获取个人信息
	const getinfo=async()=>{
		signal.value=true
		
		const res=await getinfoprofile()
		info.value=res.data
		
	}
	// 更新个人信息
	const updateinfo=async(params)=>{
		const res = await updateprofile(params)
		 await getinfo()
		return res
	}
	const loginWithWeChat = async () => {
	  try {
	    // 1. 登录获取临时登录凭证 code
	    const loginRes = await uni.login({provider: 'weixin'});
	
	    if (loginRes.errMsg === "login:ok") {
	      const codes = loginRes.code;
			console.log(codes)
	      // 2. 发送 code 到你自己的后端
	      const res = await getinfologin({code:codes})
		  
		  // token.value=res.token
		  console.log("token:"+token.value)
			if(res.code===200){
				signal.value=true
				setToken(res.token)
			
				console.log("登录成功")
			
			}
			
			
	//       if (res.data.code === 200) {
	//         // 假设返回用户信息和你自己的token
	//         const userInfo = res.data.data;
	//         uni.setStorageSync('token', userInfo.token);
	//         uni.setStorageSync('userInfo', userInfo);
	
	//         uni.showToast({ title: '登录成功' });
	//       } else {
	//         uni.showToast({ title: '登录失败', icon: 'none' });
	//       }
	    }
	  } catch (err) {
	    console.error("登录失败", err);
	  }
	};
	function deleteinfo(){
		token.value = ''
		    signal.value = false
		    info.value = {}
		    uni.removeStorageSync('token')
	}
	// 上传图片
	const uploadimage = async (filepath) => {
	  return new Promise((resolve, reject) => {
	    uni.uploadFile({
	      url: 'http://47.113.194.28:8080/api/file/upload',
	      filePath: filepath,
	      name: 'file',
		  formData: {
			biz_type: 'AVATAR' // 添加额外字段
		        },
	      header: {
	        'Content-Type': 'multipart/form-data',
	        Authorization: token.value ? `Bearer ${token.value}` : '',
	      },
	      success: (res) => {
	        try {
	          const data = JSON.parse(res.data) // 后端返回的通常是 JSON 字符串
	          console.log('上传成功:', data)
	          resolve(data) // 返回给调用者
	        } catch (e) {
	          console.error('解析失败:', e)
	          reject(e)
	        }
	      },
	      fail: (err) => {
	        console.error('上传失败:', err)
	        uni.showToast({
	          title: '上传失败',
	          icon: 'none'
	        })
	        reject(err)
	      }
	    })
	  })
	}

	
	
	const getUserProfile = async () => {
	  uni.getUserProfile({
	    desc: '用于完善用户资料',
	    
	    success: async (userRes) => {
	      console.log(userRes);
	      const { encryptedData, iv } = userRes;
		  console.log(encryptedData)
	
	      try {
	        
	        const res = await getinfoprofile({ encryptedData: encryptedData, iv: iv ,token:token.value});
	        console.log(res); // 处理你的请求结果
	      } catch (error) {
	        console.error('请求出错:', error);
	      }
	    },
	    fail: (err) => {
	      console.error('用户拒绝授权:', err);
	    },
	  });
	};
	// 查询是否已经报名
	
	const IsRegistered=async(id)=>{
		try{
			
			const res= await IsUserRegistered(id)
			console.log("报名信息：",res)
			if(res.data.is_registered==="N"){
				console.log("没有报名")
				isapply.value=false
			}else{
				console.log("已经报名")
				isapply.value=true
				
			}
		}catch(e){
			console.log(e)
		}
		
	}
	// 查询已经报名的活动
	const userapply=async()=>{
		try{
			const res=await userRegisteredEvents({event_status:"InProgress"})
			applyactivity.value = Array.isArray(res.data) ? res.data : [];
			
			// 统计未开始和已开始的数量
			const now = new Date();
			 //eventcount.value = { Eventbefore: 0, Eventing: 0, Evented: 0 }
			 let enting=0
			 let ented=0
			applyactivity.value.forEach(event => {
			  const start = new Date(event.event_start_time);
			  const end = new Date(event.event_end_time);
			
			  if (now >= start && now <= end) {
			    //eventcount.value.Eventing++;
				enting++
			  } else if (now < start) {
			     //eventcount.value.Eventbefore++;
				ented++
			  }
			   eventcount.value.Eventing=enting
			   eventcount.value.Eventbefore=ented
			});
			
			
			const reshistory=await userRegisteredEvents({event_status:"Completed"})
			applyactivityhistory.value=Array.isArray(reshistory.data) ? reshistory.data : [];
			eventcount.value.Evented=reshistory.total
			
			console.log("活动数量信息：",eventcount)
		}catch(e){
			console.log(e)
		}
	}

	
	
	return{
		info,
		token,
		signal,
		getinfo,
		deleteinfo,
		eventcount,
		loginWithWeChat,
		getUserProfile,
		updateinfo,
		uploadimage,
		setToken,
		IsRegistered,
		isapply,
		userapply,
		applyactivity,
		applyactivityhistory
	}
	
})