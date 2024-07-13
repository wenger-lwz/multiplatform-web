import request from '@/request'

// 登录
export function login(params) {
  return request({
    url: '/v2/system/account/login',
    method: 'post',
    data: params,
    isToken: false
  })
}

export function getMenuList() {
  return request({
    url: '/api/admin/system/sys-resource/web/tree',
    method: 'get'
  })
}

export function savePersonalize(params) {
  return request({
    url: '/api/admin/system/sys-user-personalize/save',
    method: 'post',
    data: params
  })
}

export function deletePersonalize(params) {
  return request({
    url: '/api/admin/system/sys-user-personalize/delete',
    method: 'post',
    data: params
  })
}

export function getPinnedList() {
  return request({
    url: '/api/admin/system/sys-user-personalize/queryDingMenu',
    method: 'get'
  })
}

// 获取权限
export function getButtonRoles() {
  return request({
    url: '/v2/sm/resource/webButton',
    method: 'get',
  }).then(res => res.data)
}

// 获取用户信息
export function getUserInfo() {
  return request({
    url: '/v2/sm/user/getCurrentUserInfo',
    method: 'get',
  }).then(res => res.data)
}

// 更新用户信息
export function updateUserInfo(params) {
  return request({
    url: '/v2/sm/user/personalCenterEdit',
    method: 'put',
    data: params,
  })
}

// 修改用户密码
export function updateUserPassword(params) {
  return request({
    url: '/v2/sm/user/editUserPwd',
    method: 'put',
    data: params,
  })
}

// 获取店铺站点
export function getMarketTree() {
  return request({
    url: '/v2/common/authorize/marketIdsAndMarket',
    method: 'get',
  }).then(res => res.data)
}

// 退出登录
export function setLoginOut() {
  return request({
    url: '/api/auth/logout',
    method: 'get',
  })
}

// 消息中心
export function countAndInfo() {
  return request({
    url: '/v2/warnModel/countAndInfo',
    method: 'get',
  })
}

// 消息中心 -- 更新公告
export function countAndInfoUpdateAnnouncement() {
  return request({
    // url: '/api/admin/version/countAndInfo',
    url: '/v2/warnModel/countAndInfo',
    method: 'get',
  })
}

// 获取全局参数
export function getGlobalParameter(parameter) {
  return request({
    url: `/v2/setting/systemSetting/getGlobalParameter?name=${parameter}`,
    method: 'get',
  }).then(res => res.data)
}

// 获取用户信息
export function getUserAttr() {
  return request({
    url: '/api/admin/user/index/profile',
    method: 'get',
  })
}

// 获取产品品类
export function getProductCategory(isAll = false) {
  return request({
    url: `/v2/product/product/categorys?isAll=${isAll}`,
    method: 'get',
  }).then(res => res.data)
}

// 获取产品品牌
export function getProductBrand() {
  return request({
    url: '/v2/product/product/brands',
    method: 'get',
  }).then(res => res.data)
}

// 获取产品类型
export function getProductType() {
  return request({
    url: '/v2/product/product/types',
    method: 'get',
  }).then(res => res.data)
}

// 获取供应商
export function getSupplier(params) {
  return request.get('/v2/setting/supplier/supplierByKeywords', {params}).then(res => res.data)
}

// 获取用户列表
export function getUserList() {
  return request.get('/v2/sm/user/normalUsers').then(res => res.data)
}
