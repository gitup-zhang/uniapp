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
    const initialLoading = common_vendor.ref(false);
    const refreshTriggered = common_vendor.ref(false);
    const selectedDomain = common_vendor.ref({ field_id: 0, field_code: "", field_name: "全部" });
    const selectedTime = common_vendor.ref("发布时间");
    const timeList = ["全部", "最近一周", "最近一月", "最近一年"];
    const Params = {
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
        resetFilters();
        Params.article_type = "NEWS";
      } else if (newVal === "policy") {
        listarticles.resetpage(1);
        resetFilters();
        Params.article_type = "POLICY";
      }
    });
    function getEmptyMessage() {
      if (searchbar.value) {
        return `未找到与"${searchbar.value}"相关的内容，试试其他关键词吧`;
      }
      if (selectedDomain.value.field_id !== 0 || selectedTime.value !== "全部") {
        return "当前筛选条件下暂无内容，试试调整筛选条件";
      }
      return "暂时还没有内容，请稍后再来看看";
    }
    function resetFilters() {
      searchbar.value = "";
      selectedDomain.value = { field_id: 0, field_code: "", field_name: "全部" };
      selectedTime.value = "全部";
      Params.article_title = "";
      Params.field_type = "";
      Params.release_time = "";
      Params.page = 1;
      loadData();
    }
    async function onRefresh() {
      refreshTriggered.value = true;
      Params.page = 1;
      try {
        await listarticles.getlistpolicy(Params);
      } catch (error) {
        console.error("刷新失败:", error);
      } finally {
        refreshTriggered.value = false;
      }
    }
    async function loadData() {
      initialLoading.value = true;
      try {
        await listarticles.getlistpolicy(Params);
      } catch (error) {
        console.error("加载数据失败:", error);
        common_vendor.index.showToast({
          title: "加载失败，请重试",
          icon: "none"
        });
      } finally {
        initialLoading.value = false;
      }
    }
    function search() {
      Params.article_title = searchbar.value;
      Params.page = 1;
      loadData();
      console.log("搜索关键词:", searchbar.value);
    }
    function cancel() {
      searchbar.value = "";
      Params.page = 1;
      Params.article_title = searchbar.value;
      loadData();
    }
    function loadMore() {
      if (listarticles.loading || !listarticles.hasMore) {
        return;
      }
      Params.page = listarticles.page + 1;
      listarticles.getarticlemore(Params);
      console.log("加载更多，当前页码:", Params.page);
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
          loadData();
        } else {
          console.log("value值：", value);
          selectedDomain.value = value;
          Params.page = 1;
          Params.field_type = selectedDomain.value.field_code;
          console.log("params:", Params);
          loadData();
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
        loadData();
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
        loadData();
        Params.article_type = "NEWS";
        loadData();
        Params.article_type = activeTab.value.toUpperCase();
      } else {
        console.log("来源：用户点击 tabBar 进入");
        isselected.value = 0;
        Params.page = 1;
        loadData();
        Params.article_type = "NEWS";
        loadData();
        Params.article_type = activeTab.value.toUpperCase();
      }
      common_vendor.index.removeStorageSync("tabSource");
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          statusBar: "true",
          backgroundColor: "#dc2626",
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
        z: !initialLoading.value
      }, !initialLoading.value ? common_vendor.e({
        A: common_vendor.unref(listarticles).listpolicy.length > 0
      }, common_vendor.unref(listarticles).listpolicy.length > 0 ? {
        B: common_vendor.f(common_vendor.unref(listarticles).listpolicy, (item, k0, i0) => {
          return {
            a: item.article_id,
            b: common_vendor.o(handlePolicyClick, item.article_id),
            c: "52720678-3-" + i0,
            d: common_vendor.p({
              policyData: item
            })
          };
        })
      } : {
        C: common_vendor.t(getEmptyMessage()),
        D: common_vendor.o(resetFilters)
      }) : {}, {
        E: initialLoading.value
      }, initialLoading.value ? {} : {}, {
        F: !initialLoading.value && common_vendor.unref(listarticles).listpolicy.length > 0
      }, !initialLoading.value && common_vendor.unref(listarticles).listpolicy.length > 0 ? common_vendor.e({
        G: common_vendor.unref(listarticles).loading
      }, common_vendor.unref(listarticles).loading ? {} : !common_vendor.unref(listarticles).hasMore ? {} : {}, {
        H: !common_vendor.unref(listarticles).hasMore
      }) : {}, {
        I: common_vendor.o(loadMore),
        J: common_vendor.o(onRefresh),
        K: refreshTriggered.value
      }) : common_vendor.e({
        L: !initialLoading.value
      }, !initialLoading.value ? common_vendor.e({
        M: common_vendor.unref(listarticles).listnew.length > 0
      }, common_vendor.unref(listarticles).listnew.length > 0 ? {
        N: common_vendor.f(common_vendor.unref(listarticles).listnew, (item, k0, i0) => {
          return {
            a: item.article_id,
            b: common_vendor.o(handleNewsClick, item.article_id),
            c: "52720678-4-" + i0,
            d: common_vendor.p({
              newsData: item
            })
          };
        })
      } : {
        O: common_vendor.t(getEmptyMessage()),
        P: common_vendor.o(resetFilters)
      }) : {}, {
        Q: initialLoading.value
      }, initialLoading.value ? {} : {}, {
        R: !initialLoading.value && common_vendor.unref(listarticles).listnew.length > 0
      }, !initialLoading.value && common_vendor.unref(listarticles).listnew.length > 0 ? common_vendor.e({
        S: common_vendor.unref(listarticles).loading
      }, common_vendor.unref(listarticles).loading ? {} : !common_vendor.unref(listarticles).hasMore ? {} : {}, {
        T: !common_vendor.unref(listarticles).hasMore
      }) : {}, {
        U: common_vendor.o(loadMore),
        V: common_vendor.o(onRefresh),
        W: refreshTriggered.value
      }));
    };
  }
};
wx.createPage(_sfc_main);
