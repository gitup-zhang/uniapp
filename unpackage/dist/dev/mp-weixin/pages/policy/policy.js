"use strict";
const common_vendor = require("../../common/vendor.js");
const store_Articles = require("../../store/Articles.js");
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
  (_easycom_uni_nav_bar + _easycom_uni_search_bar + Tabswitch + _easycom_uni_card)();
}
const Tabswitch = () => "../../components/Tabswitch/Tabswitch.js";
const _sfc_main = {
  __name: "policy",
  setup(__props) {
    const listarticles = store_Articles.useArticlesStore();
    const field = store_field.usefieldstore();
    const activeTab = common_vendor.ref("policy");
    const searchbar = common_vendor.ref("");
    const currentDropdown = common_vendor.ref(null);
    const isselected = common_vendor.ref(0);
    const selectedDomain = common_vendor.ref({ field_id: 0, field_name: "全部" });
    const selectedTime = common_vendor.ref("发布时间");
    const timeList = ["全部", "最近一周", "最近一月", "最近一年"];
    const Params = {
      field_id: 0,
      page: 0,
      is_selection: 0,
      article_title: "",
      release_time: "",
      article_type: activeTab.value.toUpperCase()
    };
    common_vendor.watch(activeTab, (newVal, oldVal) => {
      common_vendor.index.__f__("log", "at pages/policy/policy.vue:164", "Tab 变化:", oldVal, "=>", newVal);
      if (newVal === "news") {
        listarticles.resetpage(1);
        Params.article_type = "NEWS";
      } else if (newVal === "policy") {
        listarticles.resetpage(1);
        Params.article_type = "POLICY";
      }
    });
    function search() {
      Params.article_title = searchbar.value;
      Params.page = 1;
      listarticles.getlistpolicy(Params);
      common_vendor.index.__f__("log", "at pages/policy/policy.vue:179", "搜索关键词:", searchbar.value);
    }
    function cancel() {
      searchbar.value = "";
      Params.page = 1;
      Params.article_title = searchbar.value;
      listarticles.getlistpolicy(Params);
    }
    function loadMore() {
      Params.page = listarticles.page + 1;
      listarticles.getarticlemore(Params);
      common_vendor.index.__f__("log", "at pages/policy/policy.vue:194", "到底了");
    }
    function toggleDropdown(type) {
      currentDropdown.value = currentDropdown.value === type ? null : type;
    }
    function selectOption(type, value) {
      if (type === "domain") {
        if (value === null) {
          selectedDomain.value = { field_id: 0, field_name: "全部" };
          Params.page = 1;
          Params.field_id = selectedDomain.value.field_id;
          listarticles.getlistpolicy(Params);
        } else {
          selectedDomain.value = value;
          Params.page = 1;
          Params.field_id = selectedDomain.value.field_id;
          listarticles.getlistpolicy(Params);
        }
      }
      if (type === "time") {
        selectedTime.value = value;
      }
      currentDropdown.value = null;
    }
    function OnClick(id) {
      common_vendor.index.__f__("log", "at pages/policy/policy.vue:227", "测试的Id:" + id);
      common_vendor.index.navigateTo({
        url: `/pages/detail/articledetail?id=${id}`
      });
    }
    common_vendor.onShow(() => {
      const source = common_vendor.index.getStorageSync("tabSource") || "tabbar";
      field.getfield();
      if (source === "switchTab") {
        common_vendor.index.__f__("log", "at pages/policy/policy.vue:237", "来源：通过 uni.switchTab() 跳转");
        Params.is_selection = 1;
        Params.page = 1;
        listarticles.getlistpolicy(Params);
        Params.article_type = "NEWS";
        listarticles.getlistpolicy(Params);
        Params.article_type = activeTab.value.toUpperCase();
      } else {
        common_vendor.index.__f__("log", "at pages/policy/policy.vue:245", "来源：用户点击 tabBar 进入");
        isselected.value = 0;
        Params.page = 1;
        listarticles.getlistpolicy(Params);
        Params.article_type = "NEWS";
        listarticles.getlistpolicy(Params);
        Params.article_type = activeTab.value.toUpperCase();
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
          placeholder: "搜索政策或新闻",
          modelValue: searchbar.value
        }),
        f: common_vendor.o(($event) => activeTab.value = $event),
        g: common_vendor.p({
          modelValue: activeTab.value
        }),
        h: activeTab.value === "policy"
      }, activeTab.value === "policy" ? {} : {}, {
        i: common_vendor.t(selectedDomain.value.field_name || "全部领域"),
        j: currentDropdown.value === "domain" ? 1 : "",
        k: common_vendor.o(($event) => toggleDropdown("domain")),
        l: common_vendor.t(selectedTime.value),
        m: currentDropdown.value === "time" ? 1 : "",
        n: common_vendor.o(($event) => toggleDropdown("time")),
        o: currentDropdown.value === "domain"
      }, currentDropdown.value === "domain" ? {
        p: common_vendor.o(($event) => selectOption("domain", null)),
        q: selectedDomain.value.field_id === 0 ? 1 : "",
        r: common_vendor.f(common_vendor.unref(field).fieldlist, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.field_name),
            b: item.field_id,
            c: common_vendor.o(($event) => selectOption("domain", item), item.field_id),
            d: selectedDomain.value.field_id === item.field_id ? 1 : ""
          };
        })
      } : {}, {
        s: currentDropdown.value === "time"
      }, currentDropdown.value === "time" ? {
        t: common_vendor.f(timeList, (item, k0, i0) => {
          return {
            a: common_vendor.t(item),
            b: item,
            c: common_vendor.o(($event) => selectOption("time", item), item),
            d: selectedTime.value === item ? 1 : ""
          };
        })
      } : {}, {
        v: activeTab.value === "policy"
      }, activeTab.value === "policy" ? common_vendor.e({
        w: common_vendor.f(common_vendor.unref(listarticles).listpolicy, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.brief_content),
            b: item.article_id,
            c: common_vendor.o(($event) => OnClick(item.article_id), item.article_id),
            d: "52720678-3-" + i0,
            e: common_vendor.p({
              title: item.article_title,
              extra: common_vendor.unref(utils_data.Dataformat)(item.release_time)
            })
          };
        }),
        x: common_vendor.unref(listarticles).loading
      }, common_vendor.unref(listarticles).loading ? {} : !common_vendor.unref(listarticles).hasMore ? {} : {}, {
        y: !common_vendor.unref(listarticles).hasMore,
        z: common_vendor.o(loadMore)
      }) : common_vendor.e({
        A: common_vendor.f(common_vendor.unref(listarticles).listnew, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.brief_content),
            b: item.article_id,
            c: common_vendor.o(($event) => OnClick(item.article_id), item.article_id),
            d: "52720678-4-" + i0,
            e: common_vendor.p({
              title: item.article_title,
              extra: common_vendor.unref(utils_data.Dataformat)(item.release_time),
              thumbnail: item.list_image_url
            })
          };
        }),
        B: common_vendor.unref(listarticles).loading
      }, common_vendor.unref(listarticles).loading ? {} : !common_vendor.unref(listarticles).hasMore ? {} : {}, {
        C: !common_vendor.unref(listarticles).hasMore,
        D: common_vendor.o(loadMore)
      }));
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/policy/policy.js.map
