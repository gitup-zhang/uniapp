"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "MessageCard",
  props: {
    message: {
      type: Object,
      required: true,
      default: () => ({})
    }
  },
  emits: ["tap", "toggleRead"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const getSourceText = () => {
      if (props.message.type === "system") {
        return "系统消息";
      }
      return props.message.groupName || "群组消息";
    };
    const handleCardTap = () => {
      emit("tap", props.message);
    };
    const toggleRead = () => {
      emit("toggleRead", props.message);
    };
    const handleAvatarError = () => {
      console.log("头像加载失败");
    };
    const formatTime = (time) => {
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
        return time.split(" ")[0];
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: __props.message.type === "system"
      }, __props.message.type === "system" ? {} : {
        b: __props.message.avatar || "/static/default-group.png",
        c: common_vendor.o(handleAvatarError)
      }, {
        d: !__props.message.isRead
      }, !__props.message.isRead ? {} : {}, {
        e: common_vendor.t(__props.message.title),
        f: __props.message.priority === "high"
      }, __props.message.priority === "high" ? {} : {}, {
        g: common_vendor.t(formatTime(__props.message.time)),
        h: common_vendor.t(__props.message.brief),
        i: common_vendor.t(getSourceText()),
        j: __props.message.type === "group"
      }, __props.message.type === "group" ? {
        k: common_vendor.t(__props.message.memberCount)
      } : {}, {
        l: __props.message.isRead ? 1 : "",
        m: common_vendor.o(toggleRead),
        n: !__props.message.isRead ? 1 : "",
        o: common_vendor.o(handleCardTap)
      });
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-d00e46f1"]]);
wx.createComponent(Component);
