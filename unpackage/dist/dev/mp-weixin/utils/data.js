"use strict";
const common_vendor = require("../common/vendor.js");
function Dataformat(timeStr) {
  return common_vendor.dayjs(timeStr).format("YYYY-MM-DD HH:mm:ss");
}
function formatDate(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}
function getLastWeekDate() {
  const currentDate = /* @__PURE__ */ new Date();
  currentDate.setDate(currentDate.getDate() - 7);
  return formatDate(currentDate);
}
function getLastMonthDate() {
  const currentDate = /* @__PURE__ */ new Date();
  currentDate.setMonth(currentDate.getMonth() - 1);
  return formatDate(currentDate);
}
function formatEventDate(start, end) {
  const startDate = common_vendor.dayjs(start);
  const endDate = common_vendor.dayjs(end);
  return `${startDate.format("M月D日 HH:mm")} - ${endDate.format("M月D日 HH:mm")}`;
}
function getLastYearDate() {
  const currentDate = /* @__PURE__ */ new Date();
  currentDate.setFullYear(currentDate.getFullYear() - 1);
  return formatDate(currentDate);
}
exports.Dataformat = Dataformat;
exports.formatEventDate = formatEventDate;
exports.getLastMonthDate = getLastMonthDate;
exports.getLastWeekDate = getLastWeekDate;
exports.getLastYearDate = getLastYearDate;
