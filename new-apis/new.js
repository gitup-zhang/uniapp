// api/api.js
import http from '@/utils/request.js';



// 获取新闻列表和搜索功能
export function getNewList(params) {
  return http.get('/news/ListNews', params);
}


// 获取新闻详情
export function getNewDetail(params){
	return http.get(`/news/GetNewsContent/${params}`)
}

// 获取新闻领域
export function getNewField(){
	return http.get('/fieldType')
}
