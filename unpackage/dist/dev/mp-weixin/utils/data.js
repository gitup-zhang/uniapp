"use strict";
require("../common/vendor.js");
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
function getLastYearDate() {
  const currentDate = /* @__PURE__ */ new Date();
  currentDate.setFullYear(currentDate.getFullYear() - 1);
  return formatDate(currentDate);
}
exports.getLastMonthDate = getLastMonthDate;
exports.getLastWeekDate = getLastWeekDate;
exports.getLastYearDate = getLastYearDate;
