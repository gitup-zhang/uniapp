"use strict";
const common_vendor = require("../../common/vendor.js");
const store_mes = require("../../store/mes.js");
const _sfc_main = {
  __name: "ChatSystem",
  setup(__props) {
    const statusBarHeight = common_vendor.ref(0);
    const pageSize = common_vendor.ref(10);
    const loadThrottle = common_vendor.ref(false);
    const MesStore = store_mes.useMesstore();
    const CONTENT_CONFIG = {
      SHORT_LIMIT: 80,
      // 短内容限制（字符数）
      MEDIUM_LIMIT: 300,
      // 中等内容限制
      PREVIEW_LENGTH: 120,
      // 预览内容长度
      COLLAPSE_HEIGHT: 3
      // 折叠时显示行数
    };
    const PRIORITY_MAP = {
      "high": "重要",
      "medium": "普通",
      "low": "一般",
      "urgent": "紧急"
    };
    common_vendor.onMounted(async () => {
      const sysInfo = common_vendor.index.getSystemInfoSync();
      statusBarHeight.value = sysInfo.statusBarHeight || 0;
    });
    common_vendor.onLoad(async (options) => {
      await loadInitialMessages();
    });
    common_vendor.onShow(() => {
      console.log("系统消息页面显示");
    });
    common_vendor.onHide(() => {
      if (MesStore.error) {
        MesStore.error = null;
      }
    });
    const loadInitialMessages = async () => {
      try {
        await MesStore.getMessageList({
          message_type: "SYSTEM",
          page: 1,
          page_size: pageSize.value
        });
      } catch (error) {
        console.error("初始加载消息失败:", error);
        common_vendor.index.showToast({
          title: "加载失败，请重试",
          icon: "none",
          duration: 2e3
        });
      }
    };
    const handleLoadMore = async () => {
      if (loadThrottle.value || MesStore.loadingMore || !MesStore.hasMoreData) {
        console.log("加载条件不满足:", {
          throttle: loadThrottle.value,
          loading: MesStore.loadingMore,
          hasMore: MesStore.hasMoreData
        });
        return;
      }
      loadThrottle.value = true;
      try {
        const result = await MesStore.loadMoreMessages({
          message_type: "SYSTEM",
          page_size: pageSize.value
        });
        if (result.success) {
          console.log(`加载更多成功: 新增${result.data.length}条消息`);
          if (result.data.length < pageSize.value) {
            console.log("已加载所有数据");
          }
        }
      } catch (error) {
        console.error("加载更多失败:", error);
        common_vendor.index.showToast({
          title: "加载失败，请重试",
          icon: "none",
          duration: 2e3
        });
      } finally {
        setTimeout(() => {
          loadThrottle.value = false;
        }, 1e3);
      }
    };
    const handleRefresh = async () => {
      try {
        const result = await MesStore.refreshMessageList({
          message_type: "SYSTEM",
          page_size: pageSize.value
        });
        if (result.success) {
          console.log("刷新成功:", result.data.length, "条消息");
          common_vendor.index.showToast({
            title: "刷新成功",
            icon: "success",
            duration: 1500
          });
        }
      } catch (error) {
        console.error("刷新失败:", error);
        common_vendor.index.showToast({
          title: "刷新失败",
          icon: "error",
          duration: 2e3
        });
      }
    };
    const handleRefreshRestore = () => {
      console.log("刷新完成");
    };
    const handleRetry = async () => {
      MesStore.error = null;
      await loadInitialMessages();
    };
    const getContentType = (content) => {
      if (!content)
        return "short";
      const length = content.length;
      if (length <= CONTENT_CONFIG.SHORT_LIMIT) {
        return "short";
      } else if (length <= CONTENT_CONFIG.MEDIUM_LIMIT) {
        return "medium";
      } else {
        return "long";
      }
    };
    const getPreviewText = (content) => {
      if (!content)
        return "";
      return content.length > CONTENT_CONFIG.PREVIEW_LENGTH ? content.substring(0, CONTENT_CONFIG.PREVIEW_LENGTH) + "..." : content;
    };
    const getPriorityText = (priority) => {
      return PRIORITY_MAP[priority] || priority;
    };
    const handleMessageClick = async (message, index) => {
      console.log("点击消息:", message.title);
    };
    const toggleContent = async (index) => {
      const message = MesStore.MessageList[index];
      if (!message)
        return;
      MesStore.toggleMessageExpanded(message.id);
    };
    const viewFullContent = async (message) => {
      common_vendor.index.navigateTo({
        url: `/pages/detail/SystemMesDetail?id=${message.id}&title=${encodeURIComponent(message.title || "系统消息")}`
      });
    };
    const formatTime = (timeStr) => {
      if (!timeStr)
        return "";
      try {
        const time = new Date(timeStr);
        const now = /* @__PURE__ */ new Date();
        const diff = now - time;
        if (diff < 6e4) {
          return "刚刚";
        } else if (diff < 36e5) {
          return `${Math.floor(diff / 6e4)}分钟前`;
        } else if (diff < 864e5) {
          return `${Math.floor(diff / 36e5)}小时前`;
        } else if (diff < 6048e5) {
          return `${Math.floor(diff / 864e5)}天前`;
        } else {
          const month = String(time.getMonth() + 1).padStart(2, "0");
          const date = String(time.getDate()).padStart(2, "0");
          const hours = String(time.getHours()).padStart(2, "0");
          const minutes = String(time.getMinutes()).padStart(2, "0");
          if (time.getFullYear() === now.getFullYear()) {
            return `${month}-${date} ${hours}:${minutes}`;
          } else {
            return `${time.getFullYear()}-${month}-${date}`;
          }
        }
      } catch (error) {
        return String(timeStr);
      }
    };
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: statusBarHeight.value + "px",
        b: common_vendor.o(goBack),
        c: common_vendor.unref(MesStore).loading && common_vendor.unref(MesStore).MessageList.length === 0
      }, common_vendor.unref(MesStore).loading && common_vendor.unref(MesStore).MessageList.length === 0 ? {} : common_vendor.e({
        d: common_vendor.f(common_vendor.unref(MesStore).MessageList, (message, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(message.title || "系统通知"),
            b: common_vendor.t(formatTime(message.send_time || message.created_at)),
            c: message.sender_name
          }, message.sender_name ? {
            d: common_vendor.t(message.sender_name)
          } : {}, {
            e: getContentType(message.content) === "short"
          }, getContentType(message.content) === "short" ? {
            f: common_vendor.t(message.content)
          } : getContentType(message.content) === "medium" ? common_vendor.e({
            h: common_vendor.t(message.content),
            i: !message.expanded ? 1 : "",
            j: !message.expanded
          }, !message.expanded ? {} : {}, {
            k: common_vendor.t(message.expanded ? "收起" : "展开"),
            l: message.expanded ? 1 : "",
            m: common_vendor.o(($event) => toggleContent(index), message.id)
          }) : {
            n: common_vendor.t(getPreviewText(message.content)),
            o: common_vendor.o(($event) => viewFullContent(message), message.id)
          }, {
            g: getContentType(message.content) === "medium",
            p: message.priority || message.category
          }, message.priority || message.category ? common_vendor.e({
            q: message.priority
          }, message.priority ? {
            r: common_vendor.t(getPriorityText(message.priority)),
            s: common_vendor.n(`priority-${message.priority}`)
          } : {}, {
            t: message.category
          }, message.category ? {
            v: common_vendor.t(message.category)
          } : {}) : {}, {
            w: common_vendor.o(($event) => handleMessageClick(message), message.id),
            x: message.id,
            y: message.expanded ? 1 : ""
          });
        }),
        e: common_vendor.unref(MesStore).hasMoreData && common_vendor.unref(MesStore).MessageList.length > 0
      }, common_vendor.unref(MesStore).hasMoreData && common_vendor.unref(MesStore).MessageList.length > 0 ? common_vendor.e({
        f: common_vendor.unref(MesStore).loadingMore
      }, common_vendor.unref(MesStore).loadingMore ? {} : {}) : common_vendor.unref(MesStore).MessageList.length > 0 && !common_vendor.unref(MesStore).hasMoreData ? {} : {}, {
        g: common_vendor.unref(MesStore).MessageList.length > 0 && !common_vendor.unref(MesStore).hasMoreData
      }), {
        h: !common_vendor.unref(MesStore).loading && common_vendor.unref(MesStore).MessageList.length === 0
      }, !common_vendor.unref(MesStore).loading && common_vendor.unref(MesStore).MessageList.length === 0 ? common_vendor.e({
        i: common_vendor.unref(MesStore).error
      }, common_vendor.unref(MesStore).error ? {
        j: common_vendor.o(handleRetry)
      } : {}) : {}, {
        k: common_vendor.unref(MesStore).error && common_vendor.unref(MesStore).MessageList.length > 0
      }, common_vendor.unref(MesStore).error && common_vendor.unref(MesStore).MessageList.length > 0 ? {
        l: common_vendor.t(common_vendor.unref(MesStore).error),
        m: common_vendor.o(handleRetry)
      } : {}, {
        n: statusBarHeight.value + 48 + "px",
        o: common_vendor.unref(MesStore).refreshing,
        p: common_vendor.o(handleRefresh),
        q: common_vendor.o(handleRefreshRestore),
        r: common_vendor.o(handleLoadMore)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-82517712"]]);
wx.createPage(MiniProgramPage);
