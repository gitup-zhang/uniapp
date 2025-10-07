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
  __name: "ActivityCard",
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
    },
    isJoined: {
      type: Boolean,
      default: false
    },
    fee: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      required: true
    }
  },
  setup(__props) {
    const props = __props;
    const isStarted = common_vendor.computed(() => {
      return props.status === "进行中";
    });
    return (_ctx, _cache) => {
      return {
        a: __props.imgSrc,
        b: common_vendor.t(__props.status),
        c: common_vendor.n(isStarted.value ? "in-progress" : "upcoming"),
        d: common_vendor.t(__props.title),
        e: __props.title,
        f: common_vendor.p({
          type: "calendar",
          size: "16",
          color: "#999"
        }),
        g: common_vendor.t(__props.date),
        h: common_vendor.p({
          type: "location",
          size: "16",
          color: "#999"
        }),
        i: common_vendor.t(__props.location),
        j: common_vendor.t(__props.fee)
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-5b024a23"]]);
wx.createComponent(Component);
