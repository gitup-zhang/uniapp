"use strict";
const common_vendor = require("../../common/vendor.js");
const store_Articles = require("../../store/Articles.js");
const store_field = require("../../store/field.js");
const utils_data = require("../../utils/data.js");
if (!Array) {
  const _easycom_uni_nav_bar2 = common_vendor.resolveComponent("uni-nav-bar");
  const _easycom_uni_search_bar2 = common_vendor.resolveComponent("uni-search-bar");
  (_easycom_uni_nav_bar2 + _easycom_uni_search_bar2)();
}
const _easycom_uni_nav_bar = () => "../../uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.js";
const _easycom_uni_search_bar = () => "../../uni_modules/uni-search-bar/components/uni-search-bar/uni-search-bar.js";
if (!Math) {
  (_easycom_uni_nav_bar + _easycom_uni_search_bar + Tabswitch + ArticlePolicyVue + ArticleCard)();
}
const Tabswitch = () => "../../components/Tabswitch/Tabswitch.js";
const ArticleCard = () => "../../components/ArticleCard/ArticleCard.js";
const ArticlePolicyVue = () => "../../components/ArticleCard/ArticlePolicy2.js";
const _sfc_main = {
  __name: "policy",
  setup(__props) {
    const listarticles = store_Articles.useArticlesStore();
    const field = store_field.usefieldstore();
    const activeTab = common_vendor.ref("policy");
    const searchbar = common_vendor.ref("");
    const currentDropdown = common_vendor.ref(null);
    const isselected = common_vendor.ref(0);
    const selectedDomain = common_vendor.ref({ field_id: 0, field_code: "", field_name: "全部" });
    const selectedTime = common_vendor.ref("发布时间");
    const timeList = ["全部", "最近一周", "最近一月", "最近一年"];
    const Params = {
      // field_id: 0,
      field_type: "",
      page: 0,
      is_selection: 0,
      article_title: "",
      release_time: "",
      article_type: activeTab.value.toUpperCase()
    };
    common_vendor.watch(activeTab, (newVal, oldVal) => {
      console.log("Tab 变化:", oldVal, "=>", newVal);
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
      console.log("搜索关键词:", searchbar.value);
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
      console.log("到底了");
    }
    function toggleDropdown(type) {
      currentDropdown.value = currentDropdown.value === type ? null : type;
    }
    function selectOption(type, value) {
      if (type === "domain") {
        if (value === null) {
          selectedDomain.value = { field_id: 0, field_code: "", field_name: "全部" };
          Params.page = 1;
          Params.field_type = selectedDomain.value.field_code;
          listarticles.getlistpolicy(Params);
        } else {
          console.log("value值：", value);
          selectedDomain.value = value;
          Params.page = 1;
          Params.field_type = selectedDomain.value.field_code;
          console.log("params:", Params);
          listarticles.getlistpolicy(Params);
        }
      }
      if (type === "time") {
        console.log(value);
        selectedTime.value = value;
        if (value === "最近一周") {
          Params.release_time = utils_data.getLastWeekDate();
        } else if (value === "最近一月") {
          Params.release_time = utils_data.getLastMonthDate();
        } else if (value === "最近一年") {
          Params.release_time = utils_data.getLastYearDate();
        } else {
          Params.release_time = "";
        }
        Params.page = 1;
        listarticles.getlistpolicy(Params);
      }
      currentDropdown.value = null;
    }
    const handlePolicyClick = (policyItem) => {
      console.log("点击了政策:", policyItem);
      common_vendor.index.navigateTo({
        url: `/pages/detail/articledetail?id=${policyItem.article_id}`
      });
    };
    const handleNewsClick = (newsItem) => {
      console.log("点击了新闻:", newsItem.article_id);
      common_vendor.index.navigateTo({
        url: `/pages/detail/articledetail?id=${newsItem.article_id}`
      });
    };
    common_vendor.onShow(() => {
      const source = common_vendor.index.getStorageSync("tabSource") || "tabbar";
      field.getfield();
      if (source === "switchTab") {
        console.log("来源：通过 uni.switchTab() 跳转");
        Params.is_selection = 1;
        Params.page = 1;
        listarticles.getlistpolicy(Params);
        Params.article_type = "NEWS";
        listarticles.getlistpolicy(Params);
        Params.article_type = activeTab.value.toUpperCase();
      } else {
        console.log("来源：用户点击 tabBar 进入");
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
          backgroundColor: "#ff4757",
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
        o: currentDropdown.value
      }, currentDropdown.value ? {
        p: common_vendor.o(($event) => currentDropdown.value = null)
      } : {}, {
        q: currentDropdown.value === "domain"
      }, currentDropdown.value === "domain" ? common_vendor.e({
        r: selectedDomain.value.field_id === 0
      }, selectedDomain.value.field_id === 0 ? {} : {}, {
        s: common_vendor.o(($event) => selectOption("domain", null)),
        t: selectedDomain.value.field_id === 0 ? 1 : "",
        v: common_vendor.f(common_vendor.unref(field).fieldlist, (item, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(item.field_name),
            b: selectedDomain.value.field_id === item.field_id
          }, selectedDomain.value.field_id === item.field_id ? {} : {}, {
            c: item.field_id,
            d: common_vendor.o(($event) => selectOption("domain", item), item.field_id),
            e: selectedDomain.value.field_id === item.field_id ? 1 : ""
          });
        })
      }) : {}, {
        w: currentDropdown.value === "time"
      }, currentDropdown.value === "time" ? {
        x: common_vendor.f(timeList, (item, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(item),
            b: selectedTime.value === item
          }, selectedTime.value === item ? {} : {}, {
            c: item,
            d: common_vendor.o(($event) => selectOption("time", item), item),
            e: selectedTime.value === item ? 1 : ""
          });
        })
      } : {}, {
        y: activeTab.value === "policy"
      }, activeTab.value === "policy" ? common_vendor.e({
        z: common_vendor.f(common_vendor.unref(listarticles).listpolicy, (item, k0, i0) => {
          return {
            a: item.article_id,
            b: common_vendor.o(handlePolicyClick, item.article_id),
            c: "52720678-3-" + i0,
            d: common_vendor.p({
              policyData: item
            })
          };
        }),
        A: common_vendor.unref(listarticles).loading
      }, common_vendor.unref(listarticles).loading ? {} : !common_vendor.unref(listarticles).hasMore ? {} : {}, {
        B: !common_vendor.unref(listarticles).hasMore,
        C: common_vendor.o(loadMore)
      }) : common_vendor.e({
        D: common_vendor.f(common_vendor.unref(listarticles).listnew, (item, k0, i0) => {
          return {
            a: item.article_id,
            b: common_vendor.o(handleNewsClick, item.article_id),
            c: "52720678-4-" + i0,
            d: common_vendor.p({
              newsData: item
            })
          };
        }),
        E: common_vendor.unref(listarticles).loading
      }, common_vendor.unref(listarticles).loading ? {} : !common_vendor.unref(listarticles).hasMore ? {} : {}, {
        F: !common_vendor.unref(listarticles).hasMore,
        G: common_vendor.o(loadMore)
      }));
    };
  }
};
wx.createPage(_sfc_main);
