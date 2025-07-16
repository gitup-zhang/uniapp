"use strict";
const common_vendor = require("../../common/vendor.js");
const store_NewList = require("../../store/NewList.js");
const store_field = require("../../store/field.js");
const utils_data = require("../../utils/data.js");
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  const _easycom_uni_search_bar2 = common_vendor.resolveComponent("uni-search-bar");
  const _easycom_uni_card2 = common_vendor.resolveComponent("uni-card");
  (_easycom_uni_nav_bar2 + _easycom_uni_search_bar2 + _easycom_uni_card2)();
}
const _easycom_uni_nav_bar = () => "../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
const _easycom_uni_search_bar = () => "../../uni_modules/uni-search-bar/components/uni-search-bar/uni-search-bar.js";
const _easycom_uni_card = () => "../../uni_modules/uni-card/components/uni-card/uni-card.js";
if (!Math) {
  (_easycom_uni_nav_bar + _easycom_uni_search_bar + _easycom_uni_card)();
}
const _sfc_main = {
  __name: "news",
  setup(__props) {
    const listnew = store_NewList.useNewStore();
    const field = store_field.usefieldstore();
    const searchbar = common_vendor.ref("");
    const currentDropdown = common_vendor.ref(null);
    const isselected = common_vendor.ref(0);
    const selectedDomain = common_vendor.ref({ field_id: 0, field_name: "全部" });
    const selectedTime = common_vendor.ref("发布时间");
    const timeList = ["全部", "最近一周", "最近一月", "最近一年"];
    const loadMore = () => {
      listnew.getmorelist({
        policyTitle: searchbar.value,
        fieldID: selectedDomain.value.field_id,
        page: listnew.page + 1,
        is_selection: isselected.value
      });
      common_vendor.index.__f__("log", "at pages/news/news.vue:113", "到底了");
    };
    function search() {
      listnew.searchnewlist({
        newTitle: searchbar.value,
        fieldID: selectedDomain.value.field_id
      });
      common_vendor.index.__f__("log", "at pages/news/news.vue:122", "搜索关键词:", searchbar.value);
    }
    function cancel() {
      searchbar.value = "";
      listnew.getlistnew({});
    }
    function toggleDropdown(type) {
      currentDropdown.value = currentDropdown.value === type ? null : type;
    }
    function selectOption(type, value) {
      if (type === "domain") {
        if (value === null) {
          selectedDomain.value = { field_id: 0, field_name: "全部" };
          listnew.getlistnew({});
        } else {
          selectedDomain.value = value;
          listnew.searchnewlist({ fieldID: value.field_id });
        }
      }
      if (type === "time") {
        selectedTime.value = value;
      }
      currentDropdown.value = null;
    }
    function onClick(id) {
      common_vendor.index.navigateTo({
        url: `/pages/detail/detailnew?id=${id}`
      });
    }
    common_vendor.onShow(() => {
      const source = common_vendor.index.getStorageSync("tabSource") || "tabbar";
      if (source === "switchTab") {
        common_vendor.index.__f__("log", "at pages/news/news.vue:166", "来源：通过 uni.switchTab() 跳转");
        isselected.value = 1;
        listnew.getlistnew({ is_selection: isselected.value });
      } else {
        common_vendor.index.__f__("log", "at pages/news/news.vue:171", "来源：用户点击 tabBar 进入");
        isselected.value = 0;
        listnew.getlistnew({});
        field.getfield();
      }
      common_vendor.index.removeStorageSync("tabSource");
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          statusBar: "true",
          backgroundColor: "#903749",
          fixed: "true"
        }),
        b: common_vendor.o(search),
        c: common_vendor.o(cancel),
        d: common_vendor.o(($event) => searchbar.value = $event),
        e: common_vendor.p({
          placeholder: "搜索行业新闻",
          modelValue: searchbar.value
        }),
        f: common_vendor.t(selectedDomain.value.field_name || "全部领域"),
        g: currentDropdown.value === "domain" ? 1 : "",
        h: common_vendor.o(($event) => toggleDropdown("domain")),
        i: common_vendor.t(selectedTime.value),
        j: currentDropdown.value === "time" ? 1 : "",
        k: common_vendor.o(($event) => toggleDropdown("time")),
        l: currentDropdown.value === "domain"
      }, currentDropdown.value === "domain" ? {
        m: common_vendor.o(($event) => selectOption("domain", null)),
        n: selectedDomain.value.field_id === 0 ? 1 : "",
        o: common_vendor.f(common_vendor.unref(field).fieldlist, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.field_name),
            b: item.field_id,
            c: common_vendor.o(($event) => selectOption("domain", item), item.field_id),
            d: selectedDomain.value.field_id === item.field_id ? 1 : ""
          };
        })
      } : {}, {
        p: currentDropdown.value === "time"
      }, currentDropdown.value === "time" ? {
        q: common_vendor.f(timeList, (item, k0, i0) => {
          return {
            a: common_vendor.t(item),
            b: item,
            c: common_vendor.o(($event) => selectOption("time", item), item),
            d: selectedTime.value === item ? 1 : ""
          };
        })
      } : {}, {
        r: common_vendor.f(common_vendor.unref(listnew).listnew, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.brief_content),
            b: item.id,
            c: common_vendor.o(($event) => onClick(item.id), item.id),
            d: "26b1a250-2-" + i0,
            e: common_vendor.p({
              title: item.new_title,
              extra: common_vendor.unref(utils_data.Dataformat)(item.release_time),
              thumbnail: item.list_image_url
            })
          };
        }),
        s: common_vendor.unref(listnew).loading
      }, common_vendor.unref(listnew).loading ? {} : !common_vendor.unref(listnew).hasMore ? {} : {}, {
        t: !common_vendor.unref(listnew).hasMore,
        v: common_vendor.o(loadMore)
      });
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/news/news.js.map
