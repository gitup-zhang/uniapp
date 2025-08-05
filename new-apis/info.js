// api/api.js
import http from '@/utils/request.js';

// 注册和登录接口
export function getinfologin(params){
	
	return http.post('/user/login',params)
	
}

// 获取用户个人信息接口
export function getinfoprofile(){
	
	return http.get('/user/info')
}

// 更新用户信息
export function updateprofile(params){
	return http.post('/user/update',params)
}