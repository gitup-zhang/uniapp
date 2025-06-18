

const BASE_URL = import.meta.env.DEV ? '/api' : 'http://47.113.194.28:8080/api';

// 辅助函数：将对象参数转为 URL 查询字符串
function buildQuery(params) {
  return Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
}

// 通用请求方法
function request(url, method, data = {}, header = {}) {
  let requestUrl = url;
  const upperMethod = method.toUpperCase();

  // GET 请求时，将参数拼接到 URL
  if (upperMethod === 'GET' && Object.keys(data).length > 0) {
    const queryString = buildQuery(data);
    requestUrl += (requestUrl.includes('?') ? '&' : '?') + queryString;
  }

  return new Promise((resolve, reject) => {
    uni.request({
      url: BASE_URL + requestUrl,
      method: upperMethod,
      header: {
        'Content-Type': 'application/json',
        ...header
      },
      // POST/PUT 请求放在 data
      data: upperMethod === 'GET' ? undefined : data,
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(res);
        }
      },
      fail: (err) => {
        uni.showToast({ title: '网络连接失败', icon: 'none' });
        reject(err);
      }
    });
  });
}

export default {
  get: (url, data, header) => request(url, 'GET', data, header),
  post: (url, data, header) => request(url, 'POST', data, header),
};
