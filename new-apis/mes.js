// api/api.js
import http from '@/utils/request.js';

// 查询系统消息
export function getsystemmes(params){
	return http.get('/message/byTypeGroups',params)
}
// 查询活动消息  类似于一个个微信群组
export function geteventmes(){
	return http.get('/message/byEventGroups')
}
// 查询群组里面的一个个消息
export function getmesgroup(params){
	return http.get('/message/byGroups',params)
}
// 一键已读
export function markAllAsRead(){
	return http.put('/message/markAllAsRead')
}
