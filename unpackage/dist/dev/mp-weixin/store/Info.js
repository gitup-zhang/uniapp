"use strict";
const common_vendor = require("../common/vendor.js");
const newApis_info = require("../new-apis/info.js");
const useInfoStore = common_vendor.defineStore("peopleinfo", () => {
  let info = common_vendor.ref({});
  const token = common_vendor.ref("");
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
      const loginRes = await common_vendor.index.login({ provider: "weixin" });
      if (loginRes.errMsg === "login:ok") {
        const codes = loginRes.code;
        common_vendor.index.__f__("log", "at store/Info.js:34", codes);
        const res = await newApis_info.getinfologin({ code: codes });
        token.value = res.token;
        common_vendor.index.__f__("log", "at store/Info.js:38", "token:" + token.value);
        if (res.code === 200) {
          signal.value = true;
          common_vendor.index.__f__("log", "at store/Info.js:41", "1111111111111111111111111111");
          common_vendor.index.__f__("log", "at store/Info.js:42", "登录成功");
        }
      }
    } catch (err) {
      common_vendor.index.__f__("error", "at store/Info.js:58", "登录失败", err);
    }
  };
  function deleteinfo() {
    signal.value = false;
    info.value = {};
  }
  const getUserProfile = async () => {
    common_vendor.index.getUserProfile({
      desc: "用于完善用户资料",
      success: async (userRes) => {
        common_vendor.index.__f__("log", "at store/Info.js:71", userRes);
        const { encryptedData, iv } = userRes;
        common_vendor.index.__f__("log", "at store/Info.js:73", encryptedData);
        try {
          const res = await newApis_info.getinfoprofile({ encryptedData, iv, token: token.value });
          common_vendor.index.__f__("log", "at store/Info.js:78", res);
        } catch (error) {
          common_vendor.index.__f__("error", "at store/Info.js:80", "请求出错:", error);
        }
      },
      fail: (err) => {
        common_vendor.index.__f__("error", "at store/Info.js:84", "用户拒绝授权:", err);
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
