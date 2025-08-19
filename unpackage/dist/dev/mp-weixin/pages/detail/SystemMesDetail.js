"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "SystemMesDetail",
  setup(__props) {
    const statusBarHeight = common_vendor.ref(0);
    const isLoading = common_vendor.ref(false);
    const messageDetail = common_vendor.ref(null);
    const messageId = common_vendor.ref("");
    const messageTitle = common_vendor.ref("");
    const isLargeText = common_vendor.computed(() => {
      var _a, _b;
      return ((_b = (_a = messageDetail.value) == null ? void 0 : _a.content) == null ? void 0 : _b.length) > 500;
    });
    common_vendor.onMounted(() => {
      const sysInfo = common_vendor.index.getSystemInfoSync();
      statusBarHeight.value = sysInfo.statusBarHeight || 0;
    });
    common_vendor.onLoad((options) => {
      messageId.value = options.id || "";
      messageTitle.value = decodeURIComponent(options.title || "");
      loadMessageDetail();
    });
    const loadMessageDetail = async () => {
      isLoading.value = true;
      try {
        await new Promise((resolve) => setTimeout(resolve, 1e3));
        messageDetail.value = {
          id: messageId.value || "msg_001",
          title: messageTitle.value || "系统维护通知",
          content: `尊敬的用户，为了给您提供更优质的服务体验，我们将于今晚23:00至次日01:00进行系统全面维护升级。本次维护涉及服务器硬件升级、数据库性能优化、安全系统更新、新功能模块部署等多个方面。

维护期间，以下功能将暂时无法使用：
• 用户登录注册
• 在线支付交易  
• 文件上传下载
• 实时消息推送
• 数据报表生成
• 第三方接口调用

为确保您的数据安全，我们强烈建议您在维护开始前及时保存所有工作进度，备份重要数据，并退出系统。

维护完成后，系统将实现以下改进：
✓ 响应速度提升60%以上
✓ 并发处理能力增强3倍
✓ 数据安全等级提升至金融级标准
✓ 新增智能推荐功能
✓ 优化移动端用户体验

预计维护将按时完成，如遇特殊情况需要延长维护时间，我们会第一时间通过短信、邮件等方式通知您。维护期间给您带来的不便，我们深表歉意。

如有任何紧急问题或疑问，请通过以下方式联系我们：
• 24小时客服热线：400-888-6666
• 紧急邮箱：emergency@example.com  
• 官方微信客服

感谢您一直以来的信任与支持！`,
          time: (/* @__PURE__ */ new Date()).toISOString(),
          sender: "系统管理员",
          category: "系统通知",
          priority: "high",
          readCount: 1247,
          actionText: "确认知悉",
          attachments: [
            {
              name: "维护详细计划.pdf",
              type: "pdf",
              size: 2048e3
            },
            {
              name: "功能更新说明.docx",
              type: "doc",
              size: 1536e3
            }
          ],
          links: [
            {
              title: "官方帮助中心",
              description: "查看更多常见问题解答",
              url: "https://help.example.com"
            },
            {
              title: "服务状态页面",
              description: "实时监控系统运行状态",
              url: "https://status.example.com"
            }
          ]
        };
      } catch (error) {
        console.error("加载消息详情失败:", error);
        messageDetail.value = null;
      } finally {
        isLoading.value = false;
      }
    };
    const formatTime = (timeStr) => {
      if (!timeStr)
        return "";
      try {
        const time = new Date(timeStr);
        const year = time.getFullYear();
        const month = String(time.getMonth() + 1).padStart(2, "0");
        const date = String(time.getDate()).padStart(2, "0");
        const hours = String(time.getHours()).padStart(2, "0");
        const minutes = String(time.getMinutes()).padStart(2, "0");
        const seconds = String(time.getSeconds()).padStart(2, "0");
        return `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
      } catch (error) {
        return String(timeStr);
      }
    };
    const getPriorityIcon = (priority) => {
      const icons = {
        low: "📘",
        medium: "📙",
        high: "📕",
        urgent: "🚨"
      };
      return icons[priority] || "📘";
    };
    const getPriorityLabel = (priority) => {
      const labels = {
        low: "一般",
        medium: "重要",
        high: "紧急",
        urgent: "特急"
      };
      return labels[priority] || "一般";
    };
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: statusBarHeight.value + "px",
        b: common_vendor.o(goBack),
        c: isLoading.value
      }, isLoading.value ? {} : messageDetail.value ? common_vendor.e({
        e: common_vendor.t(messageDetail.value.title),
        f: common_vendor.t(formatTime(messageDetail.value.time)),
        g: messageDetail.value.sender
      }, messageDetail.value.sender ? {
        h: common_vendor.t(messageDetail.value.sender)
      } : {}, {
        i: messageDetail.value.category
      }, messageDetail.value.category ? {
        j: common_vendor.t(messageDetail.value.category)
      } : {}, {
        k: messageDetail.value.priority
      }, messageDetail.value.priority ? {
        l: common_vendor.t(getPriorityIcon(messageDetail.value.priority)),
        m: common_vendor.t(getPriorityLabel(messageDetail.value.priority)),
        n: common_vendor.n(`priority-${messageDetail.value.priority}`)
      } : {}, {
        o: common_vendor.t(messageDetail.value.content),
        p: isLargeText.value ? 1 : ""
      }) : {
        q: common_vendor.o(loadMessageDetail)
      }, {
        d: messageDetail.value,
        r: statusBarHeight.value + 48 + "px"
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-a39301fc"]]);
wx.createPage(MiniProgramPage);
