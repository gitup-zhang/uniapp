"use strict";
const common_vendor = require("../../common/vendor.js");
const store_PolicyList = require("../../store/PolicyList.js");
const utils_data = require("../../utils/data.js");
const store_field = require("../../store/field.js");
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
  __name: "policy",
  setup(__props) {
    const listpolicy = store_PolicyList.usePolicyStore();
    const field = store_field.usefieldstore();
    const searchbar = common_vendor.ref("");
    const currentDropdown = common_vendor.ref(null);
    const selectedDomain = common_vendor.ref(null);
    const selectedTime = common_vendor.ref("发布时间");
    const timeList = ["全部", "最近一周", "最近一月", "最近一年"];
    common_vendor.onMounted(() => {
      listpolicy.getlistpolicy();
      field.getfield();
    });
    function search() {
      listpolicy.searchpolicy({ "policyTitle": searchbar.value });
      common_vendor.index.__f__("log", "at pages/policy/policy.vue:119", "搜索关键词:", searchbar.value);
    }
    function cancel() {
      listpolicy.getlistpolicy();
      searchbar.value = "";
    }
    function toggleDropdown(type) {
      currentDropdown.value = currentDropdown.value === type ? null : type;
    }
    function selectOption(type, value) {
      if (type === "domain") {
        selectedDomain.value = value;
        if (value === null) {
          listpolicy.getlistpolicy();
        } else {
          listpolicy.searchpolicy({ "fieldID": value.field_id });
          common_vendor.index.__f__("log", "at pages/policy/policy.vue:142", "选中领域ID:", value.field_id);
        }
      }
      if (type === "time") {
        selectedTime.value = value;
      }
      currentDropdown.value = null;
    }
    function OnClick(id) {
      common_vendor.index.navigateTo({
        url: `/pages/detail/detailpolicy?id=${id}`
      });
    }
    return (_ctx, _cache) => {
      var _a;
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
        f: common_vendor.t(((_a = selectedDomain.value) == null ? void 0 : _a.field_name) || "全部领域"),
        g: currentDropdown.value === "domain" ? 1 : "",
        h: common_vendor.o(($event) => toggleDropdown("domain")),
        i: common_vendor.t(selectedTime.value),
        j: currentDropdown.value === "time" ? 1 : "",
        k: common_vendor.o(($event) => toggleDropdown("time")),
        l: currentDropdown.value === "domain"
      }, currentDropdown.value === "domain" ? {
        m: common_vendor.o(($event) => selectOption("domain", null)),
        n: selectedDomain.value === null ? 1 : "",
        o: common_vendor.f(common_vendor.unref(field).fieldlist, (item, k0, i0) => {
          var _a2;
          return {
            a: common_vendor.t(item.field_name),
            b: item.field_id,
            c: common_vendor.o(($event) => selectOption("domain", item), item.field_id),
            d: ((_a2 = selectedDomain.value) == null ? void 0 : _a2.field_id) === item.field_id ? 1 : ""
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
        r: common_vendor.f(common_vendor.unref(listpolicy).listpolicy, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.brief_content),
            b: item.id,
            c: common_vendor.o(($event) => OnClick(item.id), item.id),
            d: "52720678-2-" + i0,
            e: common_vendor.p({
              title: item.policy_title,
              extra: common_vendor.unref(utils_data.Dataformat)(item.release_time)
            })
          };
        })
      });
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/policy/policy.js.map
