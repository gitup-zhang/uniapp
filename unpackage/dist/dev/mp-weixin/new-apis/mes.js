"use strict";
const utils_request = require("../utils/request.js");
function getsystemmes(params) {
  return utils_request.http.get("/message/userMessageGroups", params);
}
function getmesgroup(id, params) {
  return utils_request.http.get(`/message/byGroups/${id}`, params);
}
function markAllAsReadmes() {
  return utils_request.http.put("/message/markAllAsRead");
}
exports.getmesgroup = getmesgroup;
exports.getsystemmes = getsystemmes;
exports.markAllAsReadmes = markAllAsReadmes;
