"use strict";
const utils_request = require("../utils/request.js");
function getEventList(params) {
  return utils_request.http.get("/event", params);
}
function getEventDetail(params) {
  return utils_request.http.get(`/event/${params}`);
}
exports.getEventDetail = getEventDetail;
exports.getEventList = getEventList;
