"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
const _sfc_main = {
  __name: "HorizontalActivityCard",
  props: {
    imgSrc: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    date: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return {
        a: __props.imgSrc,
        b: common_vendor.t(__props.title),
        c: __props.title,
        d: common_vendor.p({
          type: "calendar",
          size: "16",
          color: "#999"
        }),
        e: common_vendor.t(__props.date),
        f: common_vendor.p({
          type: "location",
          size: "16",
          color: "#999"
        }),
        g: common_vendor.t(__props.location)
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-20ccd4e2"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/HorizontalActivityCard/HorizontalActivityCard.js.map
