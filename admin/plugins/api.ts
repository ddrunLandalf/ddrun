/* eslint-disable camelcase */
import Vue from 'vue';
import http from './http';
const api = {
  verifycode: () => http.get('/admin/verifycode'),
  login: (data: any) => http.post('/admin/login', data),
  adminInfo: () => http.get('/admin/info'),
  userSTS: () => http.get('/admin/sts'),
  userList: (data: any) => http.get('/admin/user/list', data),
  userStatus: (data: any) => http.put('/admin/user/status', data),
  hasSuper: () => http.get('/admin/super'),
  initAdmin: (data: any) => http.post('/admin/init', data),
  adminList: (data: any) => http.get('/admin/list', data),
  adminStatus: (data: any) => http.put('/admin/status', data),
  adminAdd: (data: any) => http.post('/admin/add', data),
  adminUpdate: (data: any) => http.put('/admin/update', data),
  adminSetpwd: (data: any) => http.put('/admin/setpwd', data),
  adminResetpwd: (data: any) => http.put('/admin/resetpwd', data),

  agentList: (data: any) => http.get('/admin/agent/list', data),
  agentStatus: (data: any) => http.put('/admin/agent/status', data),
  agentAdd: (data: any) => http.post('/admin/agent/add', data),
  agentUpdate: (data: any) => http.put('/admin/agent/update', data),
  agentResetpwd: (data: any) => http.put('/admin/agent/resetpwd', data),

  cityAdd: (data: any) => http.post('/admin/citys/add', data),
  cityUpdate: (data: any) => http.put('/admin/citys/update', data),
  cityStatus: (data: any) => http.put('/admin/citys/status', data),
  cityList: (data: any) => http.get('/admin/citys/list', data),
  cityValuationAdd: (data: any) => http.post('/admin/citys/valuation/add', data),
  cityValuationUpdate: (data: any) => http.put('/admin/citys/valuation/update', data),
  cityValuationList: (data: any) => http.get('/admin/citys/valuation/list', data),
  cityValuationDel: (data: any) => http.delete('/admin/citys/valuation/del', data),

  adminAppauthPost: (data: any) => http.post('/admin/config/appauth', data),
  adminAppauthGet: () => http.get('/admin/config/appauth'),
  adminAppMchPost: (data: any) => http.post('/admin/config/appmch', data),
  adminAppMchGet: () => http.get('/admin/config/appmch'),
  adminMapPost: (data: any) => http.post('/admin/config/map', data),
  adminMapGet: () => http.get('/admin/config/map'),
  adminAliPost: (data: any) => http.post('/admin/config/ali', data),
  adminAliGet: () => http.get('/admin/config/ali'),
  adminCouponPost: (data: any) => http.post('/admin/config/coupon', data),
  adminCouponGet: () => http.get('/admin/config/coupon'),
  adminNoticePost: (data: any) => http.post('/admin/config/notice', data),
  adminNoticeGet: () => http.get('/admin/config/notice'),
  adminCancelOrderPost: (data: any) => http.post('/admin/config/ordercancel', data),
  adminCancelOrderGet: () => http.get('/admin/config/ordercancel'),
  adminOrderFeePost: (data: any) => http.post('/admin/config/orderfee', data),
  adminOrderFeeGet: () => http.get('/admin/config/orderfee'),
  adminOrderReceivePost: (data: any) => http.post('/admin/config/orderreceive', data),
  adminOrderReceiveGet: () => http.get('/admin/config/orderreceive'),
  adminGuideUserPost: (data: any) => http.post('/admin/config/guide/user', data),
  adminGuideUserGet: () => http.get('/admin/config/guide/user'),
  adminGuideRiderPost: (data: any) => http.post('/admin/config/guide/rider', data),
  adminGuideRiderGet: () => http.get('/admin/config/guide/rider'),
  adminSharePost: (data: any) => http.post('/admin/config/share', data),
  adminShareGet: () => http.get('/admin/config/share'),
  adminIntegralPost: (data: any) => http.post('/admin/config/integral', data),
  adminIntegralGet: () => http.get('/admin/config/integral'),
  adminAgreementRiderPost: (data: any) => http.post('/admin/config/agreement/rider', data),
  adminAgreementRiderGet: () => http.get('/admin/config/agreement/rider'),

  weightAdd: (data: any) => http.post('/admin/citys/weight/add', data),
  weightUpdate: (data: any) => http.put('/admin/citys/weight/update', data),
  weightList: (data: any) => http.get('/admin/citys/weight/list', data),
  weightDel: (data: any) => http.delete('/admin/citys/weight/del', data),

  tagGroupAdd: (data: any) => http.post('/admin/citys/tag/add', data),
  tagGroupUpdate: (data: any) => http.put('/admin/citys/tag/update', data),
  tagGroupList: (data: any) => http.get('/admin/citys/tag/list', data),
  tagGroupDel: (data: any) => http.delete('/admin/citys/tag/del', data),

  couponAdd: (data: any) => http.post('/admin/coupon/add', data),
  couponUpdate: (data: any) => http.put('/admin/coupon/update', data),
  couponStatus: (data: any) => http.put('/admin/coupon/status', data),
  couponList: (data: any) => http.get('/admin/coupon/list', data),

  orderList: (data: any) => http.get('/admin/order/list', data),
  orderReceive: (data: any) => http.put('/admin/order/receive', data),
  orderDeliver: (data: any) => http.put('/admin/order/deliver', data),
  orderComplete: (data: any) => http.put('/admin/order/complete', data),
  orderCancel: (data: any) => http.put('/admin/order/cancel', data),
  orderCapitalTrendList: (data: any) => http.get('/admin/order/capitaltrend/list', data),

  riderList: (data: any) => http.get('/admin/rider/list', data),
  riderRegisterList: (data: any) => http.get('/admin/rider/register/list', data),
  riderAdd: (data: any) => http.post('/admin/rider/add', data),
  riderPass: (data: any) => http.put('/admin/rider/pass', data),
  riderRefuse: (data: any) => http.put('/admin/rider/refuse', data),
  riderReceiveSet: (data: any) => http.put('/admin/rider/receive/status', data),

  wxSubscribeAdd: (data: any) => http.post('/admin/wx/subscribe/message/addtemplate', data),
  wxSubscribeDel: (data: any) => http.post('/admin/wx/subscribe/message/deltemplate', data),
  wxSubscribeCate: () => http.get('/admin/wx/subscribe/message/getcategory'),
  wxSubscribeKeyword: (data: any) =>
    http.get('/admin/wx/subscribe/message/getpubtemplatekeywords', data),
  wxSubscribeTitles: (data: any) =>
    http.get('/admin/wx/subscribe/message/getpubtemplatetitles', data),
  wxSubscribeTemplates: () => http.get('/admin/wx/subscribe/message/gettemplate'),

  analysisTotal: () => http.get('/admin/analysis/total'),
  analysisOrderStatusDaily: (data: { beginDate: string; endDate: string }) =>
    http.get('/admin/analysis/order/status', data),
  analysisNewUser: (data: { beginDate: string; endDate: string }) =>
    http.get('/admin/analysis/new/user', data),
  analysisNewOrder: (data: { beginDate: string; endDate: string }) =>
    http.get('/admin/analysis/new/order', data),

  cashList: (data: any) => http.get('/admin/cash/list', data),
  cashSuccess: (data: any) => http.put('/admin/cash/success', data),
  cashFail: (data: any) => http.put('/admin/cash/fail', data)
};
Vue.prototype.$api = api;
export default api;
