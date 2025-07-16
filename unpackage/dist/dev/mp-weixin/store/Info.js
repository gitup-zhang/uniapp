"use strict";
const common_vendor = require("../common/vendor.js");
const newApis_info = require("../new-apis/info.js");
const useInfoStore = common_vendor.defineStore("peopleinfo", () => {
  let info = common_vendor.ref({});
  const signal = common_vendor.ref(false);
  const getinfo = async () => {
    signal.value = true;
    info.value = {
      username: "胡歌",
      slogan: "在阳光灿烂的日子里睡觉呀",
      newsViews: 123,
      policyViews: 234,
      daysOnline: 128,
      field: "人工智能",
      Image: "/static/picture.jpg"
    };
  };
  const loginWithWeChat = async () => {
    try {
      const loginRes = await common_vendor.index.login();
      if (loginRes.errMsg === "login:ok") {
        const codes = loginRes.code;
        common_vendor.index.__f__("log", "at store/Info.js:31", codes);
        const res = await newApis_info.getinfologin({ code: codes });
        common_vendor.index.__f__("log", "at store/Info.js:34", res);
        if (res.code === 200) {
          common_vendor.index.__f__("log", "at store/Info.js:36", "1111111111111111111111111111");
          common_vendor.index.__f__("log", "at store/Info.js:37", "登录成功");
        }
      }
    } catch (err) {
      common_vendor.index.__f__("error", "at store/Info.js:54", "登录失败", err);
    }
  };
  function deleteinfo() {
    signal.value = false;
    info.value = {};
  }
  const getUserProfile = async (token) => {
    common_vendor.index.getUserProfile({
      desc: "用于完善用户资料",
      success: (userRes) => {
        common_vendor.index.__f__("log", "at store/Info.js:66", userRes);
      },
      fail: (err) => {
        common_vendor.index.__f__("error", "at store/Info.js:90", "用户拒绝授权:", err);
      }
    });
  };
  return {
    info,
    signal,
    getinfo,
    deleteinfo,
    loginWithWeChat,
    getUserProfile
  };
});
exports.useInfoStore = useInfoStore;
//# sourceMappingURL=../../.sourcemap/mp-weixin/store/Info.js.map
