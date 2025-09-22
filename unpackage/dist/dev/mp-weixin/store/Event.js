"use strict";
const common_vendor = require("../common/vendor.js");
const newApis_events = require("../new-apis/events.js");
const useEventstore = common_vendor.defineStore("event", () => {
  const eventing = common_vendor.ref([]);
  const eventoutdate = common_vendor.ref([]);
  const eventcount = common_vendor.ref({
    Eventbefore: 0,
    Eventing: 0,
    Evented: 0
  });
  const currentPage = common_vendor.ref(1);
  const pageSize = common_vendor.ref(10);
  const hasMoreData = common_vendor.ref(true);
  const isLoading = common_vendor.ref(false);
  const outdateCurrentPage = common_vendor.ref(1);
  const outdatePageSize = common_vendor.ref(10);
  const outdateHasMoreData = common_vendor.ref(true);
  const outdateIsLoading = common_vendor.ref(false);
  const eventdetail = common_vendor.ref({});
  const getlisting = async (num, loadMore = false) => {
    if (isLoading.value)
      return;
    isLoading.value = true;
    if (!loadMore) {
      common_vendor.index.showLoading({
        title: "加载中...",
        mask: true
      });
    }
    try {
      const page = loadMore ? currentPage.value + 1 : 1;
      const res = await newApis_events.getEventList({
        page,
        page_size: num || pageSize.value,
        event_status: "InProgress"
      });
      if (loadMore) {
        eventing.value = [...eventing.value, ...res.data];
        currentPage.value = page;
      } else {
        eventing.value = res.data;
        currentPage.value = 1;
      }
      eventcount.value.Eventing = res.total;
      hasMoreData.value = eventing.value.length < res.total;
      console.log(`已加载 ${eventing.value.length}/${res.total} 条活动数据`);
    } catch (error) {
      console.log(error);
      common_vendor.index.showToast({
        title: "加载失败",
        icon: "error"
      });
    } finally {
      isLoading.value = false;
      if (!loadMore) {
        common_vendor.index.hideLoading();
      }
    }
  };
  const loadMoreEvents = async () => {
    if (!hasMoreData.value || isLoading.value) {
      return;
    }
    await getlisting(pageSize.value, true);
  };
  const refreshEvents = async () => {
    currentPage.value = 1;
    hasMoreData.value = true;
    await getlisting(pageSize.value, false);
  };
  const getlisoutdate = async (num, loadMore = false) => {
    if (outdateIsLoading.value)
      return;
    outdateIsLoading.value = true;
    if (!loadMore) {
      common_vendor.index.showLoading({
        title: "加载中...",
        mask: true
      });
    }
    try {
      const page = loadMore ? outdateCurrentPage.value + 1 : 1;
      const res = await newApis_events.getEventList({
        page,
        page_size: num || outdatePageSize.value,
        event_status: "Completed"
      });
      if (loadMore) {
        eventoutdate.value = [...eventoutdate.value, ...res.data];
        outdateCurrentPage.value = page;
      } else {
        eventoutdate.value = res.data;
        outdateCurrentPage.value = 1;
      }
      eventcount.value.Evented = res.total;
      outdateHasMoreData.value = eventoutdate.value.length < res.total;
      console.log(`已加载历史活动 ${eventoutdate.value.length}/${res.total} 条`);
    } catch (error) {
      console.log(error);
      common_vendor.index.showToast({
        title: "加载失败",
        icon: "error"
      });
    } finally {
      outdateIsLoading.value = false;
      if (!loadMore) {
        common_vendor.index.hideLoading();
      }
    }
  };
  const loadMoreOutdateEvents = async () => {
    if (!outdateHasMoreData.value || outdateIsLoading.value) {
      return;
    }
    await getlisoutdate(outdatePageSize.value, true);
  };
  const refreshOutdateEvents = async () => {
    outdateCurrentPage.value = 1;
    outdateHasMoreData.value = true;
    await getlisoutdate(outdatePageSize.value, false);
  };
  const geteventdetail = async (id) => {
    common_vendor.index.showLoading({
      title: "加载中...",
      mask: true
    });
    try {
      const res = await newApis_events.getEventDetail(id);
      eventdetail.value = res.data;
      console.log("活动详情", eventdetail.value);
    } catch (error) {
      console.log(error);
    } finally {
      common_vendor.index.hideLoading();
    }
  };
  return {
    eventing,
    eventoutdate,
    getlisting,
    getlisoutdate,
    geteventdetail,
    eventdetail,
    eventcount,
    // 进行中活动的分页相关
    currentPage,
    pageSize,
    hasMoreData,
    isLoading,
    loadMoreEvents,
    refreshEvents,
    // 历史活动的分页相关
    outdateCurrentPage,
    outdatePageSize,
    outdateHasMoreData,
    outdateIsLoading,
    loadMoreOutdateEvents,
    refreshOutdateEvents
  };
});
exports.useEventstore = useEventstore;
