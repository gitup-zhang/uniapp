"use strict";
const common_vendor = require("../common/vendor.js");
const newApis_info = require("../new-apis/info.js");
const useInfoStore = common_vendor.defineStore("peopleinfo", () => {
  let info = common_vendor.ref({});
  const token = common_vendor.ref("");
  const signal = common_vendor.ref(false);
  const getinfo = async () => {
    signal.value = true;
    const res = await newApis_info.getinfoprofile();
    info.value = res.data;
  };
  const updateinfo = async (params) => {
    await newApis_info.updateprofile(params);
  };
  const loginWithWeChat = async () => {
    try {
      const loginRes = await common_vendor.index.login({ provider: "weixin" });
      if (loginRes.errMsg === "login:ok") {
        const codes = loginRes.code;
        console.log(codes);
        const res = await newApis_info.getinfologin({ code: codes });
        token.value = res.token;
        console.log("token:" + token.value);
        if (res.code === 200) {
          signal.value = true;
          console.log("登录成功");
        }
      }
    } catch (err) {
      console.error("登录失败", err);
    }
  };
  function deleteinfo() {
    signal.value = false;
    info.value = {};
  }
  const uploadimage = async (filepath) => {
    return new Promise((resolve, reject) => {
      common_vendor.index.uploadFile({
        url: "http://47.113.194.28:8080/api/file/upload",
        filePath: filepath,
        name: "file",
        header: {
          "Content-Type": "multipart/form-data",
          Authorization: token.value ? `Bearer ${token.value}` : ""
        },
        success: (res) => {
          try {
            const data = JSON.parse(res.data);
            console.log("上传成功:", data);
            resolve(data);
          } catch (e) {
            console.error("解析失败:", e);
            reject(e);
          }
        },
        fail: (err) => {
          console.error("上传失败:", err);
          common_vendor.index.showToast({
            title: "上传失败",
            icon: "none"
          });
          reject(err);
        }
      });
    });
  };
  const getUserProfile = async () => {
    common_vendor.index.getUserProfile({
      desc: "用于完善用户资料",
      success: async (userRes) => {
        console.log(userRes);
        const { encryptedData, iv } = userRes;
        console.log(encryptedData);
        try {
          const res = await newApis_info.getinfoprofile({ encryptedData, iv, token: token.value });
          console.log(res);
        } catch (error) {
          console.error("请求出错:", error);
        }
      },
      fail: (err) => {
        console.error("用户拒绝授权:", err);
      }
    });
  };
  return {
    info,
    token,
    signal,
    getinfo,
    deleteinfo,
    loginWithWeChat,
    getUserProfile,
    updateinfo,
    uploadimage
  };
});
exports.useInfoStore = useInfoStore;
