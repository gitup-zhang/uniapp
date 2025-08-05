"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
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
}
const _sfc_main = {
  onLaunch: function() {
    console.log("App Launch");
  },
  onShow: function() {
    console.log("App Show");
  },
  onHide: function() {
    console.log("App Hide");
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
