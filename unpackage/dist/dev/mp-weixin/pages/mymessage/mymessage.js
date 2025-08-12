"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const store_Info = require("../../store/Info.js");
const newApis_events = require("../../new-apis/events.js");
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
    const loginType = common_vendor.ref("account");
    const accountForm = common_vendor.reactive({
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
    const smsCountdown = common_vendor.ref(0);
    const isValidPhone = common_vendor.computed(() => {
      return /^1[3-9]\d{9}$/.test(smsForm.phone);
    });
    const myActivityData = common_vendor.ref(null);
    const hasActivities = common_vendor.computed(() => {
      return myActivityData.value && Object.keys(myActivityData.value).length > 0;
    });
    common_vendor.onMounted(() => {
      initPage();
    });
    common_vendor.onShow(async () => {
      console.log("已加载");
      initPage();
    });
    const initPage = async () => {
      try {
        if (userInfo.signal) {
          await refreshUserData();
        }
      } catch (error) {
        console.error("页面初始化失败:", error);
      }
    };
    const refreshUserData = async () => {
      try {
        await userInfo.getinfo();
        await userInfo.userapply();
        await loadUserActivities();
      } catch (error) {
        console.error("获取用户信息失败:", error);
      }
    };
    const loadUserActivities = async () => {
      var _a;
      try {
        myActivityData.value = ((_a = userInfo.applyactivity) == null ? void 0 : _a.length) > 0 ? userInfo.applyactivity[0] : null;
      } catch (error) {
        console.error("获取活动数据失败:", error);
        myActivityData.value = null;
      }
    };
    const formatPhoneNumber = (phone) => {
      if (!phone)
        return "";
      return phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
    };
    const switchLoginType = (type) => {
      loginType.value = type;
      accountForm.username = "";
      accountForm.password = "";
      accountForm.usernameError = "";
      accountForm.passwordError = "";
      smsForm.phone = "";
      smsForm.code = "";
      smsForm.phoneError = "";
      smsForm.codeError = "";
    };
    const validateUsername = () => {
      if (!accountForm.username.trim()) {
        accountForm.usernameError = "请输入账号或手机号";
        return false;
      }
      accountForm.usernameError = "";
      return true;
    };
    const validatePassword = () => {
      if (!accountForm.password.trim()) {
        accountForm.passwordError = "请输入密码";
        return false;
      }
      if (accountForm.password.length < 6) {
        accountForm.passwordError = "密码长度不能少于6位";
        return false;
      }
      accountForm.passwordError = "";
      return true;
    };
    const validatePhone = () => {
      if (!smsForm.phone.trim()) {
        smsForm.phoneError = "请输入手机号";
        return false;
      }
      if (!isValidPhone.value) {
        smsForm.phoneError = "请输入正确的手机号格式";
        return false;
      }
      smsForm.phoneError = "";
      return true;
    };
    const validateSmsCode = () => {
      if (!smsForm.code.trim()) {
        smsForm.codeError = "请输入验证码";
        return false;
      }
      if (smsForm.code.length !== 6) {
        smsForm.codeError = "验证码为6位数字";
        return false;
      }
      smsForm.codeError = "";
      return true;
    };
    const clearUsernameError = () => {
      if (accountForm.usernameError) {
        accountForm.usernameError = "";
      }
    };
    const clearPasswordError = () => {
      if (accountForm.passwordError) {
        accountForm.passwordError = "";
      }
    };
    const clearPhoneError = () => {
      if (smsForm.phoneError) {
        smsForm.phoneError = "";
      }
    };
    const clearCodeError = () => {
      if (smsForm.codeError) {
        smsForm.codeError = "";
      }
    };
    const handleAccountLogin = async () => {
      const isUsernameValid = validateUsername();
      const isPasswordValid = validatePassword();
      if (!isUsernameValid || !isPasswordValid) {
        return;
      }
      try {
        isLogging.value = true;
        const loginResult = await callAccountLoginAPI({
          username: accountForm.username,
          password: accountForm.password
        });
        await userInfo.saveLoginInfo(loginResult);
        await refreshUserData();
        common_vendor.index.showToast({
          title: "登录成功",
          icon: "success"
        });
      } catch (error) {
        console.error("账号登录失败:", error);
        common_vendor.index.showToast({
          title: error.message || "登录失败，请重试",
          icon: "error"
        });
      } finally {
        isLogging.value = false;
      }
    };
    const sendSmsCode = async () => {
      if (!validatePhone()) {
        return;
      }
      try {
        smsCountdown.value = 60;
        const timer = setInterval(() => {
          smsCountdown.value--;
          if (smsCountdown.value <= 0) {
            clearInterval(timer);
          }
        }, 1e3);
        common_vendor.index.showToast({
          title: "验证码已发送",
          icon: "success"
        });
      } catch (error) {
        console.error("发送验证码失败:", error);
        common_vendor.index.showToast({
          title: error.message || "发送失败，请重试",
          icon: "error"
        });
      }
    };
    const handleSmsLogin = async () => {
      const isPhoneValid = validatePhone();
      const isCodeValid = validateSmsCode();
      if (!isPhoneValid || !isCodeValid) {
        return;
      }
      try {
        isLogging.value = true;
        const loginResult = await callSmsLoginAPI({
          phone: smsForm.phone,
          code: smsForm.code
        });
        await userInfo.saveLoginInfo(loginResult);
        await refreshUserData();
        common_vendor.index.showToast({
          title: "登录成功",
          icon: "success"
        });
      } catch (error) {
        console.error("短信登录失败:", error);
        common_vendor.index.showToast({
          title: error.message || "登录失败，请重试",
          icon: "error"
        });
      } finally {
        isLogging.value = false;
      }
    };
    const wechatlogin = async () => {
      try {
        await userInfo.loginWithWeChat();
        initPage();
      } catch (e) {
        console.log(e);
      }
    };
    const handleForgotPassword = () => {
      common_vendor.index.navigateTo({
        url: "/pages/auth/forgot-password"
      });
    };
    const callAccountLoginAPI = async (data) => {
      return new Promise((resolve, reject) => {
        common_vendor.index.request({
          url: "https://your-api-domain.com/api/account-login",
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
    const callSmsLoginAPI = async (data) => {
      return new Promise((resolve, reject) => {
        common_vendor.index.request({
          url: "https://your-api-domain.com/api/sms-login",
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
    const discoverActivities = () => {
      common_vendor.index.switchTab({
        url: "../news/news"
      });
    };
    const refreshActivities = async () => {
      try {
        initPage();
        common_vendor.index.showToast({
          title: "刷新完成",
          icon: "success"
        });
      } catch (error) {
        console.error("刷新活动失败:", error);
        common_vendor.index.showToast({
          title: "刷新失败",
          icon: "error"
        });
      } finally {
        hideLoading();
      }
    };
    const hideLoading = () => {
      var _a;
      (_a = loadingPopup.value) == null ? void 0 : _a.close();
    };
    const onAction = (data) => {
      console.log("活动操作:", data);
    };
    const onCancel = async (data) => {
      common_vendor.index.showModal({
        title: "确认取消",
        content: `确定要取消报名"${data.title}"吗？`,
        success: (res) => {
          if (res.confirm) {
            cancelSignUp(data);
          }
        }
      });
    };
    const cancelSignUp = async (activityData) => {
      try {
        await newApis_events.cancelapply(activityData.id);
        initPage();
        common_vendor.index.showToast({
          title: "取消报名成功",
          icon: "success"
        });
      } catch (error) {
        console.error("取消报名失败:", error);
        common_vendor.index.showToast({
          title: "取消失败",
          icon: "error"
        });
      }
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
        d: loginType.value === "account" ? 1 : "",
        e: common_vendor.o(($event) => switchLoginType("account")),
        f: loginType.value === "sms" ? 1 : "",
        g: common_vendor.o(($event) => switchLoginType("sms")),
        h: loginType.value === "wechat" ? 1 : "",
        i: common_vendor.o(($event) => switchLoginType("wechat")),
        j: loginType.value === "account"
      }, loginType.value === "account" ? common_vendor.e({
        k: common_vendor.p({
          type: "person",
          size: "20",
          color: "#999"
        }),
        l: isLogging.value,
        m: common_vendor.o(validateUsername),
        n: common_vendor.o([($event) => accountForm.username = $event.detail.value, clearUsernameError]),
        o: accountForm.username,
        p: accountForm.usernameError ? 1 : "",
        q: accountForm.usernameError
      }, accountForm.usernameError ? {
        r: common_vendor.t(accountForm.usernameError)
      } : {}, {
        s: common_vendor.p({
          type: "locked",
          size: "20",
          color: "#999"
        }),
        t: isLogging.value,
        v: common_vendor.o(validatePassword),
        w: common_vendor.o([($event) => accountForm.password = $event.detail.value, clearPasswordError]),
        x: accountForm.password,
        y: common_vendor.o(handleForgotPassword),
        z: accountForm.passwordError ? 1 : "",
        A: accountForm.passwordError
      }, accountForm.passwordError ? {
        B: common_vendor.t(accountForm.passwordError)
      } : {}, {
        C: isLogging.value
      }, isLogging.value ? {
        D: common_vendor.p({
          status: "loading",
          color: "#fff",
          ["content-text"]: {
            contentnomore: ""
          }
        })
      } : {}, {
        E: common_vendor.o(handleAccountLogin),
        F: isLogging.value
      }) : {}, {
        G: loginType.value === "sms"
      }, loginType.value === "sms" ? common_vendor.e({
        H: common_vendor.p({
          type: "phone",
          size: "20",
          color: "#999"
        }),
        I: isLogging.value,
        J: common_vendor.o(validatePhone),
        K: common_vendor.o([($event) => smsForm.phone = $event.detail.value, clearPhoneError]),
        L: smsForm.phone,
        M: smsForm.phoneError ? 1 : "",
        N: smsForm.phoneError
      }, smsForm.phoneError ? {
        O: common_vendor.t(smsForm.phoneError)
      } : {}, {
        P: common_vendor.p({
          type: "chatboxes",
          size: "20",
          color: "#999"
        }),
        Q: isLogging.value,
        R: common_vendor.o(validateSmsCode),
        S: common_vendor.o([($event) => smsForm.code = $event.detail.value, clearCodeError]),
        T: smsForm.code,
        U: common_vendor.t(smsCountdown.value > 0 ? `${smsCountdown.value}s` : "获取验证码"),
        V: common_vendor.o(sendSmsCode),
        W: !isValidPhone.value || smsCountdown.value > 0,
        X: smsForm.codeError ? 1 : "",
        Y: smsForm.codeError
      }, smsForm.codeError ? {
        Z: common_vendor.t(smsForm.codeError)
      } : {}, {
        aa: isLogging.value
      }, isLogging.value ? {
        ab: common_vendor.p({
          status: "loading",
          color: "#fff",
          ["content-text"]: {
            contentnomore: ""
          }
        })
      } : {}, {
        ac: common_vendor.o(handleSmsLogin),
        ad: isLogging.value
      }) : {}, {
        ae: loginType.value === "wechat"
      }, loginType.value === "wechat" ? common_vendor.e({
        af: common_vendor.p({
          type: "weixin",
          size: "60",
          color: "#1aad19"
        }),
        ag: isLogging.value
      }, isLogging.value ? {
        ah: common_vendor.p({
          status: "loading",
          color: "#fff",
          ["content-text"]: {
            contentnomore: ""
          }
        })
      } : {
        ai: common_vendor.p({
          type: "weixin",
          size: "20",
          color: "#fff"
        })
      }, {
        aj: common_vendor.o((...args) => _ctx.handlePhoneAuth && _ctx.handlePhoneAuth(...args)),
        ak: isLogging.value,
        al: common_vendor.o(wechatlogin)
      }) : {}, {
        am: common_vendor.o(showUserAgreement),
        an: common_vendor.o(showPrivacyPolicy)
      }) : common_vendor.e({
        ao: common_vendor.unref(userInfo).info.avatar_url || "/static/icon/empty.png",
        ap: common_vendor.t(common_vendor.unref(userInfo).info.nickname || "用户"),
        aq: common_vendor.t(formatPhoneNumber(common_vendor.unref(userInfo).info.phone)),
        ar: common_vendor.p({
          type: "right",
          size: "18",
          color: "rgba(255,255,255,0.8)"
        }),
        as: common_vendor.o(goToProfile),
        at: common_assets._imports_1$1,
        av: common_vendor.t(common_vendor.unref(userInfo).info.newsViews || 0),
        aw: common_vendor.t(common_vendor.unref(userInfo).info.policyViews || 0),
        ax: common_vendor.t(common_vendor.unref(userInfo).info.field || 3),
        ay: hasActivities.value
      }, hasActivities.value ? {
        az: common_vendor.p({
          type: "right",
          size: "14",
          color: "#999"
        }),
        aA: common_vendor.o(viewAllActivities)
      } : {}, {
        aB: hasActivities.value
      }, hasActivities.value ? {
        aC: common_vendor.o(onAction),
        aD: common_vendor.o(onCancel),
        aE: common_vendor.p({
          activityData: myActivityData.value
        })
      } : {
        aF: common_vendor.p({
          type: "search",
          size: "16",
          color: "#fff"
        }),
        aG: common_vendor.o(discoverActivities),
        aH: common_vendor.p({
          type: "refresh",
          size: "16",
          color: "#667eea"
        }),
        aI: common_vendor.o(refreshActivities)
      }), {
        aJ: common_vendor.p({
          status: "loading",
          ["content-text"]: loadingText.value
        }),
        aK: common_vendor.sr(loadingPopup, "a5a8e0a1-14", {
          "k": "loadingPopup"
        }),
        aL: common_vendor.p({
          type: "center"
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-a5a8e0a1"]]);
wx.createPage(MiniProgramPage);
