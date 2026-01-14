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
  "./pages/detail/Login.js";
}
const _sfc_main = {
  __name: "App",
  setup(__props) {
    common_vendor.onLaunch(async () => {
      const infoStore = store_Info.useInfoStore();
      const hasToken = infoStore.loadTokensFromStorage();
      if (hasToken) {
        console.log("Token已恢复，尝试获取用户信息...");
        try {
          await infoStore.getinfo();
          console.log("登录状态恢复成功");
        } catch (e) {
          console.error("用户信息拉取失败:", e);
          if (e.message !== "登录已过期" && e.message !== "Token刷新失败") {
            console.log("清除登录状态");
            infoStore.deleteinfo();
          }
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
