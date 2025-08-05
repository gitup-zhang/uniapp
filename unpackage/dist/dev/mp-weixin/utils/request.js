"use strict";
const common_vendor = require("../common/vendor.js");
const store_Info = require("../store/Info.js");
let BASE_URL = "";
BASE_URL = "http://47.113.194.28:8080/api";
function buildQuery(params) {
  return Object.entries(params).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join("&");
}
function request(url, method, data = {}, header = {}) {
  const userStore = store_Info.useInfoStore();
  const token = userStore.token;
  console.log("获取到的token：" + token);
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
        // ✅ 加入 token
        ...header
      },
      data: upperMethod === "GET" ? void 0 : data,
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(res);
        }
      },
      fail: (err) => {
        common_vendor.index.showToast({ title: "网络连接失败", icon: "none" });
        reject(err);
      }
    });
  });
}
const http = {
  get: (url, data, header) => request(url, "GET", data, header),
  post: (url, data, header) => request(url, "POST", data, header)
};
exports.http = http;
