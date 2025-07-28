"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const store_Info = require("../../store/Info.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_ActivityTicket2 = common_vendor.resolveComponent("ActivityTicket");
  (_easycom_uni_icons2 + _easycom_ActivityTicket2)();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_ActivityTicket = () => "../../components/ActivityTicket/ActivityTicket.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_ActivityTicket)();
}
const _sfc_main = {
  __name: "mymessage",
  setup(__props) {
    const myActivityData = common_vendor.ref({
      title: "AI前沿研讨会",
      location: "北京中关村科技园",
      date: "8月10日-8月12日",
      checkText: "查看须知",
      joinText: "加入群聊",
      statusText: "点击签到"
    });
    const onCheck = (data) => {
      common_vendor.index.__f__("log", "at pages/mymessage/mymessage.vue:80", "check", data);
    };
    const onJoin = (data) => {
      common_vendor.index.__f__("log", "at pages/mymessage/mymessage.vue:81", "join", data);
    };
    const onStatus = (data) => {
      common_vendor.index.__f__("log", "at pages/mymessage/mymessage.vue:82", "status", data);
    };
    const userInfo = store_Info.useInfoStore();
    const SYSTEMINFO = common_vendor.index.getSystemInfoSync();
    const popupRef = common_vendor.ref(null);
    const statusBarHeight = common_vendor.ref(SYSTEMINFO.statusBarHeight);
    const tabBarHeight = common_vendor.ref(50);
    common_vendor.computed(() => ({
      "border-radius": "20rpx 20rpx 0 0",
      "bottom": `${tabBarHeight.value}px`,
      // 关键：设置底部偏移量
      "z-index": 9999,
      // 确保弹窗在最上层
      "max-width": "750rpx",
      // 限制最大宽度
      "margin": "0 auto",
      "background-color": "transparent"
      // 外层透明，让圆角显示
    }));
    common_vendor.ref(null);
    common_vendor.onMounted(() => {
    });
    const getPhoneNumber = async (e) => {
      userInfo.loginWithWeChat();
      if (e.detail.errMsg !== "getPhoneNumber:ok") {
        common_vendor.index.__f__("log", "at pages/mymessage/mymessage.vue:120", e);
        common_vendor.index.showToast({ title: "用户拒绝授权", icon: "none" });
        return;
      }
    };
    function openset() {
      popupRef.value.open();
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: statusBarHeight.value + "px",
        b: common_vendor.unref(userInfo).signal
      }, common_vendor.unref(userInfo).signal ? {
        c: common_vendor.p({
          type: "gear-filled",
          size: "22",
          color: "#fff"
        })
      } : {}, {
        d: common_vendor.o(openset),
        e: common_vendor.unref(userInfo).info.Image ? common_vendor.unref(userInfo).info.Image : "/static/icon/empty.png",
        f: common_vendor.t(common_vendor.unref(userInfo).info.username || "点击登录"),
        g: common_vendor.o(getPhoneNumber),
        h: common_vendor.t(common_vendor.unref(userInfo).info.slogan || "请登录后设置个人签名"),
        i: common_assets._imports_0$1,
        j: common_vendor.t(common_vendor.unref(userInfo).info.daysOnline),
        k: common_vendor.t(common_vendor.unref(userInfo).info.newsViews),
        l: common_vendor.t(common_vendor.unref(userInfo).info.policyViews),
        m: common_vendor.t(common_vendor.unref(userInfo).info.field),
        n: common_vendor.o(onCheck),
        o: common_vendor.o(onJoin),
        p: common_vendor.o(onStatus),
        q: common_vendor.p({
          activityData: myActivityData.value
        })
      });
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/mymessage/mymessage.js.map
