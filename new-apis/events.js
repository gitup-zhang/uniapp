import http from '@/utils/request.js'

// 活动列表
export function getEventList(params){
	return http.get('/event', params);
}
// 获取活动详情
export function getEventDetail(params){
	return http.get(`/event/${params}`)
}
// 活动报名
export function activityapply(params){
	return http.post('/event/registration', params);
}
// 取消活动报名
export function cancelapply(params){
	return http.delete(`/event/cancelRegistration/${params}`)
}
// 查询已经报名的活动
export function userRegisteredEvents(params){
	return http.get('/event/userRegisteredEvents')
}

