import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getinfologin,getinfoprofile } from '@/new-apis/info.js'


export const useInfoStore=defineStore('peopleinfo',()=>{
	// 个人信息
	let info=ref({})
	
	const token =ref("")
	// 标志位，判断是否登录
	const signal=ref(true)
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
	const loginWithWeChat = async () => {
	  try {
	    // 1. 登录获取临时登录凭证 code
	    const loginRes = await uni.login({provider: 'weixin'});
	
	    if (loginRes.errMsg === "login:ok") {
	      const codes = loginRes.code;
			console.log(codes)
	      // 2. 发送 code 到你自己的后端
	      const res = await getinfologin({code:codes})
		  token.value=res.token
		  console.log(token.value)
			if(res.code===200){
				console.log("1111111111111111111111111111")
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
		signal.value=false
		info.value={}
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

	
	
	return{
		info,
		signal,
		getinfo,
		deleteinfo,
		loginWithWeChat,
		getUserProfile
	}
	
})