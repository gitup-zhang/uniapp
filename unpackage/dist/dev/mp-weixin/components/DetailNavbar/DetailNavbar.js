"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "DetailNavbar",
  props: ["title"],
  setup(__props) {
    const props = __props;
    const statusBarHeight = common_vendor.ref(20);
    const navbarHeight = common_vendor.ref(64);
    common_vendor.onMounted(() => {
      const systemInfo = common_vendor.index.getSystemInfoSync();
      statusBarHeight.value = systemInfo.statusBarHeight;
      navbarHeight.value = systemInfo.statusBarHeight + 44;
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.t(props.title),
        b: statusBarHeight.value + "px",
        c: navbarHeight.value + "px"
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-ea0d75a7"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/DetailNavbar/DetailNavbar.js.map
