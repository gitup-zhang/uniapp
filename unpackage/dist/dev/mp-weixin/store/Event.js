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
  const eventdetail = common_vendor.ref({});
  const getlisting = async (num) => {
    common_vendor.index.showLoading({
      title: "加载中...",
      mask: true
    });
    try {
      const res = await newApis_events.getEventList({ page_size: num, event_status: "InProgress" });
      eventing.value = res.data;
    } catch (error) {
      console.log(error);
    } finally {
      common_vendor.index.hideLoading();
    }
  };
  const getlisoutdate = async (num) => {
    common_vendor.index.showLoading({
      title: "加载中...",
      mask: true
    });
    try {
      const res = await newApis_events.getEventList({ page_size: num, event_status: "Completed" });
      eventoutdate.value = res.data;
      eventcount.Evented = res.total;
      console.log("过期活动数量：", eventcount.Evented);
    } catch (error) {
      console.log(error);
    } finally {
      common_vendor.index.hideLoading();
    }
  };
  const geteventdetail = async (id) => {
    common_vendor.index.showLoading({
      title: "加载中...",
      mask: true
    });
    try {
      const res = await newApis_events.getEventDetail(id);
      eventdetail.value = res;
      console.log(eventdetail.value);
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
    eventcount
  };
});
exports.useEventstore = useEventstore;
