"use strict";
const common_vendor = require("../common/vendor.js");
const useInfoStore = common_vendor.defineStore("peopleinfo", () => {
  let info = common_vendor.ref({});
  const signal = common_vendor.ref(false);
  const getinfo = async () => {
    signal.value = true;
    info.value = {
      username: "胡歌",
      slogan: "在阳光灿烂的日子里睡觉呀",
      newsViews: 123,
      policyViews: 234,
      daysOnline: 128,
      field: "人工智能",
      Image: "/static/picture.jpg"
    };
  };
  function deleteinfo() {
    signal.value = false;
    info.value = {};
  }
  return {
    info,
    signal,
    getinfo,
    deleteinfo
  };
});
exports.useInfoStore = useInfoStore;
//# sourceMappingURL=../../.sourcemap/mp-weixin/store/Info.js.map
