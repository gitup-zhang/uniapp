"use strict";
const common_vendor = require("../../common/vendor.js");
const store_Info = require("../../store/Info.js");
const newApis_events = require("../../new-apis/events.js");
if (!Math) {
  ActivityTicketList();
}
const ActivityTicketList = () => "../../components/ActivityTicket/ActivityTicketList.js";
const _sfc_main = {
  __name: "activityjoined",
  setup(__props) {
    const useinfo = store_Info.useInfoStore();
    const statusBarHeight = common_vendor.ref(0);
    const activeTab = common_vendor.ref("active");
    const activityList = common_vendor.ref([]);
    const expiredActivityList = common_vendor.ref([]);
    const currentActivityList = common_vendor.computed(() => {
      return activeTab.value === "active" ? activityList.value : expiredActivityList.value;
    });
    const switchTab = (tab) => {
      if (activeTab.value !== tab) {
        activeTab.value = tab;
      }
    };
    common_vendor.onMounted(() => {
      const systemInfo = common_vendor.index.getSystemInfoSync();
      statusBarHeight.value = systemInfo.statusBarHeight || 20;
      loadActivityData();
    });
    const loadActivityData = async () => {
      try {
        await useinfo.userapply();
        activityList.value = useinfo.applyactivity;
        expiredActivityList.value = useinfo.applyactivityhistory;
      } catch (error) {
        console.error("加载活动数据失败:", error);
        common_vendor.index.showToast({
          title: "加载失败",
          icon: "error"
        });
      }
    };
    const handleCancel = (activityData) => {
      console.log("取消报名:", activityData);
      if (activeTab.value === "expired") {
        common_vendor.index.showToast({
          title: "活动已过期，无法取消报名",
          icon: "none"
        });
        return;
      }
      common_vendor.index.showModal({
        title: "确认取消",
        content: `确定要取消报名"${activityData.title}"吗？`,
        success: (res) => {
          if (res.confirm) {
            cancelSignUp(activityData);
          }
        }
      });
    };
    const cancelSignUp = async (activityData) => {
      try {
        await newApis_events.cancelapply(activityData.id);
        loadActivityData();
        common_vendor.index.showToast({
          title: "取消报名成功",
          icon: "success"
        });
      } catch (error) {
        console.error("取消报名失败:", error);
        common_vendor.index.showToast({
          title: error.data.message,
          icon: "none"
        });
      }
    };
    function onBack() {
      common_vendor.index.navigateBack();
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: statusBarHeight.value + "px",
        b: common_vendor.o(onBack),
        c: statusBarHeight.value + 44 + "px",
        d: activeTab.value === "active"
      }, activeTab.value === "active" ? {} : {}, {
        e: activeTab.value === "active" ? 1 : "",
        f: common_vendor.o(($event) => switchTab("active")),
        g: activeTab.value === "expired"
      }, activeTab.value === "expired" ? {} : {}, {
        h: activeTab.value === "expired" ? 1 : "",
        i: common_vendor.o(($event) => switchTab("expired")),
        j: statusBarHeight.value + 44 + 50 + "px",
        k: currentActivityList.value.length === 0
      }, currentActivityList.value.length === 0 ? {
        l: common_vendor.t(activeTab.value === "active" ? "暂无未过期的活动" : "暂无已过期的活动")
      } : {
        m: common_vendor.f(currentActivityList.value, (activity, k0, i0) => {
          return {
            a: activity.id,
            b: common_vendor.o(handleCancel, activity.id),
            c: "beed2d58-0-" + i0,
            d: common_vendor.p({
              status: activeTab.value,
              activityData: activity
            })
          };
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-beed2d58"]]);
wx.createPage(MiniProgramPage);
