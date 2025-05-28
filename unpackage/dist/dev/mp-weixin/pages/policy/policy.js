"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "policy",
  setup(__props) {
    const currentDropdown = common_vendor.ref(null);
    const domainList = ["教育", "科技", "医疗"];
    const timeList = ["最近一周", "最近一月", "最近一年"];
    function toggleDropdown(type) {
      currentDropdown.value = currentDropdown.value === type ? null : type;
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: currentDropdown.value === "domain" ? 1 : "",
        b: common_vendor.o(($event) => toggleDropdown("domain")),
        c: currentDropdown.value === "time" ? 1 : "",
        d: common_vendor.o(($event) => toggleDropdown("time")),
        e: currentDropdown.value === "domain"
      }, currentDropdown.value === "domain" ? {
        f: common_vendor.f(domainList, (item, k0, i0) => {
          return {
            a: common_vendor.t(item),
            b: item
          };
        })
      } : {}, {
        g: currentDropdown.value === "time"
      }, currentDropdown.value === "time" ? {
        h: common_vendor.f(timeList, (item, k0, i0) => {
          return {
            a: common_vendor.t(item),
            b: item
          };
        })
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-e4e5fb8d"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/policy/policy.js.map
