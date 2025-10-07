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
    const searchKeyword = common_vendor.ref("");
    const currentDropdown = common_vendor.ref(null);
    const initialLoading = common_vendor.ref(false);
    const refreshTriggered = common_vendor.ref(false);
    const selectedDomain = common_vendor.ref({ field_id: 0, field_code: "", field_name: "全部" });
    const selectedTime = common_vendor.ref("全部");
    const timeList = ["全部", "最近一周", "最近一月", "最近一年"];
    const isPageInitialized = common_vendor.ref(false);
    const currentList = common_vendor.computed(() => {
      return activeTab.value === "policy" ? listarticles.listpolicy : listarticles.listnew;
    });
    const buildQueryParams = (overrides = {}) => {
      const baseParams = {
        field_type: selectedDomain.value.field_code || "",
        page: 1,
        is_selection: 0,
        article_title: searchKeyword.value || "",
        release_time: getTimeParam(),
        article_type: activeTab.value.toUpperCase(),
        ...overrides
      };
      console.log("构建查询参数:", baseParams);
      return baseParams;
    };
    const getTimeParam = () => {
      switch (selectedTime.value) {
        case "最近一周":
          return utils_data.getLastWeekDate();
        case "最近一月":
          return utils_data.getLastMonthDate();
        case "最近一年":
          return utils_data.getLastYearDate();
        default:
          return "";
      }
    };
    const loadData = async (isRefresh = false, showLoading = true) => {
      try {
        if (!isRefresh && showLoading) {
          initialLoading.value = true;
        }
        const params = buildQueryParams({
          page: 1,
          isRefresh
        });
        console.log("开始加载数据:", { activeTab: activeTab.value, params });
        await listarticles.getlistpolicy(params);
        console.log("数据加载完成:", {
          type: activeTab.value,
          count: currentList.value.length
        });
      } catch (error) {
        console.error("加载数据失败:", error);
        common_vendor.index.showToast({
          title: "加载失败，请重试",
          icon: "none"
        });
      } finally {
        if (!isRefresh && showLoading) {
          initialLoading.value = false;
        }
      }
    };
    common_vendor.watch(activeTab, async (newTab, oldTab) => {
      if (!isPageInitialized.value)
        return;
      console.log("Tab 切换:", oldTab, "=>", newTab);
      listarticles.resetpage(1);
      await common_vendor.nextTick$1();
      await loadData(false, true);
    });
    const handleSearch = async () => {
      console.log("执行搜索:", searchKeyword.value);
      await loadData(false, true);
    };
    const handleSearchCancel = async () => {
      searchKeyword.value = "";
      await loadData(false, true);
    };
    const handleRefresh = async () => {
      console.log("下拉刷新");
      refreshTriggered.value = true;
      try {
        await loadData(true, false);
      } catch (error) {
        console.error("刷新失败:", error);
      } finally {
        refreshTriggered.value = false;
      }
    };
    const handleLoadMore = async () => {
      if (listarticles.loading || !listarticles.hasMore) {
        console.log("加载更多被阻止:", {
          loading: listarticles.loading,
          hasMore: listarticles.hasMore
        });
        return;
      }
      const params = buildQueryParams({
        page: listarticles.page + 1
      });
      console.log("加载更多:", params);
      await listarticles.getarticlemore(params);
    };
    const handleDomainSelect = async (domain) => {
      if (domain === null) {
        selectedDomain.value = { field_id: 0, field_code: "", field_name: "全部" };
      } else {
        selectedDomain.value = domain;
      }
      currentDropdown.value = null;
      console.log("选择领域:", selectedDomain.value);
      await loadData(false, true);
    };
    const handleTimeSelect = async (time) => {
      selectedTime.value = time;
      currentDropdown.value = null;
      console.log("选择时间:", time);
      await loadData(false, true);
    };
    const handleResetFilters = async () => {
      console.log("重置筛选条件");
      searchKeyword.value = "";
      selectedDomain.value = { field_id: 0, field_code: "", field_name: "全部" };
      selectedTime.value = "全部";
      await loadData(false, true);
    };
    const toggleDropdown = (type) => {
      currentDropdown.value = currentDropdown.value === type ? null : type;
    };
    const getEmptyMessage = () => {
      if (searchKeyword.value) {
        return `未找到与"${searchKeyword.value}"相关的内容，试试其他关键词吧`;
      }
      if (selectedDomain.value.field_id !== 0 || selectedTime.value !== "全部") {
        return "当前筛选条件下暂无内容，试试调整筛选条件";
      }
      return "暂时还没有内容，请稍后再来看看";
    };
    const handlePolicyClick = (policyItem) => {
      console.log("点击政策:", policyItem);
      common_vendor.index.navigateTo({
        url: `/pages/detail/articledetail?id=${policyItem.article_id}`
      });
    };
    const handleNewsClick = (newsItem) => {
      console.log("点击新闻:", newsItem);
      common_vendor.index.navigateTo({
        url: `/pages/detail/articledetail?id=${newsItem.article_id}`
      });
    };
    common_vendor.onShow(async () => {
      try {
        console.log("页面显示 - onShow");
        await field.getfield();
        const source = common_vendor.index.getStorageSync("tabSource") || "tabbar";
        const articlesort = common_vendor.index.getStorageSync("article") || "news";
        console.log("页面来源:", source);
        console.log("文章类型", articlesort);
        if (source === "switchTab") {
          if (articlesort === "news") {
            activeTab.value = "news";
          } else {
            activeTab.value = "policy";
          }
        }
        common_vendor.index.removeStorageSync("tabSource");
        common_vendor.index.removeStorageSync("article");
        if (!isPageInitialized.value) {
          console.log("首次初始化页面");
          isPageInitialized.value = true;
          await loadData(false, true);
        } else {
          console.log("页面已初始化，跳过数据加载");
        }
      } catch (error) {
        console.error("页面初始化失败:", error);
        common_vendor.index.showToast({
          title: "页面初始化失败",
          icon: "none"
        });
      }
    });
    common_vendor.onUnmounted(() => {
      console.log("页面卸载");
      isPageInitialized.value = false;
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          statusBar: "true",
          backgroundColor: "#dc2626",
          fixed: "true"
        }),
        b: common_vendor.o(handleSearch),
        c: common_vendor.o(handleSearchCancel),
        d: common_vendor.o(($event) => searchKeyword.value = $event),
        e: common_vendor.p({
          placeholder: "搜索政策或新闻",
          modelValue: searchKeyword.value
        }),
        f: common_vendor.o(($event) => activeTab.value = $event),
        g: common_vendor.p({
          modelValue: activeTab.value
        }),
        h: common_vendor.t(selectedDomain.value.field_name || "全部领域"),
        i: currentDropdown.value === "domain" ? 1 : "",
        j: common_vendor.o(($event) => toggleDropdown("domain")),
        k: common_vendor.t(selectedTime.value),
        l: currentDropdown.value === "time" ? 1 : "",
        m: common_vendor.o(($event) => toggleDropdown("time")),
        n: currentDropdown.value
      }, currentDropdown.value ? {
        o: common_vendor.o(($event) => currentDropdown.value = null)
      } : {}, {
        p: currentDropdown.value === "domain"
      }, currentDropdown.value === "domain" ? common_vendor.e({
        q: selectedDomain.value.field_id === 0
      }, selectedDomain.value.field_id === 0 ? {} : {}, {
        r: common_vendor.o(($event) => handleDomainSelect(null)),
        s: selectedDomain.value.field_id === 0 ? 1 : "",
        t: common_vendor.f(common_vendor.unref(field).fieldlist, (item, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(item.field_name),
            b: selectedDomain.value.field_id === item.field_id
          }, selectedDomain.value.field_id === item.field_id ? {} : {}, {
            c: item.field_id,
            d: common_vendor.o(($event) => handleDomainSelect(item), item.field_id),
            e: selectedDomain.value.field_id === item.field_id ? 1 : ""
          });
        })
      }) : {}, {
        v: currentDropdown.value === "time"
      }, currentDropdown.value === "time" ? {
        w: common_vendor.f(timeList, (item, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(item),
            b: selectedTime.value === item
          }, selectedTime.value === item ? {} : {}, {
            c: item,
            d: common_vendor.o(($event) => handleTimeSelect(item), item),
            e: selectedTime.value === item ? 1 : ""
          });
        })
      } : {}, {
        x: activeTab.value === "policy"
      }, activeTab.value === "policy" ? common_vendor.e({
        y: !initialLoading.value
      }, !initialLoading.value ? common_vendor.e({
        z: currentList.value.length > 0
      }, currentList.value.length > 0 ? {
        A: common_vendor.f(currentList.value, (item, k0, i0) => {
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
        B: common_vendor.t(getEmptyMessage()),
        C: common_vendor.o(handleResetFilters)
      }) : {}, {
        D: initialLoading.value
      }, initialLoading.value ? {} : {}, {
        E: !initialLoading.value && currentList.value.length > 0
      }, !initialLoading.value && currentList.value.length > 0 ? common_vendor.e({
        F: common_vendor.unref(listarticles).loading
      }, common_vendor.unref(listarticles).loading ? {} : !common_vendor.unref(listarticles).hasMore ? {} : {}, {
        G: !common_vendor.unref(listarticles).hasMore
      }) : {}, {
        H: common_vendor.o(handleLoadMore),
        I: common_vendor.o(handleRefresh),
        J: refreshTriggered.value
      }) : common_vendor.e({
        K: !initialLoading.value
      }, !initialLoading.value ? common_vendor.e({
        L: currentList.value.length > 0
      }, currentList.value.length > 0 ? {
        M: common_vendor.f(currentList.value, (item, k0, i0) => {
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
        N: common_vendor.t(getEmptyMessage()),
        O: common_vendor.o(handleResetFilters)
      }) : {}, {
        P: initialLoading.value
      }, initialLoading.value ? {} : {}, {
        Q: !initialLoading.value && currentList.value.length > 0
      }, !initialLoading.value && currentList.value.length > 0 ? common_vendor.e({
        R: common_vendor.unref(listarticles).loading
      }, common_vendor.unref(listarticles).loading ? {} : !common_vendor.unref(listarticles).hasMore ? {} : {}, {
        S: !common_vendor.unref(listarticles).hasMore
      }) : {}, {
        T: common_vendor.o(handleLoadMore),
        U: common_vendor.o(handleRefresh),
        V: refreshTriggered.value
      }));
    };
  }
};
wx.createPage(_sfc_main);
