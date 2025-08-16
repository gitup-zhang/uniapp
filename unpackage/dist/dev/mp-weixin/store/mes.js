"use strict";
const common_vendor = require("../common/vendor.js");
const newApis_mes = require("../new-apis/mes.js");
const useMesstore = common_vendor.defineStore("mes", () => {
  const systemmes = common_vendor.ref([]);
  const groupmes = common_vendor.ref([]);
  const loading = common_vendor.ref(false);
  const error = common_vendor.ref(null);
  const lastUpdateTime = common_vendor.ref(null);
  const totalUnreadCount = common_vendor.computed(() => {
    const systemUnread = systemmes.value.reduce((count, msg) => {
      return count + msg.unread_count;
    }, 0);
    const groupUnread = groupmes.value.reduce((count, msg) => {
      return count + msg.unread_count;
    }, 0);
    return systemUnread + groupUnread;
  });
  const systemUnreadCount = common_vendor.computed(() => {
    return systemmes.value.reduce((count, msg) => {
      const res = count + msg.unread_count;
      console.log("数量", res);
      return res;
    }, 0);
  });
  const groupUnreadCount = common_vendor.computed(() => {
    return groupmes.value.reduce((count, msg) => {
      return count + msg.unread_count;
    }, 0);
  });
  const getsystem = async (forceRefresh = false) => {
    if (!forceRefresh && systemmes.value.length > 0 && groupmes.value.length > 0) {
      console.log("消息数据已存在，跳过加载");
      return {
        success: true,
        data: {
          systemMessages: systemmes.value,
          groupMessages: groupmes.value
        }
      };
    }
    loading.value = true;
    error.value = null;
    try {
      console.log("开始加载消息数据...");
      const [systemRes, groupRes] = await Promise.all([
        newApis_mes.getsystemmes({ type_codes: "SYSTEM" }),
        newApis_mes.geteventmes()
      ]);
      if (systemRes && systemRes.data) {
        systemmes.value = Array.isArray(systemRes.data) ? systemRes.data : [];
        console.log("系统消息加载成功:", systemmes.value.length, "条");
        console.log(systemmes.value);
      } else {
        systemmes.value = [];
        console.warn("系统消息数据格式异常");
      }
      if (groupRes && groupRes.data) {
        groupmes.value = Array.isArray(groupRes.data) ? groupRes.data : [];
        console.log("群组消息加载成功:", groupmes.value.length, "条");
      } else {
        groupmes.value = [];
        console.warn("群组消息数据格式异常");
      }
      lastUpdateTime.value = (/* @__PURE__ */ new Date()).toISOString();
      return {
        success: true,
        data: {
          systemMessages: systemmes.value,
          groupMessages: groupmes.value
        }
      };
    } catch (err) {
      console.error("加载消息失败:", err);
      error.value = err.message || "加载消息失败";
      if (err.code !== "NETWORK_ERROR") {
        systemmes.value = [];
        groupmes.value = [];
      }
      throw err;
    } finally {
      loading.value = false;
    }
  };
  const refreshMessages = async () => {
    return await getsystem(true);
  };
  const markSystemMessageAsRead = async (messageId) => {
    try {
      const messageIndex = systemmes.value.findIndex((msg) => msg.id === messageId);
      if (messageIndex !== -1) {
        systemmes.value[messageIndex].is_read = 1;
        if (systemmes.value[messageIndex].unread_count !== void 0) {
          systemmes.value[messageIndex].unread_count = 0;
        }
        console.log("系统消息已标记为已读:", messageId);
        return true;
      }
      return false;
    } catch (error2) {
      console.error("标记系统消息已读失败:", error2);
      throw error2;
    }
  };
  const markGroupMessageAsRead = async (messageId) => {
    try {
      const messageIndex = groupmes.value.findIndex((msg) => msg.id === messageId);
      if (messageIndex !== -1) {
        groupmes.value[messageIndex].is_read = 1;
        if (groupmes.value[messageIndex].unread_count) {
          groupmes.value[messageIndex].unread_count = 0;
        }
        console.log("群组消息已标记为已读:", messageId);
        return true;
      }
      return false;
    } catch (error2) {
      console.error("标记群组消息已读失败:", error2);
      throw error2;
    }
  };
  const markMultipleAsRead = async (messageIds, messageType = "all") => {
    try {
      const results = [];
      if (messageType === "all" || messageType === "system") {
        const systemIds = messageIds.filter(
          (id) => systemmes.value.some((msg) => msg.id === id && msg.is_read === 0)
        );
        for (const id of systemIds) {
          const result = await markSystemMessageAsRead(id);
          results.push({ id, type: "system", success: result });
        }
      }
      if (messageType === "all" || messageType === "group") {
        const groupIds = messageIds.filter(
          (id) => groupmes.value.some((msg) => msg.id === id && (msg.is_read === 0 || msg.unread_count > 0))
        );
        for (const id of groupIds) {
          const result = await markGroupMessageAsRead(id);
          results.push({ id, type: "group", success: result });
        }
      }
      console.log("批量标记已读完成:", results);
      return results;
    } catch (error2) {
      console.error("批量标记已读失败:", error2);
      throw error2;
    }
  };
  const getSystemMessageById = (messageId) => {
    return systemmes.value.find((msg) => msg.id === messageId);
  };
  const getGroupMessageById = (messageId) => {
    return groupmes.value.find((msg) => msg.id === messageId);
  };
  const getLatestUnreadMessages = (limit = 5) => {
    const unreadSystemMessages = systemmes.value.filter((msg) => msg.is_read === 0).map((msg) => ({ ...msg, type: "system" }));
    const unreadGroupMessages = groupmes.value.filter((msg) => msg.is_read === 0 || msg.unread_count > 0).map((msg) => ({ ...msg, type: "group" }));
    const allUnread = [...unreadSystemMessages, ...unreadGroupMessages].sort((a, b) => {
      const timeA = new Date(b.created_at || b.updated_at || b.latest_time || 0);
      const timeB = new Date(a.created_at || a.updated_at || a.latest_time || 0);
      return timeA - timeB;
    });
    return allUnread.slice(0, limit);
  };
  const clearAllMessages = () => {
    systemmes.value = [];
    groupmes.value = [];
    error.value = null;
    lastUpdateTime.value = null;
    console.log("消息数据已清空");
  };
  const addSystemMessage = (message) => {
    if (message && typeof message === "object") {
      const existingIndex = systemmes.value.findIndex((msg) => msg.id === message.id);
      if (existingIndex !== -1) {
        systemmes.value[existingIndex] = { ...systemmes.value[existingIndex], ...message };
      } else {
        systemmes.value.unshift(message);
      }
      console.log("新增/更新系统消息:", message.title || message.id);
    }
  };
  const addGroupMessage = (message) => {
    if (message && typeof message === "object") {
      const existingIndex = groupmes.value.findIndex(
        (msg) => msg.group_name === message.group_name || msg.id === message.id
      );
      if (existingIndex !== -1) {
        groupmes.value[existingIndex] = { ...groupmes.value[existingIndex], ...message };
      } else {
        groupmes.value.unshift(message);
      }
      console.log("新增/更新群组消息:", message.group_name || message.id);
    }
  };
  const updateMessageUnreadCount = (messageId, messageType, unreadCount) => {
    if (messageType === "system") {
      const messageIndex = systemmes.value.findIndex((msg) => msg.id === messageId);
      if (messageIndex !== -1) {
        systemmes.value[messageIndex].is_read = unreadCount > 0 ? 0 : 1;
        if (systemmes.value[messageIndex].unread_count !== void 0) {
          systemmes.value[messageIndex].unread_count = unreadCount;
        }
      }
    } else if (messageType === "group") {
      const messageIndex = groupmes.value.findIndex((msg) => msg.id === messageId);
      if (messageIndex !== -1) {
        groupmes.value[messageIndex].unread_count = unreadCount;
        groupmes.value[messageIndex].is_read = unreadCount > 0 ? 0 : 1;
      }
    }
  };
  const hasNewMessages = common_vendor.computed(() => {
    return totalUnreadCount.value > 0;
  });
  const getDataStatus = () => {
    return {
      loading: loading.value,
      error: error.value,
      lastUpdateTime: lastUpdateTime.value,
      systemMessageCount: systemmes.value.length,
      groupMessageCount: groupmes.value.length,
      totalUnreadCount: totalUnreadCount.value,
      systemUnreadCount: systemUnreadCount.value,
      groupUnreadCount: groupUnreadCount.value,
      hasData: systemmes.value.length > 0 || groupmes.value.length > 0
    };
  };
  return {
    // 状态数据
    systemmes,
    groupmes,
    loading,
    error,
    lastUpdateTime,
    // 计算属性
    totalUnreadCount,
    systemUnreadCount,
    groupUnreadCount,
    hasNewMessages,
    // 方法
    getsystem,
    refreshMessages,
    markSystemMessageAsRead,
    markGroupMessageAsRead,
    markMultipleAsRead,
    getSystemMessageById,
    getGroupMessageById,
    getLatestUnreadMessages,
    clearAllMessages,
    addSystemMessage,
    addGroupMessage,
    updateMessageUnreadCount,
    getDataStatus
  };
});
exports.useMesstore = useMesstore;
