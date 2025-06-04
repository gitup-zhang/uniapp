"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  const _easycom_uni_search_bar2 = common_vendor.resolveComponent("uni-search-bar");
  const _easycom_uni_segmented_control2 = common_vendor.resolveComponent("uni-segmented-control");
  const _easycom_uni_card2 = common_vendor.resolveComponent("uni-card");
  (_easycom_uni_nav_bar2 + _easycom_uni_search_bar2 + _easycom_uni_segmented_control2 + _easycom_uni_card2)();
}
const _easycom_uni_nav_bar = () => "../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
const _easycom_uni_search_bar = () => "../../uni_modules/uni-search-bar/components/uni-search-bar/uni-search-bar.js";
const _easycom_uni_segmented_control = () => "../../uni_modules/uni-segmented-control/components/uni-segmented-control/uni-segmented-control.js";
const _easycom_uni_card = () => "../../uni_modules/uni-card/components/uni-card/uni-card.js";
if (!Math) {
  (_easycom_uni_nav_bar + _easycom_uni_search_bar + _easycom_uni_segmented_control + _easycom_uni_card)();
}
const _sfc_main = {
  __name: "policy",
  setup(__props) {
    const searchbar = common_vendor.ref("");
    function search() {
      common_vendor.index.__f__("log", "at pages/policy/policy.vue:84", "搜索关键词:", searchbar.value);
    }
    function cancel() {
      searchbar.value = "";
    }
    const current = common_vendor.ref(0);
    const classify = [
      { key: "all", value: "全部" },
      { key: "k1", value: "分类1" },
      { key: "k2", value: "分类2" }
    ];
    const value = common_vendor.computed(() => classify.map((item) => item.value));
    function onClickItem(e) {
      current.value = e.currentIndex;
    }
    const currentDropdown = common_vendor.ref(null);
    const selectedDomain = common_vendor.ref("政策领域");
    const selectedTime = common_vendor.ref("发布时间");
    const domainList = ["全部", "教育", "科技", "医疗"];
    const timeList = ["全部", "最近一周", "最近一月", "最近一年"];
    function toggleDropdown(type) {
      currentDropdown.value = currentDropdown.value === type ? null : type;
    }
    function selectOption(type, value2) {
      if (type === "domain") {
        selectedDomain.value = value2;
      } else if (type === "time") {
        selectedTime.value = value2;
      }
      currentDropdown.value = null;
    }
    function OnClick() {
      common_vendor.index.navigateTo({
        url: "/pages/detail/detailpolicy"
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
          placeholder: "搜索行业政策",
          modelValue: searchbar.value
        }),
        f: common_vendor.o(onClickItem),
        g: common_vendor.p({
          current: current.value,
          values: value.value,
          styleType: "text",
          activeColor: "#ff0000"
        }),
        h: common_vendor.t(selectedDomain.value),
        i: currentDropdown.value === "domain" ? 1 : "",
        j: common_vendor.o(($event) => toggleDropdown("domain")),
        k: common_vendor.t(selectedTime.value),
        l: currentDropdown.value === "time" ? 1 : "",
        m: common_vendor.o(($event) => toggleDropdown("time")),
        n: currentDropdown.value === "domain"
      }, currentDropdown.value === "domain" ? {
        o: common_vendor.f(domainList, (item, k0, i0) => {
          return {
            a: common_vendor.t(item),
            b: item,
            c: common_vendor.o(($event) => selectOption("domain", item), item),
            d: selectedDomain.value === item ? 1 : ""
          };
        })
      } : {}, {
        p: currentDropdown.value === "time"
      }, currentDropdown.value === "time" ? {
        q: common_vendor.f(timeList, (item, k0, i0) => {
          return {
            a: common_vendor.t(item),
            b: item,
            c: common_vendor.o(($event) => selectOption("time", item), item),
            d: selectedTime.value === item ? 1 : ""
          };
        })
      } : {}, {
        r: common_vendor.f(10, (item, k0, i0) => {
          return {
            a: item,
            b: common_vendor.o(OnClick, item),
            c: "e4e5fb8d-3-" + i0
          };
        }),
        s: common_vendor.p({
          title: "基础卡片",
          extra: "额外信息"
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-e4e5fb8d"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/policy/policy.js.map
