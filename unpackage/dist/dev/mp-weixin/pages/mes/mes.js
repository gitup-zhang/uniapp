"use strict";
const common_vendor = require("../../common/vendor.js");
const store_Info = require("../../store/Info.js");
const store_mes = require("../../store/mes.js");
if (!Math) {
  MessageCard();
}
const MessageCard = () => "../../components/MessageCard/MessageCard.js";
const _sfc_main = {
  __name: "mes",
  setup(__props) {
    const userStore = store_Info.useInfoStore();
    const mesStore = store_mes.useMesstore();
    const statusBarHeight = common_vendor.ref(0);
    const activeTab = common_vendor.ref("all");
    const isLoading = common_vendor.ref(false);
    const isRefreshing = common_vendor.ref(false);
    const isLoggedIn = common_vendor.computed(() => userStore.signal);
    const formatTime = (dateStr) => {
      if (!dateStr)
        return "";
      try {
        let date;
        if (typeof dateStr === "string") {
          date = new Date(dateStr);
        } else if (dateStr instanceof Date) {
          date = dateStr;
        } else {
          return String(dateStr);
        }
        if (isNaN(date.getTime())) {
          console.warn("无效的日期格式:", dateStr);
          return String(dateStr);
        }
        const now = /* @__PURE__ */ new Date();
        const diff = now - date;
        if (diff < 60 * 1e3) {
          return "刚刚";
        }
        if (diff < 60 * 60 * 1e3) {
          return `${Math.floor(diff / (60 * 1e3))}分钟前`;
        }
        if (diff < 24 * 60 * 60 * 1e3) {
          return `${Math.floor(diff / (60 * 60 * 1e3))}小时前`;
        }
        if (diff < 7 * 24 * 60 * 60 * 1e3) {
          return `${Math.floor(diff / (24 * 60 * 60 * 1e3))}天前`;
        }
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        if (date.getFullYear() === now.getFullYear()) {
          return `${month}-${day} ${hours}:${minutes}`;
        } else {
          return `${date.getFullYear()}-${month}-${day} ${hours}:${minutes}`;
        }
      } catch (error) {
        console.error("时间格式化错误:", error, "原始时间:", dateStr);
        return String(dateStr);
      }
    };
    const formatSystemMessages = (messages) => {
      if (!Array.isArray(messages))
        return [];
      return messages.map((msg) => {
        if (msg.group_name && msg.latest_content && msg.latest_time) {
          return {
            id: msg.id,
            group_name: msg.group_name,
            unread_count: msg.unread_count || 0,
            latest_content: msg.latest_content,
            latest_time: formatTime(msg.latest_time),
            raw_time: msg.latest_time,
            type: "system",
            original_data: msg
          };
        }
        return {
          id: msg.id,
          group_name: msg.title || msg.group_name || "系统通知",
          unread_count: msg.unread_count || (msg.is_read === 0 ? 1 : 0),
          latest_content: msg.content || msg.message || msg.latest_content || "",
          latest_time: formatTime(msg.latest_time || msg.created_at || msg.time),
          raw_time: msg.latest_time || msg.created_at || msg.time,
          type: "system",
          original_data: msg
        };
      });
    };
    const formatGroupMessages = (messages) => {
      if (!Array.isArray(messages))
        return [];
      return messages.map((msg) => {
        if (msg.group_name && msg.latest_content && msg.latest_time) {
          return {
            id: msg.id,
            group_name: msg.group_name,
            unread_count: msg.unread_count || 0,
            latest_content: msg.latest_content,
            latest_time: formatTime(msg.latest_time),
            raw_time: msg.latest_time,
            type: "group",
            original_data: msg
          };
        }
        return {
          id: msg.id,
          group_name: msg.group_name || msg.event_name || msg.title || "群组消息",
          unread_count: msg.unread_count || (msg.is_read === 0 ? 1 : 0),
          latest_content: msg.latest_message || msg.content || msg.description || msg.latest_content || "",
          latest_time: formatTime(msg.latest_time || msg.last_message_time || msg.updated_at || msg.created_at),
          raw_time: msg.latest_time || msg.last_message_time || msg.updated_at || msg.created_at,
          type: "group",
          original_data: msg
        };
      });
    };
    const formattedMessages = common_vendor.computed(() => {
      console.log("原始系统消息数据:", mesStore.systemmes);
      console.log("原始群组消息数据:", mesStore.groupmes);
      const systemMessages = formatSystemMessages(mesStore.systemmes || []);
      const groupMessages = formatGroupMessages(mesStore.groupmes || []);
      console.log("格式化后的系统消息:", systemMessages);
      console.log("格式化后的群组消息:", groupMessages);
      const allMessages = [...systemMessages, ...groupMessages];
      console.log("所有消息:", allMessages);
      return allMessages;
    });
    const filteredMessages = common_vendor.computed(() => {
      if (!isLoggedIn.value || isLoading.value)
        return [];
      let filtered = [];
      if (activeTab.value === "all") {
        filtered = formattedMessages.value;
      } else {
        filtered = formattedMessages.value.filter((msg) => msg.type === activeTab.value);
      }
      return filtered.sort((a, b) => {
        if (a.unread_count > 0 && b.unread_count === 0)
          return -1;
        if (a.unread_count === 0 && b.unread_count > 0)
          return 1;
        const timeA = new Date(a.raw_time || a.latest_time);
        const timeB = new Date(b.raw_time || b.latest_time);
        return timeB - timeA;
      });
    });
    const unreadCount = common_vendor.computed(() => {
      if (!isLoggedIn.value)
        return 0;
      return formattedMessages.value.reduce((sum, msg) => sum + msg.unread_count, 0);
    });
    const systemUnreadCount = common_vendor.computed(() => {
      if (!isLoggedIn.value)
        return 0;
      return formattedMessages.value.filter((msg) => msg.type === "system").reduce((sum, msg) => sum + msg.unread_count, 0);
    });
    const groupUnreadCount = common_vendor.computed(() => {
      if (!isLoggedIn.value)
        return 0;
      return formattedMessages.value.filter((msg) => msg.type === "group").reduce((sum, msg) => sum + msg.unread_count, 0);
    });
    common_vendor.onMounted(async () => {
      const sysInfo = common_vendor.index.getSystemInfoSync();
      statusBarHeight.value = sysInfo.statusBarHeight;
    });
    common_vendor.onShow(async () => {
      if (!isLoggedIn.value)
        return;
      await loadUserMessages();
    });
    common_vendor.onLoad(async () => {
      if (isLoggedIn.value) {
        await loadUserMessages();
      }
    });
    common_vendor.onPullDownRefresh(async () => {
      if (!isLoggedIn.value) {
        common_vendor.index.stopPullDownRefresh();
        return;
      }
      isRefreshing.value = true;
      try {
        await loadUserMessages(true);
        common_vendor.index.showToast({
          title: "刷新成功",
          icon: "success",
          duration: 1500
        });
      } catch (error) {
        console.error("刷新失败:", error);
        common_vendor.index.showToast({
          title: "刷新失败",
          icon: "error",
          duration: 1500
        });
      } finally {
        isRefreshing.value = false;
        common_vendor.index.stopPullDownRefresh();
      }
    });
    common_vendor.watch(isLoggedIn, async (newVal) => {
      if (newVal) {
        console.log("用户已登录，加载消息数据");
        await loadUserMessages();
      } else {
        console.log("用户已登出，清空消息数据");
      }
    });
    const goToLogin = () => {
      common_vendor.index.switchTab({
        url: "../mymessage/mymessage"
      });
    };
    const loadUserMessages = async (isRefresh = false) => {
      if (isRefresh) {
        isRefreshing.value = true;
      } else {
        isLoading.value = true;
      }
      try {
        console.log("开始加载用户消息数据...");
        await mesStore.getsystem();
        console.log("消息数据加载完成");
        await common_vendor.nextTick$1();
      } catch (error) {
        console.error("加载消息失败:", error);
        common_vendor.index.showToast({
          title: "加载消息失败",
          icon: "error",
          duration: 2e3
        });
      } finally {
        isLoading.value = false;
        isRefreshing.value = false;
      }
    };
    const loadMoreMessages = async () => {
      if (isLoading.value || isRefreshing.value)
        return;
      console.log("触发加载更多消息");
    };
    const switchTab = (tab) => {
      if (activeTab.value === tab)
        return;
      activeTab.value = tab;
      console.log("切换到标签页:", tab);
    };
    const handleMessageTap = (msg) => {
      if (!isLoggedIn.value)
        return;
      console.log("点击消息:", msg);
      if (msg.type === "system") {
        common_vendor.index.navigateTo({
          url: `/pages/system-message/index?id=${msg.id}&groupName=${encodeURIComponent(msg.group_name)}`
        });
      } else {
        common_vendor.index.navigateTo({
          url: `/pages/group-chat/index?id=${msg.id}&groupName=${encodeURIComponent(msg.group_name)}`
        });
      }
      if (msg.unread_count > 0) {
        markMessageAsRead(msg);
      }
    };
    const markMessageAsRead = async (msg) => {
      try {
        const messages = msg.type === "system" ? mesStore.systemmes : mesStore.groupmes;
        const index = messages.findIndex((m) => m.id === msg.id);
        if (index !== -1) {
          messages[index].is_read = 1;
          if (messages[index].unread_count) {
            messages[index].unread_count = 0;
          }
        }
        console.log("消息已标记为已读:", msg.group_name);
      } catch (error) {
        console.error("标记消息已读失败:", error);
      }
    };
    const getEmptyTitle = () => {
      const titles = {
        all: "暂无消息",
        system: "暂无系统消息",
        group: "暂无群组消息"
      };
      return titles[activeTab.value];
    };
    const getEmptyDesc = () => {
      const descs = {
        all: "目前还没有任何消息",
        system: "暂时没有系统通知",
        group: "您还未加入任何群组"
      };
      return descs[activeTab.value];
    };
    const markAllAsRead = async () => {
      if (!isLoggedIn.value)
        return;
      const currentMessages = activeTab.value === "all" ? formattedMessages.value : formattedMessages.value.filter((msg) => msg.type === activeTab.value);
      const totalUnread = currentMessages.reduce((sum, msg) => sum + msg.unread_count, 0);
      if (totalUnread === 0) {
        common_vendor.index.showToast({
          title: "已经没有未读消息了",
          icon: "none",
          duration: 1500
        });
        return;
      }
      try {
        const res = await new Promise((resolve) => {
          common_vendor.index.showModal({
            title: "确认操作",
            content: `确定要将${totalUnread}条未读消息标记为已读吗？`,
            success: resolve
          });
        });
        if (!res.confirm)
          return;
        currentMessages.forEach((msg) => {
          if (msg.unread_count > 0) {
            if (msg.type === "system") {
              const index = mesStore.systemmes.findIndex((m) => m.id === msg.id);
              if (index !== -1) {
                mesStore.systemmes[index].is_read = 1;
              }
            } else {
              const index = mesStore.groupmes.findIndex((m) => m.id === msg.id);
              if (index !== -1) {
                mesStore.groupmes[index].is_read = 1;
                if (mesStore.groupmes[index].unread_count) {
                  mesStore.groupmes[index].unread_count = 0;
                }
              }
            }
          }
        });
        common_vendor.index.showToast({
          title: `已标记${totalUnread}条消息为已读`,
          icon: "success",
          duration: 2e3
        });
      } catch (error) {
        console.error("批量标记已读失败:", error);
        common_vendor.index.showToast({
          title: "操作失败，请稍后重试",
          icon: "error",
          duration: 2e3
        });
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: !isLoggedIn.value
      }, !isLoggedIn.value ? {
        b: common_vendor.o(goToLogin)
      } : common_vendor.e({
        c: statusBarHeight.value + "px",
        d: unreadCount.value > 0
      }, unreadCount.value > 0 ? {
        e: common_vendor.t(unreadCount.value > 99 ? "99+" : unreadCount.value)
      } : {}, {
        f: activeTab.value === "all" ? 1 : "",
        g: common_vendor.o(($event) => switchTab("all")),
        h: systemUnreadCount.value > 0
      }, systemUnreadCount.value > 0 ? {
        i: common_vendor.t(systemUnreadCount.value)
      } : {}, {
        j: activeTab.value === "system" ? 1 : "",
        k: common_vendor.o(($event) => switchTab("system")),
        l: groupUnreadCount.value > 0
      }, groupUnreadCount.value > 0 ? {
        m: common_vendor.t(groupUnreadCount.value)
      } : {}, {
        n: activeTab.value === "group" ? 1 : "",
        o: common_vendor.o(($event) => switchTab("group")),
        p: unreadCount.value > 0
      }, unreadCount.value > 0 ? {
        q: common_vendor.o(markAllAsRead)
      } : {}, {
        r: statusBarHeight.value + 44 + "px",
        s: isLoading.value
      }, isLoading.value ? {} : {}, {
        t: common_vendor.f(filteredMessages.value, (msg, k0, i0) => {
          return {
            a: `msg-${msg.group_name || msg.title || msg.id}`,
            b: common_vendor.o(handleMessageTap, `msg-${msg.group_name || msg.title || msg.id}`),
            c: "bb2249ad-0-" + i0,
            d: common_vendor.p({
              message: msg
            })
          };
        }),
        v: !isLoading.value && filteredMessages.value.length === 0
      }, !isLoading.value && filteredMessages.value.length === 0 ? {
        w: common_vendor.t(getEmptyTitle()),
        x: common_vendor.t(getEmptyDesc())
      } : {}, {
        y: statusBarHeight.value + 44 + 68 + "px",
        z: common_vendor.o(loadMoreMessages)
      }));
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-bb2249ad"]]);
wx.createPage(MiniProgramPage);
