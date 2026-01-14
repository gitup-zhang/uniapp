"use strict";
const common_vendor = require("../common/vendor.js");
const store_Info = require("../store/Info.js");
let BASE_URL = "";
BASE_URL = "http://47.113.194.28:8080/api";
let isRefreshing = false;
let requestQueue = [];
function buildQuery(params) {
  return Object.entries(params).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join("&");
}
const processQueue = (error, token = null) => {
  requestQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  requestQueue = [];
};
function request(url, method, data = {}, header = {}, isRetry = false) {
  const userStore = store_Info.useInfoStore();
  const token = userStore.accessToken;
  console.log("获取到的accessToken：" + token);
  let requestUrl = url;
  const upperMethod = method.toUpperCase();
  if (upperMethod === "GET" && Object.keys(data).length > 0) {
    const queryString = buildQuery(data);
    requestUrl += (requestUrl.includes("?") ? "&" : "?") + queryString;
  }
  return new Promise((resolve, reject) => {
    common_vendor.index.request({
      url: BASE_URL + requestUrl,
      method: upperMethod,
      header: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
        ...header
      },
      data: upperMethod === "GET" ? void 0 : data,
      success: async (res) => {
        var _a, _b;
        if (res.statusCode === 200) {
          resolve(res.data);
        } else if (res.statusCode === 401 || ((_a = res.data) == null ? void 0 : _a.code) === 40002) {
          console.log("Token过期，尝试刷新...");
          if (isRetry) {
            console.log("重试失败，跳转登录");
            userStore.deleteinfo();
            common_vendor.index.showToast({
              title: "登录已过期，请重新登录",
              icon: "none"
            });
            common_vendor.index.navigateTo({
              url: "/pages/login/login"
            });
            reject(new Error("登录已过期"));
            return;
          }
          if (isRefreshing) {
            console.log("等待token刷新...");
            return new Promise((resolve2, reject2) => {
              requestQueue.push({
                resolve: (newToken) => {
                  request(url, method, data, header, true).then(resolve2).catch(reject2);
                },
                reject: reject2
              });
            });
          }
          isRefreshing = true;
          try {
            const refreshSuccess = await userStore.refreshAccessToken();
            if (refreshSuccess) {
              processQueue(null, userStore.accessToken);
              const retryRes = await request(url, method, data, header, true);
              resolve(retryRes);
            } else {
              processQueue(new Error("Token刷新失败"));
              reject(new Error("Token刷新失败"));
            }
          } catch (error) {
            console.error("Token刷新异常:", error);
            processQueue(error);
            reject(error);
          } finally {
            isRefreshing = false;
          }
        } else if (((_b = res.data) == null ? void 0 : _b.code) === 40003) {
          console.log("刷新令牌过期，需要重新登录");
          userStore.deleteinfo();
          common_vendor.index.showToast({
            title: "登录已过期，请重新登录",
            icon: "none"
          });
          common_vendor.index.navigateTo({
            url: "/pages/login/login"
          });
          reject(new Error("刷新令牌过期"));
        } else {
          reject(res);
        }
      },
      fail: (err) => {
        console.error("请求失败:", err);
        common_vendor.index.showToast({
          title: "网络连接失败",
          icon: "none"
        });
        reject(err);
      }
    });
  });
}
const http = {
  get: (url, data, header) => request(url, "GET", data, header),
  post: (url, data, header) => request(url, "POST", data, header),
  put: (url, data, header) => request(url, "PUT", data, header),
  delete: (url, data, header) => request(url, "DELETE", data, header)
};
exports.http = http;
