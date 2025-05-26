"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_DetailNavbar2 = common_vendor.resolveComponent("DetailNavbar");
  const _easycom_uni_search_bar2 = common_vendor.resolveComponent("uni-search-bar");
  const _easycom_uni_segmented_control2 = common_vendor.resolveComponent("uni-segmented-control");
  (_easycom_DetailNavbar2 + _easycom_uni_search_bar2 + _easycom_uni_segmented_control2)();
}
const _easycom_DetailNavbar = () => "../../components/DetailNavbar/DetailNavbar.js";
const _easycom_uni_search_bar = () => "../../uni_modules/uni-search-bar/components/uni-search-bar/uni-search-bar.js";
const _easycom_uni_segmented_control = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-segmented-control/uni-segmented-control.js";
if (!Math) {
  (_easycom_DetailNavbar + _easycom_uni_search_bar + _easycom_uni_segmented_control)();
}
const _sfc_main = {
  __name: "news",
  setup(__props) {
    let searchbar = common_vendor.ref("");
    let current = common_vendor.ref(0);
    let classify = [{ key: "all", value: "全部" }, { key: "k1", value: "分类1" }, { key: "k2", value: "分类2" }];
    const value = common_vendor.computed(() => classify.map((item) => item.value));
    function search() {
      common_vendor.index.__f__("log", "at pages/news/news.vue:23", searchbar.value);
    }
    function cancel() {
      searchbar.value = "";
    }
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          title: "新闻"
        }),
        b: common_vendor.o(search),
        c: common_vendor.o(cancel),
        d: common_vendor.o(($event) => common_vendor.isRef(searchbar) ? searchbar.value = $event : searchbar = $event),
        e: common_vendor.p({
          placeholder: "搜索行业新闻",
          modelValue: common_vendor.unref(searchbar)
        }),
        f: common_vendor.o(_ctx.onClickItem),
        g: common_vendor.p({
          current: common_vendor.unref(current),
          values: value.value,
          styleType: "text",
          activeColor: "#ff0000"
        })
      };
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/news/news.js.map
