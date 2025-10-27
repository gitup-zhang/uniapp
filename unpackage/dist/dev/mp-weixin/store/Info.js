"use strict";
const common_vendor = require("../common/vendor.js");
const newApis_info = require("../new-apis/info.js");
const newApis_events = require("../new-apis/events.js");
const useInfoStore = common_vendor.defineStore("peopleinfo", () => {
  let info = common_vendor.ref({});
  const token = common_vendor.ref("");
  const signal = common_vendor.ref(false);
  const isapply = common_vendor.ref(false);
  const applyactivity = common_vendor.ref([]);
  const applyactivityhistory = common_vendor.ref([]);
  const eventcount = common_vendor.ref({
    Eventbefore: 0,
    Eventing: 0,
    Evented: 0
  });
  const setToken = (t) => {
    token.value = t;
    signal.value = true;
    common_vendor.index.setStorageSync("token", t);
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
        console.log(codes);
        const res = await newApis_info.getinfologin({ code: codes, encrypted_data: encryptedData, iv });
        console.log("token:" + token.value);
        if (res.code === 200) {
          signal.value = true;
          setToken(res.token);
          console.log("登录成功");
          return true;
        }
      }
    } catch (err) {
      console.error("登录失败", err);
      return false;
    }
  };
  function deleteinfo() {
    token.value = "";
    signal.value = false;
    info.value = {};
    common_vendor.index.removeStorageSync("token");
  }
  const uploadimage = async (filepath) => {
    return new Promise((resolve, reject) => {
      common_vendor.index.uploadFile({
        url: "http://47.113.194.28:8080/api/file/upload",
        filePath: filepath,
        name: "file",
        formData: {
          biz_type: "AVATAR"
          // 添加额外字段
        },
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
    token,
    signal,
    getinfo,
    deleteinfo,
    eventcount,
    loginWithWeChat,
    getUserProfile,
    updateinfo,
    uploadimage,
    setToken,
    IsRegistered,
    isapply,
    userapply,
    applyactivity,
    applyactivityhistory
  };
});
exports.useInfoStore = useInfoStore;
