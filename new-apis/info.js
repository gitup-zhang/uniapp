// api/api.js
import http from '@/utils/request.js';

export function getinfologin(params){
	
	return http.post('/user/login',params)
	
}


export function getinfoprofile(params){
	
	return http.post('/user/decrypt',params)
}