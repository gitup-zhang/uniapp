"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const store_Info = require("../../store/Info.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  (_easycom_uni_icons + uniPopup)();
}
const uniPopup = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-popup/uni-popup.js";
const _sfc_main = {
  __name: "mymessage",
  setup(__props) {
    const userInfo = store_Info.useInfoStore();
    const SYSTEMINFO = common_vendor.index.getSystemInfoSync();
    const popupRef = common_vendor.ref(null);
    const statusBarHeight = common_vendor.ref(SYSTEMINFO.statusBarHeight);
    const tabBarHeight = common_vendor.ref(50);
    const popupStyle = common_vendor.computed(() => ({
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
    common_vendor.onMounted(() => {
    });
    function admin() {
      if (userInfo.signal) {
        common_vendor.index.__f__("log", "at pages/mymessage/mymessage.vue:111", "已登录");
      } else {
        userInfo.getinfo();
      }
    }
    function openset() {
      popupRef.value.open();
    }
    function closePopup() {
      popupRef.value.close();
    }
    function logout() {
      common_vendor.index.showModal({
        title: "确认退出",
        content: "您确定要退出当前账号吗？",
        confirmColor: "#ff4d4f",
        success: (res) => {
          if (res.confirm) {
            userInfo.deleteinfo();
            closePopup();
            common_vendor.index.showToast({
              title: "已退出登录",
              icon: "none"
            });
          }
        }
      });
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
        g: common_vendor.o(admin),
        h: common_vendor.t(common_vendor.unref(userInfo).info.slogan || "请登录后设置个人签名"),
        i: common_assets._imports_0$1,
        j: common_vendor.t(common_vendor.unref(userInfo).info.daysOnline),
        k: common_vendor.t(common_vendor.unref(userInfo).info.newsViews),
        l: common_vendor.t(common_vendor.unref(userInfo).info.policyViews),
        m: common_vendor.t(common_vendor.unref(userInfo).info.field),
        n: common_vendor.p({
          type: "logout",
          size: "24",
          color: "#ff4d4f"
        }),
        o: common_vendor.o(logout),
        p: common_vendor.o(closePopup),
        q: common_vendor.sr(popupRef, "2e735db0-1", {
          "k": "popupRef"
        }),
        r: common_vendor.p({
          type: "bottom",
          ["custom-style"]: popupStyle.value
        })
      });
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/mymessage/mymessage.js.map
