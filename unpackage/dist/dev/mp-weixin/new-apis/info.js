"use strict";
const utils_request = require("../utils/request.js");
function getinfologin(params) {
  return utils_request.http.post("/user/login", params);
}
function Wechatlayout() {
  return utils_request.http.post("/user/logout");
}
function getinfoprofile() {
  return utils_request.http.get("/user/info");
}
function updateprofile(params) {
  return utils_request.http.put("/user/update", params);
}
function IsUserRegistered(params) {
  return utils_request.http.get(`/event/isUserRegistered/${params}`);
}
function getIndustory() {
  return utils_request.http.get("/industry");
}
exports.IsUserRegistered = IsUserRegistered;
exports.Wechatlayout = Wechatlayout;
exports.getIndustory = getIndustory;
exports.getinfologin = getinfologin;
exports.getinfoprofile = getinfoprofile;
exports.updateprofile = updateprofile;
