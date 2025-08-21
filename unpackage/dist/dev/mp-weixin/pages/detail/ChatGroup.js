"use strict";
const common_vendor = require("../../common/vendor.js");
const store_mes = require("../../store/mes.js");
if (!Math) {
  AdminMessage();
}
const AdminMessage = () => "../../components/AdminMessage/AdminMessage.js";
const _sfc_main = {
  __name: "ChatGroup",
  props: {
    id: String,
    groupName: String
  },
  setup(__props) {
    const MesStore = store_mes.useMesstore();
    const statusBarHeight = common_vendor.ref(0);
    const scrollIntoView = common_vendor.ref("");
    const isFirstLoad = common_vendor.ref(true);
    const groupId = common_vendor.ref("");
    const groupName = common_vendor.ref("管理员通知");
    const loadMoreTimer = common_vendor.ref(null);
    const refresherTriggered = common_vendor.ref(false);
    const refresherText = common_vendor.ref("下拉刷新");
    common_vendor.onMounted(async () => {
      const sysInfo = common_vendor.index.getSystemInfoSync();
      statusBarHeight.value = sysInfo.statusBarHeight || 0;
    });
    common_vendor.onLoad(async (options) => {
      console.log("跳转到的群组信息：", options);
      groupId.value = options.id || "";
      groupName.value = decodeURIComponent(options.groupName || "管理员通知");
      MesStore.clearMessageList();
      await loadInitialMessages();
    });
    common_vendor.onShow(() => {
      isFirstLoad.value = false;
    });
    common_vendor.onReachBottom(() => {
      onScrollToLower();
    });
    const groupedMessages = common_vendor.computed(() => {
      const grouped = {};
      if (!MesStore.MessageList || !Array.isArray(MesStore.MessageList)) {
        return grouped;
      }
      MesStore.MessageList.forEach((message) => {
        const date = new Date(message.created_at || message.send_time || message.updated_at);
        const today = /* @__PURE__ */ new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        let dateKey = "";
        if (isSameDay(date, today)) {
          dateKey = "今天";
        } else if (isSameDay(date, yesterday)) {
          dateKey = "昨天";
        } else if (date.getFullYear() === today.getFullYear()) {
          dateKey = `${date.getMonth() + 1}月${date.getDate()}日`;
        } else {
          dateKey = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
        }
        if (!grouped[dateKey]) {
          grouped[dateKey] = [];
        }
        grouped[dateKey].push(message);
      });
      Object.keys(grouped).forEach((dateKey) => {
        grouped[dateKey].sort((a, b) => {
          const timeA = new Date(a.created_at || a.send_time || a.updated_at);
          const timeB = new Date(b.created_at || b.send_time || b.updated_at);
          return timeB - timeA;
        });
      });
      return grouped;
    });
    const isSameDay = (date1, date2) => {
      return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
    };
    const loadInitialMessages = async () => {
      try {
        const params = {
          message_type: "EVENT",
          event_id: groupId.value,
          page: 1,
          page_size: 20
        };
        await MesStore.getMessageList(params);
        if (MesStore.MessageList.length > 0) {
          setTimeout(() => {
            scrollToTop();
          }, 100);
        }
      } catch (error) {
        console.error("加载消息失败:", error);
        common_vendor.index.showToast({
          title: "加载消息失败",
          icon: "error",
          duration: 2e3
        });
      }
    };
    const onRefresherRefresh = async () => {
      console.log("开始下拉刷新");
      refresherTriggered.value = true;
      refresherText.value = "正在刷新...";
      try {
        const params = {
          message_type: "EVENT",
          event_id: groupId.value,
          page: 1,
          page_size: 20
        };
        await MesStore.getMessageList(params);
        common_vendor.index.showToast({
          title: "刷新成功",
          icon: "success",
          duration: 1500
        });
        setTimeout(() => {
          scrollToTop();
        }, 100);
      } catch (error) {
        console.error("刷新失败:", error);
        common_vendor.index.showToast({
          title: "刷新失败",
          icon: "error",
          duration: 2e3
        });
      } finally {
        setTimeout(() => {
          refresherTriggered.value = false;
          refresherText.value = "下拉刷新";
        }, 500);
      }
    };
    const onRefresherRestore = () => {
      console.log("刷新恢复");
      refresherText.value = "下拉刷新";
    };
    const onScrollToLower = () => {
      if (loadMoreTimer.value) {
        clearTimeout(loadMoreTimer.value);
      }
      if (!MesStore.hasMoreData || MesStore.loadingMore || MesStore.loading) {
        return;
      }
      loadMoreTimer.value = setTimeout(async () => {
        try {
          const params = {
            message_type: "EVENT",
            event_id: groupId.value,
            page_size: 20
          };
          const result = await MesStore.loadMoreMessages(params);
          if (result && result.success && result.data && result.data.length === 0) {
            common_vendor.index.showToast({
              title: "没有更多数据",
              icon: "none",
              duration: 1500
            });
          }
        } catch (error) {
          console.error("加载更多失败:", error);
        }
      }, 300);
    };
    const handleRetry = async () => {
      await loadInitialMessages();
    };
    const scrollToTop = () => {
      common_vendor.nextTick$1(() => {
        try {
          if (MesStore.MessageList && MesStore.MessageList.length > 0) {
            scrollIntoView.value = `msg-${MesStore.MessageList[0].id}`;
            setTimeout(() => {
              common_vendor.index.pageScrollTo({
                scrollTop: 0,
                duration: 300
              });
            }, 100);
          }
        } catch (error) {
          console.error("滚动到顶部失败:", error);
        }
      });
    };
    const goBack = () => {
      if (loadMoreTimer.value) {
        clearTimeout(loadMoreTimer.value);
      }
      common_vendor.index.navigateBack();
    };
    const handleMessageClick = (message) => {
      try {
        common_vendor.index.navigateTo({
          url: `/pages/detail/GroupMesDetail?id=${message.id}&title=${encodeURIComponent(message.title || "管理员通知")}`
        });
      } catch (error) {
        console.error("跳转详情页失败:", error);
        common_vendor.index.showToast({
          title: "跳转失败",
          icon: "error"
        });
      }
    };
    const handleActionClick = async (action, message) => {
      try {
        switch (action.type) {
          case "primary":
            if (action.url) {
              common_vendor.index.navigateTo({
                url: `${action.url}?id=${message.id}`
              });
            }
            break;
          case "secondary":
            if (action.id === "mark_read") {
              await markAsRead(message);
            }
            break;
          default:
            common_vendor.index.showToast({
              title: "操作成功",
              icon: "success"
            });
        }
      } catch (error) {
        console.error("操作失败:", error);
        common_vendor.index.showToast({
          title: "操作失败",
          icon: "error"
        });
      }
    };
    const handleMarkRead = async (message) => {
      await markAsRead(message);
    };
    const markAsRead = async (message) => {
      try {
        if (message.message_type === "SYSTEM") {
          await MesStore.markSystemMessageAsRead(message.id);
        } else {
          await MesStore.markGroupMessageAsRead(message.id);
        }
        common_vendor.index.showToast({
          title: "已标记为已读",
          icon: "success",
          duration: 1500
        });
      } catch (error) {
        console.error("标记已读失败:", error);
        common_vendor.index.showToast({
          title: "操作失败",
          icon: "error"
        });
      }
    };
    common_vendor.onUnmounted(() => {
      if (loadMoreTimer.value) {
        clearTimeout(loadMoreTimer.value);
      }
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: statusBarHeight.value + "px",
        b: common_vendor.o(goBack),
        c: common_vendor.t(groupName.value),
        d: common_vendor.f(groupedMessages.value, (group, dateKey, i0) => {
          return common_vendor.e(Object.keys(groupedMessages.value).length > 1 ? {
            a: common_vendor.t(dateKey)
          } : {}, {
            b: common_vendor.f(group, (message, k1, i1) => {
              return {
                a: message.id,
                b: common_vendor.o(handleMessageClick, message.id),
                c: common_vendor.o(handleActionClick, message.id),
                d: common_vendor.o(handleMarkRead, message.id),
                e: "6f6e3c6b-0-" + i0 + "-" + i1,
                f: common_vendor.p({
                  message
                })
              };
            }),
            c: dateKey
          });
        }),
        e: Object.keys(groupedMessages.value).length > 1,
        f: common_vendor.unref(MesStore).loadingMore
      }, common_vendor.unref(MesStore).loadingMore ? {} : {}, {
        g: !common_vendor.unref(MesStore).hasMoreData && common_vendor.unref(MesStore).MessageList.length > 0
      }, !common_vendor.unref(MesStore).hasMoreData && common_vendor.unref(MesStore).MessageList.length > 0 ? {} : {}, {
        h: common_vendor.unref(MesStore).MessageList.length === 0 && !common_vendor.unref(MesStore).loading
      }, common_vendor.unref(MesStore).MessageList.length === 0 && !common_vendor.unref(MesStore).loading ? {} : {}, {
        i: statusBarHeight.value + 8 + "px",
        j: scrollIntoView.value,
        k: common_vendor.o(onScrollToLower),
        l: refresherTriggered.value,
        m: common_vendor.o(onRefresherRefresh),
        n: common_vendor.o(onRefresherRestore),
        o: common_vendor.unref(MesStore).loading && common_vendor.unref(MesStore).MessageList.length === 0
      }, common_vendor.unref(MesStore).loading && common_vendor.unref(MesStore).MessageList.length === 0 ? {} : {}, {
        p: common_vendor.unref(MesStore).error && !common_vendor.unref(MesStore).loading
      }, common_vendor.unref(MesStore).error && !common_vendor.unref(MesStore).loading ? {
        q: common_vendor.t(common_vendor.unref(MesStore).error),
        r: common_vendor.o(handleRetry)
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-6f6e3c6b"]]);
wx.createPage(MiniProgramPage);
