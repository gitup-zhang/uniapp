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
	return http.put('/user/update',params)
}

// 头像上传
export function uploadimage(params){
	return http.post('file/upload',params)
}

// 查询活动是否报名
export function IsUserRegistered(params){
	return http.get(`/event/isUserRegistered/${params}`)
}