"use strict";
const common_vendor = require("../common/vendor.js");
const newApis_info = require("../new-apis/info.js");
const newApis_events = require("../new-apis/events.js");
const useInfoStore = common_vendor.defineStore("peopleinfo", () => {
  let info = common_vendor.ref({});
  const accessToken = common_vendor.ref("");
  const refreshToken = common_vendor.ref("");
  const sessionSign = common_vendor.ref("");
  const signal = common_vendor.ref(false);
  const isapply = common_vendor.ref(false);
  const applyactivity = common_vendor.ref([]);
  const applyactivityhistory = common_vendor.ref([]);
  const eventcount = common_vendor.ref({
    Eventbefore: 0,
    Eventing: 0,
    Evented: 0
  });
  const setTokens = (access, refresh, session) => {
    accessToken.value = access;
    refreshToken.value = refresh;
    sessionSign.value = session;
    signal.value = true;
    common_vendor.index.setStorageSync("accessToken", access);
    common_vendor.index.setStorageSync("refreshToken", refresh);
    common_vendor.index.setStorageSync("sessionSign", session);
  };
  const loadTokensFromStorage = () => {
    try {
      const access = common_vendor.index.getStorageSync("accessToken");
      const refresh = common_vendor.index.getStorageSync("refreshToken");
      const session = common_vendor.index.getStorageSync("sessionSign");
      if (access && refresh && session) {
        accessToken.value = access;
        refreshToken.value = refresh;
        sessionSign.value = session;
        signal.value = true;
        return true;
      }
    } catch (e) {
      console.error("加载Token失败:", e);
    }
    return false;
  };
  const refreshAccessToken = async () => {
    try {
      console.log("开始刷新Token...");
      const res = await common_vendor.index.request({
        url: "http://47.113.194.28:8080/api/user/refreshToken",
        // 替换为你的刷新接口
        method: "POST",
        header: {
          "Content-Type": "application/json"
        },
        data: {
          refresh_token: refreshToken.value,
          session_sign: sessionSign.value
        }
      });
      if (res.data.code === 200) {
        setTokens(
          res.data.access_token,
          res.data.refresh_token,
          sessionSign.value
          // session_sign 可能不会改变，使用原值或新值
        );
        console.log("Token刷新成功");
        return true;
      } else if (res.data.code === 40003) {
        console.log("刷新令牌过期，需要重新登录");
        deleteinfo();
        common_vendor.index.showToast({
          title: "登录已过期，请重新登录",
          icon: "none"
        });
        common_vendor.index.navigateTo({
          url: "/pages/login/login"
        });
        return false;
      }
    } catch (error) {
      console.error("刷新Token失败:", error);
      deleteinfo();
      return false;
    }
  };
  const getinfo = async () => {
    signal.value = true;
    const res = await newApis_info.getinfoprofile();
    info.value = res.data;
  };
  const updateinfo = async (params) => {
    const res = await newApis_info.updateprofile(params);
    await getinfo();
    return res;
  };
  const loginWithWeChat = async (encryptedData, iv) => {
    try {
      const loginRes = await common_vendor.index.login({ provider: "weixin" });
      if (loginRes.errMsg === "login:ok") {
        const codes = loginRes.code;
        console.log("微信code:", codes);
        const res = await newApis_info.getinfologin({
          code: codes,
          encrypted_data: encryptedData,
          iv
        });
        console.log("登录响应:", res);
        if (res.code === 200) {
          setTokens(
            res.access_token,
            res.refresh_token,
            res.session_sign
          );
          signal.value = true;
          console.log("登录成功");
          return true;
        } else {
          common_vendor.index.showToast({
            title: res.message || "登录失败",
            icon: "none"
          });
          return false;
        }
      }
    } catch (err) {
      console.error("登录失败", err);
      common_vendor.index.showToast({
        title: "登录失败，请重试",
        icon: "none"
      });
      return false;
    }
  };
  function deleteinfo() {
    accessToken.value = "";
    refreshToken.value = "";
    sessionSign.value = "";
    signal.value = false;
    info.value = {};
    common_vendor.index.removeStorageSync("accessToken");
    common_vendor.index.removeStorageSync("refreshToken");
    common_vendor.index.removeStorageSync("sessionSign");
  }
  const uploadimage = async (filepath) => {
    return new Promise((resolve, reject) => {
      common_vendor.index.uploadFile({
        url: "http://47.113.194.28:8080/api/file/upload",
        filePath: filepath,
        name: "file",
        formData: {
          biz_type: "AVATAR"
        },
        header: {
          "Content-Type": "multipart/form-data",
          Authorization: accessToken.value ? `Bearer ${accessToken.value}` : ""
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
          const res = await newApis_info.getinfoprofile({
            encryptedData,
            iv,
            token: accessToken.value
          });
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
  const IsRegistered = async (id) => {
    try {
      const res = await newApis_info.IsUserRegistered(id);
      console.log("报名信息：", res);
      if (res.data.is_registered === "N") {
        console.log("没有报名");
        isapply.value = false;
      } else {
        console.log("已经报名");
        isapply.value = true;
      }
    } catch (e) {
      console.log(e);
    }
  };
  const userapply = async () => {
    try {
      const res = await newApis_events.userRegisteredEvents({ event_status: "InProgress" });
      applyactivity.value = Array.isArray(res.data) ? res.data : [];
      const now = /* @__PURE__ */ new Date();
      let enting = 0;
      let ented = 0;
      applyactivity.value.forEach((event) => {
        const start = new Date(event.event_start_time);
        const end = new Date(event.event_end_time);
        if (now >= start && now <= end) {
          enting++;
        } else if (now < start) {
          ented++;
        }
        eventcount.value.Eventing = enting;
        eventcount.value.Eventbefore = ented;
      });
      const reshistory = await newApis_events.userRegisteredEvents({ event_status: "Completed" });
      applyactivityhistory.value = Array.isArray(reshistory.data) ? reshistory.data : [];
      eventcount.value.Evented = reshistory.total;
      console.log("活动数量信息：", eventcount);
    } catch (e) {
      console.log(e);
    }
  };
  return {
    info,
    accessToken,
    refreshToken,
    sessionSign,
    signal,
    getinfo,
    deleteinfo,
    eventcount,
    loginWithWeChat,
    getUserProfile,
    updateinfo,
    uploadimage,
    setTokens,
    loadTokensFromStorage,
    refreshAccessToken,
    IsRegistered,
    isapply,
    userapply,
    applyactivity,
    applyactivityhistory
  };
});
exports.useInfoStore = useInfoStore;
