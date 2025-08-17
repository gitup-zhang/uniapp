"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_data = require("../../utils/data.js");
const _sfc_main = {
  __name: "ActivityTicket",
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
    const currentTime = common_vendor.ref(/* @__PURE__ */ new Date());
    let timer = null;
    common_vendor.onMounted(() => {
      timer = setInterval(() => {
        currentTime.value = /* @__PURE__ */ new Date();
      }, 6e4);
    });
    common_vendor.onUnmounted(() => {
      if (timer) {
        clearInterval(timer);
      }
    });
    const timeStatus = common_vendor.computed(() => {
      const now = currentTime.value.getTime();
      const startTime = new Date(props.activityData.event_start_time).getTime();
      const endTime = new Date(props.activityData.event_end_time).getTime();
      if (now < startTime)
        return "not_started";
      if (now >= startTime && now <= endTime)
        return "ongoing";
      return "expired";
    });
    const checkInButtonConfig = common_vendor.computed(() => {
      switch (timeStatus.value) {
        case "not_started":
          return {
            text: "未开始",
            disabled: true,
            class: "not-started"
          };
        case "ongoing":
          return {
            text: "签到",
            disabled: false,
            class: "active"
          };
        case "expired":
          return {
            text: "已结束",
            disabled: true,
            class: "expired"
          };
        default:
          return {
            text: "签到",
            disabled: false,
            class: "active"
          };
      }
    });
    const handleAction = () => {
      if (!checkInButtonConfig.value.disabled) {
        emit("action", props.activityData);
      }
    };
    const handleCancel = () => {
      emit("cancel", props.activityData);
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.t(props.activityData.title),
        b: common_vendor.t(props.activityData.event_address),
        c: common_vendor.t(common_vendor.unref(utils_data.formatEventDate)(props.activityData.event_start_time, props.activityData.event_end_time)),
        d: common_vendor.t(checkInButtonConfig.value.text),
        e: common_vendor.n(checkInButtonConfig.value.class),
        f: checkInButtonConfig.value.disabled,
        g: common_vendor.o(handleAction),
        h: common_vendor.o(handleCancel)
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-cc16e5a8"]]);
wx.createComponent(Component);
