"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_data = require("../../utils/data.js");
const _sfc_main = {
  __name: "ActivityTicketList",
  props: {
    activityData: {
      type: Object,
      default: () => ({
        id: 0,
        title: "",
        event_address: "",
        event_end_time: "",
        event_start_time: ""
      })
    }
  },
  emits: ["action", "cancel"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const handleAction = () => {
      emit("action", props.activityData);
    };
    const handleCancel = () => {
      emit("cancel", props.activityData);
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.t(props.activityData.title),
        b: common_vendor.t(props.activityData.event_address),
        c: common_vendor.t(common_vendor.unref(utils_data.formatEventDate)(props.activityData.event_start_time, props.activityData.event_end_time)),
        d: common_vendor.o(handleAction),
        e: common_vendor.o(handleCancel)
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-a433b5db"]]);
wx.createComponent(Component);
