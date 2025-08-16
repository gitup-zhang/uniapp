"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "MessageCard",
  props: {
    message: {
      type: Object,
      required: true,
      default: () => ({
        group_name: "",
        unread_count: 0,
        latest_content: "",
        latest_time: ""
      })
    }
  },
  emits: ["tap"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const getAvatarText = () => {
      const name = props.message.group_name || "未知";
      return name.charAt(0).toUpperCase();
    };
    const handleCardTap = () => {
      emit("tap", props.message);
    };
    const formatTime = (time) => {
      if (!time)
        return "";
      const now = /* @__PURE__ */ new Date();
      const msgTime = new Date(time);
      const diff = now - msgTime;
      const days = Math.floor(diff / (1e3 * 60 * 60 * 24));
      if (days === 0) {
        const hours = Math.floor(diff / (1e3 * 60 * 60));
        if (hours === 0) {
          const minutes = Math.floor(diff / (1e3 * 60));
          return minutes <= 0 ? "刚刚" : `${minutes}分钟前`;
        } else {
          return `${hours}小时前`;
        }
      } else if (days === 1) {
        return "昨天";
      } else if (days <= 7) {
        return `${days}天前`;
      } else {
        const month = msgTime.getMonth() + 1;
        const date = msgTime.getDate();
        return `${month}月${date}日`;
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(getAvatarText()),
        b: __props.message.unread_count > 0
      }, __props.message.unread_count > 0 ? {
        c: common_vendor.t(__props.message.unread_count > 99 ? "99+" : __props.message.unread_count)
      } : {}, {
        d: common_vendor.t(__props.message.group_name),
        e: common_vendor.t(formatTime(__props.message.latest_time)),
        f: common_vendor.t(__props.message.latest_content),
        g: __props.message.unread_count > 0 ? 1 : "",
        h: common_vendor.o(handleCardTap)
      });
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-d00e46f1"]]);
wx.createComponent(Component);
