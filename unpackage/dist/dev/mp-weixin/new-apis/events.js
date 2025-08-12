"use strict";
const utils_request = require("../utils/request.js");
function getEventList(params) {
  return utils_request.http.get("/event", params);
}
function getEventDetail(params) {
  return utils_request.http.get(`/event/${params}`);
}
function activityapply(params) {
  return utils_request.http.post("/event/registration", params);
}
function cancelapply(params) {
  return utils_request.http.delete(`/event/cancelRegistration/${params}`);
}
function userRegisteredEvents(params) {
  return utils_request.http.get("/event/userRegisteredEvents");
}
exports.activityapply = activityapply;
exports.cancelapply = cancelapply;
exports.getEventDetail = getEventDetail;
exports.getEventList = getEventList;
exports.userRegisteredEvents = userRegisteredEvents;
