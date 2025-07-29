"use strict";
const common_vendor = require("../../common/vendor.js");
const store_ArticleDetail = require("../../store/ArticleDetail.js");
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  const _easycom_uni_title2 = common_vendor.resolveComponent("uni-title");
  const _easycom_uni_section2 = common_vendor.resolveComponent("uni-section");
  (_easycom_uni_nav_bar2 + _easycom_uni_title2 + _easycom_uni_section2)();
}
const _easycom_uni_nav_bar = () => "../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
const _easycom_uni_title = () => "../../uni_modules/uni-title/components/uni-title/uni-title.js";
const _easycom_uni_section = () => "../../uni_modules/uni-section/components/uni-section/uni-section.js";
if (!Math) {
  (_easycom_uni_nav_bar + _easycom_uni_title + _easycom_uni_section + mpHtml)();
}
const mpHtml = () => "../../uni_modules/mp-html/components/mp-html/mp-html.js";
const style = "padding:20rpx;background:#fff;border-radius:12rpx;box-shadow:0 0 20rpx rgba(0,0,0,0.05);";
const _sfc_main = {
  __name: "articledetail",
  setup(__props) {
    let id = common_vendor.ref();
    const content = common_vendor.ref("");
    const articledetail = store_ArticleDetail.useArticleDeatilStore();
    common_vendor.onLoad(async (option) => {
      id = decodeURIComponent(option.id);
      common_vendor.index.__f__("log", "at pages/detail/articledetail.vue:49", "接收到的ID：", id);
      await articledetail.getarticledetail(id);
      content.value = articledetail.detail.article_content;
      common_vendor.index.__f__("log", "at pages/detail/articledetail.vue:53", content.value);
    });
    function onBack() {
      common_vendor.index.navigateBack();
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.t(common_vendor.unref(articledetail).detail.article_type),
        b: common_vendor.o(onBack),
        c: common_vendor.p({
          statusBar: "true",
          backgroundColor: "#ff4757",
          fixed: "true",
          border: false,
          leftIcon: "left"
        }),
        d: common_vendor.p({
          type: "h1",
          title: common_vendor.unref(articledetail).detail.article_title
        }),
        e: common_vendor.p({
          title: "文章详情",
          type: "line",
          titleFontSize: "16px"
        }),
        f: common_vendor.p({
          content: content.value,
          ["container-style"]: style
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-5a514493"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/detail/articledetail.js.map
