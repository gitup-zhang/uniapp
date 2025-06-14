// api/api.js
import http from '@/utils/request.js';

// 获取测试接口数据
export function getExampleList(params) {
  return http.get('/example/ListExample', params);
}

// 获取政策列表和搜索功能
export function getPolicyList(params) {
  return http.get('/policy/ListPolicy', params);
}


// 获取政策详情
export function getPolicyDetail(params){
	return http.get(`/policy/GetPolicyContent/${params}`)
}
