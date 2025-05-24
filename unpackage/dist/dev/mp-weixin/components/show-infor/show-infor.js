"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "show-infor",
  props: {
    isshow: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: ""
    }
  },
  setup(__props) {
    const props = __props;
    function handleMore() {
      common_vendor.index.__f__("log", "at components/show-infor/show-infor.vue:29", props.isshow);
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(props.title),
        b: props.isshow
      }, props.isshow ? {
        c: common_vendor.o(handleMore)
      } : {});
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-02a0dac7"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/show-infor/show-infor.js.map
