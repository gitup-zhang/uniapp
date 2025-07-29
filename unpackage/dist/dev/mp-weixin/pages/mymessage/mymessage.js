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
  (_easycom_uni_icons + _easycom_uni_load_more + ActivityTicket + _easycom_uni_popup)();
}
const ActivityTicket = () => "../../components/ActivityTicket/ActivityTicket.js";
const _sfc_main = {
  __name: "mymessage",
  setup(__props) {
    const userInfo = store_Info.useInfoStore();
    const SYSTEMINFO = common_vendor.index.getSystemInfoSync();
    const statusBarHeight = common_vendor.ref(SYSTEMINFO.statusBarHeight);
    const loadingPopup = common_vendor.ref(null);
    const isLogging = common_vendor.ref(false);
    const loadingText = common_vendor.ref({ more: "加载中..." });
    const loginFeatures = common_vendor.ref([
      {
        icon: "locked",
        color: "#2ed573",
        iconClass: "security-icon",
        title: "安全保障",
        desc: "银行级数据加密保护"
      },
      {
        icon: "heart",
        color: "#ff4757",
        iconClass: "personal-icon",
        title: "个性推荐",
        desc: "智能内容个性化推送"
      },
      {
        icon: "cloud",
        color: "#3742fa",
        iconClass: "sync-icon",
        title: "云端同步",
        desc: "多设备无缝数据同步"
      }
    ]);
    common_vendor.ref([
      {
        icon: "gear",
        text: "账户设置",
        bgColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        iconColor: "#fff",
        action: "settings"
      },
      {
        icon: "heart",
        text: "我的收藏",
        bgColor: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
        iconColor: "#fff",
        action: "favorites"
      },
      {
        icon: "chatbubble",
        text: "消息中心",
        bgColor: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
        iconColor: "#fff",
        action: "messages"
      },
      {
        icon: "help",
        text: "帮助中心",
        bgColor: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
        iconColor: "#fff",
        action: "help"
      }
    ]);
    const myActivityData = common_vendor.ref({
      title: "AI前沿研讨会",
      location: "北京中关村科技园",
      date: "8月10日-8月12日",
      checkText: "查看须知",
      joinText: "加入群聊",
      statusText: "点击签到"
    });
    const authState = common_vendor.ref({
      phoneAuthCode: "",
      encryptedData: "",
      iv: ""
    });
    common_vendor.onMounted(() => {
      initPage();
    });
    const initPage = async () => {
      try {
        await userInfo.checkLoginStatus();
        if (userInfo.signal) {
          await refreshUserData();
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/mymessage/mymessage.vue:313", "页面初始化失败:", error);
      }
    };
    const refreshUserData = async () => {
      try {
        await userInfo.getUserInfo();
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/mymessage/mymessage.vue:322", "获取用户信息失败:", error);
      }
    };
    const formatPhoneNumber = (phone) => {
      if (!phone)
        return "";
      return phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
    };
    const handlePhoneAuth = async (e) => {
      common_vendor.index.__f__("log", "at pages/mymessage/mymessage.vue:334", "手机号授权回调:", e);
      if (e.detail.errMsg !== "getPhoneNumber:ok") {
        common_vendor.index.showToast({
          title: "授权失败，请重试",
          icon: "error"
        });
        return;
      }
      try {
        isLogging.value = true;
        authState.value = {
          phoneAuthCode: e.detail.code,
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv
        };
        await performLogin();
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/mymessage/mymessage.vue:356", "登录失败:", error);
        common_vendor.index.showToast({
          title: "登录失败，请重试",
          icon: "error"
        });
      } finally {
        isLogging.value = false;
      }
    };
    const performLogin = async () => {
      try {
        const loginRes = await common_vendor.index.login({
          provider: "weixin"
        });
        if (loginRes[1].errMsg !== "login:ok") {
          throw new Error("获取登录凭证失败");
        }
        const loginCode = loginRes[1].code;
        const loginData = {
          code: loginCode,
          phoneCode: authState.value.phoneAuthCode,
          encryptedData: authState.value.encryptedData,
          iv: authState.value.iv
        };
        const loginResult = await callLoginAPI(loginData);
        await userInfo.saveLoginInfo(loginResult);
        await refreshUserData();
        common_vendor.index.showToast({
          title: "登录成功",
          icon: "success"
        });
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/mymessage/mymessage.vue:396", "登录过程出错:", error);
        throw error;
      }
    };
    const callLoginAPI = async (loginData) => {
      return new Promise((resolve, reject) => {
        common_vendor.index.request({
          url: "https://your-api-domain.com/api/login",
          method: "POST",
          data: loginData,
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
    const goToProfile = () => {
      common_vendor.index.navigateTo({
        url: "/pages/detail/profile"
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
    const showLoading = (text = "加载中...") => {
      var _a;
      loadingText.value.more = text;
      (_a = loadingPopup.value) == null ? void 0 : _a.open();
    };
    const hideLoading = () => {
      var _a;
      (_a = loadingPopup.value) == null ? void 0 : _a.close();
    };
    const onCheck = (data) => {
      common_vendor.index.__f__("log", "at pages/mymessage/mymessage.vue:482", "查看活动:", data);
      common_vendor.index.navigateTo({
        url: "/pages/activity/detail?id=" + data.id
      });
    };
    const onJoin = (data) => {
      common_vendor.index.__f__("log", "at pages/mymessage/mymessage.vue:489", "加入群聊:", data);
      common_vendor.index.showToast({
        title: "已加入群聊",
        icon: "success"
      });
    };
    const onStatus = async (data) => {
      common_vendor.index.__f__("log", "at pages/mymessage/mymessage.vue:497", "状态操作:", data);
      try {
        showLoading("正在签到...");
        await performCheckin(data);
        common_vendor.index.showToast({
          title: "签到成功",
          icon: "success"
        });
      } catch (error) {
        common_vendor.index.showToast({
          title: "签到失败",
          icon: "error"
        });
      } finally {
        hideLoading();
      }
    };
    const performCheckin = async (data) => {
      return new Promise((resolve) => {
        setTimeout(resolve, 1500);
      });
    };
    const viewAllActivities = () => {
      common_vendor.index.navigateTo({
        url: "/pages/detail/activityjoined"
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: statusBarHeight.value + "px",
        b: !common_vendor.unref(userInfo).signal
      }, !common_vendor.unref(userInfo).signal ? common_vendor.e({
        c: common_assets._imports_0$1,
        d: common_vendor.f(loginFeatures.value, (feature, index, i0) => {
          return {
            a: "a5a8e0a1-0-" + i0,
            b: common_vendor.p({
              type: feature.icon,
              size: "24",
              color: feature.color
            }),
            c: common_vendor.n(feature.iconClass),
            d: common_vendor.t(feature.title),
            e: common_vendor.t(feature.desc),
            f: index
          };
        }),
        e: !isLogging.value
      }, !isLogging.value ? {
        f: common_vendor.p({
          type: "phone-filled",
          size: "20",
          color: "#fff"
        })
      } : {}, {
        g: isLogging.value
      }, isLogging.value ? {
        h: common_vendor.p({
          status: "loading",
          color: "#fff",
          ["content-text"]: {
            contentnomore: ""
          }
        })
      } : {}, {
        i: common_vendor.t(isLogging.value ? "正在登录..." : "手机号快速登录"),
        j: common_vendor.o(handlePhoneAuth),
        k: isLogging.value,
        l: common_vendor.o(showUserAgreement),
        m: common_vendor.o(showPrivacyPolicy)
      }) : {
        n: common_vendor.unref(userInfo).info.Image || "/static/icon/empty.png",
        o: common_vendor.t(common_vendor.unref(userInfo).info.username || "用户"),
        p: common_vendor.t(formatPhoneNumber(common_vendor.unref(userInfo).info.phone)),
        q: common_vendor.t(common_vendor.unref(userInfo).info.slogan || "点击设置个人签名"),
        r: common_vendor.p({
          type: "right",
          size: "18",
          color: "rgba(255,255,255,0.8)"
        }),
        s: common_vendor.o(goToProfile),
        t: common_assets._imports_1$1,
        v: common_vendor.t(common_vendor.unref(userInfo).info.daysOnline || 0),
        w: common_vendor.t(common_vendor.unref(userInfo).info.newsViews || 0),
        x: common_vendor.p({
          type: "up",
          size: "12",
          color: "#2ed573"
        }),
        y: common_vendor.t(common_vendor.unref(userInfo).info.policyViews || 0),
        z: common_vendor.p({
          type: "up",
          size: "12",
          color: "#2ed573"
        }),
        A: common_vendor.t(common_vendor.unref(userInfo).info.field || 3),
        B: common_vendor.p({
          type: "minus",
          size: "12",
          color: "#ffa726"
        }),
        C: common_vendor.p({
          type: "right",
          size: "14",
          color: "#999"
        }),
        D: common_vendor.o(viewAllActivities),
        E: common_vendor.o(onCheck),
        F: common_vendor.o(onJoin),
        G: common_vendor.o(onStatus),
        H: common_vendor.p({
          activityData: myActivityData.value
        })
      }, {
        I: common_vendor.p({
          status: "loading",
          ["content-text"]: loadingText.value
        }),
        J: common_vendor.sr(loadingPopup, "a5a8e0a1-9", {
          "k": "loadingPopup"
        }),
        K: common_vendor.p({
          type: "center"
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-a5a8e0a1"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/mymessage/mymessage.js.map
