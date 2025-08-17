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
    },
    status: {
      type: String,
      default: "active",
      validator: (value) => ["active", "expired"].includes(value)
    }
  },
  emits: ["action", "cancel", "viewDetails", "archive"],
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
    const isExpired = common_vendor.computed(() => props.status === "expired");
    const statusClass = common_vendor.computed(() => props.status);
    const timeStatus = common_vendor.computed(() => {
      if (isExpired.value)
        return "expired";
      const now = currentTime.value.getTime();
      const startTime = new Date(props.activityData.event_start_time).getTime();
      const endTime = new Date(props.activityData.event_end_time).getTime();
      if (now < startTime)
        return "not_started";
      if (now >= startTime && now <= endTime)
        return "ongoing";
      return "expired";
    });
    const statusText = common_vendor.computed(() => {
      switch (timeStatus.value) {
        case "not_started":
          return "未开始";
        case "ongoing":
          return "进行中";
        case "expired":
          return "已过期";
        default:
          return "进行中";
      }
    });
    const activityProgress = common_vendor.computed(() => {
      if (isExpired.value)
        return 100;
      const now = currentTime.value.getTime();
      const startTime = new Date(props.activityData.event_start_time).getTime();
      const endTime = new Date(props.activityData.event_end_time).getTime();
      if (now < startTime)
        return 0;
      if (now > endTime)
        return 100;
      const total = endTime - startTime;
      const elapsed = now - startTime;
      const progress = Math.round(elapsed / total * 100);
      return Math.max(0, Math.min(100, progress));
    });
    const checkInButtonConfig = common_vendor.computed(() => {
      switch (timeStatus.value) {
        case "not_started":
          return {
            text: "未开始",
            icon: "⏰",
            disabled: true,
            class: "not-started"
          };
        case "ongoing":
          return {
            text: "签到",
            icon: "✓",
            disabled: false,
            class: "primary"
          };
        case "expired":
          return {
            text: "已结束",
            icon: "🔒",
            disabled: true,
            class: "expired"
          };
        default:
          return {
            text: "签到",
            icon: "✓",
            disabled: false,
            class: "primary"
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
    const handleViewDetails = () => {
      emit("viewDetails", props.activityData);
    };
    const handleArchive = () => {
      emit("archive", props.activityData);
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.n(statusClass.value),
        b: common_vendor.t(statusText.value),
        c: isExpired.value
      }, isExpired.value ? {} : {}, {
        d: common_vendor.t(props.activityData.title),
        e: common_vendor.t(isExpired.value ? "活动已结束" : "精彩活动等你参与"),
        f: common_vendor.n(statusClass.value),
        g: common_vendor.t(props.activityData.event_address),
        h: common_vendor.n(statusClass.value),
        i: common_vendor.t(common_vendor.unref(utils_data.formatEventDate)(props.activityData.event_start_time, props.activityData.event_end_time)),
        j: common_vendor.n(statusClass.value),
        k: common_vendor.n(statusClass.value),
        l: common_vendor.n(statusClass.value),
        m: common_vendor.t(isExpired.value ? "共102人参与过" : "已有102人参与"),
        n: common_vendor.n(statusClass.value),
        o: !isExpired.value
      }, !isExpired.value ? {
        p: common_vendor.t(checkInButtonConfig.value.icon),
        q: common_vendor.t(checkInButtonConfig.value.text),
        r: common_vendor.n(checkInButtonConfig.value.class),
        s: checkInButtonConfig.value.disabled,
        t: common_vendor.o(handleAction),
        v: common_vendor.o(handleCancel)
      } : {
        w: common_vendor.o(handleViewDetails),
        x: common_vendor.o(handleArchive)
      }, {
        y: common_vendor.n(statusClass.value),
        z: activityProgress.value + "%",
        A: common_vendor.t(isExpired.value ? "活动已完成 100%" : `活动进度 ${activityProgress.value}%`),
        B: common_vendor.n(statusClass.value),
        C: common_vendor.n(statusClass.value)
      });
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-a433b5db"]]);
wx.createComponent(Component);
