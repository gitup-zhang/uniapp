"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const store_Info = require("../../store/Info.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_easycom_uni_icons2 + _easycom_uni_load_more2 + _easycom_uni_popup2)();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_load_more = () => "../../uni_modules/uni-load-more/components/uni-load-more/uni-load-more.js";
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_uni_load_more + _easycom_uni_popup)();
}
const _sfc_main = {
  __name: "Login",
  setup(__props) {
    const userInfo = store_Info.useInfoStore();
    const SYSTEMINFO = common_vendor.index.getSystemInfoSync();
    const statusBarHeight = common_vendor.ref(SYSTEMINFO.statusBarHeight);
    const loadingPopup = common_vendor.ref(null);
    const isLogging = common_vendor.ref(false);
    const loadingText = common_vendor.ref({ more: "加载中..." });
    const loginType = common_vendor.ref("wechat");
    common_vendor.reactive({
      username: "",
      password: "",
      usernameError: "",
      passwordError: ""
    });
    const smsForm = common_vendor.reactive({
      phone: "",
      code: "",
      phoneError: "",
      codeError: ""
    });
    common_vendor.ref(0);
    common_vendor.computed(() => {
      return /^1[3-9]\d{9}$/.test(smsForm.phone);
    });
    const goBack = () => {
      common_vendor.index.navigateBack({
        fail: () => {
          common_vendor.index.switchTab({
            url: "/pages/mine/mine"
          });
        }
      });
    };
    const wechatlogin = async () => {
      try {
        isLogging.value = true;
        const res = await userInfo.loginWithWeChat();
        isLogging.value = false;
        if (res) {
          common_vendor.index.showToast({
            title: "登录成功",
            icon: "success"
          });
          setTimeout(() => {
            goBack();
          }, 1500);
        }
      } catch (e) {
        console.log(e);
        isLogging.value = false;
      }
    };
    const showUserAgreement = () => {
      common_vendor.index.navigateTo({
        url: "/pages/agreement/user"
      });
    };
    const showPrivacyPolicy = () => {
      common_vendor.index.navigateTo({
        url: "/pages/agreement/privacy"
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: statusBarHeight.value + "px",
        b: common_vendor.p({
          type: "left",
          size: "24",
          color: "#fff"
        }),
        c: common_vendor.o(goBack),
        d: common_assets._imports_0$1,
        e: loginType.value === "wechat"
      }, loginType.value === "wechat" ? {
        f: common_vendor.p({
          type: "weixin",
          size: "60",
          color: "#1aad19"
        }),
        g: common_vendor.p({
          type: "weixin",
          size: "20",
          color: "#fff"
        }),
        h: common_vendor.o((...args) => _ctx.handlePhoneAuth && _ctx.handlePhoneAuth(...args)),
        i: isLogging.value,
        j: common_vendor.o(wechatlogin)
      } : {}, {
        k: common_vendor.o(showUserAgreement),
        l: common_vendor.o(showPrivacyPolicy),
        m: common_vendor.p({
          status: "loading",
          ["content-text"]: loadingText.value
        }),
        n: common_vendor.sr(loadingPopup, "acb4855b-3", {
          "k": "loadingPopup"
        }),
        o: common_vendor.p({
          type: "center"
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-acb4855b"]]);
wx.createPage(MiniProgramPage);
