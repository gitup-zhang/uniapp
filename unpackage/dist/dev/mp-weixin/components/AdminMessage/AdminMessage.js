"use strict";
const common_vendor = require("../../common/vendor.js");
const SHORT_LIMIT = 50;
const MEDIUM_LIMIT = 200;
const _sfc_main = {
  __name: "AdminMessage",
  props: {
    message: {
      type: Object,
      required: true
    }
  },
  emits: ["messageClick", "actionClick", "markRead"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const isExpanded = common_vendor.ref(false);
    const { textContent, mediaItems } = parseMessageContent(props.message.content || "");
    const contentLevel = common_vendor.computed(() => {
      const textLength = textContent.length;
      if (textLength <= SHORT_LIMIT && mediaItems.length === 0) {
        return "short";
      } else if (textLength <= MEDIUM_LIMIT) {
        return "medium";
      } else {
        return "long";
      }
    });
    function parseMessageContent(content) {
      if (!content)
        return { textContent: "", mediaItems: [] };
      const mediaItems2 = [];
      let textContent2 = content;
      const imageRegex = /\[(?:img|image):([^\]]+)\]/g;
      textContent2 = textContent2.replace(imageRegex, (match, url) => {
        mediaItems2.push({
          type: "image",
          url: url.trim()
        });
        return "";
      });
      const videoRegex = /\[(?:video|vid):([^\]]+)(?:\|poster:([^\]]+))?\]/g;
      textContent2 = textContent2.replace(videoRegex, (match, url, poster) => {
        mediaItems2.push({
          type: "video",
          url: url.trim(),
          poster: poster ? poster.trim() : ""
        });
        return "";
      });
      textContent2 = textContent2.replace(/\n\s*\n\s*\n/g, "\n\n").trim();
      return { textContent: textContent2, mediaItems: mediaItems2 };
    }
    const getDisplayText = () => {
      if (!textContent)
        return "";
      if (contentLevel.value === "medium" && !isExpanded.value) {
        return textContent.substring(0, MEDIUM_LIMIT) + "...";
      }
      if (contentLevel.value === "long") {
        return textContent.substring(0, SHORT_LIMIT) + "...";
      }
      return textContent;
    };
    const toggleExpand = () => {
      isExpanded.value = !isExpanded.value;
    };
    const formatMessageTime = (timeStr) => {
      if (!timeStr)
        return "";
      const time = new Date(timeStr);
      const now = /* @__PURE__ */ new Date();
      const isSameDay = (date1, date2) => {
        return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
      };
      if (isSameDay(time, now)) {
        return `${String(time.getHours()).padStart(2, "0")}:${String(time.getMinutes()).padStart(2, "0")}`;
      } else {
        return `${time.getMonth() + 1}-${time.getDate()} ${String(time.getHours()).padStart(2, "0")}:${String(time.getMinutes()).padStart(2, "0")}`;
      }
    };
    const getAllImageUrls = () => {
      return mediaItems.filter((item) => item.type === "image").map((item) => item.url);
    };
    const previewImage = (current, urls) => {
      common_vendor.index.previewImage({
        current,
        urls
      });
    };
    const handleMessageTap = () => {
      if (contentLevel.value === "long") {
        emit("messageClick", props.message);
        return;
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(__props.message.sender_name || "系统管理员"),
        b: common_vendor.t(formatMessageTime(__props.message.send_time)),
        c: __props.message.title
      }, __props.message.title ? {
        d: common_vendor.t(__props.message.title)
      } : {}, {
        e: common_vendor.unref(textContent)
      }, common_vendor.unref(textContent) ? {
        f: common_vendor.t(getDisplayText()),
        g: isExpanded.value ? 1 : "",
        h: contentLevel.value === "medium" && !isExpanded.value ? 1 : ""
      } : {}, {
        i: common_vendor.unref(mediaItems).length > 0
      }, common_vendor.unref(mediaItems).length > 0 ? {
        j: common_vendor.f(common_vendor.unref(mediaItems), (media, index, i0) => {
          return common_vendor.e({
            a: media.type === "image"
          }, media.type === "image" ? {
            b: media.url,
            c: common_vendor.o(($event) => previewImage(media.url, getAllImageUrls()), index)
          } : {}, {
            d: media.type === "video"
          }, media.type === "video" ? {
            e: media.url,
            f: media.poster
          } : {}, {
            g: index,
            h: common_vendor.n(`media-${media.type}`)
          });
        })
      } : {}, {
        k: contentLevel.value === "medium"
      }, contentLevel.value === "medium" ? {
        l: common_vendor.t(isExpanded.value ? "收起" : "查看全部"),
        m: isExpanded.value ? 1 : "",
        n: common_vendor.o(toggleExpand)
      } : {}, {
        o: contentLevel.value === "long"
      }, contentLevel.value === "long" ? {} : {}, {
        p: contentLevel.value === "long" ? 1 : "",
        q: common_vendor.o(handleMessageTap)
      });
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-3a7f16d9"]]);
wx.createComponent(Component);
