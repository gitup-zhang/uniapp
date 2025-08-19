"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const store_Info = require("./store/Info.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/policy/policy.js";
  "./pages/news/news.js";
  "./pages/mymessage/mymessage.js";
  "./pages/mes/mes.js";
  "./pages/detail/articledetail.js";
  "./pages/detail/activitydetail.js";
  "./pages/detail/applydetail.js";
  "./components/ArticleCard/ArticlePolicy.js";
  "./pages/detail/activitymore.js";
  "./pages/detail/activityhistorymore.js";
  "./pages/detail/profile.js";
  "./pages/detail/activityjoined.js";
  "./pages/detail/noticedetail.js";
  "./pages/detail/ChatGroup.js";
  "./pages/detail/ChatSystem.js";
  "./pages/detail/SystemMesDetail.js";
  "./pages/detail/GroupMesDetail.js";
}
const _sfc_main = {
  __name: "App",
  setup(__props) {
    common_vendor.onLaunch(async () => {
      const infoStore = store_Info.useInfoStore();
      const localToken = common_vendor.index.getStorageSync("token");
      if (localToken) {
        infoStore.token = localToken;
        infoStore.signal = true;
        try {
          await infoStore.getinfo();
          console.log("登录状态恢复成功");
        } catch (e) {
          console.log(e);
          console.log("用户信息拉取失败，清除登录状态");
          infoStore.deleteinfo();
        }
      } else {
        console.log("本地无登录状态");
      }
    });
    return () => {
    };
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  app.use(common_vendor.createPinia());
  return {
    app,
    Pinia: common_vendor.Pinia
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
