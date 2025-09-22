"use strict";
const common_vendor = require("../common/vendor.js");
const newApis_mes = require("../new-apis/mes.js");
const useMesstore = common_vendor.defineStore("mes", () => {
  const systemmes = common_vendor.ref([]);
  const groupmes = common_vendor.ref([]);
  const loading = common_vendor.ref(false);
  const refreshing = common_vendor.ref(false);
  const loadingMore = common_vendor.ref(false);
  const error = common_vendor.ref(null);
  const MessageList = common_vendor.ref([]);
  const MseList = common_vendor.ref({
    total: 0,
    page: 1,
    page_size: 10,
    has_more: false
  });
  const lastUpdateTime = common_vendor.ref(null);
  const currentLoadParams = common_vendor.ref(null);
  const isMessageUnread = (msg) => {
    if (msg.has_unread !== void 0) {
      return msg.has_unread === "Y" || msg.has_unread === true;
    }
    if (msg.unread_count !== void 0) {
      return msg.unread_count > 0;
    }
    if (msg.is_read !== void 0) {
      return msg.is_read === 0 || msg.is_read === false;
    }
    return false;
  };
  const totalUnreadCount = common_vendor.computed(() => {
    const systemUnread = systemmes.value.filter((msg) => isMessageUnread(msg)).length;
    const groupUnread = groupmes.value.filter((msg) => isMessageUnread(msg)).length;
    return systemUnread + groupUnread;
  });
  const systemUnreadCount = common_vendor.computed(() => {
    const count = systemmes.value.filter((msg) => isMessageUnread(msg)).length;
    console.log("系统消息未读数量", count);
    return count;
  });
  const groupUnreadCount = common_vendor.computed(() => {
    const count = groupmes.value.filter((msg) => isMessageUnread(msg)).length;
    console.log("群组消息未读数量：", count);
    return count;
  });
  const hasMoreData = common_vendor.computed(() => {
    if (!MseList.value.total)
      return false;
    const totalPages = Math.ceil(MseList.value.total / MseList.value.page_size);
    return MseList.value.page < totalPages;
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
        newApis_mes.getsystemmes({ type_code: "SYSTEM" }),
        newApis_mes.getsystemmes({ type_code: "GROUP" })
      ]);
      if (systemRes && systemRes.data) {
        systemmes.value = Array.isArray(systemRes.data) ? systemRes.data : [];
        console.log("系统消息加载成功:", systemmes.value.length, "条");
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
  const getMessageList = async (id, params) => {
    const { message_type, page = 1, page_size = 10, isRefresh = false, isLoadMore = false, ...otherParams } = params || {};
    try {
      if (isRefresh) {
        refreshing.value = true;
      } else if (isLoadMore) {
        loadingMore.value = true;
      } else {
        loading.value = true;
      }
      error.value = null;
      console.log("加载消息列表参数:", { message_type, page, page_size, isRefresh, isLoadMore, ...otherParams });
      const requestParams = {
        message_type,
        page,
        page_size,
        ...otherParams
      };
      if (!isLoadMore) {
        currentLoadParams.value = { message_type, page_size, ...otherParams };
      }
      const res = await newApis_mes.getmesgroup(id, requestParams);
      if (!res || !res.data) {
        throw new Error("消息数据格式错误");
      }
      const newMessages = Array.isArray(res.data) ? res.data.map((msg) => ({
        ...msg,
        expanded: false
      })) : [];
      MseList.value = {
        page: res.page || page,
        total: res.total || 0,
        page_size: res.page_size || page_size,
        has_more: hasMoreData.value
      };
      if (isRefresh || page === 1) {
        MessageList.value = newMessages;
        console.log("刷新消息列表完成，共", newMessages.length, "条消息");
      } else if (isLoadMore) {
        const existingIds = new Set(MessageList.value.map((msg) => msg.id));
        const uniqueNewMessages = newMessages.filter((msg) => !existingIds.has(msg.id));
        MessageList.value = [...MessageList.value, ...uniqueNewMessages];
        console.log("加载更多消息完成，新增", uniqueNewMessages.length, "条消息，总共", MessageList.value.length, "条");
      } else {
        MessageList.value = newMessages;
      }
      lastUpdateTime.value = (/* @__PURE__ */ new Date()).toISOString();
      console.log("获得的消息数据", MessageList.value);
      console.log("获取到的信息结构体", MseList.value);
      return {
        success: true,
        data: newMessages,
        page: res.page,
        total: res.total,
        page_size: res.page_size,
        has_more: hasMoreData.value
      };
    } catch (err) {
      console.error("获取消息列表失败:", err);
      error.value = err.message || "获取消息列表失败";
      throw err;
    } finally {
      loading.value = false;
      refreshing.value = false;
      loadingMore.value = false;
    }
  };
  const loadMoreMessages = async (params) => {
    const { message_type, page_size = 10, ...otherParams } = params || {};
    if (!hasMoreData.value || loadingMore.value) {
      console.log("没有更多数据或正在加载中");
      return { success: false, message: "没有更多数据" };
    }
    const nextPage = MseList.value.page + 1;
    const mergedParams = {
      ...currentLoadParams.value,
      ...params,
      page: nextPage,
      page_size,
      isLoadMore: true
    };
    return await getMessageList(mergedParams);
  };
  const refreshMessageList = async (params) => {
    const { message_type, page_size = 10, ...otherParams } = params || {};
    MseList.value.page = 1;
    const mergedParams = {
      message_type,
      page: 1,
      page_size,
      isRefresh: true,
      ...otherParams
    };
    return await getMessageList(mergedParams);
  };
  const clearMessageList = () => {
    MessageList.value = [];
    MseList.value = {
      total: 0,
      page: 1,
      page_size: 10,
      has_more: false
    };
    currentLoadParams.value = null;
    loading.value = false;
    refreshing.value = false;
    loadingMore.value = false;
    error.value = null;
  };
  const toggleMessageExpanded = (messageId) => {
    const messageIndex = MessageList.value.findIndex((msg) => msg.id === messageId);
    if (messageIndex !== -1) {
      MessageList.value[messageIndex].expanded = !MessageList.value[messageIndex].expanded;
      return MessageList.value[messageIndex].expanded;
    }
    return false;
  };
  const toggleMultipleExpanded = (messageIds, expanded) => {
    const updatedMessages = [];
    messageIds.forEach((id) => {
      const messageIndex = MessageList.value.findIndex((msg) => msg.id === id);
      if (messageIndex !== -1) {
        MessageList.value[messageIndex].expanded = expanded;
        updatedMessages.push(MessageList.value[messageIndex]);
      }
    });
    return updatedMessages;
  };
  const markSystemMessageAsRead = async (messageId) => {
    try {
      const systemMessageIndex = systemmes.value.findIndex((msg) => msg.id === messageId);
      if (systemMessageIndex !== -1) {
        systemmes.value[systemMessageIndex].is_read = 1;
        systemmes.value[systemMessageIndex].has_unread = "N";
        if (systemmes.value[systemMessageIndex].unread_count !== void 0) {
          systemmes.value[systemMessageIndex].unread_count = 0;
        }
      }
      const messageIndex = MessageList.value.findIndex((msg) => msg.id === messageId);
      if (messageIndex !== -1) {
        MessageList.value[messageIndex].is_read = 1;
        MessageList.value[messageIndex].has_unread = "N";
        if (MessageList.value[messageIndex].unread_count !== void 0) {
          MessageList.value[messageIndex].unread_count = 0;
        }
      }
      console.log("系统消息已标记为已读:", messageId);
      return true;
    } catch (error2) {
      console.error("标记系统消息已读失败:", error2);
      throw error2;
    }
  };
  const markGroupMessageAsRead = async (messageId) => {
    try {
      const groupMessageIndex = groupmes.value.findIndex((msg) => msg.id === messageId);
      if (groupMessageIndex !== -1) {
        groupmes.value[groupMessageIndex].is_read = 1;
        groupmes.value[groupMessageIndex].has_unread = "N";
        if (groupmes.value[groupMessageIndex].unread_count !== void 0) {
          groupmes.value[groupMessageIndex].unread_count = 0;
        }
      }
      const messageIndex = MessageList.value.findIndex((msg) => msg.id === messageId);
      if (messageIndex !== -1) {
        MessageList.value[messageIndex].is_read = 1;
        MessageList.value[messageIndex].has_unread = "N";
        if (MessageList.value[messageIndex].unread_count !== void 0) {
          MessageList.value[messageIndex].unread_count = 0;
        }
      }
      console.log("群组消息已标记为已读:", messageId);
      return true;
    } catch (error2) {
      console.error("标记群组消息已读失败:", error2);
      throw error2;
    }
  };
  const markMultipleAsRead = async (messageIds, messageType = "all") => {
    try {
      const results = [];
      if (messageType === "all" || messageType === "system") {
        const systemIds = messageIds.filter((id) => {
          const msg = systemmes.value.find((msg2) => msg2.id === id);
          return msg && isMessageUnread(msg);
        });
        for (const id of systemIds) {
          try {
            const result = await markSystemMessageAsRead(id);
            results.push({ id, type: "system", success: result });
          } catch (error2) {
            results.push({ id, type: "system", success: false, error: error2 });
          }
        }
      }
      if (messageType === "all" || messageType === "group") {
        const groupIds = messageIds.filter((id) => {
          const msg = groupmes.value.find((msg2) => msg2.id === id);
          return msg && isMessageUnread(msg);
        });
        for (const id of groupIds) {
          try {
            const result = await markGroupMessageAsRead(id);
            results.push({ id, type: "group", success: result });
          } catch (error2) {
            results.push({ id, type: "group", success: false, error: error2 });
          }
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
  const getMessageById = (messageId) => {
    return MessageList.value.find((msg) => msg.id === messageId);
  };
  const getLatestUnreadMessages = (limit = 5) => {
    const unreadSystemMessages = systemmes.value.filter((msg) => isMessageUnread(msg)).map((msg) => ({ ...msg, type: "system" }));
    const unreadGroupMessages = groupmes.value.filter((msg) => isMessageUnread(msg)).map((msg) => ({ ...msg, type: "group" }));
    const allUnread = [...unreadSystemMessages, ...unreadGroupMessages].sort((a, b) => {
      const timeA = new Date(a.created_at || a.updated_at || a.latest_time || a.send_time || 0);
      const timeB = new Date(b.created_at || b.updated_at || b.latest_time || b.send_time || 0);
      return timeB - timeA;
    });
    return allUnread.slice(0, limit);
  };
  const clearAllMessages = () => {
    systemmes.value = [];
    groupmes.value = [];
    MessageList.value = [];
    MseList.value = {
      total: 0,
      page: 1,
      page_size: 10,
      has_more: false
    };
    currentLoadParams.value = null;
    error.value = null;
    lastUpdateTime.value = null;
    loading.value = false;
    refreshing.value = false;
    loadingMore.value = false;
    console.log("所有消息数据已清空");
  };
  const addSystemMessage = (message) => {
    if (message && typeof message === "object") {
      const existingIndex = systemmes.value.findIndex((msg) => msg.id === message.id);
      if (existingIndex !== -1) {
        systemmes.value[existingIndex] = { ...systemmes.value[existingIndex], ...message };
      } else {
        systemmes.value.unshift(message);
      }
      if (MessageList.value.length > 0 && MessageList.value[0].message_type === "SYSTEM") {
        const messageListIndex = MessageList.value.findIndex((msg) => msg.id === message.id);
        if (messageListIndex !== -1) {
          MessageList.value[messageListIndex] = {
            ...MessageList.value[messageListIndex],
            ...message,
            expanded: MessageList.value[messageListIndex].expanded
          };
        } else {
          MessageList.value.unshift({
            ...message,
            expanded: false
          });
          MseList.value.total += 1;
        }
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
      if (MessageList.value.length > 0 && MessageList.value[0].message_type === "GROUP") {
        const messageListIndex = MessageList.value.findIndex((msg) => msg.id === message.id);
        if (messageListIndex !== -1) {
          MessageList.value[messageListIndex] = {
            ...MessageList.value[messageListIndex],
            ...message,
            expanded: MessageList.value[messageListIndex].expanded
          };
        } else {
          MessageList.value.unshift({
            ...message,
            expanded: false
          });
          MseList.value.total += 1;
        }
      }
      console.log("新增/更新群组消息:", message.group_name || message.id);
    }
  };
  const updateMessageUnreadStatus = (messageId, messageType, hasUnread) => {
    const unreadValue = hasUnread ? "Y" : "N";
    const isReadValue = hasUnread ? 0 : 1;
    if (messageType === "system") {
      const messageIndex = systemmes.value.findIndex((msg) => msg.id === messageId);
      if (messageIndex !== -1) {
        systemmes.value[messageIndex].has_unread = unreadValue;
        systemmes.value[messageIndex].is_read = isReadValue;
        if (systemmes.value[messageIndex].unread_count !== void 0) {
          systemmes.value[messageIndex].unread_count = hasUnread ? 1 : 0;
        }
      }
    } else if (messageType === "group") {
      const messageIndex = groupmes.value.findIndex((msg) => msg.id === messageId);
      if (messageIndex !== -1) {
        groupmes.value[messageIndex].has_unread = unreadValue;
        groupmes.value[messageIndex].is_read = isReadValue;
        if (groupmes.value[messageIndex].unread_count !== void 0) {
          groupmes.value[messageIndex].unread_count = hasUnread ? 1 : 0;
        }
      }
    }
    const listMessageIndex = MessageList.value.findIndex((msg) => msg.id === messageId);
    if (listMessageIndex !== -1) {
      MessageList.value[listMessageIndex].has_unread = unreadValue;
      MessageList.value[listMessageIndex].is_read = isReadValue;
      if (MessageList.value[listMessageIndex].unread_count !== void 0) {
        MessageList.value[listMessageIndex].unread_count = hasUnread ? 1 : 0;
      }
    }
  };
  const updateMessageUnreadCount = (messageId, messageType, unreadCount) => {
    updateMessageUnreadStatus(messageId, messageType, unreadCount > 0);
  };
  const hasNewMessages = common_vendor.computed(() => {
    return totalUnreadCount.value > 0;
  });
  const getDataStatus = () => {
    return {
      loading: loading.value,
      refreshing: refreshing.value,
      loadingMore: loadingMore.value,
      error: error.value,
      lastUpdateTime: lastUpdateTime.value,
      systemMessageCount: systemmes.value.length,
      groupMessageCount: groupmes.value.length,
      messageListCount: MessageList.value.length,
      totalUnreadCount: totalUnreadCount.value,
      systemUnreadCount: systemUnreadCount.value,
      groupUnreadCount: groupUnreadCount.value,
      hasData: systemmes.value.length > 0 || groupmes.value.length > 0,
      hasMoreData: hasMoreData.value,
      pagination: MseList.value,
      currentLoadParams: currentLoadParams.value
    };
  };
  const searchMessages = (keyword, messageType = "all") => {
    if (!keyword)
      return [];
    const searchIn = (messages) => {
      return messages.filter(
        (msg) => msg.title && msg.title.includes(keyword) || msg.content && msg.content.includes(keyword) || msg.group_name && msg.group_name.includes(keyword) || msg.sender_name && msg.sender_name.includes(keyword)
      );
    };
    let results = [];
    if (messageType === "all" || messageType === "system") {
      results.push(...searchIn(systemmes.value).map((msg) => ({ ...msg, type: "system" })));
    }
    if (messageType === "all" || messageType === "group") {
      results.push(...searchIn(groupmes.value).map((msg) => ({ ...msg, type: "group" })));
    }
    if (messageType === "current") {
      results.push(...searchIn(MessageList.value).map((msg) => ({ ...msg, type: "current" })));
    }
    return results.sort((a, b) => {
      const timeA = new Date(a.created_at || a.updated_at || a.latest_time || a.send_time || 0);
      const timeB = new Date(b.created_at || b.updated_at || b.latest_time || b.send_time || 0);
      return timeB - timeA;
    });
  };
  const resetLoadingStates = () => {
    loading.value = false;
    refreshing.value = false;
    loadingMore.value = false;
    error.value = null;
  };
  const validateDataConsistency = () => {
    const issues = [];
    if (MseList.value.page < 1) {
      issues.push("页码不能小于1");
    }
    if (MseList.value.page_size < 1) {
      issues.push("页面大小不能小于1");
    }
    if (MseList.value.total < 0) {
      issues.push("总数不能为负数");
    }
    const duplicateIds = MessageList.value.map((msg) => msg.id).filter((id, index, arr) => arr.indexOf(id) !== index);
    if (duplicateIds.length > 0) {
      issues.push(`发现重复的消息ID: ${duplicateIds.join(", ")}`);
    }
    return {
      isValid: issues.length === 0,
      issues
    };
  };
  return {
    // 状态数据
    systemmes,
    groupmes,
    loading,
    refreshing,
    loadingMore,
    error,
    lastUpdateTime,
    MessageList,
    MseList,
    currentLoadParams,
    // 计算属性
    totalUnreadCount,
    systemUnreadCount,
    groupUnreadCount,
    hasNewMessages,
    hasMoreData,
    // 工具函数
    isMessageUnread,
    // 方法
    getsystem,
    refreshMessages,
    getMessageList,
    loadMoreMessages,
    refreshMessageList,
    clearMessageList,
    toggleMessageExpanded,
    toggleMultipleExpanded,
    markSystemMessageAsRead,
    markGroupMessageAsRead,
    markMultipleAsRead,
    getSystemMessageById,
    getGroupMessageById,
    getMessageById,
    getLatestUnreadMessages,
    clearAllMessages,
    addSystemMessage,
    addGroupMessage,
    updateMessageUnreadStatus,
    updateMessageUnreadCount,
    // 保留兼容性
    getDataStatus,
    searchMessages,
    resetLoadingStates,
    validateDataConsistency
  };
});
exports.useMesstore = useMesstore;
