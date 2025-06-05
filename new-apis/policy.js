// api/api.js
import http from '@/utils/request.js';

// 获取测试接口数据
export function getExampleList(params) {
  return http.get('/example/ListExample', params);
}

// 获取政策列表
export function getPolicyList(params) {
  return http.get('/policy/ListPolicy', params);
}
