import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getinfologin,getinfoprofile } from '@/new-apis/info.js'


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
	const loginWithWeChat = async () => {
	  try {
	    // 1. 登录获取临时登录凭证 code
	    const loginRes = await uni.login();
	
	    if (loginRes.errMsg === "login:ok") {
	      const codes = loginRes.code;
			console.log(codes)
	      // 2. 发送 code 到你自己的后端
	      const res = await getinfologin({code:codes})
		  console.log(res)
			if(res.code===200){
				console.log("1111111111111111111111111111")
				console.log("登录成功")
				// getUserProfile(123)
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
	
	const  getUserProfile =async(token)=>{
	  uni.getUserProfile({
	    desc: '用于完善用户资料',
	    success: (userRes) => {
			console.log(userRes)
	      const { encryptedData, iv } = userRes;
	
	      // 发送 encryptedData 和 iv 给后台，由后台用 session_key 解密
	      // uni.request({
	      //   url: 'http://你的服务器地址/api/user/decrypt',
	      //   method: 'POST',
	      //   data: {
	      //     encryptedData,
	      //     iv,
	      //     // token // 后台用 token 找到 session_key
	      //   },
		  // const res= await getinfoprofile({encryptedDatas:encryptedData,ivs:iv})
	      //   success: (decryptRes) => {
	      //     if (decryptRes.data.code === 200) {
	      //       console.log('用户信息：', decryptRes.data.data);
	      //       // 这里拿到用户昵称、头像等信息，可以保存到页面或者数据库
	      //     } else {
	      //       console.error('解密失败:', decryptRes.data.message);
	      //     }
	      //   }
	      // });
	    },
	    fail: (err) => {
	      console.error('用户拒绝授权:', err);
	    }
	  });
	}

	
	
	return{
		info,
		signal,
		getinfo,
		deleteinfo,
		loginWithWeChat,
		getUserProfile
	}
	
})
