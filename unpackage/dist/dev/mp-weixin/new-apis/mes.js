"use strict";
const utils_request = require("../utils/request.js");
function getsystemmes(params) {
  return utils_request.http.get("/message/byTypeGroups", params);
}
function geteventmes() {
  return utils_request.http.get("/message/byEventGroups");
}
exports.geteventmes = geteventmes;
exports.getsystemmes = getsystemmes;
