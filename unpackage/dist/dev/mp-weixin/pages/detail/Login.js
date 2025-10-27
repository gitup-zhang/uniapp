"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const store_Info = require("../../store/Info.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  (_easycom_uni_icons2 + _easycom_uni_load_more2)();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_load_more = () => "../../uni_modules/uni-load-more/components/uni-load-more/uni-load-more.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_uni_load_more)();
}
const _sfc_main = {
  __name: "Login",
  setup(__props) {
    const userInfo = store_Info.useInfoStore();
    const SYSTEMINFO = common_vendor.index.getSystemInfoSync();
    const statusBarHeight = common_vendor.ref(SYSTEMINFO.statusBarHeight);
    const isLogging = common_vendor.ref(false);
    const goBack = () => {
      common_vendor.index.navigateBack({
        fail: () => {
          common_vendor.index.switchTab({
            url: "/pages/mine/mine"
          });
        }
      });
    };
    const handlePhoneAuth = async (e) => {
      console.log("获取手机号事件:", e);
      if (e.detail.errMsg !== "getPhoneNumber:ok") {
        common_vendor.index.showToast({
          title: "已取消授权",
          icon: "none"
        });
        return;
      }
      try {
        isLogging.value = true;
        const loginResult = await callPhoneLoginAPI({
          code: e.detail.code,
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv
        });
        await userInfo.saveLoginInfo(loginResult);
        common_vendor.index.showToast({
          title: "登录成功",
          icon: "success"
        });
        setTimeout(() => {
          goBack();
        }, 1500);
      } catch (error) {
        console.error("手机号登录失败:", error);
        common_vendor.index.showToast({
          title: error.message || "登录失败，请重试",
          icon: "error"
        });
      } finally {
        isLogging.value = false;
      }
    };
    const callPhoneLoginAPI = async (data) => {
      return new Promise((resolve, reject) => {
        common_vendor.index.request({
          url: "https://your-api-domain.com/api/phone-login",
          method: "POST",
          data,
          success: (res) => {
            if (res.data.success) {
              resolve(res.data.data);
            } else {
              reject(new Error(res.data.message || "登录失败"));
            }
          },
          fail: (error) => {
            reject(error);
          }
        });
      });
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
        e: common_vendor.p({
          type: "weixin",
          size: "60",
          color: "#1aad19"
        }),
        f: isLogging.value
      }, isLogging.value ? {
        g: common_vendor.p({
          status: "loading",
          color: "#667eea",
          ["content-text"]: {
            contentnomore: ""
          }
        })
      } : {
        h: common_vendor.p({
          type: "phone",
          size: "20",
          color: "#667eea"
        })
      }, {
        i: common_vendor.o(handlePhoneAuth),
        j: isLogging.value,
        k: common_vendor.o(showUserAgreement),
        l: common_vendor.o(showPrivacyPolicy)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-acb4855b"]]);
wx.createPage(MiniProgramPage);
