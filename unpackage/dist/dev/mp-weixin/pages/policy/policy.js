"use strict";
const common_vendor = require("../../common/vendor.js");
const store_PolicyList = require("../../store/PolicyList.js");
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
    const searchbar = common_vendor.ref("");
    const currentDropdown = common_vendor.ref(null);
    const selectedDomain = common_vendor.ref("政策领域");
    const selectedTime = common_vendor.ref("发布时间");
    const domainList = ["全部", "教育", "科技", "医疗"];
    const timeList = ["全部", "最近一周", "最近一月", "最近一年"];
    common_vendor.onMounted(() => {
      listpolicy.getlistpolicy();
    });
    function search() {
      common_vendor.index.__f__("log", "at pages/policy/policy.vue:102", "搜索关键词:", searchbar.value);
    }
    function cancel() {
      searchbar.value = "";
    }
    function toggleDropdown(type) {
      currentDropdown.value = currentDropdown.value === type ? null : type;
    }
    function selectOption(type, value) {
      if (type === "domain") {
        selectedDomain.value = value;
      } else if (type === "time") {
        selectedTime.value = value;
      }
      currentDropdown.value = null;
    }
    function OnClick(id) {
      common_vendor.index.navigateTo({
        url: `/pages/detail/detailpolicy?id=${id}`
      });
    }
    function Dataformat(timeStr) {
      return common_vendor.dayjs(timeStr).format("YYYY-MM-DD HH:mm:ss");
    }
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
          placeholder: "搜索行业政策",
          modelValue: searchbar.value
        }),
        f: common_vendor.t(selectedDomain.value),
        g: currentDropdown.value === "domain" ? 1 : "",
        h: common_vendor.o(($event) => toggleDropdown("domain")),
        i: common_vendor.t(selectedTime.value),
        j: currentDropdown.value === "time" ? 1 : "",
        k: common_vendor.o(($event) => toggleDropdown("time")),
        l: currentDropdown.value === "domain"
      }, currentDropdown.value === "domain" ? {
        m: common_vendor.f(domainList, (item, k0, i0) => {
          return {
            a: common_vendor.t(item),
            b: item,
            c: common_vendor.o(($event) => selectOption("domain", item), item),
            d: selectedDomain.value === item ? 1 : ""
          };
        })
      } : {}, {
        n: currentDropdown.value === "time"
      }, currentDropdown.value === "time" ? {
        o: common_vendor.f(timeList, (item, k0, i0) => {
          return {
            a: common_vendor.t(item),
            b: item,
            c: common_vendor.o(($event) => selectOption("time", item), item),
            d: selectedTime.value === item ? 1 : ""
          };
        })
      } : {}, {
        p: common_vendor.f(common_vendor.unref(listpolicy).listpolicy, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.brief_content),
            b: item.id,
            c: common_vendor.o(($event) => OnClick(item.id), item.id),
            d: "e4e5fb8d-2-" + i0,
            e: common_vendor.p({
              title: item.policy_title,
              extra: Dataformat(item.release_time)
            })
          };
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-e4e5fb8d"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/policy/policy.js.map
