"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "ActivityTicket",
  props: {
    activityData: {
      type: Object,
      default: () => ({
        title: "中国大模型大会",
        location: "深圳华侨城创意文化园北区 C2 展厅",
        date: "3月15日-4月10日",
        statusText: "位置签到"
      })
    }
  },
  emits: ["action"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const handleAction = () => {
      emit("action", props.activityData);
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.t(props.activityData.title),
        b: common_vendor.t(props.activityData.location),
        c: common_vendor.t(props.activityData.date),
        d: common_vendor.t(props.activityData.statusText),
        e: common_vendor.o(handleAction)
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-cc16e5a8"]]);
wx.createComponent(Component);
