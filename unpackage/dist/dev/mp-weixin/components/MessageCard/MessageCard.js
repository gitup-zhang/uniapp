"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "MessageCard",
  props: {
    message: {
      type: Object,
      required: true,
      default: () => ({
        id: "",
        group_name: "",
        unread_count: 0,
        is_read: 1,
        latest_content: "",
        latest_time: "",
        type: "group"
      })
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ["tap", "markAsRead"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const hasUnreadMessages = common_vendor.computed(() => {
      return props.message.unread_count > 0 || props.message.is_read === 0;
    });
    const displayUnreadCount = common_vendor.computed(() => {
      const count = props.message.unread_count || (props.message.is_read === 0 ? 1 : 0);
      return count > 99 ? "99+" : count.toString();
    });
    const displayContent = common_vendor.computed(() => {
      const content = props.message.latest_content || props.message.content || props.message.message || "";
      return content || "暂无内容";
    });
    const formattedTime = common_vendor.computed(() => {
      return formatTime(props.message.latest_time || props.message.created_at || props.message.updated_at);
    });
    const getAvatarText = () => {
      const name = props.message.group_name || "未知";
      const firstChar = name.charAt(0);
      return firstChar.toUpperCase();
    };
    const getAvatarStyle = () => {
      const name = props.message.group_name || "default";
      let hash = 0;
      for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
      }
      const colors = [
        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
        "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
        "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
        "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
        "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
        "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)"
      ];
      const colorIndex = Math.abs(hash) % colors.length;
      return {
        background: colors[colorIndex]
      };
    };
    const handleCardTap = () => {
      if (props.loading)
        return;
      emit("tap", props.message);
      if (hasUnreadMessages.value) {
        emit("markAsRead", props.message);
      }
    };
    const formatTime = (time) => {
      if (!time)
        return "";
      try {
        const now = /* @__PURE__ */ new Date();
        let msgTime;
        if (typeof time === "string") {
          msgTime = new Date(time);
        } else if (time instanceof Date) {
          msgTime = time;
        } else if (typeof time === "number") {
          msgTime = new Date(time);
        } else {
          return String(time);
        }
        if (isNaN(msgTime.getTime())) {
          console.warn("无效的日期格式:", time);
          return String(time);
        }
        const diff = now - msgTime;
        const minutes = Math.floor(diff / (1e3 * 60));
        const hours = Math.floor(diff / (1e3 * 60 * 60));
        const days = Math.floor(diff / (1e3 * 60 * 60 * 24));
        if (minutes < 1) {
          return "刚刚";
        } else if (minutes < 60) {
          return `${minutes}分钟前`;
        } else if (hours < 24) {
          return `${hours}小时前`;
        } else if (days === 1) {
          return "昨天";
        } else if (days <= 7) {
          return `${days}天前`;
        } else {
          const month = msgTime.getMonth() + 1;
          const date = msgTime.getDate();
          if (msgTime.getFullYear() === now.getFullYear()) {
            return `${month}月${date}日`;
          } else {
            return `${msgTime.getFullYear()}年${month}月${date}日`;
          }
        }
      } catch (error) {
        console.error("时间格式化错误:", error, "原始时间:", time);
        return String(time);
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(getAvatarText()),
        b: common_vendor.s(getAvatarStyle()),
        c: hasUnreadMessages.value
      }, hasUnreadMessages.value ? {
        d: common_vendor.t(displayUnreadCount.value)
      } : {}, {
        e: common_vendor.t(__props.message.group_name || "未知群组"),
        f: common_vendor.t(formattedTime.value),
        g: common_vendor.t(displayContent.value),
        h: hasUnreadMessages.value ? 1 : "",
        i: __props.loading ? 1 : "",
        j: common_vendor.o(handleCardTap)
      });
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-d00e46f1"]]);
wx.createComponent(Component);
