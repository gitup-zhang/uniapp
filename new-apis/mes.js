// api/api.js
import http from '@/utils/request.js';

// 查询系统消息
export function getsystemmes(params){
	return http.get('/message/byTypeGroups',params)
}
// 查询活动消息
export function geteventmes(){
	return http.get('/message/byEventGroups')
}
