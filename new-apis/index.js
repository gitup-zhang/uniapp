// api/api.js
import http from '@/utils/request.js';

// 获取公告
export function getnotice(){
	return http.get('/notice')
}
// 获取公告详细信息
export function getnoticedetail(params){
	
   return  http.get(`/notice/${params}`)
}
