"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  __name: "CustomNavbar",
  setup(__props) {
    const statusBarHeight = common_vendor.ref(20);
    const navbarHeight = common_vendor.ref(70);
    common_vendor.onMounted(() => {
      const systemInfo = common_vendor.index.getSystemInfoSync();
      statusBarHeight.value = systemInfo.statusBarHeight;
      navbarHeight.value = systemInfo.statusBarHeight + 80;
    });
    return (_ctx, _cache) => {
      return {
        a: common_assets._imports_0$2,
        b: statusBarHeight.value + "px",
        c: navbarHeight.value + "px",
        d: navbarHeight.value + "px"
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-ff1d8d81"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/CustomNavbar/CustomNavbar.js.map
