"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "GroupMesDetail",
  setup(__props) {
    const statusBarHeight = common_vendor.ref(0);
    const message = common_vendor.ref({
      id: "1",
      sender_name: "系统管理员",
      title: "重要系统维护通知",
      content: `尊敬的用户：

为了提升系统性能和用户体验，我们将于本周末进行重要的系统维护升级。具体安排如下：

🕐 维护时间：2025年8月21日 02:00 - 06:00
🔧 影响范围：全平台服务暂停
⏰ 预计恢复：当日上午6点前完全恢复

维护期间，您可能遇到以下情况：
• 无法正常登录和使用平台服务
• 数据同步可能出现延迟  
• 部分功能临时不可用

[img:https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg]

本次升级将带来以下改进：
✨ 全新的用户界面设计
🚀 更快的响应速度（提升40%）
🔒 增强的安全防护机制
📱 优化移动端体验

[video:https://media.w3.org/2010/05/sintel/trailer.mp4]

为了确保您的数据安全，建议您：
1. 提前保存重要工作内容
2. 避免在维护期间进行重要操作
3. 关注我们的官方公告获取最新进展

感谢您的理解与支持！如有紧急问题，请联系客服热线：400-123-4567

祝您使用愉快！`,
      type: "maintenance",
      priority: "high",
      created_at: "2025-08-19T14:30:00.000Z"
    });
    const { textContent, mediaItems } = parseMessageContent(message.value.content || "");
    common_vendor.onMounted(() => {
      const sysInfo = common_vendor.index.getSystemInfoSync();
      statusBarHeight.value = sysInfo.statusBarHeight || 0;
    });
    common_vendor.onLoad((options) => {
      if (options.id)
        ;
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
    const formatDetailTime = (timeStr) => {
      if (!timeStr)
        return "";
      const time = new Date(timeStr);
      const year = time.getFullYear();
      const month = String(time.getMonth() + 1).padStart(2, "0");
      const day = String(time.getDate()).padStart(2, "0");
      const hours = String(time.getHours()).padStart(2, "0");
      const minutes = String(time.getMinutes()).padStart(2, "0");
      return `${year}年${month}月${day}日 ${hours}:${minutes}`;
    };
    const getTypeLabel = (type) => {
      const labels = {
        "announcement": "公告",
        "maintenance": "维护",
        "event": "活动",
        "security": "安全",
        "update": "更新",
        "normal": "通知"
      };
      return labels[type] || "通知";
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
    const onImageLoad = (e) => {
      console.log("图片加载成功", e);
    };
    const onImageError = (e) => {
      console.log("图片加载失败", e);
      common_vendor.index.showToast({
        title: "图片加载失败",
        icon: "none",
        duration: 2e3
      });
    };
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: statusBarHeight.value + "px",
        b: common_vendor.o(goBack),
        c: message.value.priority === "high" ? 1 : "",
        d: common_vendor.t(message.value.sender_name || "系统管理员"),
        e: common_vendor.t(formatDetailTime(message.value.created_at)),
        f: message.value.priority === "high"
      }, message.value.priority === "high" ? {} : {}, {
        g: message.value.title
      }, message.value.title ? {
        h: common_vendor.t(message.value.title)
      } : {}, {
        i: message.value.type && message.value.type !== "normal"
      }, message.value.type && message.value.type !== "normal" ? {
        j: common_vendor.t(getTypeLabel(message.value.type)),
        k: common_vendor.n(`tag-${message.value.type}`)
      } : {}, {
        l: common_vendor.unref(textContent)
      }, common_vendor.unref(textContent) ? {
        m: common_vendor.t(common_vendor.unref(textContent))
      } : {}, {
        n: common_vendor.unref(mediaItems).length > 0
      }, common_vendor.unref(mediaItems).length > 0 ? {
        o: common_vendor.f(common_vendor.unref(mediaItems), (media, index, i0) => {
          return common_vendor.e({
            a: media.type === "image"
          }, media.type === "image" ? {
            b: media.url,
            c: common_vendor.o(($event) => previewImage(media.url, getAllImageUrls()), index),
            d: common_vendor.o(onImageLoad, index),
            e: common_vendor.o(onImageError, index)
          } : {}, {
            f: media.type === "video"
          }, media.type === "video" ? {
            g: media.url,
            h: media.poster
          } : {}, {
            i: index
          });
        })
      } : {}, {
        p: statusBarHeight.value + 48 + "px"
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-9d197054"]]);
wx.createPage(MiniProgramPage);
