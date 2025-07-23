import http from '@/utils/request.js'


// 获取文章领域
export function getArticleField(){
	return http.get('/fieldType')
}

// 获取文章详情
export function getArticleDetail(params){
	return http.get(`/articles/${params}`)
}

// 文章列表
export function getArticleList(params){
	return http.get('/articles', params);
}