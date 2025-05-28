"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_DetailNavbar2 = common_vendor.resolveComponent("DetailNavbar");
  const _easycom_uni_search_bar2 = common_vendor.resolveComponent("uni-search-bar");
  const _easycom_uni_segmented_control2 = common_vendor.resolveComponent("uni-segmented-control");
  const _easycom_uni_data_select2 = common_vendor.resolveComponent("uni-data-select");
  (_easycom_DetailNavbar2 + _easycom_uni_search_bar2 + _easycom_uni_segmented_control2 + _easycom_uni_data_select2)();
}
const _easycom_DetailNavbar = () => "../../components/DetailNavbar/DetailNavbar.js";
const _easycom_uni_search_bar = () => "../../uni_modules/uni-search-bar/components/uni-search-bar/uni-search-bar.js";
const _easycom_uni_segmented_control = () => "../../uni_modules/uni-segmented-control/components/uni-segmented-control/uni-segmented-control.js";
const _easycom_uni_data_select = () => "../../uni_modules/uni-data-select/components/uni-data-select/uni-data-select.js";
if (!Math) {
  (_easycom_DetailNavbar + _easycom_uni_search_bar + _easycom_uni_segmented_control + _easycom_uni_data_select)();
}
const _sfc_main = {
  __name: "news",
  setup(__props) {
    const searchbar = common_vendor.ref("");
    const current = common_vendor.ref(0);
    const classify = [
      { key: "all", value: "全部" },
      { key: "k1", value: "分类1" },
      { key: "k2", value: "分类2" }
    ];
    const value = common_vendor.computed(() => classify.map((item) => item.value));
    function search() {
      common_vendor.index.__f__("log", "at pages/news/news.vue:52", searchbar.value);
    }
    function cancel() {
      searchbar.value = "";
    }
    const brandOptions = [
      { value: 0, text: "苹果" },
      { value: 1, text: "华为" },
      { value: 2, text: "小米" }
    ];
    const typeOptions = [
      { value: 0, text: "保护壳" },
      { value: 1, text: "贴膜" },
      { value: 2, text: "充电器" }
    ];
    const selectedBrand = common_vendor.ref(null);
    const selectedType = common_vendor.ref(null);
    common_vendor.ref(null);
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          title: "新闻"
        }),
        b: common_vendor.o(search),
        c: common_vendor.o(cancel),
        d: common_vendor.o(($event) => searchbar.value = $event),
        e: common_vendor.p({
          placeholder: "搜索行业新闻",
          modelValue: searchbar.value
        }),
        f: common_vendor.o(_ctx.onClickItem),
        g: common_vendor.p({
          current: current.value,
          values: value.value,
          styleType: "text",
          activeColor: "#ff0000"
        }),
        h: common_vendor.o(($event) => selectedBrand.value = $event),
        i: common_vendor.p({
          localdata: brandOptions,
          placeholder: "品牌",
          modelValue: selectedBrand.value
        }),
        j: common_vendor.o(($event) => selectedType.value = $event),
        k: common_vendor.p({
          localdata: typeOptions,
          placeholder: "类型",
          modelValue: selectedType.value
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-24bc9d41"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/news/news.js.map
