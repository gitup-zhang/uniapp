// api/api.js
import http from '@/utils/request.js';

// 获取公告
export function getnotice(){
	return http.get('/notice')
}
