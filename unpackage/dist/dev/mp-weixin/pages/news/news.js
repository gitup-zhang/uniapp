"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  const _easycom_uni_search_bar2 = common_vendor.resolveComponent("uni-search-bar");
  const _easycom_uni_card2 = common_vendor.resolveComponent("uni-card");
  (_easycom_uni_nav_bar2 + _easycom_uni_search_bar2 + _easycom_uni_card2)();
}
const _easycom_uni_nav_bar = () => "../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
const _easycom_uni_search_bar = () => "../../uni_modules/uni-search-bar/components/uni-search-bar/uni-search-bar.js";
const _easycom_uni_card = () => "../../uni_modules/uni-card/components/uni-card/uni-card.js";
if (!Math) {
  (_easycom_uni_nav_bar + _easycom_uni_search_bar + _easycom_uni_card)();
}
const _sfc_main = {
  __name: "news",
  setup(__props) {
    const searchbar = common_vendor.ref("");
    const currentDropdown = common_vendor.ref(null);
    const selectedDomain = common_vendor.ref("新闻领域");
    const selectedTime = common_vendor.ref("发布时间");
    const domainList = ["全部", "教育", "科技", "医疗"];
    const timeList = ["全部", "最近一周", "最近一月", "最近一年"];
    function search() {
      common_vendor.index.__f__("log", "at pages/news/news.vue:90", "搜索关键词:", searchbar.value);
    }
    function cancel() {
      searchbar.value = "";
    }
    function toggleDropdown(type) {
      currentDropdown.value = currentDropdown.value === type ? null : type;
    }
    function selectOption(type, value) {
      if (type === "domain") {
        selectedDomain.value = value;
      } else if (type === "time") {
        selectedTime.value = value;
      }
      currentDropdown.value = null;
    }
    function onClick() {
      common_vendor.index.navigateTo({
        url: "/pages/detail/detailnew"
      });
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          statusBar: "true",
          backgroundColor: "#903749",
          fixed: "true"
        }),
        b: common_vendor.o(search),
        c: common_vendor.o(cancel),
        d: common_vendor.o(($event) => searchbar.value = $event),
        e: common_vendor.p({
          placeholder: "搜索行业新闻",
          modelValue: searchbar.value
        }),
        f: common_vendor.t(selectedDomain.value),
        g: currentDropdown.value === "domain" ? 1 : "",
        h: common_vendor.o(($event) => toggleDropdown("domain")),
        i: common_vendor.t(selectedTime.value),
        j: currentDropdown.value === "time" ? 1 : "",
        k: common_vendor.o(($event) => toggleDropdown("time")),
        l: currentDropdown.value === "domain"
      }, currentDropdown.value === "domain" ? {
        m: common_vendor.f(domainList, (item, k0, i0) => {
          return {
            a: common_vendor.t(item),
            b: item,
            c: common_vendor.o(($event) => selectOption("domain", item), item),
            d: selectedDomain.value === item ? 1 : ""
          };
        })
      } : {}, {
        n: currentDropdown.value === "time"
      }, currentDropdown.value === "time" ? {
        o: common_vendor.f(timeList, (item, k0, i0) => {
          return {
            a: common_vendor.t(item),
            b: item,
            c: common_vendor.o(($event) => selectOption("time", item), item),
            d: selectedTime.value === item ? 1 : ""
          };
        })
      } : {}, {
        p: common_vendor.f(10, (item, k0, i0) => {
          return {
            a: "24bc9d41-2-" + i0
          };
        }),
        q: common_vendor.o(onClick),
        r: common_vendor.p({
          title: "基础卡片",
          ["sub-title"]: "副标题",
          extra: "额外信息",
          thumbnail: "/static/3044eb7c01d942fc96e5d5bd8282ee19.jpg"
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-24bc9d41"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/news/news.js.map
