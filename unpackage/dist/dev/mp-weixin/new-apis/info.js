"use strict";
const utils_request = require("../utils/request.js");
function getinfologin(params) {
  return utils_request.http.post("/user/login", params);
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
exports.IsUserRegistered = IsUserRegistered;
exports.getinfologin = getinfologin;
exports.getinfoprofile = getinfoprofile;
exports.updateprofile = updateprofile;
