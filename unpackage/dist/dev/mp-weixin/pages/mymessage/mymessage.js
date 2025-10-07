"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const store_Info = require("../../store/Info.js");
const newApis_events = require("../../new-apis/events.js");
require("../../store/Event.js");
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
  (_easycom_uni_icons + ActivityTicket + _easycom_uni_load_more + _easycom_uni_popup)();
}
const ActivityTicket = () => "../../components/ActivityTicket/ActivityTicket.js";
const _sfc_main = {
  __name: "mymessage",
  setup(__props) {
    const userInfo = store_Info.useInfoStore();
    const SYSTEMINFO = common_vendor.index.getSystemInfoSync();
    const statusBarHeight = common_vendor.ref(SYSTEMINFO.statusBarHeight);
    const loadingPopup = common_vendor.ref(null);
    const loadingText = common_vendor.ref({ more: "加载中..." });
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
    const goToLogin = () => {
      common_vendor.index.navigateTo({
        url: "/pages/detail/Login"
      });
    };
    const goToProfile = () => {
      common_vendor.index.navigateTo({
        url: "/pages/detail/profile"
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
        console.error("取消报名失败:", error.data);
        common_vendor.index.showToast({
          title: error.data.message,
          icon: "none"
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
      }, !common_vendor.unref(userInfo).signal ? {
        c: common_assets._imports_0$1,
        d: common_vendor.p({
          type: "person",
          size: "20",
          color: "#fff"
        }),
        e: common_vendor.o(goToLogin),
        f: common_vendor.p({
          type: "calendar",
          size: "24",
          color: "#667eea"
        }),
        g: common_vendor.p({
          type: "person",
          size: "24",
          color: "#667eea"
        }),
        h: common_vendor.p({
          type: "chat",
          size: "24",
          color: "#667eea"
        })
      } : common_vendor.e({
        i: common_vendor.unref(userInfo).info.avatar_url || "/static/icon/empty.png",
        j: common_vendor.t(common_vendor.unref(userInfo).info.nickname || "用户"),
        k: common_vendor.t(formatPhoneNumber(common_vendor.unref(userInfo).info.phone)),
        l: common_vendor.p({
          type: "right",
          size: "18",
          color: "rgba(255,255,255,0.8)"
        }),
        m: common_vendor.o(goToProfile),
        n: common_assets._imports_1$1,
        o: common_vendor.t(common_vendor.unref(userInfo).eventcount.Eventbefore || 0),
        p: common_vendor.t(common_vendor.unref(userInfo).eventcount.Eventing || 0),
        q: common_vendor.t(common_vendor.unref(userInfo).eventcount.Evented || 0),
        r: common_vendor.p({
          type: "right",
          size: "14",
          color: "#999"
        }),
        s: common_vendor.o(viewAllActivities),
        t: hasActivities.value
      }, hasActivities.value ? {
        v: common_vendor.o(onAction),
        w: common_vendor.o(onCancel),
        x: common_vendor.p({
          activityData: myActivityData.value
        })
      } : {
        y: common_vendor.p({
          type: "search",
          size: "16",
          color: "#fff"
        }),
        z: common_vendor.o(discoverActivities),
        A: common_vendor.p({
          type: "refresh",
          size: "16",
          color: "#667eea"
        }),
        B: common_vendor.o(refreshActivities)
      }), {
        C: common_vendor.p({
          status: "loading",
          ["content-text"]: loadingText.value
        }),
        D: common_vendor.sr(loadingPopup, "a5a8e0a1-9", {
          "k": "loadingPopup"
        }),
        E: common_vendor.p({
          type: "center"
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-a5a8e0a1"]]);
wx.createPage(MiniProgramPage);
