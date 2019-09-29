/**
 * Define all of your application routes here
 * for more information on routes, see the
 * official documentation https://router.vuejs.org/en/
 */
export default [
  {
    path: '/dashboard',
    name: '数据总览',
    view: 'Dashboard'
  },
  {
    path: '/login',
    name: '登录',
    view: 'Login'
  },
  {
    path: '/user',
    name: '用户管理',
    view: 'pages/user/User'
  },
  {
    path: '/agent',
    name: '城市代理',
    view: 'pages/agent/Agent'
  },
  {
    path: '/verify',
    name: '审核管理',
    view: 'pages/verify/Verify'
  },
  
  {
    path: '/admin',
    name: '系统用户及权限',
    view: 'pages/admin/Admin'
  },
  {
    path: '/config',
    name: '系统用户及权限',
    view: 'pages/config/Config'
  },
  {
    path: '/wxappset',
    name: '小程序设置',
    view: 'pages/wxappset/Wxappset'
  },
  {
    path: '/order',
    name: '订单列表',
    view: 'pages/order/Order'
  },
  
  {
    path: '/text',
    name: '文本设置',
    view: 'pages/text/Text'
  },
  {
    path: '/anlysis',
    name: '数据报表',
    view: 'pages/anlysis/Anlysis'
  },
  {
    path: '/pwd',
    name: '修改密码',
    view: 'pages/admin/UpdatePwd'
  },
  {
    path: '/opentp',
    name: '第三方应用',
    view: 'pages/opentp/Opentp'
  }
]
