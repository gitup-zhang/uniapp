import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getinfologin,getinfoprofile,updateprofile } from '@/new-apis/info.js'


export const useInfoStore=defineStore('peopleinfo',()=>{
	// 个人信息
	let info=ref({})
	
	const token =ref("")
	// 标志位，判断是否登录
	const signal=ref(false)
	
	// 获取个人信息
	const getinfo=async()=>{
		signal.value=true
		
		const res=await getinfoprofile()
		info.value=res.data
	}
	// 更新个人信息
	const updateinfo=async(params)=>{
		await updateprofile(params)
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
		  console.log("token:"+token.value)
			if(res.code===200){
				signal.value=true
			
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
	// 上传图片
	const uploadimage = async (filepath) => {
	  return new Promise((resolve, reject) => {
	    uni.uploadFile({
	      url: 'http://47.113.194.28:8080/api/file/upload',
	      filePath: filepath,
	      name: 'file',
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

	
	
	return{
		info,
		token,
		signal,
		getinfo,
		deleteinfo,
		loginWithWeChat,
		getUserProfile,
		updateinfo,
		uploadimage
	}
	
})